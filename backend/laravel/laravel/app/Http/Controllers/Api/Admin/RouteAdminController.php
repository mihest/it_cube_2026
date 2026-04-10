<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TravelRoute;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class RouteAdminController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request, true);

        $route = DB::transaction(function () use ($data) {
            $slots = $data['slots'] ?? [];
            unset($data['slots']);

            $route = TravelRoute::create($data);

            foreach ($slots as $slot) {
                $route->slots()->create([
                    'date' => $slot['date'],
                    'capacity' => $slot['capacity'],
                    'booked_count' => 0,
                    'is_active' => true,
                ]);
            }

            return $route->load(['slots', 'comments']);
        });

        return response()->json($this->formatRoute($route), 201);
    }

    public function update(Request $request, TravelRoute $travelRoute): JsonResponse
    {
        $data = $this->validated($request, false, $travelRoute);

        $route = DB::transaction(function () use ($data, $travelRoute) {
            $slots = $data['slots'] ?? null;
            unset($data['slots']);

            $travelRoute->update($data);

            if (is_array($slots)) {
                $travelRoute->slots()->delete();

                foreach ($slots as $slot) {
                    $travelRoute->slots()->create([
                        'date' => $slot['date'],
                        'capacity' => $slot['capacity'],
                        'booked_count' => 0,
                        'is_active' => true,
                    ]);
                }
            }

            return $travelRoute->load(['slots', 'comments']);
        });

        return response()->json($this->formatRoute($route));
    }

    public function destroy(TravelRoute $travelRoute): JsonResponse
    {
        if ($travelRoute->image && !$this->isExternalUrl($travelRoute->image)) {
            Storage::disk('public')->delete($travelRoute->image);
        }

        if (is_array($travelRoute->gallery)) {
            foreach ($travelRoute->gallery as $file) {
                if ($file && !$this->isExternalUrl($file)) {
                    Storage::disk('public')->delete($file);
                }
            }
        }

        $travelRoute->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    protected function validated(
        Request $request,
        bool $required = true,
        ?TravelRoute $travelRoute = null
    ): array {
        $validator = Validator::make($request->all(), [
            'title' => $required ? ['required', 'string', 'max:255'] : ['sometimes', 'string', 'max:255'],
            'shortDescription' => $required ? ['required', 'string'] : ['sometimes', 'string'],
            'fullDescription' => $required ? ['required', 'string'] : ['sometimes', 'string'],
            'duration' => $required ? ['required', 'string', 'max:50'] : ['sometimes', 'string', 'max:50'],

            'company' => ['sometimes', 'array'],
            'company.*' => ['string'],

            'transport' => $required ? ['required', 'string', 'max:50'] : ['sometimes', 'string', 'max:50'],
            'budget' => $required ? ['required', 'string', 'max:50'] : ['sometimes', 'string', 'max:50'],

            'interests' => ['sometimes', 'array'],
            'interests.*' => ['string'],

            'volunteer' => ['sometimes'],
            'volunteerImpact' => ['nullable', 'string'],
            'petsAllowed' => ['sometimes'],
            'kidsAllowed' => ['sometimes'],

            'typeLabel' => ['sometimes', 'string', 'max:255'],
            'place' => $required ? ['required', 'string', 'max:255'] : ['sometimes', 'string', 'max:255'],
            'rating' => ['sometimes', 'numeric'],
            'reviewsCount' => ['sometimes', 'integer'],
            'priceFrom' => ['sometimes', 'string', 'max:255'],

            'tips' => ['sometimes', 'array'],
            'tips.*' => ['string'],

            'coordinates' => ['sometimes', 'array'],
            'coordinates.lat' => ['sometimes', 'numeric'],
            'coordinates.lng' => ['sometimes', 'numeric'],

            'image' => $required
                ? ['required', 'image', 'max:5120']
                : ['sometimes', 'image', 'max:5120'],

            'gallery' => ['sometimes', 'array'],
            'gallery.*' => ['image', 'max:5120'],

            'slots' => ['sometimes', 'array'],
            'slots.*.date' => ['required_with:slots', 'date'],
            'slots.*.capacity' => ['required_with:slots', 'integer', 'min:0'],
        ]);

        if ($validator->fails()) {
            abort(response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $validator->errors(),
            ], 422));
        }

        $data = $validator->validated();

        $imagePath = $travelRoute?->image;
        if ($request->hasFile('image')) {
            if ($travelRoute?->image && !$this->isExternalUrl($travelRoute->image)) {
                Storage::disk('public')->delete($travelRoute->image);
            }

            $imagePath = $request->file('image')->store('routes', 'public');
        }

        $galleryPaths = $travelRoute?->gallery ?? [];
        if ($request->hasFile('gallery')) {
            if ($travelRoute && is_array($travelRoute->gallery)) {
                foreach ($travelRoute->gallery as $oldFile) {
                    if ($oldFile && !$this->isExternalUrl($oldFile)) {
                        Storage::disk('public')->delete($oldFile);
                    }
                }
            }

            $galleryPaths = [];
            foreach ($request->file('gallery') as $file) {
                $galleryPaths[] = $file->store('routes/gallery', 'public');
            }
        }

        return [
            'title' => $data['title'] ?? $travelRoute?->title,
            'short_description' => $data['shortDescription'] ?? $travelRoute?->short_description,
            'full_description' => $data['fullDescription'] ?? $travelRoute?->full_description,
            'duration' => $data['duration'] ?? $travelRoute?->duration,
            'company' => $data['company'] ?? $travelRoute?->company ?? ['solo', 'friends'],
            'transport' => $data['transport'] ?? $travelRoute?->transport ?? 'car',
            'budget' => $data['budget'] ?? $travelRoute?->budget ?? 'econom',
            'interests' => $data['interests'] ?? $travelRoute?->interests ?? ['nature'],

            'volunteer' => array_key_exists('volunteer', $data)
                ? $this->toBool($data['volunteer'])
                : ($travelRoute?->volunteer ?? false),

            'volunteer_impact' => $data['volunteerImpact'] ?? $travelRoute?->volunteer_impact,

            'pets_allowed' => array_key_exists('petsAllowed', $data)
                ? $this->toBool($data['petsAllowed'])
                : ($travelRoute?->pets_allowed ?? false),

            'kids_allowed' => array_key_exists('kidsAllowed', $data)
                ? $this->toBool($data['kidsAllowed'])
                : ($travelRoute?->kids_allowed ?? true),

            'type_label' => $data['typeLabel'] ?? $travelRoute?->type_label ?? 'Автомобильный',
            'place' => $data['place'] ?? $travelRoute?->place,
            'rating' => $data['rating'] ?? $travelRoute?->rating ?? 0,
            'reviews_count' => $data['reviewsCount'] ?? $travelRoute?->reviews_count ?? 0,
            'price_from' => $data['priceFrom'] ?? $travelRoute?->price_from ?? 'от 0 ₽',

            // Старое поле оставляем пустым/для совместимости, если оно ещё есть в БД
            'booking_dates' => [],

            'image' => $imagePath,
            'gallery' => $galleryPaths,
            'tips' => $data['tips'] ?? $travelRoute?->tips ?? [],
            'coordinates' => $data['coordinates'] ?? $travelRoute?->coordinates,

            'slots' => collect($data['slots'] ?? [])
                ->map(function ($slot) {
                    return [
                        'date' => $slot['date'],
                        'capacity' => (int) $slot['capacity'],
                    ];
                })
                ->values()
                ->all(),
        ];
    }

    protected function formatRoute(TravelRoute $route): array
    {
        $route->loadMissing(['slots', 'comments']);

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

    protected function toBool(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }
}
