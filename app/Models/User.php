<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['initial'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted()
    {
        parent::boot();
        static::created(function ($user) {
            $defaultPlan = StoragePlan::firstOrCreate(
                ['name' => 'Free'],
                [
                    'slug' => 'free',
                    'capacity' => (string) config('fylo.storage.default_free_capacity_gb', 5),
                    'price_monthly' => 0.00,
                    'price_yearly' => 0.00,
                    'currency' => config('fylo.currency.code', 'NGN'),
                    'max_file_size_mb' => config('fylo.storage.default_max_file_size_mb', 50),
                    'is_active' => true,
                ]
            );
            UserStoragePlan::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'storage_plan_id' => $defaultPlan->id,
                    'billing_cycle' => 'monthly',
                    'status' => 'active',
                    'starts_at' => now(),
                    'auto_renew' => true,
                ]
            );
        });
    }

    public function getInitialAttribute()
    {
        $explodedName = explode(' ', trim((string) $this->name));

        if (count($explodedName) > 1 && ! empty($explodedName[1])) {
            return mb_strtoupper(mb_substr($explodedName[0], 0, 1).mb_substr($explodedName[1], 0, 1));
        }

        return mb_strtoupper(mb_substr((string) $this->name, 0, 1));
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

    public function sharedFiles()
    {
        return $this->hasMany(SharedFile::class, 'receiver_id', 'id');
    }

    public function totalSharedFiles()
    {
        return $this->sharedFiles()
            ->whereHas('file', fn ($q) => $q->whereNull('deleted_at'))
            ->count();
    }

    public function totalDownloads(): int
    {
        return (int) $this->files()->sum('downloads');
    }

    public function totalStorageUsed()
    {
        $totalSize = $this->totalStorageUsedBytes();

        return round($totalSize / (1024 * 1024 * 1024), 4);
    }

    public function totalStorageUsedBytes(): float
    {
        $query = $this->files();
        if (config('fylo.storage.trash_consumes_quota', false)) {
            $query = $query->withTrashed();
        }

        return (float) $query->sum('size');
    }

    public function activeStoragePlanRecord(): ?UserStoragePlan
    {
        $record = $this->storagePlan;
        if (! $record) {
            return null;
        }

        if ($record->expires_at !== null && $record->expires_at->isPast()) {
            if ($record->status === 'active') {
                $record->update(['status' => 'expired']);
            }

            return null;
        }

        return $record->status === 'active' ? $record : null;
    }

    public function storageCapacityGB(): float
    {
        $activeRecord = $this->activeStoragePlanRecord();
        $capacity = $activeRecord?->storagePlanDetail?->capacity;
        if (! $capacity) {
            return (float) config('fylo.storage.default_free_capacity_gb', 5);
        }
        if (strtolower((string) $capacity) === 'unlimited') {
            return 999999.0;
        }

        return (float) $capacity;
    }

    public function maxUploadSizeMB(): int
    {
        $activeRecord = $this->activeStoragePlanRecord();

        return (int) ($activeRecord?->storagePlanDetail?->max_file_size_mb
            ?? config('fylo.storage.default_max_file_size_mb', 50));
    }

    public function storageCapacityBytes(): float
    {
        return $this->storageCapacityGB() * 1024 * 1024 * 1024;
    }

    public function hasAvailableStorageFor(int $bytes): bool
    {
        return ($this->totalStorageUsedBytes() + $bytes) <= $this->storageCapacityBytes();
    }

    public function storagePlan()
    {
        return $this->hasOne(UserStoragePlan::class)->with('storagePlanDetail');
    }

    public function userStoragePlan()
    {
        return $this->hasOne(UserStoragePlan::class)->with('storagePlanDetail');
    }
}
