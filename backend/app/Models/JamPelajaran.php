<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JamPelajaran extends Model
{
    use HasFactory;

    protected $table = 'jam_pelajaran';

    protected $fillable = [
        'nama_jam',
        'urutan',
        'jam_mulai',
        'jam_selesai',
        'durasi_menit',
        'is_istirahat',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_istirahat' => 'boolean',
        'urutan' => 'integer',
        'durasi_menit' => 'integer',
    ];

    /**
     * Relationship: Jadwal yang menggunakan jam ini
     */
    public function jadwal()
    {
        return $this->hasMany(Jadwal::class, 'jam_pelajaran_id');
    }

    /**
     * Relationship: Ketersediaan guru di jam ini
     */
    public function ketersediaan()
    {
        return $this->hasMany(KetersediaanGuru::class, 'jam_pelajaran_id');
    }

    /**
     * Scope: Only active jam
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Exclude istirahat
     */
    public function scopeNotIstirahat($query)
    {
        return $query->where('is_istirahat', false);
    }

    /**
     * Scope: Order by urutan
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan', 'asc');
    }
}