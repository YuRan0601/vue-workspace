import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'sweetalert2/dist/sweetalert2.min.css';

// 引入 Bootstrap 样式
import "bootstrap/dist/css/bootstrap.min.css";
// 可选：引入 Bootstrap JS（包括依赖的 Popper.js）
import "bootstrap/dist/js/bootstrap.bundle.min.js";

//bootstrap-icons
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App.vue";

import { useRouter } from "vue-router";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css";
import customZhHant from "./assets/common/js/customZhHant";
import { VDateInput } from "vuetify/labs/VDateInput";
import '@fortawesome/fontawesome-free/css/all.css'


const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(({ store }) => {
    store.router = router;
})
app.use(pinia);
app.use(router);



const vuetify = createVuetify({
    components: {
        ...components,
        VDateInput,
    },
    directives,
    icons: {
        defaultSet: "mdi", // This is already the default value - only for display purposes
    },
    locale: {
        locale: "zhHant",
        messages: { zhHant: customZhHant },
    },
});

app.use(vuetify);

app.mount("#app");
