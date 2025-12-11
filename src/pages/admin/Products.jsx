// src/pages/admin/Products.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!confirm('Xóa sản phẩm này?')) return;
    try {
      await axiosClient.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between mb-mb-4">
        <h2>Quản lý Sản phẩm</h2>
        <button className="btn btn-success">+ Thêm sản phẩm</button>
      </div>

      <table className="table table-hover shadow">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.productID}>
              <td>{product.productID}</td>
              <td>{product.productName}</td>
              <td>{product.price.toLocaleString()}đ</td>
              <td>{product.categoryName}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2 me-2">Sửa</button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="btn btn-sm btn-danger"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}