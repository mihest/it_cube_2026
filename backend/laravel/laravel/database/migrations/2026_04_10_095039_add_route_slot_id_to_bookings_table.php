<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->foreignId('route_slot_id')
                ->nullable()
                ->after('travel_route_id')
                ->constrained('route_slots')
                ->nullOnDelete();

            $table->dropColumn('date');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('date')->nullable();
            $table->dropConstrainedForeignId('route_slot_id');
        });
    }
};
