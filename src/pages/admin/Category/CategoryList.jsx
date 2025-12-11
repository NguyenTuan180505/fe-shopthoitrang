import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/categories");
      setCategories(res.data);
    } catch (err) {
      alert("Lỗi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    try {
      await axiosClient.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c.categoryID !== id));
      alert("Xóa thành công!");
    } catch (err) {
      alert("Xóa thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleAdd = () => {
    navigate("/admin/categories/add");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý Danh mục</h2>
        <button onClick={handleAdd} className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i> Thêm danh mục
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th style={{ width: "180px" }} className="text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr key={cat.categoryID}>
                  <td>{cat.categoryID}</td>
                  <td className="fw-semibold">{cat.categoryName}</td>
                  <td>{cat.description}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleEdit(cat.categoryID)}
                    >
                      <i className="bi bi-pencil"></i> Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(cat.categoryID)}
                    >
                      <i className="bi bi-trash"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
