<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'uploaded_files';
    protected $guarded = ['id'];

    protected $appends = ['size_in_kb', 'size_in_mb'];

    public static function boot()
    {
        parent::boot();
        self::creating(function ($model) {
            $model->uuid = (string) \Illuminate\Support\Str::orderedUuid();
        });
    }

/*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Returns the size of the file in kilobytes (KB) as a 2 decimal place value.
     *
     * @return string
     */
/*******  bb6e8b98-72f8-468e-83a4-bab4a527c04b  *******/
    public function getSizeInKBAttribute()
    {
        return round($this->size / 1024, 2) . "KB";
       
    }
    /**
     * Returns the size of the file in megabytes (MB) as a 2 decimal place value.
     *
     * @return string
     */
    public function getSizeInMBAttribute()
    {
        return round($this->size / (1024 * 1024), 2) . "MB";
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function getFormattedDateAttribute()
    {
        return $this->created_at->diffForHumans();
    }
}
