<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin Account
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'nip' => null,
            'phone' => '081234567890',
            'address' => 'Jl. Admin No. 1',
            'is_active' => true,
        ]);

        // Kepala Sekolah Account
        User::create([
            'name' => 'Dr. Kepala Sekolah',
            'email' => 'kepsek@example.com',
            'password' => Hash::make('password'),
            'role' => 'kepsek',
            'nip' => '196501011990031001',
            'phone' => '081234567891',
            'address' => 'Jl. Kepsek No. 1',
            'is_active' => true,
        ]);

        // Guru Accounts (Sample)
        User::create([
            'name' => 'Budi Santoso, S.Pd',
            'email' => 'guru1@example.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'nip' => '198001012005011001',
            'phone' => '081234567892',
            'address' => 'Jl. Guru No. 1',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Siti Nurhaliza, S.Pd',
            'email' => 'guru2@example.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'nip' => '198505102006042001',
            'phone' => '081234567893',
            'address' => 'Jl. Guru No. 2',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Ahmad Dahlan, S.Kom',
            'email' => 'guru3@example.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'nip' => '199003152010011002',
            'phone' => '081234567894',
            'address' => 'Jl. Guru No. 3',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Dewi Lestari, S.Si',
            'email' => 'guru4@example.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'nip' => '198807202012042001',
            'phone' => '081234567895',
            'address' => 'Jl. Guru No. 4',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Eko Prasetyo, S.Pd',
            'email' => 'guru5@example.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'nip' => '199201012015011001',
            'phone' => '081234567896',
            'address' => 'Jl. Guru No. 5',
            'is_active' => true,
        ]);

        // Output info
        $this->command->info('✓ Admin account created: admin@example.com / password');
        $this->command->info('✓ Kepsek account created: kepsek@example.com / password');
        $this->command->info('✓ 5 Guru accounts created: guru1-5@example.com / password');
    }
}