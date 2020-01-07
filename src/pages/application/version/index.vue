<!-- 订单中心 -> 已审核订单 -->
<template>
    <section class="container_setion">
        <el-row>
            <el-row class="mgb10">
                <el-col :span="24">
                    <div class="operating-bar">
                        <div class="left">
                            <el-button type="primary" size="small" @click="open('add')" v-auth:VERSION_DEFINITION_RELEASE>发布</el-button>
                        </div>
                        <div class="operating-bar-r searchBox">
                            <el-input placeholder="应用编码/版本名称/URL地址" v-model.trim="params.keyWords" class="w200" size="small"></el-input>
                            <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="mgb10">
                <el-table :data="list" border stripe style="width: 100%">
                    <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column prop="appCode" label="应用编码"></el-table-column>
                    <el-table-column prop="releaseName" label="版本名称" min-width="150"></el-table-column>
                    <el-table-column prop="releaseUrl" label="URL地址" min-width="200"></el-table-column>
                    <el-table-column prop="releaseVersion" label="版本号" align="center" width="150"></el-table-column>
                    <el-table-column prop="operTime" label="创建时间" align="center" width="150"></el-table-column>
                    <el-table-column prop="operName" label="创建人" align="center" width="150"></el-table-column>
                    <el-table-column label="操作" width="200" header-align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="open('edit',scope.row)"  v-auth:BTN_BRP_PLATFORM_RELEASE_UPDATE>编辑</el-button>
                            <el-button type="text" @click="openSetAuth(scope.row)"  v-auth:BTN_BRP_PLATFORM_RELEASE_UPDATEMUNE>权限设置</el-button>
                            <el-button type="text" @click="del(scope.row)" v-auth:BTN_BRP_PLATFORM_RELEASE_DEL>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-row class="right ">
                <yl-pagination :total="pageParams.total" :pageSize.sync="pageParams.pageSize" :currentPage.sync="pageParams.pageIndex" @change="getList"></yl-pagination>
            </el-row>
        </el-row>
        <el-row>
            <div v-if="isOprate">
                <VersionAdd :show.sync="isOprate" :opt-type="opt.type"  :appList="appList" :formData="formData" @update="getList"></VersionAdd>
            </div>
            <div v-if="isAuth">
                <yl-dialog :title="opt.title" :show.sync="isAuth" width="1000px" @submit="updateAuth" :hide="editView == 'content'">
                    <div>
                        <!--<MenusTree :optType="opt.type" :formData="authSearch" ref="menusTree" v-show="editView == 'content'" @edit="showEditMenu"></MenusTree>-->
                        <div v-show="editView == 'content'">
                            <el-table :data="authTree" border stripe style="width: 100%" row-key="no">
                                <el-table-column prop="label" label="菜单名称" width="150"></el-table-column>
                                <el-table-column prop="funcCode" label="菜单编码"></el-table-column>
                                <el-table-column prop="funcTypeStr" label="菜单类型" min-width="60" align="center">
                                    <template slot-scope="scope">
                                        {{scope.row.funcType | typeFilter}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="funcUrl" label="菜单路径" min-width="150"></el-table-column>
                                <el-table-column prop="permissionCodes" label="权限集合" min-width="150"></el-table-column>
                                <el-table-column label="操作" width="60" header-align="center" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="showEditMenu(scope.row)" v-auth:BTN_BRP_PLATFORM_RELEASE_UPDATE>编辑</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <MenusEdit :formData="menuEditData" :permissionCodes="permissionCodes" :iconList="iconList" v-if="editView == 'menuEdit'" @returnList="returnAuthList"
                                   @showEditAuthList="showEditAuthList" ref="menusEdit"></MenusEdit>
                    </div>
                </yl-dialog>
            </div>
            <div v-if="isAuthList">
                <yl-dialog title="编辑权限" :show.sync="isAuthList" width="1000px" @submit="updateAuthList">
                    <MenuAuthList :permissionCodes.sync="permissionCodes" ref="menuAuthList"></MenuAuthList>
                </yl-dialog>
            </div>
        </el-row>
    </section>
</template>

<script>
import VersionAdd from './mods/VersionAdd.vue';
// import MenusTree from './mods/MenusTree.vue';
import MenusEdit from './mods/MenusEdit.vue';
import MenuAuthList from './mods/MenuAuthList.vue';
import { mapActions } from 'vuex';
const URL = {
    list: 'yhlo.brp.release.findListPage',
    add: 'yhlo.brp.release.save',
    update: 'yhlo.brp.release.update',
    remove: 'yhlo.brp.release.remove',
    save: 'yhlo.brp.releaseFun.save',
    get: '	yhlo.brp.releaseFun.get',
    appList: 'yhlo.brp.application.findList',
    includeTree: 'yhlo.brp.releaseFun.authTreeView'
};
export default {
    name: 'staffInfo',
    data () {
        return {
            opt: {
                type: 'add', // add 添加 ，edit 编辑 setAuth 权限设置
                title: '发布版本'
            },
            isOprate: false, // 是否显示新增
            isAuth: false, // 是否显示权限
            authSearch: {}, // 权限搜索条件
            permissionCodes: [], // 已选择权限集合
            isAuthList: false, // 是否显示权限列表
            editView: 'content', // menuEdit 两个slot 公用一个 模态框
            menuEditData: {
                permissionCodes: []
            },
            formData: {},
            appList: [], // 应用列表
            params: {
                keyWords: ''
            },
            iconList: [], // 图标列表
            pageParams: {
                total: 0,
                pageSize: 20,
                pageIndex: 1
            },
            value: '',
            iconsList: null,
            list: [],
            authTree: []
        };
    },
    filters: {
        typeFilter (str) {
            let name;
            switch (str) {
            case 'MENU':
                name = '菜单';
                break;
            case 'TABPAGE':
                name = '标签页';
                break;
            case 'BUTTON':
                name = '按钮';
                break;
            }
            return name;
        }
    },
    methods: {
        ...mapActions(['GetIcons']),
        open (type, row) {
            this.getAppList().then(() => {
                if (row) {
                    this.formData = row;
                } else {
                    this.formData = {};
                }
                this.opt.title = type === 'add' ? '发布版本' : '修改版本';
                this.opt.type = type;
                this.isOprate = true;
            });
        },

        // 删除
        del (row) {
            this.$confirm('确定删除该记录？', '提示').then(() => {
                this.Http(URL.remove, {
                    params: {
                        id: row.id
                    }
                }).then((result) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                });
            });
        },
        // 权限笔记
        openSetAuth (row) {
            this.opt = {
                title: '权限设置',
                type: 'setAuth'
            };
            this.authSearch = {
                appCode: row.appCode,
                releaseId: row.id
            };
            this.getAuthList();
            this.isAuth = true;
        },
        getAuthList () {
            this.Http(URL.includeTree, {
                params: this.authSearch
            }).then((result) => {
                let data = result.data;
                this.authTree = data;
            });
            this.editView = 'content';
        },
        // 获取应用列表
        getAppList () {
            if (this.appList.length) {
                return new Promise((resolve) => {
                    resolve(this.appList);
                });
            } else {
                return this.Http(URL.appList, {
                    params: {}
                }).then(result => {
                    this.appList = result.data || [];
                });
            }
        },
        // 获取列表
        getList (pageIndex = 1) {
            let param = {
                pageParams: this.pageParams,
                params: this.params
            };
            if (pageIndex) {
                param.pageParams.pageIndex = pageIndex;
            }
            this.Http(URL.list, param).then((result) => {
                let data = result.data;
                this.pageParams.pageIndex = data.pageIndex;
                this.pageParams.pageSize = data.pageSize;
                this.pageParams.total = data.total;
                this.list = data.rows || [];
                this.list.forEach((item, index) => {
                    item.index = (this.pageParams.pageIndex - 1) * this.pageParams.pageSize + index + 1;
                });
            });
        },
        // 显示 编辑菜单
        async showEditMenu (row) {
            await this.getIconsList();
            this.Http(URL.get, {
                params: Object.assign({
                    funcNo: row.no
                }, this.authSearch)
            }).then(result => {
                let data = result.data;
                data.permissionCodes = typeof data.permissionCodes === 'string' ? data.permissionCodes.split(',') : data.permissionCodes || [];
                // this.iconList = iconList;
                this.menuEditData = data;
                this.permissionCodes = data.permissionCodes;
                this.editView = 'menuEdit';
            }).catch(err => {
                console.log(err);
            });
        },
        // 返回权限列表
        returnAuthList () {
            this.editView = 'content';
            this.menuEditData = {
                permissionCodes: []
            };
        },
        // 更新权限
        updateAuth () {
            let child = this.$refs.menusEdit || {};
            let param = Object.assign({}, child.form);
            param.permissionCodes += '';
            if (this.editView === 'menuEdit') {
                child.$refs.form.validate((valid) => {
                    if (valid) {
                        this.Http(URL.save, {
                            params: param
                        }).then(result => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.getAuthList();
                            this.editView = 'content';
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            } else {
                this.isAuth = false;
            }
        },
        // 修改权限集合
        showEditAuthList (list) {
            this.isAuthList = true;
            this.funcNos = list;
            // this.getIconsList();
        },
        // 更新权限集合
        updateAuthList () {
            let child = this.$refs.menuAuthList;
            this.permissionCodes = child.rightCodes;
            this.isAuthList = false;
        },
        // 获取图标集合
        async getIconsList () {
            this.GetIcons().then(data => {
                this.iconList = data;
            });
        }
    },
    mounted () {
        this.getList();
    },
    components: {
        VersionAdd,
        MenusEdit,
        // MenusTree,
        MenuAuthList
    }
};
</script>

<style lang="scss" scoped>
    .operating-bar-r {
        text-align: right;
    }
</style>
