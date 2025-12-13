import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ReviewForm.css';
import { createReview } from '../../api/reviewApi';

export default function ReviewForm() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    author: '',
    size: '',
    height: '',
    height_cm: '',
    weight: '',
    material: '',
    location: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    setError('');
  };

  // ============================
  // HANDLE FILE UPLOAD
  // ============================
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Kiểm tra loại file
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        setError('Chỉ hỗ trợ ảnh hoặc video!');
        return;
      }

      // Kiểm tra kích thước (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('Tệp quá lớn (tối đa 50MB)');
        return;
      }

      // Thêm file vào state
      setUploadedFiles(prev => [...prev, file]);

      // Tạo preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrls(prev => [...prev, {
          url: event.target.result,
          type: isImage ? 'image' : 'video',
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // ============================
  // SUBMIT REVIEW
  // ============================
  const handleSubmit = async () => {
    if (!formData.rating || !formData.content) {
      setError('Vui lòng nhập đánh giá (rating) và bình luận!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        productID: Number(productId),
        rating: formData.rating,
        comment: formData.content,
        imageUrls: [],
        videoUrls: [],
      };

      await createReview(payload);

      setFormData({
        rating: 0,
        title: '',
        content: '',
        author: '',
        size: '',
        height: '',
        height_cm: '',
        weight: '',
        material: '',
        location: '',
      });
      
      setUploadedFiles([]);
      setPreviewUrls([]);

      navigate(`/reviews/${productId}`);
    } catch (err) {
      console.error('Lỗi gửi review:', err);
      setError('Gửi đánh giá thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // RENDER
  // ============================
  return (
    <div className="review-form-container">
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('/')}>Trang chủ</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-link" onClick={() => navigate(`/reviews/${productId}`)}>Đánh giá</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Viết bài đánh giá</span>
      </div>

      <div className="form-header">
        <h1>Viết bài đánh giá</h1>
        <p>Chia sẻ trải nghiệm của bạn với sản phẩm này. Bài đánh giá của bạn sẽ giúp ích cho những khách hàng khác.</p>
      </div>

      <div className="review-form">
        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button 
              type="button" 
              className="error-close" 
              onClick={() => setError('')}
            >
              ✕
            </button>
          </div>
        )}

        <div className="form-header-title">
          <h2>THÔNG TIN ĐÁNH GIÁ</h2>
          <span className="required-note">Bắt buộc*</span>
        </div>

        {/* Rating */}
        <div className="form-group">
          <label className="form-label">ĐÁNH GIÁ *</label>
          <div className="rating-select">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                type="button"
                className={`star-btn ${num <= formData.rating ? 'active' : ''}`}
                onClick={() => handleStarClick(num)}
                title={`${num} sao`}
              >
                ★
              </button>
            ))}
            <span className="rating-text">{formData.rating > 0 ? `${formData.rating} sao` : 'Chọn số sao'}</span>
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">TIÊU ĐỀ *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Tóm tắt đánh giá của bạn..."
          />
        </div>

        {/* Content */}
        <div className="form-group">
          <label className="form-label">BÌNH LUẬN *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Hãy chia sẻ trải nghiệm chi tiết của bạn về sản phẩm..."
          />
        </div>

        {/* Author */}
        <div className="form-group">
          <label className="form-label">TÊN CỦA BẠN</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Nhập tên của bạn (tùy chọn)"
          />
        </div>

        {/* File Upload Section */}
        <div className="form-group upload-section">
          <label className="form-label">THÊM ẢNH HOẶC VIDEO</label>
          <p className="upload-hint">Tải lên ảnh hoặc video để làm đánh giá của bạn rõ hơn (tùy chọn)</p>
          
          <div className="upload-area">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="file-input"
            />
            <label htmlFor="file-upload" className="upload-label">
              <div className="upload-icon">📸 🎥</div>
              <p>Nhấp để chọn ảnh hoặc video</p>
              <span className="upload-subtext">hoặc kéo thả tệp vào đây</span>
            </label>
          </div>

          {/* Preview Uploaded Files */}
          {previewUrls.length > 0 && (
            <div className="preview-grid">
              {previewUrls.map((preview, index) => (
                <div key={index} className="preview-item">
                  {preview.type === 'image' ? (
                    <img src={preview.url} alt={`Preview ${index + 1}`} />
                  ) : (
                    <video src={preview.url} />
                  )}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeFile(index)}
                    title="Xóa"
                  >
                    ✕
                  </button>
                  <span className="file-type">{preview.type === 'image' ? '🖼️' : '🎬'}</span>
                </div>
              ))}
            </div>
          )}

          <p className="upload-info">
            {uploadedFiles.length > 0 
              ? `Đã chọn ${uploadedFiles.length} tệp` 
              : 'Chưa chọn tệp nào'}
          </p>
        </div>

        {/* Additional Info Section */}
        <div className="additional-info">
          <div className="info-row">
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Kích cỡ (tùy chọn)"
            />
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Chiều cao (tùy chọn)"
            />
          </div>
          <div className="info-row">
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Cân nặng (tùy chọn)"
            />
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Chất liệu (tùy chọn)"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/reviews/${productId}`)}
            className="btn-cancel"
            disabled={loading}
          >
            QUAY LẠI
          </button>
        </div>
      </div>
    </div>
  );
}