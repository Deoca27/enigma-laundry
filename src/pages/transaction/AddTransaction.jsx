import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddTransaction() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ productId: "", qty: 1, price: 0 }]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch customers
        const custResponse = await fetch('/api/v1/customers', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!custResponse.ok) throw new Error('Gagal memuat pelanggan');
        const custData = await custResponse.json();
        setCustomers(custData.data || []);

        // Fetch products
        const prodResponse = await fetch('/api/v1/products', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!prodResponse.ok) throw new Error('Gagal memuat produk');
        const prodData = await prodResponse.json();
        setProducts(prodData.data || []);

      } catch (error) {
        console.error("Fetch data error:", error);
        alert(error.message);
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);


  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    if (field === "productId") {
      const selectedProduct = products.find(
        (p) => p.id === value
      );
      updated[index].productId = value;
      updated[index].price = selectedProduct?.price || 0;
    } else if (field === "qty") {
      updated[index].qty = parseInt(value, 10) || 1;
    }
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { productId: "", qty: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    if (updated.length === 0) {
      setItems([{ productId: "", qty: 1, price: 0 }]);
    } else {
      setItems(updated);
    }
  };

  const getTotal = () =>
    items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Client-side validation
    if (!customerId) {
        alert("Pelanggan harus dipilih.");
        return;
    }

    for (const item of items) {
        if (!item.productId) {
            alert("Semua produk harus dipilih.");
            return;
        }
        if (item.qty <= 0) {
            alert("Kuantitas produk harus lebih dari 0.");
            return;
        }
    }

    const transactionPayload = {
        customerId,
        billDetails: items.map(item => ({
            product: { id: item.productId },
            qty: item.qty
        }))
    }

    try {
        const response = await fetch('/api/v1/bills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(transactionPayload)
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || 'Gagal membuat transaksi')
        }

        alert("Transaksi berhasil dibuat!");
        navigate("/transactions");

    } catch(error) {
        console.error("Transaction error:", error);
        alert(`Gagal: ${error.message}`);
    }

  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Buat Transaksi
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Nama Pelanggan
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Pelanggan</option>
            {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4 mb-4">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-5 gap-3 items-center">
              <select
                value={item.productId}
                onChange={(e) =>
                  handleItemChange(i, "productId", e.target.value)
                }
                required
                className="col-span-2 p-2 border border-gray-300 rounded"
              >
                <option value="">Pilih Produk</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => handleItemChange(i, "qty", e.target.value)}
                required
                min="1"
                className="p-2 border border-gray-300 rounded w-full"
              />

              <input
                type="text"
                value={`Rp${(item.qty * item.price).toLocaleString("id-ID")}`}
                readOnly
                className="text-right p-2 border border-gray-100 bg-gray-100 rounded w-full font-medium text-gray-700"
              />

              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-red-500 hover:text-red-700 font-bold text-xl"
                title="Hapus"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          + Tambah Produk
        </button>

        <div className="mb-6 text-right text-lg font-semibold text-gray-700">
          Total: Rp{getTotal().toLocaleString("id-ID")}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Batal
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Simpan Transaksi
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTransaction;
