<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HealthCheckController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'API is running',
            'timestamp' => now()->toDateTimeString(),
            'app' => config('app.name'),
            'environment' => config('app.env'),
        ], 200);
    }
}