<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait CheckForDuplicates
{
    /**
     * Find potential duplicates of the given model instance.
     */
    public static function findPotentialDuplicates(array $attributes, ?int $ignoreId = null): \Illuminate\Support\Collection
    {
        $model = new static;
        $query = $model::query();

        // 1. Build the OR conditions
        $query->where(function (Builder $q) use ($model, $attributes) {
            if ($model instanceof \App\Models\Company) {
                // Name: Partial match
                if (!empty($attributes['name'])) {
                    $q->orWhere('name', 'like', '%' . $attributes['name'] . '%');
                }
                // Email: Exact match
                if (!empty($attributes['email'])) {
                    $q->orWhere('email', $attributes['email']);
                }
                // Website: Partial match (often cleaner to strip http/www first, but LIKE is okay for now)
                if (!empty($attributes['website'])) {
                    $q->orWhere('website', 'like', '%' . $attributes['website'] . '%');
                }
            } elseif ($model instanceof \App\Models\Contact) {
                // Email: Exact match
                if (!empty($attributes['email'])) {
                    $q->orWhere('email', $attributes['email']);
                }
                // Phone: Exact match
                if (!empty($attributes['phone'])) {
                    $q->orWhere('phone', $attributes['phone']);
                }
                // Full Name Check (only if both first and last are present to avoid noise)
                if (!empty($attributes['first_name']) && !empty($attributes['last_name'])) {
                    $q->orWhere(function ($subQ) use ($attributes) {
                        $subQ->where('first_name', 'like', $attributes['first_name'] . '%')
                             ->where('last_name', 'like', $attributes['last_name'] . '%');
                    });
                }
            }
        });

        // 2. Exclude the current record if updating
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        // 3. Limit results to prevent UI clutter
        return $query->limit(5)->get();
    }
}
