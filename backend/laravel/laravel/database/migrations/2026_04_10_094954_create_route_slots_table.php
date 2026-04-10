<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('route_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('travel_route_id')->constrained('travel_routes')->cascadeOnDelete();
            $table->date('date');
            $table->unsignedInteger('capacity')->default(0);
            $table->unsignedInteger('booked_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('route_slots');
    }
};
