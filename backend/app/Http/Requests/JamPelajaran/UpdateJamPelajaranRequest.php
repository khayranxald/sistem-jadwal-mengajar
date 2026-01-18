<?php

namespace App\Http\Requests\JamPelajaran;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateJamPelajaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('jam_pelajaran') ?? $this->route('id');
        
        return [
            'nama_jam' => 'sometimes|string|max:50',
            'urutan' => 'sometimes|integer|min:1|unique:jam_pelajaran,urutan,' . $id,
            'jam_mulai' => 'sometimes|date_format:H:i',
            'jam_selesai' => 'sometimes|date_format:H:i|after:jam_mulai',
            'durasi_menit' => 'sometimes|integer|min:1|max:180',
            'is_istirahat' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'urutan.unique' => 'Urutan jam sudah digunakan',
            'jam_mulai.date_format' => 'Format jam mulai harus HH:MM',
            'jam_selesai.date_format' => 'Format jam selesai harus HH:MM',
            'jam_selesai.after' => 'Jam selesai harus lebih besar dari jam mulai',
            'durasi_menit.min' => 'Durasi minimal 1 menit',
            'durasi_menit.max' => 'Durasi maksimal 180 menit',
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