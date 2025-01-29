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
                        <h2>內湖碧湖公園</h2>
                    </div>
                </div>

                <!-- 圖片 -->
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="image-container">
                            <img src="/images/兒童新樂園.jpg" alt="內湖碧湖公園" class="detail-image"/>
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
                                內湖碧湖公園是一座風景秀麗的自然公園，位於台北市內湖區。公園內有一座美麗的人工湖，湖面倒映著周圍翠綠的山林，營造出寧靜悠閒的氛圍，是市民散步、慢跑、騎腳踏車的絕佳場所。
                            </p>

                            <p>
                                碧湖公園內設有環湖步道，遊客可以沿著湖畔欣賞湖光山色，還能在湖邊的涼亭休息，享受大自然的清新空氣。此外，公園內的生態區孕育了豐富的動植物，包括水鳥、魚類與各類昆蟲，是一處生態觀察的好去處。
                            </p>

                            <p>
                                碧湖公園鄰近內湖捷運站，交通便利，不論是晨間運動、午後散步，還是拍攝湖景美照，這裡都是台北市內最適合放鬆心情的公園之一。想要在都市中尋找一處寧靜的綠地，碧湖公園絕對是你的最佳選擇。
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
