<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JamPelajaran;

class JamPelajaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jamPelajaran = [
            ['nama_jam' => 'Jam ke-1', 'urutan' => 1, 'jam_mulai' => '07:00:00', 'jam_selesai' => '07:45:00', 'durasi_menit' => 45, 'is_istirahat' => false],
            ['nama_jam' => 'Jam ke-2', 'urutan' => 2, 'jam_mulai' => '07:45:00', 'jam_selesai' => '08:30:00', 'durasi_menit' => 45, 'is_istirahat' => false],
            ['nama_jam' => 'Jam ke-3', 'urutan' => 3, 'jam_mulai' => '08:30:00', 'jam_selesai' => '09:15:00', 'durasi_menit' => 45, 'is_istirahat' => false],
            
            // Istirahat 1
            ['nama_jam' => 'Istirahat 1', 'urutan' => 4, 'jam_mulai' => '09:15:00', 'jam_selesai' => '09:30:00', 'durasi_menit' => 15, 'is_istirahat' => true],
            
            ['nama_jam' => 'Jam ke-4', 'urutan' => 5, 'jam_mulai' => '09:30:00', 'jam_selesai' => '10:15:00', 'durasi_menit' => 45, 'is_istirahat' => false],
            ['nama_jam' => 'Jam ke-5', 'urutan' => 6, 'jam_mulai' => '10:15:00', 'jam_selesai' => '11:00:00', 'durasi_menit' => 45, 'is_istirahat' => false],
            ['nama_jam' => 'Jam ke-6', 'urutan' => 7, 'jam_mulai' => '11:00:00', 'jam_selesai' => '11:45:00', 'durasi_menit' => 45, 'is_istirahat' => false],
            
            // Istirahat 2 (Makan Siang)
            ['nama_jam' => 'Istirahat 2', 'urutan' => 8, 'jam_mulai' => '11:45:00', 'jam_selesai' => '12:15:00', 'durasi_menit' => 30, 'is_istirahat' => true],
            
            ['nama_jam' => 'Jam ke-7', 'urutan' => 9, 'jam_mulai' => '12:15:00', 'jam_selesai' => '13:00:00', 'durasi_menit' => 45, 'is_istirahat' => false],
            ['nama_jam' => 'Jam ke-8', 'urutan' => 10, 'jam_mulai' => '13:00:00', 'jam_selesai' => '13:45:00', 'durasi_menit' => 45, 'is_istirahat' => false],
            ['nama_jam' => 'Jam ke-9', 'urutan' => 11, 'jam_mulai' => '13:45:00', 'jam_selesai' => '14:30:00', 'durasi_menit' => 45, 'is_istirahat' => false],
            ['nama_jam' => 'Jam ke-10', 'urutan' => 12, 'jam_mulai' => '14:30:00', 'jam_selesai' => '15:15:00', 'durasi_menit' => 45, 'is_istirahat' => false],
        ];

        foreach ($jamPelajaran as $jam) {
            JamPelajaran::create($jam);
        }

        $this->command->info('✓ ' . count($jamPelajaran) . ' Jam pelajaran created');
    }
}