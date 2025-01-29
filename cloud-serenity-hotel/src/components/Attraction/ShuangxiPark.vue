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
                        <h2>雙溪公園</h2>
                    </div>
                </div>

                <!-- 圖片 -->
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="image-container">
                            <img src="/images/雙溪公園.jpg" alt="雙溪公園" class="detail-image"/>
                        </div>
                    </div>
                </div>

                <!-- 副標題（圖片下方） -->
                <div class="row">
                    <div class="col-md-12 text-center subtitle-container">
                        <p class="subtitle">雙溪之美，士林的綠色心臟。</p>
                    </div>
                </div>

                <!-- 小黑板區塊 -->
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="blackboard">
                            <h3>詳細景點介紹</h3>
                            <p>
                                雙溪公園位於台北市士林區，是一處融合自然景觀與人文歷史的休憩場所。這座公園以其優美的環境、寧靜的氛圍和豐富的生態資源，成為當地居民與遊客的最愛。公園內擁有茂密的樹林、蜿蜒的步道，以及一座清澈見底的湖泊，湖水映照著四季變化的美景，呈現出詩意般的畫面。無論是晨跑、散步、拍照，或是與家人朋友一同來場野餐，雙溪公園都能帶來悠閒而愜意的時光。
                               </p><p>
                                雙溪公園的名稱源自於園內的兩條溪流，這些溪流蜿蜒流過園區，滋養著公園內的各種動植物。園內生態豐富，春夏時節可以看到滿滿的翠綠植物，而秋冬時分則有落葉鋪滿步道，為整座公園增添了不同的風情。此外，這裡也是許多鳥類的棲息地，晨間與黃昏時分，經常可見鳥兒飛翔於樹梢，或駐足於湖面上，讓遊客感受到大自然的和諧之美。
                                </p><p>
                                園內設有涼亭與休憩區，讓遊客可以靜靜地坐下來享受片刻寧靜。公園的景色隨著天氣與時間的變化呈現不同風貌，清晨的薄霧、午後的陽光、黃昏的晚霞，每一刻都有其獨特的魅力。此外，雙溪公園也適合親子同樂，家長可以帶著孩子來這裡觀察昆蟲、認識植物，或是讓孩子在寬廣的草坪上奔跑玩耍，培養對大自然的興趣與熱愛。
                                </p><p>
                                雙溪公園不僅是一處綠意盎然的城市綠洲，也是一個讓人放鬆身心的理想場所。這裡遠離都市的喧囂，卻又不失便利性，讓每位來訪的旅人都能在這片綠地中找到屬於自己的寧靜角落。如果你想要尋找一個可以親近自然、享受悠閒時光的地方，那麼雙溪公園絕對是一個值得推薦的選擇。
                                </p><p>
                                這裡不僅擁有四季變化的美景，還能欣賞到當地鳥類與生態環境，是攝影與自然愛好者的天堂。
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
