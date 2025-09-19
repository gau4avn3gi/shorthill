<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    private function authenticate(Request $request, $requireAdmin = false)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return ['error' => response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422)];
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return ['error' => response()->json([
                'status'  => false,
                'message' => 'Invalid credentials'
            ], 401)];
        }

        if ($requireAdmin && $user->role !== 'admin') {
            return ['error' => response()->json([
                'status'  => false,
                'message' => 'Access denied. Admins only.'
            ], 403)];
        }

        return ['user' => $user];
    }

    // User Registration

    public function registration(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role'     => 'required|string|in:admin,user',
            'name'     => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'name'     => $request->name
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'User registered successfully'
        ], 201);
    }


    //  User Login
    public function login(Request $request)
    {
        $auth = $this->authenticate($request);

        if (isset($auth['error'])) return $auth['error'];

        $user = $auth['user'];

        return response()->json([
            'status'  => true,
            'message' => 'Login successful',
            'data'    => $user
        ], 200);
    }

    // Add Product (Admins only)
    public function add_product(Request $request)
    {
        $auth = $this->authenticate($request, true);
        if (isset($auth['error'])) return $auth['error'];

        $data = json_decode($request->input('data'), true);

        if (!$data) {
            return response()->json([
                'status'  => false,
                'message' => 'Invalid JSON in data field'
            ], 400);
        }

        $validator = Validator::make($data, [
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::create($data);

        return response()->json([
            'status'  => true,
            'message' => 'Product added successfully'
        ], 201);
    }

    // Edit Product (Admins only)
    public function edit_product(Request $request)
    {
        $auth = $this->authenticate($request, true);
        if (isset($auth['error'])) return $auth['error'];

        $data = json_decode($request->input('data'), true);

        if (!$data) {
            return response()->json([
                'status'  => false,
                'message' => 'Invalid JSON in data field'
            ], 400);
        }

        $validator = Validator::make($data, [
            'id'          => 'required|exists:products,id',
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'sometimes|required|numeric|min:0',
            'stock'       => 'sometimes|required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::find($data['id']);
        $product->update($data);

        return response()->json([
            'status'  => true,
            'message' => 'Product updated successfully'
        ], 200);
    }

    // Delete Product (Admins only)
    public function delete_product(Request $request, $id)
    {
        $auth = $this->authenticate($request, true);
        if (isset($auth['error'])) return $auth['error'];

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status'  => false,
                'message' => 'Product not found'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Product deleted successfully'
        ], 200);
    }


    // Show Product List (All users)

    public function show_products(Request $request)
    {
        $auth = $this->authenticate($request);
        if (isset($auth['error'])) return $auth['error'];

        $products = Product::all();

        return response()->json([
            'status'  => true,
            'message' => 'Products fetched successfully',
            'data'    => $products
        ], 200);
    }
}
