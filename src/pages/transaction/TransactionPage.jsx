import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TransactionDetailModal from "./TransactionDetailModal";

function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/v1/bills', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch transactions' }));
          throw new Error(errorData.message);
        }

        const data = await response.json();
        setTransactions(data.data || []); // handle case where data.data might be null/undefined

      } catch (error) {
        console.error("Fetch error:", error);
        alert(`Gagal memuat transaksi: ${error.message}`);
        navigate('/login');
      }
    };

    fetchTransactions();
  }, [navigate]);

  const getTotal = (items) => {
    if (!items || !Array.isArray(items)) {
        return 0;
    }
    return items.reduce((total, item) => total + item.qty * item.price, 0);
  }


  return (
    <div className="relative max-w-5xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Manajemen Transaksi</h2>

      <div className="flex justify-end mb-4">
        <Link to="/transactions/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
            Buat Transaksi Baru
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border text-left">ID</th>
              <th className="px-4 py-2 border text-left">Pelanggan</th>
              <th className="px-4 py-2 border text-left">Total</th>
              <th className="px-4 py-2 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{trx.id}</td>
                <td className="px-4 py-2 border">{trx.customer.name}</td>
                <td className="px-4 py-2 border">Rp{getTotal(trx.billDetails).toLocaleString()}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => setSelectedTransaction(trx)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

export default TransactionPage;