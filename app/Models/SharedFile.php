<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SharedFile extends Model
{
    protected $guarded = [];

    protected $with = ['file', 'user'];

    public static function booted()
    {
        static::creating(function ($model) {
            $model->uuid = (string) \Illuminate\Support\Str::orderedUuid();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function file()
    {
        return $this->hasOne(File::class, 'id', 'file_id');
    }
}
