<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('travel_routes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('short_description');
            $table->longText('full_description');
            $table->string('duration');
            $table->json('company')->nullable();
            $table->string('transport');
            $table->string('budget');
            $table->json('interests')->nullable();
            $table->boolean('volunteer')->default(false);
            $table->text('volunteer_impact')->nullable();
            $table->boolean('pets_allowed')->default(false);
            $table->boolean('kids_allowed')->default(true);
            $table->string('type_label');
            $table->string('place');
            $table->decimal('rating', 3, 1)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->string('price_from')->default('от 0 ₽');
            $table->json('booking_dates')->nullable();
            $table->text('image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('tips')->nullable();
            $table->json('coordinates')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('travel_routes');
    }
};
