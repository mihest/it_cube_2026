<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('route_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('travel_route_id')->constrained('travel_routes')->cascadeOnDelete();
            $table->string('author');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('text');
            $table->timestamp('commented_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('route_comments');
    }
};
