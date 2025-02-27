import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{
      width: '200px',
      height: '100vh',
      backgroundColor: '#f4f4f4',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      <h2>Dolantix Admin</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '10px 0' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>Dashboard</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link to="/admin/olahraga" style={{ textDecoration: 'none', color: '#333' }}>Olahraga</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link to="/admin/konser" style={{ textDecoration: 'none', color: '#333' }}>Konser</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link to="/admin/seminar" style={{ textDecoration: 'none', color: '#333' }}>Seminar</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link to="/admin/festival" style={{ textDecoration: 'none', color: '#333' }}>Festival</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;