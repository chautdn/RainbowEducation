import styles from './InfiniteScroll.module.css';


function InfiniteScroll() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.contentContainer}>
                <span>
                    Trải nghiệm quá trình{" "}
                    <div className={styles.benefits}>
                        <span> chơi</span>
                        <span> học</span>
                        <span> vui</span>
                        <span> hiệu quả</span>
                        <span> chơi</span>
                    </div>
                    {" "}Thật{" "}
                    <div className={styles.benefits}>
                        <span> phong phú</span>
                        <span> bổ ích</span>
                        <span> phong phú</span>
                        <span> bổ ích</span>
                        <span> phong phú</span>
                    </div>

                </span>
            </div>
        </div>
    );
}
export default InfiniteScroll;
