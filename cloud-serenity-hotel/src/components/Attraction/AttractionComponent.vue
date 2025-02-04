<template>
    <div id="page">
        <!-- 頁面載入動畫 -->
        <header id="gtco-header" class="gtco-cover gtco-cover-sm" role="banner" style="background-image: url('/Attraction/images/Background1.jpeg'); 
        background-size: cover; background-position: center;">
            <div class="overlay"></div>
            <div class="gtco-container">
                <h1>雲澄 CloudSerenity Hotel</h1>
            </div>
        </header>

        <!-- 主要內容 -->
        <div class="gtco-section">
            <div class="gtco-container">
                <div class="row">
                    <div class="col-md-8 mx-auto text-center gtco-heading">
                        <h2>您旅途中最完美的休息站</h2>
                        <p>結合現代舒適與在地風情的完美選擇。</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-6" v-for="spot in paginatedAttractions" :key="spot.title">
                        <div class="fh5co-card-item">
                            <figure>
                                <div class="overlay"><i class="ti-plus"></i></div>
                                <img :src="spot.image" :alt="spot.title" class="img-responsive" />
                            </figure>
                            <div class="fh5co-text">
                                <h2>{{ spot.title }}</h2>
                                <p>{{ spot.description }}</p>
                                <p>
                                    <span class="btn btn-primary" @click="showDetails(spot)">查看景點詳情</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 搜索框（移動到分頁上方） -->
                <div class="search-bar">
                    <input type="text" v-model="searchQuery" placeholder="請輸入景點名稱" class="form-control" />
                </div>

                <!-- 分頁功能 -->
                <div class="pagination">
                    <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                        :class="{ active: currentPage === page }">
                        {{ page }}
                    </button>
                </div>
            </div>
        </div>

        <!-- 頁腳 -->
        <footer id="gtco-footer">
            <div class="gtco-container">
                <p>版權所有 &copy; 2025 CloudSerenity Hotel</p>
            </div>
        </footer>
    </div>
  
      <section class="gtco-cover gtco-cover-sm" :style="backgroundStyle" data-stellar-background-ratio="0.5">
        <div class="overlay"></div>
        <div class="gtco-container text-center">
          <div class="display-t">
            <div class="display-tc">
              <h1>從雲澄旅館出發<br>探索士林的美景與文化！</h1>
            </div>
          </div>
        </div>
      </section>
  
</template>


<script>
import Swal from "sweetalert2";
import { ref } from "vue";

export default {
    name: "AttractionComponent",
    data() {
        return {
            searchQuery: ref(""), // 搜索框內容
            currentPage: 1, // 當前頁數
            itemsPerPage: 6, // 每頁顯示的景點數量
            attractions: [
                {
                    title: "雙溪公園",
                    description: "雙溪之美，士林的綠色心臟。",
                    image: "/Attraction/images/雙溪公園.jpg",
                },
                {
                    title: "士林科教館",
                    description: "感受科學的魅力，開啟無限的可能。",
                    image: "/Attraction/images/士林科學教育館.jpg",
                },
                {
                    title: "台北市立天文館",
                    description: "穿越星河，探索無垠宇宙。",
                    image: "/Attraction/images/天文科學博物館.jpg",
                },
                {
                    title: "台北兒童新樂園",
                    description: "孩子的冒險世界，快樂永不停歇。",
                    image: "/Attraction/images/兒童新樂園.jpg",
                },
                {
                    title: "士林官邸",
                    description: "歷史與自然的完美融合。",
                    image: "/Attraction/images/士林官邸.jpg",
                },
                {
                    title: "原住民文化主題公園",
                    description: "傳統與自然的完美結合。",
                    image: "/Attraction/images/原住民文化主題公園.jpg",
                },
                {
                    title: "美麗華摩天輪",
                    description: "夜景燦爛，夢幻情調。",
                    image: "/Attraction/images/美麗華摩天輪.jpg",
                },
                {
                    title: "內湖碧湖公園",
                    description: "湖光山色，都市中的綠洲。",
                    image: "/Attraction/images/碧湖公園.jpg",
                },
            ],
            
        };
    },
    computed: {
        // 搜索過濾後的景點
        filteredAttractions() {
            if (this.searchQuery) {
                return this.attractions.filter((spot) =>
                    spot.title.includes(this.searchQuery)
                );
            }
            return this.attractions;
        },
        // 計算總頁數
        totalPages() {
            return Math.ceil(this.filteredAttractions.length / this.itemsPerPage);
        },
        // 取得當前頁面的景點資料
        paginatedAttractions() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.filteredAttractions.slice(startIndex, endIndex);
        },
    },
    methods: {
        showDetails(spot) {
            Swal.fire({
                title: `<strong>${spot.title}</strong>`,
                html: `
                    <img src="${spot.image}" alt="${spot.title}" style="width: 100%; border-radius: 10px; margin-bottom: 15px;">
                    <p>${spot.description}</p>
                    <p>探索士林最美風景，來一場難忘的旅程！</p>
                `,
                showCancelButton: true,
                confirmButtonText: "關閉",
                cancelButtonText: "查看詳情",
                cancelButtonColor: "#09c6ab"
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                    // 跳轉到詳細頁面
                    this.$router.push(`/attraction/${spot.title}`);
                }
            });
        },
    }
};

</script>

<style scoped>
@import "@/assets/Attraction/css/style.css";

/* 搜索框樣式，調整位置 */
.search-bar {
    text-align: center;
    max-width: 500px;
    margin: 20px auto 0 auto;
    /* 增加 margin-top，使其與內容分開 */
    padding: 10px 0;
}

.form-control {
    width: 100%;
    padding: 10px;
    font-size: 16px;
}

/* 分頁按鈕樣式 */
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination button {
    padding: 10px 15px;
    margin: 5px;
    border: 1px solid #ddd;
    background-color: white;
    cursor: pointer;
}

.pagination button.active {
    background-color: #09c6ab;
    color: white;
}

/* 置中標題 */
.gtco-heading h2 {
    color: #09C6AB;
}
</style>