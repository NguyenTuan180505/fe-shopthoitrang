// src/pages/admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh!');
        return;
      }
      
      // Kiểm tra kích thước (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB!');
        return;
      }

      setImageFile(file);
      
      // Tạo preview
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.imageUrl; // API trả về đường dẫn ảnh
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

      // Upload ảnh nếu có file mới
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const dataToSubmit = {
        ...formData,
        imageUrl
      };

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h4>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Danh mục */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Danh mục <span className="text-danger">*</span>
                  </label>
                  <select 
                    name="categoryID" 
                    className="form-select"
                    value={formData.categoryID}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.categoryID} value={cat.categoryID}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tên sản phẩm */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Tên sản phẩm <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text"
                    name="productName"
                    className="form-control"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên sản phẩm"
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
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả chi tiết về sản phẩm"
                  />
                </div>

                {/* Giá, Giảm giá, Tồn kho */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">
                      Giá (VNĐ) <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="number"
                      name="price"
                      className="form-control"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="1000"
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Giảm giá (%)</label>
                    <input 
                      type="number"
                      name="discount"
                      className="form-control"
                      value={formData.discount}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">
                      Tồn kho <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="number"
                      name="stock"
                      className="form-control"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Upload hình ảnh */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Hình ảnh sản phẩm</label>
                  <input 
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="text-muted">
                    Chấp nhận: JPG, PNG, GIF. Tối đa 5MB
                  </small>
                  
                  {/* Preview ảnh */}
                  {imagePreview && (
                    <div className="mt-3">
                      <img 
                        src={imagePreview} 
                        alt="Preview"
                        className="img-thumbnail"
                        style={{maxWidth: '300px', maxHeight: '300px', objectFit: 'cover'}}
                      />
                    </div>
                  )}
                </div>

                {/* Trạng thái (chỉ hiện khi sửa) */}
                {isEditMode && (
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input 
                        type="checkbox"
                        name="isActive"
                        className="form-check-input"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label fw-bold" htmlFor="isActive">
                        Sản phẩm đang hoạt động
                      </label>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="d-flex gap-2 justify-content-end mt-4">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => navigate('/admin/products')}
                    disabled={loading}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {isEditMode ? 'Cập nhật' : 'Thêm mới'}
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