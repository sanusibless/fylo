<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoragePlan extends Model
{
    use HasFactory;

    public const YEARLY_DISCOUNT_RATE = 0.20;

    protected $guarded = ['id'];

    protected $casts = [
        'features' => 'array',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
        'price_monthly' => 'decimal:2',
        'price_yearly' => 'decimal:2',
    ];

    public static function calculateYearlyPrice(float $monthlyPrice): float
    {
        if ($monthlyPrice <= 0) {
            return 0.00;
        }

        return round($monthlyPrice * 12 * (1 - self::YEARLY_DISCOUNT_RATE), 2);
    }

    public static function calculateYearlyDiscountAmount(float $monthlyPrice): float
    {
        if ($monthlyPrice <= 0) {
            return 0.00;
        }

        $grossYearly = $monthlyPrice * 12;

        return round($grossYearly - self::calculateYearlyPrice($monthlyPrice), 2);
    }

    public function getAmountForCycle(string $cycle): float
    {
        $monthly = (float) $this->price_monthly;
        if ($cycle === 'yearly') {
            return self::calculateYearlyPrice($monthly);
        }

        return round($monthly, 2);
    }

    public function getSubtotalForCycle(string $cycle): float
    {
        $monthly = (float) $this->price_monthly;
        if ($cycle === 'yearly') {
            return round($monthly * 12, 2);
        }

        return round($monthly, 2);
    }

    public function getDiscountForCycle(string $cycle): float
    {
        $monthly = (float) $this->price_monthly;
        if ($cycle === 'yearly') {
            return self::calculateYearlyDiscountAmount($monthly);
        }

        return 0.00;
    }

    public function userStoragePlans()
    {
        return $this->hasMany(UserStoragePlan::class);
    }
}
