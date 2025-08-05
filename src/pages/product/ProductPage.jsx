import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EditModal from "./EditModal";
import Swal from "sweetalert2";
import { Toaster, toast } from "sonner";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      toast.success(location.state.message);
    }

    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/v1/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        console.error("Fetch error:", error);
        // Mungkin token sudah expired, arahkan ke login
        navigate('/login');
      }
    };

    fetchProducts();
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
          const response = await fetch(`/api/v1/products/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete product');
          }

          setProducts(products.filter((p) => p.id !== id));
          toast.success("Produk berhasil dihapus!");
        } catch (error) {
          console.error("Delete error:", error);
          toast.error("Gagal menghapus produk.");
        }
      }
    });
  };

  const handleUpdate = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  return (
    <div className="relative max-w-2xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <Toaster richColors />
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Manajemen Produk</h2>

      <div className="flex justify-end mb-6">
        <Link to="/products/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
            Tambah Produk
          </button>
        </Link>
      </div>

      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="p-4 border border-gray-200 rounded-md shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-700">{product.name}</p>
              <p className="text-sm text-gray-500">Rp{product.price.toLocaleString()}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

export default ProductPage;
