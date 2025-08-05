import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EditModal from "./EditModal";
import Swal from "sweetalert2";
import { Toaster, toast } from "sonner";

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      toast.success(location.state.message);
    }

    const fetchCustomers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/v1/customers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }

        const data = await response.json();
        setCustomers(data.data);
      } catch (error) {
        console.error("Fetch error:", error);
        navigate('/login');
      }
    };

    fetchCustomers();
  }, [navigate, location.state]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/v1/customers/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete customer');
          }

          setCustomers(customers.filter((c) => c.id !== id));
          toast.success("Pelanggan berhasil dihapus!");
        } catch (error) {
          console.error("Delete error:", error);
          toast.error("Gagal menghapus pelanggan.");
        }
      }
    });
  };

  const handleUpdate = (updated) => {
    setCustomers(customers.map((c) => (c.id === updated.id ? updated : c)));
    setEditingCustomer(null);
  };

  return (
    <div className="relative max-w-5xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <Toaster richColors />
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Manajemen Pelanggan</h2>

      <div className="flex justify-end mb-4">
        <Link to="/customers/add">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200">
            Tambah Pelanggan
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-2 border">ID</th>
              <th className="text-left px-4 py-2 border">Nama</th>
              <th className="text-left px-4 py-2 border">No. HP</th>
              <th className="text-left px-4 py-2 border">Alamat</th>
              <th className="text-left px-4 py-2 border">Created At</th>
              <th className="text-left px-4 py-2 border">Updated At</th>
              <th className="text-center px-4 py-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{cust.id}</td>
                <td className="px-4 py-2 border">{cust.name}</td>
                <td className="px-4 py-2 border">{cust.phoneNumber}</td>
                <td className="px-4 py-2 border">{cust.address}</td>
                <td className="px-4 py-2 border">{new Date(cust.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 border">{new Date(cust.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2 border text-center space-x-2">
                  <button
                    onClick={() => setEditingCustomer(cust)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cust.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingCustomer && (
        <EditModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

export default CustomerPage;
