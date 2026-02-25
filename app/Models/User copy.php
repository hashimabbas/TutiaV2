<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany; // Import HasMany

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        // --- CRM-related additions ---
        'phone_number',
        'job_title',
        'is_active', // To enable/disable CRM users
        'profile_photo_path', // Optional: if you want user avatars
        // --- End CRM-related additions ---
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean', // Cast is_active to boolean
        ];
    }

    // --- Relationships for CRM ---

    /**
     * Get the companies assigned to this user.
     */
    public function assignedCompanies(): HasMany
    {
        return $this->hasMany(Company::class, 'assigned_user_id');
    }

    /**
     * Get the contacts assigned to this user.
     */
    public function assignedContacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'assigned_user_id');
    }

    /**
     * Get the offers assigned to this user.
     * (We'll define the Offer model next)
     */
    public function assignedOffers(): HasMany
    {
        return $this->hasMany(Offer::class, 'assigned_user_id');
    }

    // --- End Relationships for CRM ---

    /**
     * Get the tasks created by the user.
     */
    public function createdTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'created_by_user_id');
    }

    /**
     * Get the tasks assigned to the user.
     */
    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to_user_id');
    }
}
