<?php

namespace App\Models;

use App\Models\RouteSlot;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TravelRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'short_description',
        'full_description',
        'duration',
        'company',
        'transport',
        'budget',
        'interests',
        'volunteer',
        'volunteer_impact',
        'pets_allowed',
        'kids_allowed',
        'type_label',
        'place',
        'rating',
        'reviews_count',
        'price_from',
        'booking_dates',
        'image',
        'gallery',
        'tips',
        'coordinates',
    ];

    protected $casts = [
        'company' => 'array',
        'interests' => 'array',
        'volunteer' => 'boolean',
        'pets_allowed' => 'boolean',
        'kids_allowed' => 'boolean',
        'rating' => 'float',
        'reviews_count' => 'integer',
        'booking_dates' => 'array',
        'gallery' => 'array',
        'tips' => 'array',
        'coordinates' => 'array',
    ];

    public function comments()
    {
        return $this->hasMany(RouteComment::class, 'travel_route_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'travel_route_id');
    }

    public function slots()
    {
        return $this->hasMany(RouteSlot::class, 'travel_route_id')->orderBy('date');
    }
}
