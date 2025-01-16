<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref, onMounted, reactive } from 'vue';

//國家列表api
fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
        const select = document.getElementById("country");
        data.sort((a, b) => a.name.common.localeCompare(b.name.common)); // 按國名排序
        data.forEach((country) => {
            const option = document.createElement("option");
            option.value = country.cca3; // 使用 ISO 3166-1 Alpha-3 代碼
            option.textContent = country.name.common; // 國家名稱
            if (country.cca3 === "TWN") {
                // 讓預設選中的選項是台灣
                option.selected = true;
            }
            select.appendChild(option);
        });
    })
    .catch((error) => console.error("Error fetching country data:", error));

$('#register').on('submit', function (e) {
    e.preventDefault(); // 防止表單預設提交行為

    // 獲取表單資料
    const registerData = {
        userName: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        member: {
            gender: $('#gender').val(),
            birthday: $('#birthday').val(),
            phone: $('#phone').val(),
            personalIdNo: $('#personal-id-no').val(),
            country: $('#country').val(),
            address: $('#address').val(),
            passportNo: $('#passport-no').val()
        }
    };

    // console.log(registerData);


    //發送請求給後端
    axios.post('http://localhost:8080/CloudSerenityHotel/user/register', registerData)
        .then(function (response) {
            // 彈出成功提示
            Swal.fire({
                title: '註冊成功',
                text: '將跳轉到登入頁面！',
                icon: 'success',
                allowOutsideClick: false,
                timer: 3000, // 設定 3 秒後自動關閉
                timerProgressBar: true, // 顯示倒數計時進度條
                didClose: () => {
                    // 跳轉到登入頁面
                    window.location.href = 'http://localhost:8080/CloudSerenityHotel/user/login';
                }
            });
        })
        .catch(function (error) {
            Swal.fire({
                title: '註冊失敗',
                text: '請稍後再試！',
                icon: 'error',
                allowOutsideClick: false
            });
        });
});

//一鍵帶入
$('#auto-keyin').on("click", (e) => {
    e.preventDefault();
    $('#name').val("王小明")
    $("#email").val("WangXiaoMing@mail.com")
    $("#password").val("J$6vul3au!6")
    $('#gender').val("Male")
    $('#birthday').val("1988-01-08")
    $('#phone').val("0911123245")
    $('#personal-id-no').val("A123456789")
    $('#country').val("TWN")
    $('#address').val("")
    $('#passport-no').val("")
})

//判斷身分別 移除必填屬性
addEventListener("load", (e) => {
    // console.log("load done");
    let id = $("#identity").val();
    if (id == "native") {
        //本國人無須護照號碼也可訂房入住
        $("#passport-no").removeAttr("required");
        $("#personal-id-no").attr("required", true);
        $(".per-sp").css("color", "red").text("*");
        $(".pass-sp").text("");
    } else {
        //外國人沒有身分證字號
        $("#personal-id-no").removeAttr("required");
        $("#passport-no").attr("required", true);
        $(".pass-sp").css("color", "red").text("*");
        $(".per-sp").text("");
    }
});
$("#identity").change((e) => {
    let id = $("#identity").val();
    if (id == "native") {
        //本國人無須護照號碼也可訂房入住
        $("#passport-no").removeAttr("required");
        $("#personal-id-no").attr("required", true);
        $(".per-sp").css("color", "red").text("*");
        $(".pass-sp").text("");
    } else {
        //外國人沒有身分證字號
        $("#personal-id-no").removeAttr("required");
        $("#passport-no").attr("required", true);
        $(".pass-sp").css("color", "red").text("*");
        $(".per-sp").text("");
    }
});

//email
$("#email").blur(function () {
    let email = $(this).val();

    if (email.length != 0) {
        axios.post('http://localhost:8080/CloudSerenityHotel/user/checkEmail', { email })
            .then(function (response) {
                console.log(response.data);

                if (response.data == "ok") {
                    $("#EmailMsg").html('<i class="fa-solid fa-circle-check"></i> 此Email可以使用').css("color", "green")
                } else {
                    $("#EmailMsg").html('<i class="fa-solid fa-circle-xmark"></i> 此Email已被使用').css("color", "#c70000")
                }
                $("#EmailMsg").css("visibility", "visible");
            })
            .catch(function (error) {
                console.log(error);
            })
    } else {
        $("#EmailMsg").html('<i class="fa-solid fa-circle-xmark"></i> Email不可為空白').css("color", "#c70000")
        $("#EmailMsg").css("visibility", "visible");
    }

});

