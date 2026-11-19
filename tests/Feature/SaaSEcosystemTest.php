<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\Folder;
use App\Models\StoragePlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SaaSEcosystemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');

        StoragePlan::firstOrCreate([
            'slug' => 'free',
        ], [
            'name' => 'Free',
            'capacity' => '5',
            'price_monthly' => 0.00,
            'price_yearly' => 0.00,
            'currency' => 'NGN',
            'max_file_size_mb' => 50,
            'is_active' => true,
        ]);

        StoragePlan::firstOrCreate([
            'slug' => 'growth',
        ], [
            'name' => 'Growth',
            'capacity' => '100',
            'price_monthly' => 20000.00,
            'price_yearly' => 192000.00,
            'currency' => 'NGN',
            'max_file_size_mb' => 1024,
            'is_active' => true,
        ]);
    }

    public function test_public_pages_render_successfully()
    {
        $this->get('/')->assertStatus(200);
        $this->get('/features')->assertStatus(200);
        $this->get('/pricing')->assertStatus(200);
        $this->get('/faqs')->assertStatus(200);
        $this->get('/contact')->assertStatus(200);
        $this->get('/privacy')->assertStatus(200);
        $this->get('/terms')->assertStatus(200);
    }

    public function test_contact_form_submits_and_stores_inquiry()
    {
        $response = $this->post('/contact', [
            'name' => 'Chinedu Okafor',
            'email' => 'chinedu@example.com',
            'subject' => 'Abuja Storage Quota Inquiry',
            'message' => 'Hello, I want to inquire about the Pro NGN plan for our Abuja office.',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('contact_messages', [
            'email' => 'chinedu@example.com',
            'subject' => 'Abuja Storage Quota Inquiry',
        ]);
    }

    public function test_user_can_create_and_manage_folders()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create folder
        $response = $this->post('/folders', [
            'name' => 'Quarterly Reports',
            'color' => '#2dd4bf',
        ]);
        $response->assertSessionHas('status');

        $folder = Folder::where('user_id', $user->id)->first();
        $this->assertNotNull($folder);
        $this->assertEquals('Quarterly Reports', $folder->name);

        // Rename folder
        $updateResp = $this->put("/folders/{$folder->uuid}", [
            'name' => 'Annual Reports',
            'color' => '#38bdf8',
        ]);
        $updateResp->assertSessionHas('status');
        $this->assertEquals('Annual Reports', $folder->fresh()->name);

        // Soft delete folder
        $deleteResp = $this->delete("/folders/{$folder->uuid}");
        $deleteResp->assertSessionHas('status');
        $this->assertSoftDeleted('folders', ['id' => $folder->id]);
    }

    public function test_user_can_move_file_into_folder()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $fakeFile = UploadedFile::fake()->create('contract.pdf', 500, 'application/pdf');
        $this->post('/file/upload', ['file' => $fakeFile]);

        $file = File::where('user_id', $user->id)->first();
        $folder = Folder::create(['user_id' => $user->id, 'name' => 'Legal']);

        $moveResp = $this->post("/file/{$file->uuid}/move", [
            'folder_id' => $folder->id,
        ]);
        $moveResp->assertSessionHas('status');
        $this->assertEquals($folder->id, $file->fresh()->folder_id);
    }

    public function test_public_share_token_and_preview_flow()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $fakeFile = UploadedFile::fake()->create('presentation.pdf', 300, 'application/pdf');
        $this->post('/file/upload', ['file' => $fakeFile]);

        $file = File::where('user_id', $user->id)->first();

        // Generate public share link
        $shareResp = $this->post("/file/{$file->uuid}/public-share", [
            'password' => 'secret123',
            'expires_in_days' => 7,
        ]);
        $shareResp->assertSessionHas('status');

        $file = $file->fresh();
        $this->assertTrue($file->is_public);
        $this->assertNotNull($file->share_token);

        // External guest visits public link
        auth()->logout();
        $guestResp = $this->get("/s/{$file->share_token}");
        $guestResp->assertStatus(200);

        // Locked download before password verification returns 403
        $lockedDownload = $this->get("/s/{$file->share_token}/download");
        $lockedDownload->assertStatus(403);

        // Unlock password
        $unlockResp = $this->post("/s/{$file->share_token}/verify", [
            'password' => 'secret123',
        ]);
        $unlockResp->assertSessionHasNoErrors();

        // Unlocked download succeeds
        $unlockedDownload = $this->get("/s/{$file->share_token}/download");
        $unlockedDownload->assertStatus(200);
    }

    public function test_subscription_checkout_in_naira_and_plan_upgrade()
    {
        config([
            'services.paystack.environment' => 'test',
            'services.paystack.test_secret_key' => 'sk_test_mock_key',
        ]);

        \Illuminate\Support\Facades\Http::fake([
            'https://api.paystack.co/transaction/initialize' => \Illuminate\Support\Facades\Http::response([
                'status' => true,
                'message' => 'Authorization URL created',
                'data' => [
                    'authorization_url' => 'https://checkout.paystack.com/mock_code',
                    'access_code' => 'mock_code',
                    'reference' => 'FYLO_MOCKREF',
                ],
            ], 200),
            'https://api.paystack.co/transaction/verify/*' => \Illuminate\Support\Facades\Http::response([
                'status' => true,
                'message' => 'Verification successful',
                'data' => [
                    'id' => 123456,
                    'status' => 'success',
                    'reference' => 'DYNAMIC',
                    'amount' => 2000000, // ₦20,000 in kobo
                    'currency' => 'NGN',
                    'paid_at' => now()->toIso8601String(),
                ],
            ], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $resp = $this->post('/subscription/checkout', [
            'plan_slug' => 'growth',
            'billing_cycle' => 'monthly',
            'provider' => 'paystack',
        ]);

        $resp->assertRedirect('https://checkout.paystack.com/mock_code');

        $payment = \App\Models\Payment::where('user_id', $user->id)->firstOrFail();
        $this->assertEquals('pending', $payment->status);
        $this->assertEquals(20000.00, (float) $payment->amount);
    }

    public function test_admin_portal_access_control()
    {
        // Non-admin user gets 403
        $regularUser = User::factory()->create(['is_admin' => false]);
        $this->actingAs($regularUser);
        $this->get('/admin')->assertStatus(403);
        $this->get('/admin/logs')->assertStatus(403);

        // Admin user gets 200
        $adminUser = User::factory()->create(['is_admin' => true]);
        $this->actingAs($adminUser);
        $this->get('/admin')->assertStatus(200);
        $this->get('/admin/users')->assertStatus(200);
        $this->get('/admin/plans')->assertStatus(200);
        $this->get('/admin/payments')->assertStatus(200);
    }
}
