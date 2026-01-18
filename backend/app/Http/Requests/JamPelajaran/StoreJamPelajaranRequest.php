<?php

namespace App\Http\Requests\JamPelajaran;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreJamPelajaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_jam' => 'required|string|max:50',
            'urutan' => 'required|integer|min:1|unique:jam_pelajaran,urutan',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'durasi_menit' => 'required|integer|min:1|max:180',
            'is_istirahat' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_jam.required' => 'Nama jam wajib diisi',
            'urutan.required' => 'Urutan jam wajib diisi',
            'urutan.unique' => 'Urutan jam sudah digunakan',
            'jam_mulai.required' => 'Jam mulai wajib diisi',
            'jam_mulai.date_format' => 'Format jam mulai harus HH:MM (contoh: 07:00)',
            'jam_selesai.required' => 'Jam selesai wajib diisi',
            'jam_selesai.date_format' => 'Format jam selesai harus HH:MM (contoh: 07:45)',
            'jam_selesai.after' => 'Jam selesai harus lebih besar dari jam mulai',
            'durasi_menit.required' => 'Durasi wajib diisi',
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