//password 顯示開關
$("#checkEye").click(function () {
    if ($(this).hasClass('fa-eye')) {
        $("#password").attr('type', 'text');
    } else {
        $("#password").attr('type', 'password');
    }
    $(this).toggleClass('fa-eye').toggleClass('fa-eye-slash');
});

//password 檢查
$("#password").blur(function () {
    let content = $(this).val();
    let contentLength = $(this).val().length;
    let rule1 = new RegExp(/[a-z]/i);
    let rule2 = new RegExp(/[0-9]/);
    let rule3 = new RegExp(/[!@#$%^*]/);
    if (contentLength == 0) {
        $("#passwordMsg").html(
            '<i class="fa-solid fa-circle-xmark"></i> 密碼不可為空白');
        $("#passwordMsg").css("visibility", "visible");
    } else if (contentLength < 8) {
        $("#passwordMsg").html(
            '<i class="fa-solid fa-circle-xmark"></i> 密碼至少8個字');
        $("#passwordMsg").css("visibility", "visible");
    } else if (!rule1.test(content)) {
        $("#passwordMsg").html(
            '<i class="fa-solid fa-circle-xmark"></i> 密碼必須包含英文');
        $("#passwordMsg").css("visibility", "visible");
    } else if (!rule2.test(content)) {
        $("#passwordMsg").html(
            '<i class="fa-solid fa-circle-xmark"></i> 密碼必須包含數字');
        $("#passwordMsg").css("visibility", "visible");
    } else if (!rule3.test(content)) {
        $("#passwordMsg").html(
            '<i class="fa-solid fa-circle-xmark"></i> 密碼必須包含特殊字元!@#$%^*');
        $("#passwordMsg").css("visibility", "visible");
    } else {
        $("#passwordMsg").css("visibility", "hidden");
    }
});

// twId
$("#personal-id-no").blur(function () {
    let content = $(this).val();
    let result = validateTaiwanID(content);
    if (!result) {
        $("#twIdMsg").css("visibility", "visible");
    } else {
        $("#twIdMsg").css("visibility", "hidden");
    }
});

//身分證驗證器 by GPT
function validateTaiwanID(id) {
    // 檢查格式：英文字母開頭，接著9個數字
    const regex = /^[A-Z][0-9]{9}$/;
    if (!regex.test(id)) {
        return false;
    }

    // 字母對應數字表
    const letterMapping = {
        A: 10, B: 11, C: 12, D: 13, E: 14, F: 15,
        G: 16, H: 17, I: 34, J: 18, K: 19, L: 20,
        M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25,
        S: 26, T: 27, U: 28, V: 29, W: 32, X: 30,
        Y: 31, Z: 33,
    };

    // 將第一個字母轉換為數字並拆分成兩部分 ex:10 -> 1 0
    const firstChar = id[0];
    const numCode = letterMapping[firstChar];
    //第一個數字
    const firstDigit = Math.floor(numCode / 10);
    //第二個數字
    const secondDigit = numCode % 10;

    // 計算權重總和 乘數 1 9 8 7 6 5 4 3 2 1 1
    let sum = firstDigit + secondDigit * 9;
    for (let i = 1; i <= 8; i++) {
        sum += parseInt(id[i]) * (9 - i);
    }
    // 加上最後一位檢查碼
    sum += parseInt(id[9]);
    // 確認總和能被10整除
    return sum % 10 === 0;
}

</script>

<template>
    <div class="container mb-6">
        <h2 style="text-align: center; margin: 0">歡迎註冊</h2>
        <br />
        <label for="identity" class="form-label fs-5">身分別</label>
        <select class="form-select w-25" id="identity" required>
            <option selected value="native">本國人</option>
            <option value="foreigner">外國人</option>
        </select>
        <br />
        <h4 style="color: red; font-weight: bold;">標示 * 為必填欄位，本國人需必填 身分證字號 ，護照號碼則選填，外國人必填護照號碼!</h4>
        <form method="post" id="register" class="row">
            <!-- 左欄 -->
            <div class="col-md-6">
                <label for="email" class="form-label fs-5">電子信箱<span
                        style="color: red; font-weight: bold;">*</span></label>
                <input type="email" class="form-control" id="email" name="email" placeholder="請輸入電子信箱" required />
                <span id="EmailMsg" style="visibility: hidden"><i class="fa-solid fa-circle-xmark"></i></span>
                <br />

                <label for="password" class="form-label fs-5">密碼<span style="color: red; font-weight: bold;">*</span>
                    <button type="button" class="btn btn-warning mx-2" data-bs-container="body"
                        data-bs-toggle="collapse" data-bs-target="#collapsePassword" aria-expanded="false"
                        aria-controls="collapsePassword">
                        密碼規則
                    </button></label>
                <div class="collapse" id="collapsePassword">
                    <div class="mb-2">
                        至少8字,上限為64字,需有大小寫英文,數字,特殊字元!@#$%^*
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <input type="password" class="form-control" id="password" name="password" placeholder="請輸入密碼"
                            minlength="8" maxlength="64" required />
                    </div>
                    <div class="col-1">
                        <i id="checkEye" class="fa-solid fa-eye fa-lg"></i>
                    </div>
                </div>

                <span id="passwordMsg" style="visibility: hidden"><i class="fa-solid fa-circle-xmark"></i></span>
                <br />

                <label for="name" class="form-label fs-5">姓名<span
                        style="color: red; font-weight: bold;">*</span></label>
                <input type="text" class="form-control" id="name" name="name" placeholder="請輸入姓名" required />
                <br />

                <label for="gender" class="form-label fs-5">性別<span
                        style="color: red; font-weight: bold;">*</span></label>
                <select class="form-select" id="gender" name="gender" required>
                    <option value="Male">男</option>
                    <option value="Female">女</option>
                    <option value="Other">其他</option>
                </select>
                <br />

                <label for="birthday" class="form-label fs-5">生日<span
                        style="color: red; font-weight: bold;">*</span></label>
                <input type="date" class="form-control" id="birthday" name="birthday" required />
                <br />
            </div>

            <!-- 右欄 -->
            <div class="col-md-6">
                <label for="phone" class="form-label fs-5">行動電話<span
                        style="color: red; font-weight: bold;">*</span></label>
                <input type="tel" class="form-control" id="phone" name="phone" placeholder="請輸入行動電話" required />
                <br />

                <label for="personal-id-no" class="form-label fs-5">身分證字號<span class="per-sp"
                        style="font-weight: bold;"></span></label>
                <input type="text" class="form-control" id="personal-id-no" name="personal_id_no" placeholder="請輸入身分證字號"
                    required />
                <span id="twIdMsg" style="visibility: hidden"><i class="fa-solid fa-circle-xmark"></i> 身分證字號錯誤</span>
                <br />

                <label for="country" class="form-label fs-5">國家<span
                        style="color: red; font-weight: bold;">*</span></label>
                <select class="form-select" id="country" name="country" required></select>
                <br />

                <label for="passport-no" class="form-label fs-5">護照號碼<span class="pass-sp"
                        style="font-weight: bold;"></span></label>
                <input type="text" class="form-control" id="passport-no" name="passport_no" placeholder="請輸入護照號碼"
                    required />
                <br />
            </div>

            <!-- 地址獨立一行 -->
            <div class="col-12">
                <label for="address" class="form-label fs-5">聯絡地址<span
                        style="color: blue; font-weight: bold;">(選填)</span></label>
                <input type="text" class="form-control" id="address" name="address" minlength="10"
                    placeholder="請輸入地址" />
                <br />
            </div>

            <!-- 按鈕 -->
            <div class="col-12 text-center">
                <button type="submit" class="btn btn-primary btn-lg px-5 text-white">註冊</button>
                <button id="auto-keyin" class="btn btn-primary btn-lg px-5 text-white mx-2">一鍵帶入</button>
            </div>
        </form>
    </div>
</template>

<style lang="css" scoped></style>