import styles from "./FeaturesPage.module.css";

export default function FeaturesPage() {
  const features = [
    {
      id: 1,
      icon: "🚚",
      title: "Miễn phí vận chuyển",
      description:
        "Miễn phí giao hàng cho đơn từ 500.000đ trở lên trên toàn quốc",
      color: "#10b981",
    },
    {
      id: 2,
      icon: "🔄",
      title: "Đổi trả dễ dàng",
      description:
        "Chính sách đổi trả trong vòng 7 ngày nếu sản phẩm lỗi hoặc không đúng size",
      color: "#3b82f6",
    },
    {
      id: 3,
      icon: "💳",
      title: "Thanh toán an toàn",
      description:
        "Hỗ trợ đa dạng phương thức thanh toán: COD, chuyển khoản, ví điện tử",
      color: "#8b5cf6",
    },
    {
      id: 4,
      icon: "⭐",
      title: "Chất lượng đảm bảo",
      description:
        "100% sản phẩm chính hãng, cam kết chất lượng từ các thương hiệu uy tín",
      color: "#f59e0b",
    },
    {
      id: 5,
      icon: "🎁",
      title: "Ưu đãi hấp dẫn",
      description:
        "Chương trình khuyến mãi, tích điểm thành viên, giảm giá đặc biệt mỗi tuần",
      color: "#ef4444",
    },
    {
      id: 6,
      icon: "💬",
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ tư vấn nhiệt tình, sẵn sàng hỗ trợ mọi thắc mắc của bạn",
      color: "#06b6d4",
    },
  ];

  const benefits = [
    {
      id: 1,
      title: "Thời trang đa dạng",
      description:
        "Hàng nghìn sản phẩm từ áo quần, phụ kiện đến giày dép, đáp ứng mọi phong cách",
    },
    {
      id: 2,
      title: "Xu hướng mới nhất",
      description:
        "Cập nhật liên tục các xu hướng thời trang hot nhất từ trong và ngoài nước",
    },
    {
      id: 3,
      title: "Giá cả cạnh tranh",
      description: "Cam kết giá tốt nhất thị trường với chất lượng vượt trội",
    },
    {
      id: 4,
      title: "Trải nghiệm mua sắm",
      description:
        "Giao diện thân thiện, dễ sử dụng, tìm kiếm sản phẩm nhanh chóng",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Tính năng nổi bật</h1>
          <p className={styles.heroSubtitle}>
            Khám phá những lợi ích tuyệt vời khi mua sắm cùng chúng tôi
          </p>
        </div>
      </div>

      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <div key={feature.id} className={styles.featureCard}>
                <div
                  className={styles.featureIcon}
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                  }}
                >
                  <span>{feature.icon}</span>
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Tại sao chọn chúng tôi?</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit) => (
              <div key={benefit.id} className={styles.benefitCard}>
                <div className={styles.benefitNumber}>{benefit.id}</div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDesc}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Sẵn sàng trải nghiệm?</h2>
            <p className={styles.ctaDesc}>
              Bắt đầu hành trình mua sắm thời trang cùng chúng tôi ngay hôm nay
            </p>
            <button
              className={styles.ctaBtn}
              onClick={() => (window.location.href = "/shop")}
            >
              Khám phá ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
