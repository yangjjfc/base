<template>
  <section class="main-content" :id="id">
    <!-- <keep-alive> -->
      <components :is="componentName"></components>
    <!-- </keep-alive> -->
  </section>
</template>
<script>
import Vue from 'vue';
import  {id} from './mountEv'

const _import = (file) => () => import(/* webpackChunkName: `[request][index]` */ `@/pages${file}/index.vue`); 
/* eslint-elable */

let reverseComponentName = (str) => str.replace(/(\/|\.)/g, '');
export default {
  data() {
    return {
      id,
      componentName: '',
      permissions: null
    };
  },
  watch: {
    $route(to, from) {
       console.log("TCL: $route -> to", to)
       if(to.path.startsWith('/base/')){
        this.initPermission();
      }
    }
  },
  methods: {
    _getBtnAuth(no, permissions) {
      this.buttons && this.buttons.forEach(item => {
        if (item.parentFuncNo === no) {
          permissions[item.funcCode] = item.funcName;
        }
      });
    },
    // 初始化按钮权限
    async initPermission() {
      let no = this.$route.meta.no || this.$route.query.$no,
        permissions = {},
        path = this.$route.meta.componentUrl;
      this._getBtnAuth(no, permissions);
      Vue.prototype.auth = permissions;
      console.log(permissions, '按钮权限');
      // 模块点击，直接用navPage组件
      if (this.$route.meta.leval === 2) {
        this.componentName = null;
        return;
      }
      path = /^\//.test(path) ? path : ('/' + path);
      if (!this.$route.name) {
        return;
      }
      let name = reverseComponentName(this.$route.name);
      let async = _import(path);
      async().then(com => {
        Vue.component(name, com.default);
        this.componentName = name;
      }, errors => {
        this.componentName = this.$root.$options.components.pageError;
        this.$message.error('模块地址加载失败,地址：' + path + '，具体错误：' + errors);
        console.error(errors);
      });
    }
  },
  created() {
    this.initPermission();
  },
  components: {
    Error
  }

};

</script>

<style lang="scss">
.app-main {
  padding: 0 10px;
  box-sizing: border-box;
}
</style>