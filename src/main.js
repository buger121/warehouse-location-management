import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import axios from 'axios';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
axios.defaults.baseURL = '/api';
Vue.use(ElementUI);

// 注入全局样式
import './assets/public.scss';

new Vue({
  axios,
  store,
  render: (h) => h(App),
}).$mount('#app');
