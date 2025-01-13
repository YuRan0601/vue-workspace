<script setup></script>

<template>
  <div>
    <header class="header_area bg-header">
            <div class="container">
                <nav class="navbar navbar-expand-lg navbar-light">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <a class="navbar-brand logo_h" href="index.html"><img src="../../assets/common/logo.png" alt=""></a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <!-- Collect the nav links, forms, and other content for toggling -->
                    <div class="collapse navbar-collapse offset" id="navbarSupportedContent">
                        <ul class="nav navbar-nav menu_nav ml-auto">
                            <li class="nav-item"><a class="nav-link" href="index.html">首頁</a></li> 
                            <li class="nav-item"><a class="nav-link" href="about.html">會員中心</a></li>
                            <li class="nav-item"><RouterLink class="nav-link" :to="{name: 'roomFront'}">房型介紹</RouterLink></li>
                            <li class="nav-item active"><a class="nav-link" href="gallery.html">商城</a></li>
                            <li class="nav-item"><a class="nav-link" href="elements.html">周邊景點介紹</a></li>
                            <li class="nav-item"><a class="nav-link" href="contact.html">租車服務</a></li>
                        </ul>
                    </div> 
                </nav>
            </div>
        </header>
    <RouterView></RouterView>
  </div>
</template>

<style lang="css" scoped>
nav a img {
  height: 50px;
}

.bg-header {
  background-color: #ecf0d6;
}
</style>
