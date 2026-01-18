<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class JadwalExportController extends Controller
{
    /**
     * Export jadwal to PDF
     */
    public function exportPDF(Request $request)
    {
        try {
            $type = $request->input('type', 'lengkap');
            $includeDetails = $request->input('details', true);
            $includeStatistics = $request->input('statistics', false);

            $data = $this->getJadwalData($type);

            $pdf = Pdf::loadView('exports.jadwal-pdf', [
                'data' => $data,
                'type' => $type,
                'includeDetails' => $includeDetails,
                'includeStatistics' => $includeStatistics,
                'exportDate' => now()->format('d/m/Y H:i')
            ]);

            return $pdf->download('jadwal-' . $type . '-' . time() . '.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal export PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export jadwal to Excel
     */
    public function exportExcel(Request $request)
    {
        try {
            $type = $request->input('type', 'lengkap');
            $data = $this->getJadwalData($type);

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            // Header
            $sheet->setCellValue('A1', 'JADWAL PELAJARAN');
            $sheet->setCellValue('A2', 'Tipe: ' . strtoupper($type));
            $sheet->setCellValue('A3', 'Tanggal Export: ' . now()->format('d/m/Y H:i'));

            // Column headers
            $row = 5;
            $headers = ['No', 'Hari', 'Jam', 'Mata Pelajaran', 'Guru', 'Kelas', 'Ruangan'];
            $col = 'A';
            foreach ($headers as $header) {
                $sheet->setCellValue($col . $row, $header);
                $col++;
            }

            // Data
            $row = 6;
            $no = 1;
            foreach ($data as $jadwal) {
                $sheet->setCellValue('A' . $row, $no++);
                $sheet->setCellValue('B' . $row, $jadwal['hari']);
                $sheet->setCellValue('C' . $row, $jadwal['jam']);
                $sheet->setCellValue('D' . $row, $jadwal['mata_pelajaran']);
                $sheet->setCellValue('E' . $row, $jadwal['guru']);
                $sheet->setCellValue('F' . $row, $jadwal['kelas']);
                $sheet->setCellValue('G' . $row, $jadwal['ruangan'] ?? '-');
                $row++;
            }

            // Auto size columns
            foreach (range('A', 'G') as $col) {
                $sheet->getColumnDimension($col)->setAutoSize(true);
            }

            $writer = new Xlsx($spreadsheet);
            
            $filename = 'jadwal-' . $type . '-' . time() . '.xlsx';
            $tempFile = tempnam(sys_get_temp_dir(), $filename);
            
            $writer->save($tempFile);

            return response()->download($tempFile, $filename)->deleteFileAfterSend();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal export Excel: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate print preview HTML
     */
    public function printPreview(Request $request)
    {
        try {
            $type = $request->input('type', 'lengkap');
            $data = $this->getJadwalData($type);

            return view('exports.jadwal-print', [
                'data' => $data,
                'type' => $type,
                'printDate' => now()->format('d/m/Y H:i')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal generate print preview: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get jadwal data based on type
     */
    private function getJadwalData($type)
    {
        $query = Jadwal::with(['guru', 'mataPelajaran', 'kelas', 'jamPelajaran'])
            ->orderBy('hari')
            ->orderBy('jam_id');

        if ($type === 'per-guru') {
            $jadwal = $query->get()->groupBy('guru_id');
        } elseif ($type === 'per-kelas') {
            $jadwal = $query->get()->groupBy('kelas_id');
        } else {
            $jadwal = $query->get();
        }

        $result = [];
        $hariNames = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

        foreach ($jadwal as $item) {
            if (is_object($item)) {
                $result[] = [
                    'hari' => $hariNames[$item->hari] ?? '',
                    'jam' => $item->jamPelajaran->jam ?? '',
                    'mata_pelajaran' => $item->mataPelajaran->nama ?? '',
                    'guru' => $item->guru->nama ?? '',
                    'kelas' => $item->kelas->nama ?? '',
                    'ruangan' => $item->ruangan ?? ''
                ];
            }
        }

        return $result;
    }
}