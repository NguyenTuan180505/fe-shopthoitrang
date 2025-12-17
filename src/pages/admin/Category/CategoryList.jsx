
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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

  const handleEdit = (id) => navigate(`/admin/categories/edit/${id}`);
  const handleAdd = () => navigate("/admin/categories/add");

  // --- XỬ LÝ LỌC & SẮP XẾP ---
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    // 1. Tìm kiếm
    if (searchTerm) {
      result = result.filter(c =>
        c.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 2. Sắp xếp tên A-Z
    result.sort((a, b) => {
      const nameA = a.categoryName.toLowerCase();
      const nameB = b.categoryName.toLowerCase();
      if (sortOrder === 'asc') return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });

    return result;
  }, [categories, searchTerm, sortOrder]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 bg-light">
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 className="fw-bold text-primary mb-1">
                <i className="bi bi-tags-fill me-2"></i>QUẢN LÝ DANH MỤC
            </h3>
            <p className="text-muted mb-0">Phân loại sản phẩm của cửa hàng</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary px-4 py-2 fw-bold shadow-sm">
            <i className="bi bi-plus-lg me-2"></i> Tạo Danh Mục
        </button>
      </div>

      {/* Tìm kiếm & Sắp xếp */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
            <div className="row g-3">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Tìm tên danh mục, mô tả..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <select 
                        className="form-select" 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="asc">Sắp xếp: A - Z</option>
                        <option value="desc">Sắp xếp: Z - A</option>
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
                  <th className="ps-4 py-3 text-secondary small text-uppercase fw-bold" style={{ width: "80px" }}>ID</th>
                  <th className="py-3 text-secondary small text-uppercase fw-bold">Tên Danh Mục</th>
                  <th className="py-3 text-secondary small text-uppercase fw-bold">Mô Tả</th>
                  <th className="py-3 text-secondary small text-uppercase fw-bold text-center" style={{ width: "150px" }}>Hành Động</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr key={cat.categoryID} style={{borderBottom: '1px solid #f0f0f0'}}>
                      <td className="ps-4 fw-bold text-secondary">#{cat.categoryID}</td>
                      <td>
                        <span className="fw-bold text-dark">{cat.categoryName}</span>
                      </td>
                      <td className="text-muted">
                        {cat.description || <span className="fst-italic text-secondary small">Không có mô tả</span>}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-2 border-0 bg-primary bg-opacity-10"
                          onClick={() => handleEdit(cat.categoryID)}
                          title="Sửa"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger border-0 bg-danger bg-opacity-10"
                          onClick={() => handleDelete(cat.categoryID)}
                          title="Xóa"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      <i className="bi bi-folder-x fs-1 d-block mb-2 opacity-50"></i>
                      Không tìm thấy danh mục nào.
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