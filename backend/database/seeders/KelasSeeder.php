<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kelas;
use App\Models\User;

class KelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $guru = User::where('role', 'guru')->get();
        
        $kelas = [
            // Kelas X
            ['nama_kelas' => 'X IPA 1', 'tingkat' => 'X', 'jurusan' => 'IPA', 'kapasitas' => 36, 'ruangan' => 'R.201'],
            ['nama_kelas' => 'X IPA 2', 'tingkat' => 'X', 'jurusan' => 'IPA', 'kapasitas' => 36, 'ruangan' => 'R.202'],
            ['nama_kelas' => 'X IPS 1', 'tingkat' => 'X', 'jurusan' => 'IPS', 'kapasitas' => 36, 'ruangan' => 'R.203'],
            ['nama_kelas' => 'X IPS 2', 'tingkat' => 'X', 'jurusan' => 'IPS', 'kapasitas' => 36, 'ruangan' => 'R.204'],
            
            // Kelas XI
            ['nama_kelas' => 'XI IPA 1', 'tingkat' => 'XI', 'jurusan' => 'IPA', 'kapasitas' => 36, 'ruangan' => 'R.301'],
            ['nama_kelas' => 'XI IPA 2', 'tingkat' => 'XI', 'jurusan' => 'IPA', 'kapasitas' => 36, 'ruangan' => 'R.302'],
            ['nama_kelas' => 'XI IPS 1', 'tingkat' => 'XI', 'jurusan' => 'IPS', 'kapasitas' => 36, 'ruangan' => 'R.303'],
            ['nama_kelas' => 'XI IPS 2', 'tingkat' => 'XI', 'jurusan' => 'IPS', 'kapasitas' => 36, 'ruangan' => 'R.304'],
            
            // Kelas XII
            ['nama_kelas' => 'XII IPA 1', 'tingkat' => 'XII', 'jurusan' => 'IPA', 'kapasitas' => 36, 'ruangan' => 'R.401'],
            ['nama_kelas' => 'XII IPA 2', 'tingkat' => 'XII', 'jurusan' => 'IPA', 'kapasitas' => 36, 'ruangan' => 'R.402'],
            ['nama_kelas' => 'XII IPS 1', 'tingkat' => 'XII', 'jurusan' => 'IPS', 'kapasitas' => 36, 'ruangan' => 'R.403'],
            ['nama_kelas' => 'XII IPS 2', 'tingkat' => 'XII', 'jurusan' => 'IPS', 'kapasitas' => 36, 'ruangan' => 'R.404'],
        ];

        foreach ($kelas as $index => $kelasData) {
            // Assign wali kelas secara acak dari guru yang ada
            $waliKelas = $guru->random();
            $kelasData['wali_kelas_id'] = $waliKelas->id;
            
            Kelas::create($kelasData);
        }

        $this->command->info('✓ ' . count($kelas) . ' Kelas created');
    }
}