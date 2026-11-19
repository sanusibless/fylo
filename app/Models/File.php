<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use SoftDeletes;

    protected $table = 'uploaded_files';

    protected $guarded = ['id'];

    protected $hidden = [
        'share_password',
        'relative_path',
        'full_path',
        'base_url',
        'storage_disk',
    ];

    protected $casts = [
        'share_expires_at' => 'datetime',
        'is_public' => 'boolean',
        'is_favorite' => 'boolean',
        'size' => 'float',
        'downloads' => 'integer',
    ];

    protected $appends = ['size_in_kb', 'size_in_mb', 'total_downloads', 'formatted_date', 'has_share_password'];

    public static function boot()
    {
        parent::boot();
        self::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) \Illuminate\Support\Str::orderedUuid();
            }
        });
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class, 'folder_id');
    }

    public function isShareExpired(): bool
    {
        return $this->share_expires_at !== null && $this->share_expires_at->isPast();
    }

    public function getHasSharePasswordAttribute(): bool
    {
        return ! empty($this->share_password);
    }

    public function resolveDiskPath(): string
    {
        return ltrim(str_replace('/storage/', '', (string) $this->relative_path), '/');
    }

    public function resolveStorageDisk(): string
    {
        $diskPath = $this->resolveDiskPath();
        $preferredDisk = $this->storage_disk ?: config('fylo.storage.disk', 'local');

        if ($preferredDisk && Storage::disk($preferredDisk)->exists($diskPath)) {
            return $preferredDisk;
        }

        if (Storage::disk('local')->exists($diskPath)) {
            return 'local';
        }

        if (Storage::disk('public')->exists($diskPath)) {
            return 'public';
        }

        return $preferredDisk ?: 'local';
    }

    /**
     * Returns the size of the file in kilobytes (KB) as a 2 decimal place value.
     *
     * @return string
     */
    public function getSizeInKBAttribute()
    {
        return round($this->size / 1024, 2).' KB';
    }

    /**
     * Returns the size of the file in megabytes (MB) or KB if smaller than 1 MB.
     *
     * @return string
     */
    public function getSizeInMBAttribute()
    {
        $mb = $this->size / (1024 * 1024);
        if ($mb < 0.01 && $this->size > 0) {
            return round($this->size / 1024, 2).' KB';
        }

        return round($mb, 2).' MB';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFormattedDateAttribute()
    {
        return $this->created_at?->diffForHumans() ?? 'Recently';
    }

    public function increaseDownloads()
    {
        $this->increment('downloads');
    }

    public function getTotalDownloadsAttribute()
    {
        $downloads = (int) $this->downloads;
        if ($downloads >= 1_000_000_000) {
            return round($downloads / 1_000_000_000, 1).'B';
        }
        if ($downloads >= 1_000_000) {
            return round($downloads / 1_000_000, 1).'M';
        }
        if ($downloads >= 1_000) {
            return round($downloads / 1_000, 1).'K';
        }

        return (string) $downloads;
    }
}
