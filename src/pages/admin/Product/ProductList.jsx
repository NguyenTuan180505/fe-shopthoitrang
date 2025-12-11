// src/pages/admin/ProductList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleAdd = () => {
    navigate('/admin/products/add');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý Sản phẩm</h2>
        <button onClick={handleAdd} className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Thêm sản phẩm
        </button>
      </div>

      {products.length === 0 ? (
        <div className="alert alert-info">
          Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '80px' }}>ID</th>
                    <th style={{ width: '100px' }}>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th style={{ width: '130px' }}>Giá</th>
                    <th style={{ width: '100px' }}>Giảm giá</th>
                    <th style={{ width: '100px' }}>Tồn kho</th>
                    <th style={{ width: '150px' }}>Danh mục</th>
                    <th style={{ width: '120px' }}>Trạng thái</th>
                    <th style={{ width: '180px' }} className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.productID}>
                      <td className="align-middle">{product.productID}</td>
                      <td className="align-middle">
                        <img
                          src={product.imageUrl ? product.imageUrl : "/images/no-image.png"}
                          alt={product.productName}
                          className="img-thumbnail"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                          onError={(e) => (e.target.src = "/images/no-image.png")}
                        />

                      </td>
                      <td className="align-middle">
                        <div className="fw-semibold">{product.productName}</div>
                        <small className="text-muted">{product.description}</small>
                      </td>
                      <td className="align-middle">
                        <span className="fw-bold text-primary">
                          {product.price.toLocaleString()}đ
                        </span>
                      </td>
                      <td className="align-middle">
                        {product.discount > 0 ? (
                          <span className="badge bg-danger">{product.discount}%</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="align-middle">
                        <span className={product.stock < 10 ? 'text-danger fw-bold' : ''}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="align-middle">
                        <span className="badge bg-secondary">
                          {product.categoryName}
                        </span>
                      </td>
                      <td className="align-middle">
                        <span className={`badge ${product.isActive ? 'bg-success' : 'bg-warning'}`}>
                          {product.isActive ? 'Hoạt động' : 'Tạm ngừng'}
                        </span>
                      </td>
                      <td className="align-middle text-center">
                        <button
                          onClick={() => handleEdit(product.productID)}
                          className="btn btn-sm btn-outline-primary me-1"
                          title="Chỉnh sửa"
                        >
                          <i className="bi bi-pencil"></i> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(product.productID)}
                          className="btn btn-sm btn-outline-danger"
                          title="Xóa"
                        >
                          <i className="bi bi-trash"></i> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}