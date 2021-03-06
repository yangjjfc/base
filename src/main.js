import Vue from 'vue';
import App from './App.vue';
import singleSpaVue from 'single-spa-vue';
import router from './router';
import store from './store/index';
Vue.config.productionTip = false;

const vueLifecycles = singleSpaVue({
    Vue,
    appOptions: {
        el: '#main-empty',
        render: h => h(App),
        router,
        store
    }
});

export const bootstrap = (props) => {
    // 在这里注册全局模块
    store.registerModule('global', props.store);
    return vueLifecycles.bootstrap(props);
};

export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;

export default vueLifecycles;