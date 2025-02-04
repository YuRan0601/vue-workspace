<template>
	<div id="fh5co-content" class="fh5co-no-pd-top">
		<div class="container">
            <div>
    <section id="about-us" class="about-container">
      <div class="container text-center">
        <h2 class="about-title black-text">About Us</h2>
        <p class="black-text">我們的專案小組由六名成員組成，致力於提供最優質的旅遊體驗。</p>
        <div class="container team-grid">
          <div class="row">
            <div v-for="(member, index) in team" :key="index" class="col-md-4 col-sm-6">
              <div class="fh5co-staff animate-box" data-animate-effect="fadeIn">
                <img :src="member.image" :alt="member.name">
                <h3 class="black-text">{{ member.name }}</h3>
                <strong class="role">{{ member.role }}</strong>
                <p class="black-text">{{ member.description }}</p>
                <ul class="fh5co-social-icons">
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
            
		</div>
	</div>
    <div id="fh5co-blog">
		<div class="container">
			<div class="row animate-box">
				<div class="col-md-12 col-md-offset-0 text-center fh5co-heading">
					<h2><span>Development process</span></h2>
				</div>
			</div>
			<div class="row">
				<div class="col-md-4">
					<div class="fh5co-blog animate-box">
						<div class="title text-center">
							<span class="posted-on">Nov. 15th 2016</span>
							<h3><a href="#">Modeling &amp; Stylist in USA</a></h3>
							<span class="category">Lifestyle</span>
						</div>
						<!-- <a href="#"><img class="img-responsive" src="/Attraction/images/blog-2.jpg" alt=""></a> -->
						<div class="blog-text text-center">
							<p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
						</div> 
					</div>
				</div>
				<div class="col-md-4">
					<div class="fh5co-blog animate-box">
						<div class="title text-center">
							<span class="posted-on">Nov. 15th 2016</span>
							<h3><a href="#">Modeling &amp; Stylist in USA</a></h3>
							<span class="category">Lifestyle</span>
						</div>
						<!-- <a href="#"><img class="img-responsive" src="/Attraction/images/blog-1.jpg" alt=""></a> -->
						<div class="blog-text text-center">
							<p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>

						</div> 
					</div>
				</div>
				<div class="col-md-4">
					<div class="fh5co-blog animate-box">
						<div class="title text-center">
							<span class="posted-on">Nov. 15th 2016</span>
							<h3><a href="#">Modeling &amp; Stylist in USA</a></h3>
							<span class="category">Lifestyle</span>
						</div>
						<!-- <a href="#"><img class="img-responsive" src="/Attraction/images/blog-2.jpg" alt=""></a> -->
						<div class="blog-text text-center">
							<p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>

						</div> 
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="fh5co-instagram">
		<div class="container">
			<div class="row animate-box">
				<div class="col-md-12 col-md-offset-0 text-center fh5co-heading">
					<h2><span>Instagram Posts</span></h2>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3 nopadding animate-box">
				<div class="insta" style="background-image: url(/Attraction/images/insta-1.jpg);"></div>
			</div>
			<div class="col-md-3 nopadding animate-box">
				<div class="insta" style="background-image: url(/Attraction/images/insta-2.jpg);"></div>
			</div>
			<div class="col-md-3 nopadding animate-box">
				<div class="insta" style="background-image: url(/Attraction/images/insta-3.jpg);"></div>
			</div>
			<div class="col-md-3 nopadding animate-box">
				<div class="insta" style="background-image: url(/Attraction/images/insta-4.jpg);"></div>
			</div>
		</div>
	</div>
    
    <footer id="fh5co-footer" role="contentinfo">


			<div class="row copyright">
				<div class="col-md-12 text-center">
					<p>
						<small class="block">&copy; 2016 Free HTML5. All Rights Reserved.</small> 
						<small class="block">Designed by <a href="http://freehtml5.co/" target="_blank">FreeHTML5.co</a> Demo Images: <a href="http://unsplash.co/" target="_blank">Unsplash</a></small>
					</p>
				</div>
			</div>

	</footer>

  </template>
  
  <script>
  export default {
    data() {
      return {
        team: [
          { name: '陳裕然', role: 'Project Manager ,Booking Developer', description: '負責專案管理與整體規劃。', image: '/Attraction/images/user-1.jpg', socials: [{ class: 'icon-facebook', link: '#' }, { class: 'icon-twitter', link: '#' }] },
          { name: '范誠宇', role: 'Attrac. Content Designer & Developer', description: '負責景點前端設計規劃。', image: '/Attraction/images/user-2.jpg', socials: [{ class: 'icon-github', link: '#' }, { class: 'icon-linkedin', link: '#' }] },
          { name: '林孟穎', role: 'Car Rental System Developer', description: '設計租車系統及使用者體驗。', image: '/Attraction/images/user-3.jpg', socials: [{ class: 'icon-dribbble', link: '#' }, { class: 'icon-behance', link: '#' }] },
          { name: '何霈珩', role: 'Membership System Developer', description: '負責會員系統開發與視覺實現。', image: '/Attraction/images/user-4.jpg', socials: [{ class: 'icon-twitter', link: '#' }, { class: 'icon-facebook', link: '#' }] },
          { name: '廖青梅', role: 'Order System Developer', description: '負責訂單系統及購物車設計開發。', image: '/Attraction/images/user-5.jpg', socials: [{ class: 'icon-github', link: '#' }, { class: 'icon-linkedin', link: '#' }] },
          { name: '林芯儀', role: 'Souvenir E-Commerce Developer', description: '負責伴手禮商誠與周邊商品。', image: '/Attraction/images/user-6.jpg', socials: [{ class: 'icon-instagram', link: '#' }, { class: 'icon-twitter', link: '#' }] }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
    @import '@/assets/Attraction/css/papercss/style.css';
    @import '@/assets/Attraction/css/papercss/animate.css';
    @import '@/assets/Attraction/css/papercss/icomoon.css';
    @import '@/assets/Attraction/css/papercss/bootstrap.css';
    @import '@/assets/Attraction/css/papercss/magnific-popup.css';
    @import '@/assets/Attraction/css/papercss/flexslider.css';
    @import '@/assets/Attraction/css/papercss/style.css';

    .about-container {
  /* background-color: #09C6AB; */
  padding: 60px 0;
  color: white;
}
.about-title {
  text-align: center;
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 20px;
  display: block;
  width: 100%;
  position: relative;
}
.black-text {
  color: black !important;
}
.about-title::before,
.about-title::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40px;
  height: 2px;
  background: black;
}
.about-title::before {
  left: calc(50% - 60px);
}

.about-title::after {
  right: calc(50% - 60px);
}
.team-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.col-md-4 {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.fh5co-staff {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  width: 100%;
}
.fh5co-staff img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.fh5co-social-icons {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
}
.fh5co-social-icons li {
  margin: 0 5px;
}
.fh5co-social-icons a {
  /* color: #09C6AB; */
  font-size: 20px;
}
  </style>
  