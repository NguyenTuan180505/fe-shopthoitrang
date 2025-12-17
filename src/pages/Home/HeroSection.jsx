import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.inner}>
          {/* NỘI DUNG CHỮ BÊN TRÁI */}
          <div className={styles.left}>
            <h1 className={styles.title}>
              Khám phá và <br />
              Tìm phong cách <br />
              Của riêng bạn!
            </h1>

            <p className={styles.desc}>
              Khám phá bộ sưu tập quần áo và phụ kiện thời trang được tuyển
              chọn, phù hợp với phong cách và cá tính riêng của bạn.
            </p>

            <button className={styles.btn}>KHÁM PHÁ NGAY</button>
          </div>

          {/* HÌNH ẢNH BÊN PHẢI */}
          <div className={styles.right}>
            <div className={styles.imageBox}>
              <img
                src="/images/model.png"
                alt="người_mẫu"
                className={styles.model}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
