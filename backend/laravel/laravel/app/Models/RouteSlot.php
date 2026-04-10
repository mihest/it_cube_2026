<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'travel_route_id',
        'date',
        'capacity',
        'booked_count',
        'is_active',
    ];

    protected $casts = [
        'date' => 'date',
        'capacity' => 'integer',
        'booked_count' => 'integer',
        'is_active' => 'boolean',
    ];

    public function route()
    {
        return $this->belongsTo(TravelRoute::class, 'travel_route_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'route_slot_id');
    }

    public function getAvailablePlacesAttribute(): int
    {
        return max(0, $this->capacity - $this->booked_count);
    }
}
