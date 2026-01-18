<?php

namespace App\Http\Requests\MataPelajaran;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreMataPelajaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_mapel' => 'required|string|max:20|unique:mata_pelajaran,kode_mapel',
            'nama_mapel' => 'required|string|max:255',
            'jumlah_jam_perminggu' => 'required|integer|min:1|max:10',
            'jenis' => 'required|in:wajib,peminatan,muatan_lokal',
            'deskripsi' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'kode_mapel.required' => 'Kode mata pelajaran wajib diisi',
            'kode_mapel.unique' => 'Kode mata pelajaran sudah digunakan',
            'nama_mapel.required' => 'Nama mata pelajaran wajib diisi',
            'jumlah_jam_perminggu.required' => 'Jumlah jam per minggu wajib diisi',
            'jumlah_jam_perminggu.min' => 'Jumlah jam minimal 1',
            'jumlah_jam_perminggu.max' => 'Jumlah jam maksimal 10',
            'jenis.required' => 'Jenis mata pelajaran wajib dipilih',
            'jenis.in' => 'Jenis mata pelajaran tidak valid',
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