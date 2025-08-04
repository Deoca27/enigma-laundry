function TransactionDetailModal({ transaction, onClose }) {
  const total = transaction.billDetails.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-white border border-gray-300 shadow-lg rounded-lg p-6 w-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">Detail Transaksi</h3>

      <p className="mb-2">
        <span className="font-medium">Pelanggan:</span> {transaction.customer.name}
      </p>

      <ul className="mb-4 space-y-1 text-sm">
        {transaction.billDetails.map((item, idx) => (
          <li key={idx}>
            {item.product.name} - {item.qty} x Rp{item.price.toLocaleString("id-ID")} = Rp
            {(item.qty * item.price).toLocaleString("id-ID")}
          </li>
        ))}
      </ul>

      <p className="font-semibold mb-4">Total: Rp{total.toLocaleString("id-ID")}</p>

      <div className="text-right">
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export default TransactionDetailModal;
