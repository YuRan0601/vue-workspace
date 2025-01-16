<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref, onMounted, reactive } from 'vue';


function showErrorMsg(msg) {
    if (msg.length > 0) { // 如果訊息不為空，顯示錯誤訊息
        $('#errormsg').text(msg);
        $('#errorMessage').css('visibility', 'visible');
    } else { // 如果沒有訊息，隱藏錯誤訊息
        $('#errorMessage').css('visibility', 'hidden');
    }
}

//password 顯示開關
$("#pass-hidden").on("change", function () {
    if (this.checked) {
        $("#password").attr('type', 'text');
    } else {
        $("#password").attr('type', 'password');
    }
});

//一鍵登入
$('#admin').on("click", (e) => {
    e.preventDefault();
    $("#email").val("CSH_AD@mail.com")
    $("#password").val("aDmin@01")
})
$('#member').on("click", (e) => {
    e.preventDefault();
    $("#email").val("Linsansan@mail.com")
    $("#password").val("Lin33#033")
})

$('#login').on('submit', function (e) {
    e.preventDefault(); // 防止表單預設提交行為

    // 獲取表單資料
    const loginData = {
        email: $('#email').val(),
        password: $('#password').val()
    };

    //發送請求給後端
    axios.post('http://localhost:8080/CloudSerenityHotel/user/checklogin', loginData)
        .then(function (response) {
            console.log(response.data);
            let data = response.data
            if (data == "admin") {
                window.location.href = 'http://localhost:8080/CloudSerenityHotel/static/common/adminPage.html';
            } else if (data == "member") {
                window.location.href = 'http://localhost:8080/CloudSerenityHotel/static/user/protected/userDashboard.html';
            }
        })
        .catch(function (error) {
            showErrorMsg(error.response.data);
        });
});

</script>

<template>
    <div class="login container">
        <form class="loginform" id="login" method="post">
            <h2 style='text-align: center; margin: 0;'>歡迎登入</h2>
            <br>
            <label for="email" class="form-label fs-5">電子信箱</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="請輸入電子信箱" required />
            <br>
            <label for="password" class="form-label fs-5">密碼</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="請輸入密碼" minlength="8"
                maxlength="64" required />
            <input type="checkbox" class="my-3" id="pass-hidden"> 顯示密碼</input>
            <br>
            <div class="d-grid gap-2 mx-auto">
                <button type="submit" class="btn btn-primary">登入</button>
            </div>
            <div class="row mt-2">
                <!-- 一鍵登入 -->
                <div class="col-2"><button id="admin" class="btn btn-outline-dark bg-white text-dark"><i
                            class="fa-solid fa-user-tie"></i></button>
                </div>
                <div class="col-2"><button id="member" class="btn btn-outline-dark bg-white text-dark"><i
                            class="fa-solid fa-user"></i></button>
                </div>
            </div>
            <p id="errorMessage" class="pt-2">
                <i class="fa-solid fa-circle-xmark"></i>
                <span id="errormsg"></span>
            </p>
            <p style='text-align: center; margin: 0;'>
                沒有帳號? <a href="/CloudSerenityHotel/user/register">立即註冊</a>
            </p>
        </form>
    </div>
</template>

<style lang="css" scoped>
.login {
    margin: auto;
    padding: 50px 0;
    display: flex;
    justify-content: center;
}

.loginform {
    padding: 35px 35px;
    width: 400px;
    display: block;
    border-radius: 50px;
    background-color: skyblue;
}

.nav-bgc {
    background-color: lightblue;
}

#errorMessage {
    margin: 0;
    color: #c70000;
    font-weight: bold;
    visibility: hidden;
    text-align: center;
}
</style>