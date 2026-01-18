<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KetersediaanGuru extends Model
{
    use HasFactory;

    protected $table = 'ketersediaan_guru';

    protected $fillable = [
        'guru_id',
        'hari',
        'jam_pelajaran_id',
        'is_available',
        'keterangan',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    /**
     * Relationship: Guru
     */
    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    /**
     * Relationship: Jam Pelajaran
     */
    public function jamPelajaran()
    {
        return $this->belongsTo(JamPelajaran::class, 'jam_pelajaran_id');
    }

    /**
     * Scope: Filter by guru
     */
    public function scopeByGuru($query, $guruId)
    {
        return $query->where('guru_id', $guruId);
    }

    /**
     * Scope: Filter by hari
     */
    public function scopeByHari($query, $hari)
    {
        return $query->where('hari', $hari);
    }

    /**
     * Scope: Only available
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }
}