<style scoped>
@import "@/assets/css/style.css";

/* 搜索框樣式，調整位置 */
.search-bar {
  text-align: center;
  max-width: 500px;
  margin: 20px auto 0 auto; /* 增加 margin-top，使其與內容分開 */
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