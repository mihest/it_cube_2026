<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\TravelRoute;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'routeId' => ['required', 'integer', 'exists:travel_routes,id'],
            'date' => ['required', 'string', 'max:255'],
            'people' => ['required', 'string', 'max:50'],
            'phone' => ['required', 'string', 'max:255'],
            'comment' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $validator->errors(),
            ], 422);
        }

        $booking = Booking::create([
            'travel_route_id' => $request->routeId,
            'user_id' => $request->user()->id,
            'status' => 'pending',
            'date' => $request->date,
            'people' => $request->people,
            'phone' => $request->phone,
            'comment' => $request->comment,
        ]);

        $booking->load(['route', 'user']);

        return response()->json($this->formatBooking($booking), 201);
    }

    public function my(Request $request): JsonResponse
    {
        $bookings = Booking::with(['route', 'user'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn ($booking) => $this->formatBooking($booking));

        return response()->json($bookings);
    }

    protected function formatBooking(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'status' => $booking->status,
            'createdAt' => $booking->created_at?->toIso8601String(),
            'route' => [
                'id' => $booking->route->id,
                'title' => $booking->route->title,
                'place' => $booking->route->place,
                'duration' => $booking->route->duration,
                'date' => $booking->date,
                'priceFrom' => $booking->route->price_from,
            ],
            'user' => [
                'id' => $booking->user->id,
                'fullName' => $booking->user->full_name,
                'username' => $booking->user->username,
                'email' => $booking->user->email,
                'phone' => $booking->phone,
            ],
            'people' => $booking->people,
            'comment' => $booking->comment,
        ];
    }
}
