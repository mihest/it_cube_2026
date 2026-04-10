<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TravelRoute;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RouteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = TravelRoute::with([
            'comments' => function ($q) {
                $q->latest('commented_at');
            },
            'slots' => function ($q) {
                $q->orderBy('date');
            },
        ]);

        if ($request->filled('search')) {
            $search = mb_strtolower(trim($request->search));

            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(short_description) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(full_description) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(place) LIKE ?', ["%{$search}%"]);
            });
        }

        if ($request->filled('company') && $request->company !== 'any') {
            $query->whereJsonContains('company', $request->company);
        }

        if ($request->filled('transport') && $request->transport !== 'any') {
            $query->where('transport', $request->transport);
        }

        if ($request->filled('budget') && $request->budget !== 'any') {
            $query->where('budget', $request->budget);
        }

        if ($request->boolean('withPets')) {
            $query->where('pets_allowed', true);
        }

        if ($request->boolean('volunteerOnly')) {
            $query->where('volunteer', true);
        }

        if ($request->filled('interests')) {
            $interests = is_array($request->interests)
                ? $request->interests
                : explode(',', $request->interests);

            $query->where(function ($q) use ($interests) {
                foreach ($interests as $interest) {
                    $interest = trim((string) $interest);

                    if ($interest !== '') {
                        $q->orWhereJsonContains('interests', $interest);
                    }
                }
            });
        }

        $routes = $query->latest()->get()->map(fn ($route) => $this->formatRoute($route));

        return response()->json($routes);
    }

    public function show(TravelRoute $travelRoute): JsonResponse
    {
        $travelRoute->load([
            'comments' => function ($q) {
                $q->latest('commented_at');
            },
            'slots' => function ($q) {
                $q->orderBy('date');
            },
        ]);

        return response()->json($this->formatRoute($travelRoute));
    }

    protected function formatRoute(TravelRoute $route): array
    {
        $slots = $route->slots->map(function ($slot) {
            $available = max(0, (int) $slot->capacity - (int) $slot->booked_count);

            return [
                'id' => $slot->id,
                'date' => optional($slot->date)->format('Y-m-d'),
                'label' => optional($slot->date)->format('d.m.Y'),
                'capacity' => (int) $slot->capacity,
                'bookedCount' => (int) $slot->booked_count,
                'availablePlaces' => $available,
                'isActive' => (bool) $slot->is_active,
                'isAvailable' => (bool) $slot->is_active && $available > 0,
            ];
        })->values()->all();

        return [
            'id' => $route->id,
            'title' => $route->title,
            'shortDescription' => $route->short_description,
            'fullDescription' => $route->full_description,
            'duration' => $route->duration,
            'company' => $route->company ?? [],
            'transport' => $route->transport,
            'budget' => $route->budget,
            'interests' => $route->interests ?? [],
            'volunteer' => (bool) $route->volunteer,
            'volunteerImpact' => $route->volunteer_impact,
            'petsAllowed' => (bool) $route->pets_allowed,
            'kidsAllowed' => (bool) $route->kids_allowed,
            'typeLabel' => $route->type_label,
            'place' => $route->place,
            'rating' => (float) $route->rating,
            'reviewsCount' => (int) $route->reviews_count,
            'priceFrom' => $route->price_from,

            'bookingDates' => collect($slots)->pluck('label')->values()->all(),
            'slots' => $slots,

            'image' => $this->resolveFileUrl($route->image),
            'gallery' => collect($route->gallery ?? [])
                ->map(fn ($path) => $this->resolveFileUrl($path))
                ->filter()
                ->values()
                ->all(),

            'tips' => $route->tips ?? [],
            'coordinates' => $route->coordinates,

            'comments' => $route->comments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'author' => $comment->author,
                    'date' => optional($comment->commented_at)->format('d.m.Y'),
                    'rating' => (int) $comment->rating,
                    'text' => $comment->text,
                ];
            })->values()->all(),
        ];
    }

    protected function resolveFileUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if ($this->isExternalUrl($path)) {
            return $path;
        }

        return Storage::url($path);
    }

    protected function isExternalUrl(string $path): bool
    {
        return str_starts_with($path, 'http://') || str_starts_with($path, 'https://');
    }
}
