import { useUserAuth } from '../context/UserAuthContext';

export default function Header() {
  const { user } = useUserAuth();

  return (
    <nav className="navbar navbar-expand navbar-light bg-white shadow-sm px-4" style={{ height: '70px' }}>
      <div className="container-fluid">
        
        <div className="d-flex align-items-center text-secondary">
            <i className="bi bi-list fs-3 me-3 d-lg-none"></i>
            <span className="fw-bold fs-5 text-dark">QUẢN TRỊ HỆ THỐNG</span>
        </div>

        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav align-items-center">
            
            <li className="nav-item me-4">
                <a href="#" className="position-relative text-secondary">
                    <i className="bi bi-bell fs-5"></i>
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                </a>
            </li>

            <li className="nav-item dropdown">
              <a 
                className="nav-link d-flex align-items-center p-0" 
                href="#" 
              >
                <div 
                    className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2" 
                    style={{width: '35px', height: '35px', fontSize: '1.2rem'}}
                >
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
                </div>
                
                <div className="d-none d-md-block lh-1 text-start">
                    <span className="d-block fw-bold text-dark">{user?.fullName || 'Admin'}</span>
                    <small className="text-muted" style={{fontSize: '11px'}}>Super Admin</small>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}