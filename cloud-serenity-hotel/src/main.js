import { createApp } from "vue";

import 'sweetalert2/dist/sweetalert2.min.css';

// 引入 Bootstrap 样式
import "bootstrap/dist/css/bootstrap.min.css";

// 可选：引入 Bootstrap JS（包括依赖的 Popper.js）
import "bootstrap/dist/js/bootstrap.bundle.min.js";

//bootstrap-icons
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import '@fortawesome/fontawesome-free/css/all.css'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi", // This is already the default value - only for display purposes
    },
});

app.use(vuetify);

app.mount("#app");
