import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho bộ lọc và tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get('/products');
      setProducts(res.data);
    } catch (err) {
      alert('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
      await axiosClient.delete(`/products/${id}`);
      setProducts(products.filter(p => p.productID !== id));
      alert('Xóa thành công!');
    } catch (err) {
      alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (id) => navigate(`/admin/products/edit/${id}`);
  const handleAdd = () => navigate('/admin/products/add');

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock < 10).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    return { totalProducts, lowStock, totalValue };
  }, [products]);

  // --- XỬ LÝ LỌC & SẮP XẾP ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Tìm kiếm theo Tên
    if (searchTerm) {
      result = result.filter(p => 
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Sắp xếp
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, searchTerm, sortConfig]);

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Đang tải...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-4 bg-light">
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 className="fw-bold text-primary mb-1">
                <i className="bi bi-box-seam me-2"></i>QUẢN LÝ KHO SẢN PHẨM
            </h3>
            <p className="text-muted mb-0">Theo dõi tồn kho và danh sách sản phẩm thời trang</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary px-4 py-2 fw-bold shadow-sm">
            <i className="bi bi-plus-lg me-2"></i> Thêm sản phẩm
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
            <div className="card border-0 shadow-sm border-start border-4 border-primary h-100">
                <div className="card-body d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                        <i className="bi bi-layers-fill fs-3"></i>
                    </div>
                    <div>
                        <h6 className="text-muted text-uppercase mb-1 small fw-bold">Tổng Sản Phẩm</h6>
                        <h3 className="fw-bold mb-0">{stats.totalProducts}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="card border-0 shadow-sm border-start border-4 border-warning h-100">
                <div className="card-body d-flex align-items-center">
                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3 text-warning">
                        <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                    </div>
                    <div>
                        <h6 className="text-muted text-uppercase mb-1 small fw-bold">Sắp Hết Hàng</h6>
                        <h3 className="fw-bold mb-0 text-warning">{stats.lowStock}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="card border-0 shadow-sm border-start border-4 border-success h-100">
                <div className="card-body d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                        <i className="bi bi-cash-stack fs-3"></i>
                    </div>
                    <div>
                        <h6 className="text-muted text-uppercase mb-1 small fw-bold">Tổng Định Giá Kho</h6>
                        <h3 className="fw-bold mb-0 text-success">{formatCurrency(stats.totalValue)}</h3>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Tìm kiếm & Lọc */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
            <div className="row g-3">
                {/* Tìm kiếm */}
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Tìm tên sản phẩm..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-primary px-4">Tìm</button>
                    </div>
                </div>
                
                {/* Lọc theo Giá */}
                <div className="col-md-3">
                    <select className="form-select" onChange={(e) => handleSortChange('price', e.target.value)}>
                        <option value="">-- Sắp xếp giá --</option>
                        <option value="asc">Giá tăng dần</option>
                        <option value="desc">Giá giảm dần</option>
                    </select>
                </div>

                {/* Lọc theo Số lượng */}
                <div className="col-md-3">
                    <select className="form-select" onChange={(e) => handleSortChange('stock', e.target.value)}>
                        <option value="">-- Sắp xếp tồn kho --</option>
                        <option value="asc">Tồn kho thấp nhất</option>
                        <option value="desc">Tồn kho cao nhất</option>
                    </select>
                </div>
            </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3 py-3" style={{ width: '60px' }}>ID</th>
                  <th style={{ width: '80px' }}>Hình</th>
                  <th>Tên sản phẩm</th>
                  <th style={{ width: '130px' }}>Giá</th>
                  <th style={{ width: '100px' }}>Giảm giá</th>
                  <th style={{ width: '100px' }}>Tồn kho</th>
                  <th style={{ width: '150px' }}>Danh mục</th>
                  <th style={{ width: '120px' }}>Trạng thái</th>
                  <th style={{ width: '150px' }} className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <tr key={product.productID} style={{borderBottom: '1px solid #f0f0f0'}}>
                      <td className="ps-3 fw-bold text-secondary">{product.productID}</td>
                      <td>
                        <img
                          src={product.imageUrl || "/images/no-image.png"}
                          alt={product.productName}
                          className="rounded border p-1"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          onError={(e) => (e.target.src = "/images/no-image.png")}
                        />
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{product.productName}</div>
                        <small className="text-muted text-truncate d-block" style={{maxWidth: '250px'}}>
                            {product.description}
                        </small>
                      </td>
                      <td>
                        <span className="fw-bold text-primary">
                          {product.price.toLocaleString()}đ
                        </span>
                      </td>
                      <td>
                        {product.discount > 0 ? (
                          <span className="badge bg-danger bg-opacity-10 text-danger border border-danger">
                            -{product.discount}%
                          </span>
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>
                      <td>
                        {product.stock < 10 ? (
                            <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2">
                                Low: {product.stock}
                            </span>
                        ) : (
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2">
                                {product.stock}
                            </span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border fw-normal">
                          {product.categoryName}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${product.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {product.isActive ? 'Hoạt động' : 'Ẩn'}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleEdit(product.productID)}
                          className="btn btn-sm btn-outline-primary me-2 border-0 bg-primary bg-opacity-10"
                          title="Chỉnh sửa"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product.productID)}
                          className="btn btn-sm btn-outline-danger border-0 bg-danger bg-opacity-10"
                          title="Xóa"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
                        Chưa có sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}