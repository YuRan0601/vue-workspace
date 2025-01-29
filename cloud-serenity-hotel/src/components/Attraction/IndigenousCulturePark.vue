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
                        <h2>原住民文化主題公園</h2>
                    </div>
                </div>

                <!-- 圖片 -->
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="image-container">
                            <img src="/images/原住民文化主題公園.jpg" alt="原住民文化主題公園" class="detail-image"/>
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
                                原住民文化主題公園位於台北市士林區，是一座以台灣原住民族文化為主題的公園。這座公園不僅展示了台灣 16 個原住民族的歷史與傳統，也透過建築、藝術、音樂與舞蹈，讓遊客深入了解原住民的獨特文化。
                            </p>

                            <p>
                                公園內設有傳統竹屋與木造建築，還有以手工雕刻的圖騰柱，展現各族群的文化特色。此外，定期舉辦的原住民表演活動，如傳統歌謠、舞蹈及手工藝體驗，讓遊客能夠親身感受原住民文化的魅力。
                            </p>

                            <p>
                                此外，公園內也設有自然生態區，遊客可以欣賞到各種原住民部落周邊的原生植物與動物。這裡不僅是一處了解台灣原住民文化的場所，也是適合親子共遊的教育景點。無論是文化愛好者，還是對台灣歷史有興趣的旅人，原住民文化主題公園都是值得一訪的地方。
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
