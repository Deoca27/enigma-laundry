
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import CustomerPage from './pages/customer/CustomerPage';
import ProductPage from './pages/product/ProductPage';
import TransactionPage from './pages/transaction/TransactionPage';
import AddTransaction from './pages/transaction/AddTransaction';
import AddProduct from './pages/product/AddProduct';
import AddCustomer from './pages/customer/AddCustomer';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/customers/add" element={<AddCustomer />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/transactions/add" element={<AddTransaction />} />
      </Routes>
    </>
  );
}

export default App;
