<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasFactory;
    protected $fillable = ['page_name', 'ip','countryName', 'countryCode','regionCode', 'regionName',
    'cityName', 'zipCode', 'latitude', 'longitude', 'areaCode', 'timezone',
];
}
