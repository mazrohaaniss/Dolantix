import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'user') {
      navigate('/');
    } else {
      fetchOrders();
    }
  }, [navigate, token, role]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Gagal mengambil pesanan:', err);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Riwayat Pesanan</h1>
      <button onClick={handleBack} style={{ marginBottom: '20px' }}>Kembali ke Dashboard</button>
      {orders.length === 0 ? (
        <p>Belum ada pesanan.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Acara</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Kategori Tiket</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Harga (Rp)</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tanggal Pesan</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.event_id} ({order.event_category})</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.ticket_category}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;