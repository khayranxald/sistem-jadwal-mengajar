<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataPelajaran extends Model
{
    use HasFactory;

    protected $table = 'mata_pelajaran';

    protected $fillable = [
        'kode_mapel',
        'nama_mapel',
        'jumlah_jam_perminggu',
        'jenis',
        'deskripsi',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'jumlah_jam_perminggu' => 'integer',
    ];

    /**
     * Relationship: Guru yang mengajar mapel ini (Many-to-Many)
     */
    public function guru()
    {
        return $this->belongsToMany(User::class, 'guru_mapel', 'mata_pelajaran_id', 'guru_id')
                    ->withTimestamps();
    }

    /**
     * Relationship: Jadwal yang menggunakan mapel ini
     */
    public function jadwal()
    {
        return $this->hasMany(Jadwal::class, 'mata_pelajaran_id');
    }

    /**
     * Scope: Only active mapel
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Filter by jenis
     */
    public function scopeByJenis($query, $jenis)
    {
        return $query->where('jenis', $jenis);
    }
}