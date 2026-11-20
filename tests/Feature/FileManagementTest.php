<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\StoragePlan;
use App\Models\User;
use App\Models\UserStoragePlan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');

        StoragePlan::firstOrCreate([
            'name' => 'Free',
        ], [
            'slug' => 'free',
            'capacity' => '10',
            'currency' => 'NGN',
            'max_file_size_mb' => 50,
        ]);
    }

    public function test_user_can_upload_file()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $fakeFile = UploadedFile::fake()->create('document.pdf', 1024, 'application/pdf');

        $response = $this->post(route('file.upload'), [
            'file' => $fakeFile,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('uploaded_files', [
            'user_id' => $user->id,
            'type' => 'document',
            'extension' => 'pdf',
        ]);
    }

    public function test_duplicate_file_uploads_are_renamed_cleanly()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post(route('file.upload'), [
            'file' => UploadedFile::fake()->create('proposal.pdf', 200, 'application/pdf'),
        ]);
        $this->post(route('file.upload'), [
            'file' => UploadedFile::fake()->create('proposal.pdf', 200, 'application/pdf'),
        ]);

        $names = File::where('user_id', $user->id)->pluck('name')->toArray();
        $this->assertContains('proposal.pdf', $names);
        $this->assertContains('proposal-1.pdf', $names);
    }

    public function test_executable_and_svg_uploads_are_blocked_for_security()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $maliciousPhp = UploadedFile::fake()->create('shell.php', 100, 'application/x-php');
        $response = $this->post(route('file.upload'), ['file' => $maliciousPhp]);
        $response->assertSessionHasErrors(['file']);

        $maliciousSvg = UploadedFile::fake()->create('xss.svg', 100, 'image/svg+xml');
        $responseSvg = $this->post(route('file.upload'), ['file' => $maliciousSvg]);
        $responseSvg->assertSessionHasErrors(['file']);
    }

    public function test_user_cannot_upload_file_exceeding_storage_quota()
    {
        $user = User::factory()->create();
        $tinyPlan = StoragePlan::create([
            'name' => 'Tiny',
            'slug' => 'tiny',
            'capacity' => '0.0001', // ~100KB
            'currency' => 'NGN',
        ]);
        UserStoragePlan::where('user_id', $user->id)->update([
            'storage_plan_id' => $tinyPlan->id,
        ]);

        $this->actingAs($user);

        // Upload a 10MB file which exceeds the quota
        $fakeFile = UploadedFile::fake()->create('large.pdf', 10240, 'application/pdf');

        $response = $this->post(route('file.upload'), [
            'file' => $fakeFile,
        ]);

        $response->assertSessionHasErrors(['file']);
    }

    public function test_user_can_star_and_unstar_file_and_stranger_cannot()
    {
        $user = User::factory()->create();
        $stranger = User::factory()->create();
        $this->actingAs($user);

        $fakeFile = UploadedFile::fake()->create('report.pdf', 500, 'application/pdf');
        $this->post(route('file.upload'), ['file' => $fakeFile]);

        $file = File::where('user_id', $user->id)->firstOrFail();
        $this->assertFalse((bool) $file->is_favorite);

        // Star file
        $response = $this->getJson(route('file.toggle_favorite', ['file_uuid' => $file->uuid]));
        $response->assertOk()->assertJson(['starred' => true]);
        $this->assertTrue((bool) $file->fresh()->is_favorite);

        // Stranger tries to unstar owner's file (IDOR check)
        $this->actingAs($stranger);
        $strangerResp = $this->getJson(route('file.toggle_favorite', ['file_uuid' => $file->uuid]));
        $strangerResp->assertStatus(403);
        $this->assertTrue((bool) $file->fresh()->is_favorite);

        // Owner unstars file
        $this->actingAs($user);
        $response = $this->getJson(route('file.toggle_favorite', ['file_uuid' => $file->uuid]));
        $response->assertOk()->assertJson(['starred' => false]);
        $this->assertFalse((bool) $file->fresh()->is_favorite);
    }

    public function test_user_can_rename_file()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $fakeFile = UploadedFile::fake()->create('original-name.pdf', 500, 'application/pdf');
        $this->post(route('file.upload'), ['file' => $fakeFile]);

        $file = File::where('user_id', $user->id)->firstOrFail();

        $response = $this->put(route('file.update', ['file_uuid' => $file->uuid]), [
            'file_uuid' => $file->uuid,
            'name' => 'renamed-document',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals('renamed-document.pdf', $file->fresh()->name);
    }

    public function test_user_can_download_and_preview_their_own_file()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $fakeFile = UploadedFile::fake()->create('my-notes.pdf', 300, 'application/pdf');
        $this->post(route('file.upload'), ['file' => $fakeFile]);

        $file = File::where('user_id', $user->id)->firstOrFail();

        $previewResponse = $this->get(route('file.preview', ['file_uuid' => $file->uuid]));
        $previewResponse->assertOk();

        $response = $this->get(route('file.download', ['file_uuid' => $file->uuid]));
        $response->assertOk();
        $this->assertEquals(1, $file->fresh()->downloads);
    }

    public function test_unauthorized_user_cannot_download_or_preview_private_file()
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();

        $this->actingAs($owner);
        $fakeFile = UploadedFile::fake()->create('secret.pdf', 300, 'application/pdf');
        $this->post(route('file.upload'), ['file' => $fakeFile]);

        $file = File::where('user_id', $owner->id)->firstOrFail();

        // Stranger tries to download & preview
        $this->actingAs($stranger);
        $response = $this->get(route('file.download', ['file_uuid' => $file->uuid]));
        $response->assertSessionHasErrors(['file']);

        $previewResponse = $this->get(route('file.preview', ['file_uuid' => $file->uuid]));
        $previewResponse->assertStatus(403);
    }

    public function test_user_can_share_file_with_another_user()
    {
        $owner = User::factory()->create();
        $recipient = User::factory()->create(['email' => 'colleague@example.com']);

        $this->actingAs($owner);
        $fakeFile = UploadedFile::fake()->create('shared-deck.pdf', 300, 'application/pdf');
        $this->post(route('file.upload'), ['file' => $fakeFile]);

        $file = File::where('user_id', $owner->id)->firstOrFail();

        $response = $this->post(route('file.share'), [
            'file_uuid' => $file->uuid,
            'receiver_email' => 'colleague@example.com',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('shared_files', [
            'file_id' => $file->id,
            'receiver_id' => $recipient->id,
        ]);

        // Recipient can now download the shared file
        $this->actingAs($recipient);
        $downloadResponse = $this->get(route('file.download', ['file_uuid' => $file->uuid]));
        $downloadResponse->assertOk();
    }

    public function test_user_cannot_share_file_with_themselves()
    {
        $user = User::factory()->create(['email' => 'self@example.com']);
        $this->actingAs($user);

        $fakeFile = UploadedFile::fake()->create('notes.pdf', 300, 'application/pdf');
        $this->post(route('file.upload'), ['file' => $fakeFile]);

        $file = File::where('user_id', $user->id)->firstOrFail();

        $response = $this->post(route('file.share'), [
            'file_uuid' => $file->uuid,
            'receiver_email' => 'self@example.com',
        ]);

        $response->assertSessionHasErrors(['receiver_email']);
    }

    public function test_user_can_soft_delete_restore_and_force_delete_file()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $fakeFile = UploadedFile::fake()->create('test-delete.pdf', 300, 'application/pdf');
        $this->post(route('file.upload'), ['file' => $fakeFile]);

        $file = File::where('user_id', $user->id)->firstOrFail();

        // 1. Soft delete (move to Trash)
        $this->delete(route('file.delete', ['file_uuid' => $file->uuid]));
        $this->assertSoftDeleted('uploaded_files', ['id' => $file->id]);

        // Trashed files do not count toward active storage quota
        $this->assertEquals(0, $user->fresh()->totalStorageUsedBytes());

        // 2. Restore from Trash
        $this->post(route('file.restore', ['file_uuid' => $file->uuid]));
        $this->assertNotSoftDeleted('uploaded_files', ['id' => $file->id]);
        $this->assertGreaterThan(0, $user->fresh()->totalStorageUsedBytes());

        // 3. Force delete (permanent deletion)
        $this->delete(route('file.force_delete', ['file_uuid' => $file->uuid]));
        $this->assertDatabaseMissing('uploaded_files', ['id' => $file->id]);
    }

    public function test_user_can_view_all_file_management_pages()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->get(route('dashboard'))->assertOk();
        $this->get(route('recent'))->assertOk();
        $this->get(route('starred'))->assertOk();
        $this->get(route('trash'))->assertOk();
        $this->get(route('shared_files'))->assertOk();
    }
}
