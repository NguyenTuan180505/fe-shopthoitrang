import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExclusiveOffer.module.css";

export default function ExclusiveOffer() {
  const navigate = useNavigate();

  // Tính thời gian kết thúc: 7 ngày từ bây giờ
  const [endTime] = useState(() => {
    const end = new Date();
    end.setDate(end.getDate() + 7);
    return end.getTime();
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000); // Update mỗi giây

    return () => clearInterval(timer);
  }, [endTime]);

  const handleBuyNow = () => {
    window.scrollTo(0, 0);
    navigate("/shop");
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.offerCard}>
          <div className={styles.imageBox}>
            <div className={styles.decorDots}>
              {[...Array(15)].map((_, i) => (
                <span key={i} className={styles.dot}></span>
              ))}
            </div>
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
              alt="Fashion Model"
              className={styles.modelImage}
            />
          </div>

          <div className={styles.content}>
            <h2 className={styles.title}>Exclusive offer</h2>
            <p className={styles.description}>
              Unlock the ultimate style upgrade with our exclusive offer! Enjoy
              savings of up to 40% off on our latest New Arrivals
            </p>

            <div className={styles.countdown}>
              <div className={styles.timeBox}>
                <div className={styles.timeValue}>
                  {String(timeLeft.days).padStart(2, "0")}
                </div>
                <div className={styles.timeLabel}>Days</div>
              </div>
              <div className={styles.timeBox}>
                <div className={styles.timeValue}>
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className={styles.timeLabel}>Hours</div>
              </div>
              <div className={styles.timeBox}>
                <div className={styles.timeValue}>
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className={styles.timeLabel}>Min</div>
              </div>
              <div className={styles.timeBox}>
                <div className={styles.timeValue}>
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className={styles.timeLabel}>Sec</div>
              </div>
            </div>

            <button className={styles.buyBtn} onClick={handleBuyNow}>
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
