import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Table from "../../../../components/ui/Table";
import Modal from "../../../../components/ui/Modal";
import Badge from "../../../../components/ui/Badge";
import Pagination from "../../../../components/ui/Pagination";
import Loading from "../../../../components/ui/Loading";
import { mataPelajaranApi } from "../../../../api/adminApi";

const MataPelajaran = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    kode_mapel: "",
    nama_mapel: "",
    jumlah_jam_perminggu: 2,
    jenis: "wajib",
    deskripsi: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: 10,
        search: search || undefined,
        jenis: filterJenis || undefined,
      };

      const response = await mataPelajaranApi.getAll(params);
      setData(response.data.data.data);
      setTotalPages(response.data.data.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, search, filterJenis]);

  // Handle create
  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      kode_mapel: "",
      nama_mapel: "",
      jumlah_jam_perminggu: 2,
      jenis: "wajib",
      deskripsi: "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle edit
  const handleEdit = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setFormData({
      kode_mapel: item.kode_mapel,
      nama_mapel: item.nama_mapel,
      jumlah_jam_perminggu: item.jumlah_jam_perminggu,
      jenis: item.jenis,
      deskripsi: item.deskripsi || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await mataPelajaranApi.delete(selectedItem.id);
      setIsDeleteModalOpen(false);
      fetchData();
      alert("Data berhasil dihapus");
    } catch (error) {
      console.error("Error deleting:", error);
      alert(error.response?.data?.message || "Gagal menghapus data");
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    try {
      if (modalMode === "create") {
        await mataPelajaranApi.create(formData);
      } else {
        await mataPelajaranApi.update(selectedItem.id, formData);
      }

      setIsModalOpen(false);
      fetchData();
      alert(`Data berhasil ${modalMode === "create" ? "ditambahkan" : "diupdate"}`);
    } catch (error) {
      console.error("Error submitting:", error);
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || "Terjadi kesalahan");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getJenisBadge = (jenis) => {
    const variants = {
      wajib: "success",
      peminatan: "info",
      muatan_lokal: "warning",
    };
    return <Badge variant={variants[jenis]}>{jenis.replace("_", " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Data Mata Pelajaran</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Kelola data mata pelajaran sekolah</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Tambah Mata Pelajaran
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Cari nama atau kode mapel..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} />
          <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)} className="input">
            <option value="">Semua Jenis</option>
            <option value="wajib">Wajib</option>
            <option value="peminatan">Peminatan</option>
            <option value="muatan_lokal">Muatan Lokal</option>
          </select>
          {(search || filterJenis) && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setFilterJenis("");
              }}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Reset Filter
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="py-12">
            <Loading size="lg" text="Memuat data..." />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Tidak ada data</p>
          </div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.Head>Kode</Table.Head>
                <Table.Head>Nama Mata Pelajaran</Table.Head>
                <Table.Head>Jam/Minggu</Table.Head>
                <Table.Head>Jenis</Table.Head>
                <Table.Head>Aksi</Table.Head>
              </Table.Header>
              <Table.Body>
                {data.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <span className="font-mono font-semibold">{item.kode_mapel}</span>
                    </Table.Cell>
                    <Table.Cell>{item.nama_mapel}</Table.Cell>
                    <Table.Cell>{item.jumlah_jam_perminggu} jam</Table.Cell>
                    <Table.Cell>{getJenisBadge(item.jenis)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {/* Pagination */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === "create" ? "Tambah Mata Pelajaran" : "Edit Mata Pelajaran"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Kode Mapel" name="kode_mapel" value={formData.kode_mapel} onChange={handleFormChange} error={formErrors.kode_mapel?.[0]} placeholder="MTK" required disabled={modalMode === "edit"} />

          <Input label="Nama Mata Pelajaran" name="nama_mapel" value={formData.nama_mapel} onChange={handleFormChange} error={formErrors.nama_mapel?.[0]} placeholder="Matematika" required />

          <Input label="Jumlah Jam per Minggu" type="number" name="jumlah_jam_perminggu" value={formData.jumlah_jam_perminggu} onChange={handleFormChange} error={formErrors.jumlah_jam_perminggu?.[0]} min="1" max="10" required />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenis</label>
            <select name="jenis" value={formData.jenis} onChange={handleFormChange} className="input" required>
              <option value="wajib">Wajib</option>
              <option value="peminatan">Peminatan</option>
              <option value="muatan_lokal">Muatan Lokal</option>
            </select>
            {formErrors.jenis && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.jenis[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deskripsi (Opsional)</label>
            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleFormChange} className="input min-h-[100px]" placeholder="Deskripsi mata pelajaran..." />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1" disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Konfirmasi Hapus" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus mata pelajaran <strong className="text-gray-900 dark:text-gray-100">{selectedItem?.nama_mapel}</strong>?
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">
              Batal
            </Button>
            <Button variant="danger" onClick={confirmDelete} className="flex-1">
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MataPelajaran;
