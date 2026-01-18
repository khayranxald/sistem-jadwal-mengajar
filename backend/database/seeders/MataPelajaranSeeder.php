<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MataPelajaran;

class MataPelajaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mataPelajaran = [
            // Mata Pelajaran Wajib
            ['kode_mapel' => 'MTK', 'nama_mapel' => 'Matematika', 'jumlah_jam_perminggu' => 4, 'jenis' => 'wajib'],
            ['kode_mapel' => 'BIN', 'nama_mapel' => 'Bahasa Indonesia', 'jumlah_jam_perminggu' => 4, 'jenis' => 'wajib'],
            ['kode_mapel' => 'BING', 'nama_mapel' => 'Bahasa Inggris', 'jumlah_jam_perminggu' => 3, 'jenis' => 'wajib'],
            ['kode_mapel' => 'PKN', 'nama_mapel' => 'Pendidikan Kewarganegaraan', 'jumlah_jam_perminggu' => 2, 'jenis' => 'wajib'],
            ['kode_mapel' => 'PJOK', 'nama_mapel' => 'Pendidikan Jasmani & Olahraga', 'jumlah_jam_perminggu' => 2, 'jenis' => 'wajib'],
            ['kode_mapel' => 'PAI', 'nama_mapel' => 'Pendidikan Agama Islam', 'jumlah_jam_perminggu' => 2, 'jenis' => 'wajib'],
            ['kode_mapel' => 'SEJIN', 'nama_mapel' => 'Sejarah Indonesia', 'jumlah_jam_perminggu' => 2, 'jenis' => 'wajib'],
            
            // Mata Pelajaran Peminatan IPA
            ['kode_mapel' => 'FIS', 'nama_mapel' => 'Fisika', 'jumlah_jam_perminggu' => 4, 'jenis' => 'peminatan'],
            ['kode_mapel' => 'KIM', 'nama_mapel' => 'Kimia', 'jumlah_jam_perminggu' => 4, 'jenis' => 'peminatan'],
            ['kode_mapel' => 'BIO', 'nama_mapel' => 'Biologi', 'jumlah_jam_perminggu' => 4, 'jenis' => 'peminatan'],
            
            // Mata Pelajaran Peminatan IPS
            ['kode_mapel' => 'SEJ', 'nama_mapel' => 'Sejarah', 'jumlah_jam_perminggu' => 3, 'jenis' => 'peminatan'],
            ['kode_mapel' => 'GEO', 'nama_mapel' => 'Geografi', 'jumlah_jam_perminggu' => 3, 'jenis' => 'peminatan'],
            ['kode_mapel' => 'EKO', 'nama_mapel' => 'Ekonomi', 'jumlah_jam_perminggu' => 4, 'jenis' => 'peminatan'],
            ['kode_mapel' => 'SOS', 'nama_mapel' => 'Sosiologi', 'jumlah_jam_perminggu' => 3, 'jenis' => 'peminatan'],
            
            // Muatan Lokal
            ['kode_mapel' => 'BJAWA', 'nama_mapel' => 'Bahasa Jawa', 'jumlah_jam_perminggu' => 2, 'jenis' => 'muatan_lokal'],
            ['kode_mapel' => 'SENI', 'nama_mapel' => 'Seni Budaya', 'jumlah_jam_perminggu' => 2, 'jenis' => 'muatan_lokal'],
        ];

        foreach ($mataPelajaran as $mapel) {
            MataPelajaran::create($mapel);
        }

        $this->command->info('✓ ' . count($mataPelajaran) . ' Mata pelajaran created');
    }
}