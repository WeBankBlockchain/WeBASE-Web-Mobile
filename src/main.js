import { createApp } from "vue";
import App from "./App.vue";

import 'normalize.css/normalize.css'

import router from "./router";
import store from "./store";
import Vant from "vant";
import "vant/lib/index.css";
import 'amfe-flexible/index';


/*iconfont*/
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont.js'
import '@/assets/icon/iconfont_webaas.css'

// import '@/styles/index.css'
createApp(App)
    .use(store)
    .use(router)
    .use(Vant)
    .mount("#app");
