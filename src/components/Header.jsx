import { Link, useNavigate, useLocation } from "react-router-dom";
import { Toaster, toast } from "sonner";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success("Berhasil logout!");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  // Sembunyikan header di halaman login dan register
  if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/") return null;

  return (
    <header className="bg-gray-800 text-white py-4 px-6 shadow-md mb-6">
      <Toaster richColors />
      <div className="container mx-auto flex justify-between items-center">
        <nav className="flex gap-6 text-lg font-medium">
          <Link
            to="/products"
            className="hover:text-blue-400 transition duration-200"
          >
            Produk
          </Link>
          <Link
            to="/customers"
            className="hover:text-blue-400 transition duration-200"
          >
            Pelanggan
          </Link>
          <Link
            to="/transactions"
            className="hover:text-blue-400 transition duration-200"
          >
            Transaksi
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
