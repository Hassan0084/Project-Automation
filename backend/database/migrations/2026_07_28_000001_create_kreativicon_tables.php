<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('role')->default('Viewer'); // Super Admin, Admin, Coordinator, Engineer, Sales, Viewer
            $table->string('region')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // Customers Table
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company_name');
            $table->string('contact_person')->nullable();
            $table->string('mobile')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('region')->default('CENTRAL');
            $table->string('city')->default('RIYADH');
            $table->string('national_address')->nullable();
            $table->string('vat_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Engineers Table
        Schema::create('engineers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('specialization')->default('MW Specialist');
            $table->string('region')->default('CENTRAL');
            $table->integer('max_capacity')->default(10);
            $table->timestamps();
        });

        // Orders Table (Full alignment with KI_Orders_with_Summary_Updated source of truth)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('sl_no')->nullable();
            $table->string('ki_id')->unique();
            $table->date('order_received')->nullable();
            $table->string('region')->default('CENTRAL');
            $table->string('city')->default('RIYADHDST');
            $table->string('circuit_id')->nullable();
            $table->string('order_number')->nullable();
            $table->string('customer_name');
            $table->string('customer_contact')->nullable();
            $table->string('bw')->default('8MBPs');
            $table->date('los_performed')->nullable();
            $table->string('los_status')->nullable(); // CLOS, Pending, Not Started
            $table->string('los_id')->nullable();
            $table->date('cwo_date')->nullable();
            $table->date('installation_start')->nullable();
            $table->date('installation_complete')->nullable();
            $table->date('delivery_date')->nullable();
            $table->string('order_status')->default('Under MW Installation');
            $table->string('assigned_to')->nullable();
            $table->boolean('is_cancelled')->default(false);
            $table->enum('priority', ['High', 'Medium', 'Low'])->default('Medium');
            $table->string('service_type')->default('Microwave Link');
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        // Order Activity History
        Schema::create('order_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('user');
            $table->string('action');
            $table->text('details')->nullable();
            $table->timestamp('timestamp')->useCurrent();
        });

        // Order Documents
        Schema::create('order_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_size')->nullable();
            $table->string('file_type')->nullable();
            $table->string('uploaded_by')->nullable();
            $table->timestamps();
        });

        // Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('user');
            $table->string('role');
            $table->string('action');
            $table->string('target');
            $table->text('details')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('order_documents');
        Schema::dropIfExists('order_activities');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('engineers');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('users');
    }
};
