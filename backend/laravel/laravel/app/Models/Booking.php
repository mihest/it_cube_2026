<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'travel_route_id',
        'user_id',
        'status',
        'date',
        'people',
        'phone',
        'comment',
    ];

    public function route()
    {
        return $this->belongsTo(TravelRoute::class, 'travel_route_id');
    }

    public function slot()
    {
        return $this->belongsTo(RouteSlot::class, 'route_slot_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
