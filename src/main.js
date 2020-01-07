import Vue from 'vue';
import App from './App.vue';
import singleSpaVue from 'single-spa-vue';
import router from './router';
import store from './store/index';
import { id, createMountIdAndMount, showIsId } from './mountEv';
Vue.config.productionTip = false;
let umountLock = false; // umount 锁死
createMountIdAndMount();
const vueLifecycles = singleSpaVue({
    Vue,
    appOptions: {
        el: '#' + id,
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

export const mount = () => umountLock ? Promise.resolve().then(_ => {
    showIsId();
}) : Promise.resolve().then(_ => {
    showIsId();
    vueLifecycles.mount({ domElement: 'null' });
});
export const unmount = () => Promise.resolve().then(_ => {
    umountLock = true;
});
export default vueLifecycles;