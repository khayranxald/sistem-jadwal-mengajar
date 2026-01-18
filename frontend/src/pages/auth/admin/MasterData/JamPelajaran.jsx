import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Clock as ClockIcon } from "lucide-react";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Table from "../../../../components/ui/Table";
import Modal from "../../../../components/ui/Modal";
import Badge from "../../../../components/ui/Badge";
import Pagination from "../../../../components/ui/Pagination";
import Loading from "../../../../components/ui/Loading";
import { jamPelajaranApi } from "../../../../api/adminApi";

const JamPelajaran = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    nama_jam: "",
    urutan: "",
    jam_mulai: "",
    jam_selesai: "",
    durasi_menit: 45,
    is_istirahat: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: 20,
        search: search || undefined,
      };

      const response = await jamPelajaranApi.getAll(params);
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
  }, [currentPage, search]);

  const handleCreate = () => {
    setModalMode("create");
    const nextUrutan = data.length > 0 ? Math.max(...data.map((d) => d.urutan)) + 1 : 1;
    setFormData({
      nama_jam: `Jam ke-${nextUrutan}`,
      urutan: nextUrutan,
      jam_mulai: "",
      jam_selesai: "",
      durasi_menit: 45,
      is_istirahat: false,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setFormData({
      nama_jam: item.nama_jam,
      urutan: item.urutan,
      jam_mulai: item.jam_mulai.substring(0, 5), // HH:MM format
      jam_selesai: item.jam_selesai.substring(0, 5),
      durasi_menit: item.durasi_menit,
      is_istirahat: item.is_istirahat,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await jamPelajaranApi.delete(selectedItem.id);
      setIsDeleteModalOpen(false);
      fetchData();
      alert("Data berhasil dihapus");
    } catch (error) {
      console.error("Error deleting:", error);
      alert(error.response?.data?.message || "Gagal menghapus data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        is_istirahat: formData.is_istirahat === true || formData.is_istirahat === "true",
      };

      if (modalMode === "create") {
        await jamPelajaranApi.create(submitData);
      } else {
        await jamPelajaranApi.update(selectedItem.id, submitData);
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Data Jam Pelajaran</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Kelola jam pelajaran dan istirahat</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Tambah Jam
        </Button>
      </div>

      <Card>
        <Input placeholder="Cari nama jam..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} />
      </Card>

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
                <Table.Head>Urutan</Table.Head>
                <Table.Head>Nama Jam</Table.Head>
                <Table.Head>Waktu</Table.Head>
                <Table.Head>Durasi</Table.Head>
                <Table.Head>Jenis</Table.Head>
                <Table.Head>Aksi</Table.Head>
              </Table.Header>
              <Table.Body>
                {data.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <Badge variant="primary">{item.urutan}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-semibold">{item.nama_jam}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-1 text-sm">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span>
                          {item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{item.durasi_menit} menit</Table.Cell>
                    <Table.Cell>{item.is_istirahat ? <Badge variant="warning">Istirahat</Badge> : <Badge variant="success">Jam Efektif</Badge>}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === "create" ? "Tambah Jam Pelajaran" : "Edit Jam Pelajaran"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nama Jam" name="nama_jam" value={formData.nama_jam} onChange={handleFormChange} error={formErrors.nama_jam?.[0]} placeholder="Jam ke-1" required />

          <Input label="Urutan" type="number" name="urutan" value={formData.urutan} onChange={handleFormChange} error={formErrors.urutan?.[0]} min="1" required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Jam Mulai" type="time" name="jam_mulai" value={formData.jam_mulai} onChange={handleFormChange} error={formErrors.jam_mulai?.[0]} required />
            <Input label="Jam Selesai" type="time" name="jam_selesai" value={formData.jam_selesai} onChange={handleFormChange} error={formErrors.jam_selesai?.[0]} required />
          </div>

          <Input label="Durasi (Menit)" type="number" name="durasi_menit" value={formData.durasi_menit} onChange={handleFormChange} error={formErrors.durasi_menit?.[0]} min="1" max="180" required />

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <input type="checkbox" id="is_istirahat" name="is_istirahat" checked={formData.is_istirahat} onChange={handleFormChange} className="h-4 w-4 text-primary-600 rounded" />
            <label htmlFor="is_istirahat" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ini adalah waktu istirahat
            </label>
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

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Konfirmasi Hapus" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus <strong className="text-gray-900 dark:text-gray-100">{selectedItem?.nama_jam}</strong>?
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

export default JamPelajaran;
