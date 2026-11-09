<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class File extends Model
{
    use SoftDeletes;

    protected $table = 'uploaded_files';

    protected $guarded = ['id'];

    protected $appends = ['size_in_kb', 'size_in_mb', 'total_downloads'];

    public static function boot()
    {
        parent::boot();
        self::creating(function ($model) {
            $model->uuid = (string) \Illuminate\Support\Str::orderedUuid();
        });
    }

    /**
     * Returns the size of the file in kilobytes (KB) as a 2 decimal place value.
     *
     * @return string
     */
    public function getSizeInKBAttribute()
    {
        return round($this->size / 1024, 2).'KB';

    }

    /**
     * Returns the size of the file in megabytes (MB) as a 2 decimal place value.
     *
     * @return string
     */
    public function getSizeInMBAttribute()
    {
        return round($this->size / (1024 * 1024), 2).'MB';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFormattedDateAttribute()
    {
        return $this->created_at->diffForHumans();
    }

    public function increaseDownloads()
    {
        $this->downloads += 1;
        $this->save();
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
