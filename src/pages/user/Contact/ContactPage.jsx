import { useState } from "react";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      id: 1,
      icon: "📍",
      title: "Địa chỉ",
      content: "48 Cao Thắng, TP. Đà Nẵng",
      color: "#10b981",
    },
    {
      id: 2,
      icon: "📞",
      title: "Điện thoại",
      content: "+84 123 456 789",
      color: "#3b82f6",
    },
    {
      id: 3,
      icon: "📧",
      title: "Email",
      content: "contact@fashion.com",
      color: "#8b5cf6",
    },
    {
      id: 4,
      icon: "🕒",
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 7: 8:00 - 22:00",
      color: "#f59e0b",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập gửi form
    console.log("Form data:", formData);
    setSubmitted(true);

    // Reset form sau 3 giây
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Liên hệ với chúng tôi</h1>
          <p className={styles.heroSubtitle}>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </div>

      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactGrid}>
            {contactInfo.map((info) => (
              <div key={info.id} className={styles.infoCard}>
                <div
                  className={styles.infoIcon}
                  style={{
                    background: `linear-gradient(135deg, ${info.color}, ${info.color}dd)`,
                  }}
                >
                  <span>{info.icon}</span>
                </div>
                <h3 className={styles.infoTitle}>{info.title}</h3>
                <p className={styles.infoContent}>{info.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Gửi tin nhắn cho chúng tôi</h2>
              <p className={styles.formSubtitle}>
                Điền thông tin bên dưới và chúng tôi sẽ phản hồi trong thời gian
                sớm nhất
              </p>
            </div>

            {submitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>Gửi thành công!</h3>
                <p>
                  Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.
                </p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Họ và tên *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="0123456789"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tiêu đề *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Chủ đề liên hệ"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Nội dung *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    rows="6"
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Gửi tin nhắn
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className="container">
          <h2 className={styles.mapTitle}>Vị trí của chúng tôi</h2>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.0268896479484!2d108.21937131533302!3d16.06430428889076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c6a13b7d97%3A0x8d6b3e8c5c5e8b3e!2zNDggQ2FvIFRo4bqvbmcsIEjhuqNpIENow6J1IDEsIEjhuqNpIENow6J1LCDEkMOgIE7hurVuZyA1NTAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - 48 Cao Thắng, Đà Nẵng"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
