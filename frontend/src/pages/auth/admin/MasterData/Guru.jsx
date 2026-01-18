import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, Eye, EyeOff } from "lucide-react";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Table from "../../../../components/ui/Table";
import Modal from "../../../../components/ui/Modal";
import Badge from "../../../../components/ui/Badge";
import Pagination from "../../../../components/ui/Pagination";
import Loading from "../../../../components/ui/Loading";
import { guruApi, mataPelajaranApi } from "../../../../api/adminApi";

const Guru = () => {
  const [data, setData] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nip: "",
    phone: "",
    address: "",
    mata_pelajaran_ids: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, per_page: 10, search: search || undefined };
      const response = await guruApi.getAll(params);
      setData(response.data.data.data);
      setTotalPages(response.data.data.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMapel = async () => {
    try {
      const response = await mataPelajaranApi.getAll({ per_page: 100 });
      setMapelList(response.data.data.data);
    } catch (error) {
      console.error("Error fetching mapel:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, search]);

  useEffect(() => {
    fetchMapel();
  }, []);

  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      name: "",
      email: "",
      password: "",
      nip: "",
      phone: "",
      address: "",
      mata_pelajaran_ids: [],
    });
    setFormErrors({});
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setFormData({
      name: item.name,
      email: item.email,
      password: "",
      nip: item.nip,
      phone: item.phone || "",
      address: item.address || "",
      mata_pelajaran_ids: item.mata_pelajaran?.map((m) => m.id) || [],
    });
    setFormErrors({});
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await guruApi.delete(selectedItem.id);
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
      const submitData = { ...formData };

      if (modalMode === "edit" && !submitData.password) {
        delete submitData.password;
      }

      if (modalMode === "create") {
        await guruApi.create(submitData);
      } else {
        await guruApi.update(selectedItem.id, submitData);
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

  const handleMapelChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
    setFormData((prev) => ({ ...prev, mata_pelajaran_ids: options }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Data Guru</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Kelola data guru dan mata pelajaran yang diampu</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Tambah Guru
        </Button>
      </div>

      <Card>
        <div className="flex gap-4">
          <Input placeholder="Cari nama, NIP, atau email..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} />
          {search && (
            <Button variant="secondary" onClick={() => setSearch("")} className="flex items-center gap-2">
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
                <Table.Head>Nama</Table.Head>
                <Table.Head>NIP</Table.Head>
                <Table.Head>Email</Table.Head>
                <Table.Head>No. HP</Table.Head>
                <Table.Head>Mata Pelajaran</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Aksi</Table.Head>
              </Table.Header>
              <Table.Body>
                {data.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <span className="font-semibold">{item.name}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-mono text-xs">{item.nip}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm">{item.email}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm">{item.phone || "-"}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-1">
                        {item.mata_pelajaran?.length > 0 ? (
                          item.mata_pelajaran.map((m) => (
                            <Badge key={m.id} variant="info" className="text-xs">
                              {m.kode_mapel}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{item.is_active ? <Badge variant="success">Aktif</Badge> : <Badge variant="danger">Nonaktif</Badge>}</Table.Cell>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === "create" ? "Tambah Guru" : "Edit Guru"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nama Lengkap" name="name" value={formData.name} onChange={handleFormChange} error={formErrors.name?.[0]} placeholder="Nama Guru, S.Pd" required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="NIP" name="nip" value={formData.nip} onChange={handleFormChange} error={formErrors.nip?.[0]} placeholder="196812311994122003" required disabled={modalMode === "edit"} />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleFormChange} error={formErrors.email?.[0]} placeholder="guru@example.com" required />
          </div>

          <div className="relative">
            <Input
              label={modalMode === "create" ? "Password" : "Password (Kosongkan jika tidak ingin mengubah)"}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              error={formErrors.password?.[0]}
              placeholder="••••••••"
              required={modalMode === "create"}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="No. HP (Opsional)" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="081234567890" />
            <Input label="Alamat (Opsional)" name="address" value={formData.address} onChange={handleFormChange} placeholder="Enrekang" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mata Pelajaran yang Diampu</label>
            <select multiple name="mata_pelajaran_ids" value={formData.mata_pelajaran_ids} onChange={handleMapelChange} className="input min-h-[150px]" size="6">
              {mapelList.map((mapel) => (
                <option key={mapel.id} value={mapel.id}>
                  {mapel.kode_mapel} - {mapel.nama_mapel}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tekan Ctrl (Windows) atau Cmd (Mac) untuk memilih beberapa mata pelajaran</p>
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
            Apakah Anda yakin ingin menghapus guru <strong className="text-gray-900 dark:text-gray-100">{selectedItem?.name}</strong>?
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

export default Guru;
