<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingAdminController extends Controller
{
    public function index(): JsonResponse
    {
        $bookings = Booking::with(['route', 'user'])
            ->latest()
            ->get()
            ->map(fn ($booking) => $this->formatBooking($booking));

        return response()->json($bookings);
    }

    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', 'in:pending,approved,cancelled'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $validator->errors(),
            ], 422);
        }

        $booking->update([
            'status' => $request->status,
        ]);

        $booking->load(['route', 'user']);

        return response()->json($this->formatBooking($booking));
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
