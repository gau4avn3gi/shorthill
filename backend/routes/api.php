<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::POST('/user_registration', [App\Http\Controllers\API\UserController::class, 'registration']);
Route::POST('/login', [App\Http\Controllers\API\UserController::class, 'login']);
Route::POST('/add_product', [App\Http\Controllers\API\UserController::class, 'add_product']);
Route::POST('/edit_product', [App\Http\Controllers\API\UserController::class, 'edit_product']);
Route::POST('/delete/{id}', [App\Http\Controllers\API\UserController::class, 'delete_product']);
Route::POST('/show_products', [App\Http\Controllers\API\UserController::class, 'show_products']);




