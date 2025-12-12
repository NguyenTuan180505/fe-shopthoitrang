import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.inner}>
          {/* LEFT TEXT CONTENT */}
          <div className={styles.left}>
            <h1 className={styles.title}>
              Discover and <br />
              Find Your Own <br />
              Fashion!
            </h1>

            <p className={styles.desc}>
              Explore our curated collection of stylish clothing and accessories
              tailored to your unique taste.
            </p>

            <button className={styles.btn}>EXPLORE NOW</button>
          </div>

          {/* RIGHT IMAGE */}
          <div className={styles.right}>
            <div className={styles.imageBox}>
              <img
                src="/images/model.png"
                alt="model"
                className={styles.model}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
