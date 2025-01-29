<template>
    <div id="page">


        <div class="gtco-section">
            <div class="gtco-container">
                <!-- 返回按鈕 -->
                <div class="back-button">
                    <button @click="$router.push('/front')">← 返回景點列表</button>
                </div>

                <!-- 景點標題 -->
                <div class="row">
                    <div class="col-md-8 mx-auto text-center gtco-heading">
                        <h2>士林科教館</h2>
                    </div>
                </div>

                <!-- 圖片 -->
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="image-container">
                            <img src="/images/士林科學教育館.jpg" alt="士林科教館" class="detail-image"/>
                        </div>
                    </div>
                </div>

                <!-- 副標題（圖片下方） -->
                <div class="row">
                    <div class="col-md-12 text-center subtitle-container">
                        <p class="subtitle"></p>
                    </div>
                </div>

                <!-- 小黑板區塊 -->
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="blackboard">
                            <h3>詳細景點介紹</h3>
                            <p>
                                士林科學教育館（簡稱士林科教館）位於台北市士林區，是台灣最重要的科學教育場所之一。這座館舍以推廣科學知識、啟發創新思維為目標，透過互動展示、實驗體驗與各類科學展覽，讓不同年齡層的訪客都能深入了解科學的奧妙。
                            </p>

                            <p>
                                科教館內部設有多個主題展區，涵蓋了物理、化學、地球科學、生物科學以及天文學等領域。其中最受歡迎的是互動展區，透過動手實驗與模擬裝置，讓參觀者能夠親自體驗各種科學現象，例如重力作用、電磁原理、光學折射等。這些展品不僅適合學生學習，也能讓成年人對科學產生更濃厚的興趣。
                            </p>

                            <p>
                                除了基本的常設展區，士林科教館還會定期舉辦特展與科學講座，邀請國內外的專家學者，帶領訪客探索最新的科技發展與科學發現。例如，與航太科技相關的展覽曾展示太空探測器模型，讓參觀者近距離了解人類如何探索宇宙。此外，科教館也會針對不同的節日或科學紀念日舉辦特別活動，如「科學嘉年華」與「STEM 教育週」等，讓科學變得更加有趣與生活化。
                            </p>

                            <p>
                                士林科教館的另一個亮點是天文展區，這裡設有天文模擬劇場，能夠讓參觀者感受沉浸式的星空體驗，了解宇宙的形成、恆星的運行以及太陽系的奧秘。此外，戶外也設有太陽能觀測設備，天氣良好時，遊客可以透過望遠鏡觀看太陽黑子與日冕現象，進一步認識天文學的奧妙。
                            </p>

                            <p>
                                作為一座集教育與娛樂於一體的科學樂園，士林科教館不僅是學生的學習基地，也是親子共遊的理想場所。這裡的展覽設計以趣味性與互動性為主，讓科學知識不再只是課本上的文字，而是能夠親身體驗的精彩旅程。無論是對科學充滿好奇的孩子，還是希望拓展知識視野的成年人，士林科教館都是一個值得探索的地方。
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Google 地圖 -->
                <div class="row">
                    <div class="col-md-12 text-center">
                        <h3 class="map-title">景點位置</h3>
                        <div class="map-container">
                            <iframe 
                                class="map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.5788!2d121.5415!3d25.0837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2z5rW35paw6YeR5Lq65qWK!5e0!3m2!1sen!2stw!4v1234567890"
                                allowfullscreen="" loading="lazy">
                            </iframe>
                        </div>
                    </div>
                </div>

                <!-- 分享與推薦 -->
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="social-icons">
                            <button @click="shareOnFacebook">Facebook</button>
                            <button @click="shareOnLine">LINE</button>
                            <button @click="shareOnTwitter">Twitter</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        shareOnFacebook() {
            window.open("https://www.facebook.com/sharer/sharer.php?u=" + window.location.href, "_blank");
        },
        shareOnLine() {
            window.open("https://line.me/R/msg/text/?" + encodeURIComponent(document.title + " " + window.location.href), "_blank");
        },
        shareOnTwitter() {
            window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(document.title + " " + window.location.href), "_blank");
        }
    }
};
</script>

<style scoped>
/* 設定背景圖片（變淡 50%） */
#page {
    position: relative;
}
#page::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/Attraction/images/bgwood.png') no-repeat center center fixed;
    background-size: cover;
    opacity: 0.9;
    z-index: -1;
}

/* 讓 Header 具有透明感 */
#gtco-header {
    background: rgba(0, 0, 0, 0.8);
    height: 120px;
}

/* 讓按鈕現代化 */
.back-button button {
    background: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    margin: 10px;
}
.back-button button:hover {
    background: #555;
}

/* 標題設計 */
.gtco-heading h2 {
    font-size: 32px;
    color: white;
    font-weight: bold;
}

/* 副標題設計 */
.subtitle-container {
    margin-top: 10px;
}
.subtitle {
    color: white;
    font-size: 20px;
    font-style: italic;
}

/* 圖片容器 */
.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

/* 景點圖片 */
.detail-image {
    max-width: 80%;
    height: auto;
    border-radius: 15px;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
}

/* 小黑板區塊 */
.blackboard {
    background: url('/Attraction/images/board.jpeg') no-repeat center;
    background-size: cover;
    padding: 30px;
    margin: 20px auto;
    width: 80%;
    max-width: 1000px;
    border-radius: 15px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
    text-align: center;
    color: white;
    font-family: 'Chalkboard', sans-serif;
}

.blackboard h3 {
    font-size: 28px;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.blackboard p {
    font-size: 18px;
    line-height: 1.6;
}

/* Google 地圖設計 */
.map-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.map {
    width: 30%;
    height: 600px;
    border-radius: 15px;
    border: none;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
}

/* 修改「景點位置」字體為白色 */
.map-title {
    color: white;
}

/* 社群分享按鈕 */
.social-icons button {
    background: #444;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    margin: 5px;
    border: none;
    cursor: pointer;
}
.social-icons button:hover {
    background: #666;
}
</style>
