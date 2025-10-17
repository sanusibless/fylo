<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStoragePlan extends Model
{
    protected $storage = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function storagePlanDetail()
    {
        return $this->belongsTo(StoragePlan::class, 'storage_plan_id');
    }
}
