<?php 

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Throwable;

class GeneralService 
{
    protected $name = "General Service";
    public function serviceResponse($status, $message, $data = null) 
    {
        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    public function log($message, $data = null) {
        Log::info($message, 
        [
            "data" => $data
        ]);
    }

    public function logError(Throwable $throwable)
    {
        Log::warning("Error in " . $this->name, 
        ["" => $throwable ]);
    }

    public static function generalLog($message, $data)
    {
        Log::warning($message ,
            ["" => $data 
        ]);
    }
}