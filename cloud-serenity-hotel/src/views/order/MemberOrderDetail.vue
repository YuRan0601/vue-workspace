<script setup>

</script>

<template>
    <div>
        <h2>訂單明細</h2>
        <div class="order-summary">
            <h2>訂單詳情</h2>
            <div class="order-info">
                <p><strong>訂單編號：</strong>1</p>
                <p><strong>狀態：</strong>處理中</p>
            </div>
            <div class="order-items">
                <h3>商品清單：</h3>
                <ul>
                    <li>
                        <span>心連禮盒（1 件）</span>
                        <span>原價：<s>$1,200</s>，特價：$999</span>
                    </li>
                    <li>
                        <span>雲新禮盒（1 件）</span>
                        <span>原價：<s>$950</s>，特價：$850</span>
                    </li>
                </ul>
            </div>
            <div class="price-summary">
                <p><strong>小計：</strong>$2,150</p>
                <p><strong>折扣金額：</strong>- $301</p>
                <p><strong>總金額：</strong>$1,849</p>
            </div>
            <div class="recipient-info">
                <h3>收件人資訊：</h3>
                <p><strong>收件人：</strong>John</p>
                <p><strong>地址：</strong>台北市</p>
                <p><strong>電話：</strong>0912345678</p>
            </div>
        </div>
        <!-- 按鈕區 -->
        <div class="d-flex justify-content-between align-items-center mt-5 mb-4 py-3 border-top">
            <!-- 返回按鈕 -->
            <RouterLink :to="{ name: 'orderList' }" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> 返回
            </RouterLink>
        </div>
    </div>
</template>

<style lang="css" scoped>
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f7f7f7;
}

.order-summary {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.order-summary h2 {
    text-align: center;
    color: #333333;
    margin-bottom: 20px;
}

.order-info,
.price-summary,
.recipient-info {
    margin-bottom: 20px;
}

.order-items ul {
    list-style: none;
    padding: 0;
}

.order-items li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 0;
}

.order-items li span {
    display: inline-block;
}

.price-summary p,
.recipient-info p {
    margin: 5px 0;
}

strong {
    color: #333333;
}

s {
    color: #999999;
}

@media (max-width: 768px) {
    .order-summary {
        padding: 15px;
    }

    .order-items li {
        flex-direction: column;
        align-items: flex-start;
    }

    .order-items li span {
        margin-bottom: 5px;
    }
}


/* 讓邊界更清晰 */
.border-top {
    border-top: 1px solid #ddd;
    /* 添加一條淡灰色的頂部邊框 */
}
</style>