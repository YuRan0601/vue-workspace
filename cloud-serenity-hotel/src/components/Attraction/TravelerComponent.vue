<template>
        <!-- 頁面載入動畫 -->
        <header id="gtco-header" class="gtco-cover gtco-cover-sm" role="banner" style="background-image: url('/Attraction/images/Background1.jpeg'); 
        background-size: cover; background-position: center;">
      <div class="overlay"></div>
      <div class="gtco-container">
        <h1>雲澄 CloudSerenity Hotel</h1>
      </div>
    </header>

    <div>
      <section id="gtco-features">
        <div class="gtco-container text-center">
          <div class="row">
            <div class="col-md-8 col-md-offset-2 text-center gtco-heading animate-box">
              <h2>探索雲澄</h2>
              <p>在台北士林區的心臟地帶，體驗舒適住宿與便捷的周邊旅遊體驗。</p>
            </div>
          </div>
          <br><br><br><br>
          <div class="row justify-content-center">
            <div v-for="(feature, index) in features" :key="index" class="col-md-4 col-sm-6 d-flex justify-content-center">
              <div class="feature-center animate-box" data-animate-effect="fadeIn">
                <span class="icon">
                  <i>{{ feature.icon }}</i>
                </span>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- <section class="gtco-cover gtco-cover-sm" :style="backgroundStyle" data-stellar-background-ratio="0.5">
        <div class="overlay"></div>
        <div class="gtco-container text-center">
          <div class="display-t">
            <div class="display-tc">
              <h1>從雲澄旅館出發，探索士林的美景與文化！</h1>
            </div>
          </div>
        </div>
      </section> -->
  
      <section id="gtco-counter" class="gtco-section">
        <div class="gtco-container">
          <div class="row">
            <div class="col-md-8 col-md-offset-2 text-center gtco-heading animate-box">
              <h2>雲澄旅館的足跡</h2>
              <p>陪伴無數旅人，探索世界各地，感受士林的獨特魅力。</p>
            </div>
          </div>
          <br><br><br><br>
          <div class="row">
            <div v-for="(stat, index) in stats" :key="index" class="col-md-3 col-sm-6 animate-box text-center" data-animate-effect="fadeInUp">
              <div class="feature-center">
                <span class="counter">{{ stat.count }}</span>
                <span class="counter-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        features: [
          { icon: '1', title: '舒適住宿體驗', description: '雲澄旅館提供豪華與舒適的房型，讓您放鬆身心。' },
          { icon: '2', title: '便捷的地理位置', description: '鄰近士林夜市與捷運站，輕鬆探索台北。' },
          { icon: '3', title: '特色旅遊行程', description: '推薦周邊景點與獨特的文化體驗，豐富您的旅程。' }
        ],
        stats: [
          { count: 124, label: '周邊景點' },
          { count: 97, label: '舒適房型' },
          { count: 12402, label: '旅客人次' },
          { count: 12202, label: '滿意顧客' }
        ]
      };
    },
    computed: {
      backgroundStyle() {
        return { backgroundImage: 'url(/images/img_bg_1.jpg)' };
      }
    }
  };
  </script>
  
  <style scoped>
  @import '@/assets/Attraction/css/style.css';
  
  .gtco-heading {
    text-align: center;
    margin: 0 auto;
  }
  
  .feature-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  </style>
  