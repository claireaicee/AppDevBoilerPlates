<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

// GET/POST /api/tasks, GET/PUT/PATCH/DELETE /api/tasks/{task}
Route::apiResource('tasks', TaskController::class);
