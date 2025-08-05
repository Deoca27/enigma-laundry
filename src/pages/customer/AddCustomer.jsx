import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Toaster, toast } from "sonner";

function AddCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phoneNumber: "", address: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/v1/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menambahkan pelanggan');
      }

      navigate("/customers", { state: { message: "Pelanggan berhasil ditambahkan!" } });

    } catch (error) {
      console.error("Add customer error:", error);
      toast.error(`Gagal menambahkan pelanggan: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-md rounded-lg">
      <Toaster richColors />
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Tambah Pelanggan</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="phoneNumber"
            placeholder="No. HP"
            value={form.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <textarea
            name="address"
            placeholder="Alamat"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
        </div>
        <div className="flex justify-between mt-4">
            <button
                type="button"
                onClick={() => navigate("/customers")}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
                Batal
            </button>

            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Simpan
            </button>
        </div>
      </form>
    </div>
  );
}

export default AddCustomer;