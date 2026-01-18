<?php

namespace App\Http\Requests\MataPelajaran;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateMataPelajaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('mata_pelajaran') ?? $this->route('id');
        
        return [
            'kode_mapel' => 'sometimes|string|max:20|unique:mata_pelajaran,kode_mapel,' . $id,
            'nama_mapel' => 'sometimes|string|max:255',
            'jumlah_jam_perminggu' => 'sometimes|integer|min:1|max:10',
            'jenis' => 'sometimes|in:wajib,peminatan,muatan_lokal',
            'deskripsi' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'kode_mapel.unique' => 'Kode mata pelajaran sudah digunakan',
            'jumlah_jam_perminggu.min' => 'Jumlah jam minimal 1',
            'jumlah_jam_perminggu.max' => 'Jumlah jam maksimal 10',
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