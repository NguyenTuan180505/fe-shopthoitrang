import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    categoryID: 0,
    productName: '',
    description: '',
    price: 0,
    discount: 0,
    stock: 0,
    imageUrl: '',
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get('/categories');
      setCategories(res.data);
      if (!isEditMode && res.data.length > 0) {
        setFormData(prev => ({ ...prev, categoryID: res.data[0].categoryID }));
      }
    } catch (err) {
      alert('Lỗi tải danh mục');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/products/${id}`);
      const product = res.data;
      setFormData({
        categoryID: product.categoryID,
        productName: product.productName,
        description: product.description || '',
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive
      });
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    } catch (err) {
      alert('Lỗi tải thông tin sản phẩm');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB!');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.imageUrl;
    const formDataImage = new FormData();
    formDataImage.append('image', imageFile);
    try {
      const res = await axiosClient.post('/upload/image', formDataImage, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.imageUrl;
    } catch (err) {
      console.error('Lỗi upload ảnh:', err);
      throw new Error('Upload ảnh thất bại');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.price <= 0) {
      alert('Giá sản phẩm phải lớn hơn 0!');
      return;
    }
    try {
      setLoading(true);
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      const dataToSubmit = { ...formData, imageUrl };
      if (isEditMode) {
        await axiosClient.put(`/products/${id}`, dataToSubmit);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await axiosClient.post('/products', dataToSubmit);
        alert('Thêm sản phẩm thành công!');
      }
      navigate('/admin/products');
    } catch (err) {
      alert(err.message || (isEditMode ? 'Cập nhật thất bại' : 'Thêm thất bại'));
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
    <div className="container-fluid p-4 bg-light">
        {/* Breadcrumb & Title */}
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="text-primary fw-bold m-0">
                {isEditMode ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h3>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin/products">Sản phẩm</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{isEditMode ? 'Sửa' : 'Thêm'}</li>
                </ol>
            </nav>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="row g-4">
                {/* CỘT TRÁI: THÔNG TIN CHÍNH */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3">
                            <h5 className="m-0 font-weight-bold text-dark">Thông Tin Cơ Bản</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                {/* Tên sản phẩm */}
                                <div className="col-md-12">
                                    <label className="form-label fw-bold">Tên sản phẩm <span className="text-danger">*</span></label>
                                    <input type="text" name="productName" className="form-control" value={formData.productName} onChange={handleInputChange} placeholder="Nhập tên sản phẩm" required />
                                </div>

                                {/* Danh mục & Tồn kho */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Danh mục <span className="text-danger">*</span></label>
                                    <select name="categoryID" className="form-select" value={formData.categoryID} onChange={handleInputChange} required>
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(cat => (
                                            <option key={cat.categoryID} value={cat.categoryID}>{cat.categoryName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Tồn kho <span className="text-danger">*</span></label>
                                    <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleInputChange} min="0" required />
                                </div>

                                {/* Giá & Giảm giá */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Giá bán (VNĐ) <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type="number" name="price" className="form-control" value={formData.price} onChange={handleInputChange} min="0" step="1000" required />
                                        <span className="input-group-text">₫</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Giảm giá (%)</label>
                                    <div className="input-group">
                                        <input type="number" name="discount" className="form-control" value={formData.discount} onChange={handleInputChange} min="0" max="100" step="0.01" />
                                        <span className="input-group-text">%</span>
                                    </div>
                                </div>

                                {/* Mô tả */}
                                <div className="col-md-12">
                                    <label className="form-label fw-bold">Mô tả chi tiết</label>
                                    <textarea name="description" className="form-control" rows="5" value={formData.description} onChange={handleInputChange} placeholder="Nhập mô tả sản phẩm..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: HÌNH ẢNH & TRẠNG THÁI */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="m-0 font-weight-bold text-dark">Hình Ảnh</h5>
                        </div>
                        <div className="card-body text-center">
                            <div className="mb-3">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="img-fluid rounded border" style={{ maxHeight: '250px', width: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <div className="bg-light rounded border-dashed d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
                                        <div className="text-muted">
                                            <i className="bi bi-image fs-1"></i>
                                            <p className="mb-0 mt-2">Chưa có ảnh</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="d-grid">
                                <label className="btn btn-outline-primary" htmlFor="imageUpload">
                                    <i className="bi bi-upload me-2"></i> Chọn ảnh
                                </label>
                                <input type="file" id="imageUpload" className="d-none" accept="image/*" onChange={handleImageChange} />
                            </div>
                            <small className="text-muted d-block mt-2">Chấp nhận JPG, PNG. Tối đa 5MB.</small>
                        </div>
                    </div>

                    {/* Card Trạng thái */}
                    {isEditMode && (
                        <div className="card shadow-sm border-0">
                             <div className="card-header bg-white py-3">
                                <h5 className="m-0 font-weight-bold text-dark">Trạng Thái</h5>
                            </div>
                            <div className="card-body">
                                <div className="form-check form-switch">
                                    <input type="checkbox" name="isActive" className="form-check-input" id="isActive" checked={formData.isActive} onChange={handleInputChange} />
                                    <label className="form-check-label fw-bold" htmlFor="isActive">Đang hoạt động</label>
                                </div>
                                <small className="text-muted">Tắt để ẩn sản phẩm khỏi trang chủ.</small>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Nút Hành động */}
            <div className="d-flex gap-3 justify-content-end mt-4 pt-3 border-top">
                <button type="button" className="btn btn-light border" onClick={() => navigate('/admin/products')} disabled={loading}>
                    <i className="bi bi-x-lg me-2"></i> Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-save me-2"></i> {isEditMode ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                        </>
                    )}
                </button>
            </div>
        </form>
    </div>
  );
}