import { useState } from "react";
import { Toaster, toast } from "sonner";

function EditModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState({ ...customer, phoneNumber: customer.phoneNumber || "", address: customer.address || "", name: customer.name || "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/v1/customers`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui pelanggan');
      }

      onSave(data.data);
      toast.success("Pelanggan berhasil diperbarui!");

    } catch (error) {
      console.error("Update error:", error);
      toast.error(`Gagal memperbarui pelanggan: ${error.message}`);
    }
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-white border border-gray-300 shadow-lg rounded-lg p-6 w-80">
      <Toaster richColors />
      <h3 className="text-lg font-semibold mb-4 text-center">Edit Pelanggan</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Nama"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            required
            placeholder="No. HP"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <textarea
            name="address"
            placeholder="Alamat"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditModal;