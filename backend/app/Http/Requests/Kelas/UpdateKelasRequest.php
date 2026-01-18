<?php

namespace App\Http\Requests\Kelas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateKelasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_kelas' => 'sometimes|string|max:50',
            'tingkat' => 'sometimes|in:X,XI,XII',
            'jurusan' => 'sometimes|in:IPA,IPS,Bahasa,Umum',
            'kapasitas' => 'sometimes|integer|min:1|max:50',
            'ruangan' => 'nullable|string|max:50',
            'wali_kelas_id' => 'nullable|exists:users,id',
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'tingkat.in' => 'Tingkat kelas tidak valid',
            'jurusan.in' => 'Jurusan tidak valid',
            'kapasitas.min' => 'Kapasitas minimal 1',
            'kapasitas.max' => 'Kapasitas maksimal 50',
            'wali_kelas_id.exists' => 'Guru wali kelas tidak ditemukan',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}