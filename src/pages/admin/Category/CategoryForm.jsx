import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

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
        description: res.data.description,
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

  return (
    <div className="container p-4">
      <div className="col-lg-7 mx-auto">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4>{isEditMode ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h4>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>

              {/* Tên danh mục */}
              <div className="mb-3">
                <label className="form-label fw-bold">Tên danh mục</label>
                <input
                  type="text"
                  name="categoryName"
                  className="form-control"
                  value={formData.categoryName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Mô tả */}
              <div className="mb-3">
                <label className="form-label fw-bold">Mô tả</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={loading}
                  onClick={() => navigate("/admin/categories")}
                >
                  Hủy
                </button>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Đang xử lý..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
