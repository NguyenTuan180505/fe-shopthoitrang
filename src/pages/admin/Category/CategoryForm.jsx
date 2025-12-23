// src/pages/admin/Category/CategoryForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../../api/axiosClientUser";

export default function CategoryForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
  });

  useEffect(() => {
    if (isEditMode) fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/categories/${id}`);
      setFormData({
        categoryName: res.data.categoryName,
        description: res.data.description || "",
      });
    } catch (err) {
      alert("Lỗi tải danh mục");
      navigate("/admin/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryName.trim()) {
      alert("Tên danh mục không được để trống!");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        await axiosClient.put(`/categories/${id}`, formData);
        alert("Cập nhật thành công!");
      } else {
        await axiosClient.post("/categories", formData);
        alert("Thêm danh mục thành công!");
      }

      navigate("/admin/categories");
    } catch (err) {
      alert("Lỗi xử lý: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      );
  }

  return (
    <div className="container-fluid p-4 bg-light" style={{minHeight: '85vh'}}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="text-primary fw-bold m-0">
                {isEditMode ? 'Chỉnh Sửa Danh Mục' : 'Tạo Danh Mục Mới'}
            </h3>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin/categories">Danh mục</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{isEditMode ? 'Sửa' : 'Thêm'}</li>
                </ol>
            </nav>
        </div>

        <div className="row justify-content-center">
            <div className="col-lg-6">
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-white py-3 border-bottom">
                        <h5 className="m-0 font-weight-bold text-dark">
                            <i className="bi bi-info-circle me-2 text-primary"></i>
                            Thông Tin Danh Mục
                        </h5>
                    </div>

                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            
                            {/* Tên danh mục */}
                            <div className="mb-4">
                                <label className="form-label fw-bold text-secondary small text-uppercase">
                                    Tên danh mục <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="bi bi-tag"></i></span>
                                    <input
                                        type="text"
                                        name="categoryName"
                                        className="form-control"
                                        placeholder="Ví dụ: Áo thun, Quần Jeans..."
                                        value={formData.categoryName}
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div className="mb-4">
                                <label className="form-label fw-bold text-secondary small text-uppercase">
                                    Mô tả
                                </label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="5"
                                    placeholder="Nhập mô tả chi tiết cho danh mục này..."
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Buttons Action */}
                            <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                                <button
                                    type="button"
                                    className="btn btn-light border px-4"
                                    disabled={loading}
                                    onClick={() => navigate("/admin/categories")}
                                >
                                    <i className="bi bi-arrow-return-left me-2"></i> Quay lại
                                </button>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary px-4 fw-bold shadow-sm" 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-save me-2"></i>
                                            {isEditMode ? "Lưu Thay Đổi" : "Tạo Mới"}
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}