<template>
    <div id="page">
      <!-- 頁面載入動畫 -->
      <div class="gtco-loader"></div>
  
      <!-- 導覽列 -->
      <nav class="gtco-nav" role="navigation">
        <div class="gtco-container">
          <div class="row">
            <div class="col-sm-4 col-xs-12">
              <div id="gtco-logo"><a href="#">Traveler <em>.</em></a></div>
            </div>
            <div class="col-xs-8 text-right menu-1">
              <ul>
                <li class="active"><a href="#">您的旅途休息站</a></li>
                <li class="has-dropdown">
                  <a href="#">房型</a>
                  <ul class="dropdown">
                    <li><a href="#">青旅房</a></li>
                    <li><a href="#">單人房</a></li>
                    <li><a href="#">雙人房</a></li>
                    <li><a href="#">四人房</a></li>
                  </ul>
                </li>
                <li><a href="#">價格查詢</a></li>
                <li><a href="#">和我們聯絡</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- 橫幅 -->
      <header id="gtco-header" class="gtco-cover gtco-cover-sm" role="banner">
        <div class="overlay"></div>
        <div class="gtco-container">
          <h1>雲澄 CloudSerenity Hotel</h1>
        </div>
      </header>
  
      <!-- 主要內容 -->
      <div class="gtco-section">
        <div class="gtco-container">
          <div class="row">
            <div class="col-md-8 col-md-offset-2 text-center gtco-heading">
              <h2>您旅途中最完美的休息站</h2>
              <p>結合現代舒適與在地風情的完美選擇。</p>
            </div>
          </div>
  
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-6" v-for="spot in attractions" :key="spot.title">
              <div class="fh5co-card-item">
                <figure>
                  <div class="overlay"><i class="ti-plus"></i></div>
                  <img :src="spot.image" :alt="spot.title" class="img-responsive" />
                </figure>
                <div class="fh5co-text">
                  <h2>{{ spot.title }}</h2>
                  <p>{{ spot.description }}</p>
                  <p><span class="btn btn-primary" @click="showDetails(spot)">查看景點詳情</span></p>
                </div>
              </div>
            </div>
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
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  
  export default {
    name: 'AttractionComponent',
    data() {
      return {
        attractions: [
          {
            title: "雙溪公園",
            description: "雙溪之美，士林的綠色心臟。",
            image: require('@/assets/images/雙溪公園.jpg')
          },
          {
            title: "士林科教館",
            description: "感受科學的魅力，開啟無限的可能。",
            image: require('@/assets/images/士林科學教育館.jpg')
          }
        ]
      };
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
          confirmButtonText: '關閉',
          confirmButtonColor: '#007BFF'
        });
      }
    }
  };
  </script>
  
  <style scoped>
  @import '@/assets/css/style.css';
  
  .gtco-heading h2 {
    color: #09C6AB;
  }
  </style>
  