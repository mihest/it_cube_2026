<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'travel_route_id',
        'author',
        'rating',
        'text',
        'commented_at',
    ];

    protected $casts = [
        'rating' => 'integer',
        'commented_at' => 'datetime',
    ];

    public function route()
    {
        return $this->belongsTo(TravelRoute::class, 'travel_route_id');
    }
}
