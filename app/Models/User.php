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
        ];
    }

    protected static function booted()
    {
        parent::boot();
        static::created(function ($user) {
            $defaultPlanId = StoragePlan::first()?->id ?? 1;
            UserStoragePlan::firstOrCreate([
                'user_id' => $user->id,
            ], [
                'storage_plan_id' => $defaultPlanId,
            ]);
        });
    }

    public function getInitialAttribute()
    {
        $explodedName = explode(' ', trim($this->name));

        if (count($explodedName) > 1 && ! empty($explodedName[1])) {
            return mb_strtoupper(mb_substr($explodedName[0], 0, 1).mb_substr($explodedName[1], 0, 1));
        }

        return mb_strtoupper(mb_substr($this->name, 0, 1));
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function sharedFiles()
    {
        return $this->hasMany(SharedFile::class, 'receiver_id', 'id');
    }

    public function totalSharedFiles()
    {
        return $this->sharedFiles()->count();
    }

    public function totalDownloads(): int
    {
        return (int) $this->files()->sum('downloads');
    }

    public function totalStorageUsed()
    {
        $totalSize = (float) $this->files()->sum('size');

        return round($totalSize / (1024 * 1024 * 1024), 2);
    }

    public function totalStorageUsedBytes(): float
    {
        return (float) $this->files()->sum('size');
    }

    public function storageCapacityGB(): float
    {
        $capacity = $this->storagePlan?->storagePlanDetail?->capacity;
        if (! $capacity || strtolower((string) $capacity) === 'unlimited') {
            return 999999.0;
        }

        return (float) $capacity;
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
}
