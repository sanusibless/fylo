<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

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
        static::creating(function ($user) {
            Settings::create(['user_id' => $user->id]);
        });
    }

    public function getInitialAttribute()
    {
        $explodedName = explode(' ', $this->name);

        if (count($explodedName) > 1) {
            return $explodedName[0][0] . $explodedName[1][0];
        }
        return mb_substr($this->name, 0, 1);
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function sharedFiles()
    {
        return $this->hasMany(SharedFile::class);
    }

    public function totalSharedFiles()
    {
        return $this->sharedFiles()->count();
    }
    public function totalStorageUsed()
    {
        $totalSize = $this->files()->sum('size');
        return $totalSize / (1024 * 1024 * 1024);
    }
}
