import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Table from "../../../../components/ui/Table";
import Modal from "../../../../components/ui/Modal";
import Badge from "../../../../components/ui/Badge";
import Pagination from "../../../../components/ui/Pagination";
import Loading from "../../../../components/ui/Loading";
import { kelasApi, guruApi } from "../../../../api/adminApi";

const Kelas = () => {
  const [data, setData] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterTingkat, setFilterTingkat] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    nama_kelas: "",
    tingkat: "X",
    jurusan: "IPA",
    kapasitas: 36,
    ruangan: "",
    wali_kelas_id: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: 10,
        search: search || undefined,
        tingkat: filterTingkat || undefined,
        jurusan: filterJurusan || undefined,
      };

      const response = await kelasApi.getAll(params);
      setData(response.data.data.data);
      setTotalPages(response.data.data.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const fetchGuru = async () => {
    try {
      const response = await guruApi.getAll({ per_page: 100 });
      setGuruList(response.data.data.data);
    } catch (error) {
      console.error("Error fetching guru:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, search, filterTingkat, filterJurusan]);

  useEffect(() => {
    fetchGuru();
  }, []);

  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      nama_kelas: "",
      tingkat: "X",
      jurusan: "IPA",
      kapasitas: 36,
      ruangan: "",
      wali_kelas_id: "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setFormData({
      nama_kelas: item.nama_kelas,
      tingkat: item.tingkat,
      jurusan: item.jurusan,
      kapasitas: item.kapasitas,
      ruangan: item.ruangan || "",
      wali_kelas_id: item.wali_kelas_id || "",
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
      await kelasApi.delete(selectedItem.id);
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
        wali_kelas_id: formData.wali_kelas_id || null,
      };

      if (modalMode === "create") {
        await kelasApi.create(submitData);
      } else {
        await kelasApi.update(selectedItem.id, submitData);
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

  const getTingkatBadge = (tingkat) => {
    const variants = { X: "success", XI: "info", XII: "warning" };
    return <Badge variant={variants[tingkat]}>{tingkat}</Badge>;
  };

  const getJurusanBadge = (jurusan) => {
    const variants = { IPA: "info", IPS: "warning", Bahasa: "success", Umum: "default" };
    return <Badge variant={variants[jurusan]}>{jurusan}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Data Kelas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Kelola data kelas sekolah</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Tambah Kelas
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input placeholder="Cari nama kelas..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} />
          <select value={filterTingkat} onChange={(e) => setFilterTingkat(e.target.value)} className="input">
            <option value="">Semua Tingkat</option>
            <option value="X">X</option>
            <option value="XI">XI</option>
            <option value="XII">XII</option>
          </select>
          <select value={filterJurusan} onChange={(e) => setFilterJurusan(e.target.value)} className="input">
            <option value="">Semua Jurusan</option>
            <option value="IPA">IPA</option>
            <option value="IPS">IPS</option>
            <option value="Bahasa">Bahasa</option>
            <option value="Umum">Umum</option>
          </select>
          {(search || filterTingkat || filterJurusan) && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setFilterTingkat("");
                setFilterJurusan("");
              }}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
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
                <Table.Head>Nama Kelas</Table.Head>
                <Table.Head>Tingkat</Table.Head>
                <Table.Head>Jurusan</Table.Head>
                <Table.Head>Kapasitas</Table.Head>
                <Table.Head>Ruangan</Table.Head>
                <Table.Head>Wali Kelas</Table.Head>
                <Table.Head>Aksi</Table.Head>
              </Table.Header>
              <Table.Body>
                {data.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <span className="font-semibold">{item.nama_kelas}</span>
                    </Table.Cell>
                    <Table.Cell>{getTingkatBadge(item.tingkat)}</Table.Cell>
                    <Table.Cell>{getJurusanBadge(item.jurusan)}</Table.Cell>
                    <Table.Cell>{item.kapasitas} siswa</Table.Cell>
                    <Table.Cell>{item.ruangan || "-"}</Table.Cell>
                    <Table.Cell>
                      <span className="text-sm">{item.wali_kelas?.name || "-"}</span>
                    </Table.Cell>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === "create" ? "Tambah Kelas" : "Edit Kelas"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nama Kelas" name="nama_kelas" value={formData.nama_kelas} onChange={handleFormChange} error={formErrors.nama_kelas?.[0]} placeholder="X IPA 1" required />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tingkat</label>
              <select name="tingkat" value={formData.tingkat} onChange={handleFormChange} className="input" required>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jurusan</label>
              <select name="jurusan" value={formData.jurusan} onChange={handleFormChange} className="input" required>
                <option value="IPA">IPA</option>
                <option value="IPS">IPS</option>
                <option value="Bahasa">Bahasa</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
          </div>

          <Input label="Kapasitas" type="number" name="kapasitas" value={formData.kapasitas} onChange={handleFormChange} error={formErrors.kapasitas?.[0]} min="1" max="50" required />

          <Input label="Ruangan (Opsional)" name="ruangan" value={formData.ruangan} onChange={handleFormChange} placeholder="R.201" />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Wali Kelas (Opsional)</label>
            <select name="wali_kelas_id" value={formData.wali_kelas_id} onChange={handleFormChange} className="input">
              <option value="">- Pilih Wali Kelas -</option>
              {guruList.map((guru) => (
                <option key={guru.id} value={guru.id}>
                  {guru.name}
                </option>
              ))}
            </select>
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
            Apakah Anda yakin ingin menghapus kelas <strong className="text-gray-900 dark:text-gray-100">{selectedItem?.nama_kelas}</strong>?
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

export default Kelas;
