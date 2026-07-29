<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'sl_no',
        'ki_id',
        'order_received',
        'region',
        'city',
        'circuit_id',
        'order_number',
        'customer_name',
        'customer_contact',
        'bw',
        'los_performed',
        'los_status',
        'los_id',
        'cwo_date',
        'installation_start',
        'installation_complete',
        'delivery_date',
        'order_status',
        'assigned_to',
        'is_cancelled',
        'priority',
        'service_type',
        'remarks',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'is_cancelled' => 'boolean',
        'order_received' => 'date',
        'los_performed' => 'date',
        'cwo_date' => 'date',
        'installation_start' => 'date',
        'installation_complete' => 'date',
        'delivery_date' => 'date',
    ];

    public function activities()
    {
        return $this->hasMany(OrderActivity::class);
    }

    public function documents()
    {
        return $this->hasMany(OrderDocument::class);
    }
}
