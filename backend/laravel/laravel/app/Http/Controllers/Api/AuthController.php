<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RefreshToken;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function signIn(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Неверный логин или пароль',
            ], 401);
        }

        $user->tokens()->delete();

        $accessToken = $user->createToken('access-token')->plainTextToken;
        $refreshToken = $this->issueRefreshToken($user);

        return response()
            ->json([
                'access_token' => $accessToken,
                'user' => $this->userPayload($user),
            ])
            ->cookie($refreshToken);
    }

    public function signUp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'fullName' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'full_name' => $request->fullName,
            'role' => 'user',
        ]);

        $accessToken = $user->createToken('access-token')->plainTextToken;
        $refreshToken = $this->issueRefreshToken($user);

        return response()
            ->json([
                'access_token' => $accessToken,
                'user' => $this->userPayload($user),
            ], 201)
            ->cookie($refreshToken);
    }

    public function refresh(Request $request): JsonResponse
    {
        $plainToken = $request->cookie('refresh_token');

        if (!$plainToken) {
            return response()->json([
                'message' => 'Refresh token отсутствует',
            ], 401);
        }

        $stored = RefreshToken::where('token', hash('sha256', $plainToken))
            ->where('expires_at', '>', now())
            ->first();

        if (!$stored || !$stored->user) {
            return response()->json([
                'message' => 'Refresh token недействителен',
            ], 401);
        }

        $user = $stored->user;

        $stored->delete();
        $user->tokens()->delete();

        $accessToken = $user->createToken('access-token')->plainTextToken;
        $refreshCookie = $this->issueRefreshToken($user);

        return response()
            ->json([
                'access_token' => $accessToken,
                'user' => $this->userPayload($user),
            ])
            ->cookie($refreshCookie);
    }

    public function signOut(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            $user->tokens()->delete();
        }

        $plainToken = $request->cookie('refresh_token');
        if ($plainToken) {
            RefreshToken::where('token', hash('sha256', $plainToken))->delete();
        }

        return response()
            ->json([
                'success' => true,
            ])
            ->cookie(Cookie::forget('refresh_token'));
    }

    protected function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'fullName' => $user->full_name,
            'email' => $user->email,
            'role' => $user->role,
        ];
    }

    protected function issueRefreshToken(User $user)
    {
        $plain = Str::random(64);

        RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $plain),
            'expires_at' => Carbon::now()->addDays(7),
        ]);

        return cookie(
            'refresh_token',
            $plain,
            60 * 24 * 7,
            '/',
            null,
            false,
            true,
            false,
            'lax'
        );
    }
}
