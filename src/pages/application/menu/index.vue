<!-- 应用中心 -> 菜单管理  -->
<template>
    <section class="container_setion application-menu">
        <div class="tree-box">
            <el-select v-model="collection.code" placeholder="请选择" size="small" @change="getData()">
                <el-option v-for="item in collection.selectList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
            <div class="tree-container mgt10">
                <el-scrollbar class="tree-scrollbar">
                    <el-tree :data="tree.data" node-key="no" :props="tree.defaultProps" :default-expanded-keys="defaultExpand" @node-click="handleClick" ref="myTree"
                             highlight-current :expand-on-click-node="false" @node-expand="expandNode" @node-collapse="collapseNode"></el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="list">
            <el-row>
                <el-col :span="24">
                    <el-button  type="primary" size="small" @click="add('add')" :disabled="this.tree.data.length==0" v-auth:BTN_BRP_PLATFORM_MENU_ADD>新增</el-button>
                    <div class="right searchBox">
                        <el-input placeholder="菜单编码/菜单名称" class="w200" size="small" v-model="keywords" @keyup.enter.native="getList()"></el-input>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
                    </div>
                </el-col>
                <el-col :span="24" class="mgt10" >
                    <el-table :data="list" border stripe style="width: 100%" size="mini" :height="tableHeight">
                        <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="funcName" label="菜单名称" min-width="150"></el-table-column>
                        <el-table-column prop="funcCode" label="菜单编码" min-width="120"></el-table-column>
                        <el-table-column label="菜单类型" width="100" align="center">
                            <template slot-scope="scope">
                                <div class="cell" v-html="scope.row.funcTypeX"></div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="funcUrl" label="菜单路径" min-width="180"></el-table-column>
                        <el-table-column label="菜单图标" min-width="80" align="center">
                            <template slot-scope="scope">
                                <yl-icon :icon="scope.row.funcIcon"></yl-icon>
                            </template>
                        </el-table-column>
                        <el-table-column prop="authModeX" label="授权模式" min-width="100" align="center"></el-table-column>
                        <el-table-column prop="operTime" label="创建时间" width="150" align="center"></el-table-column>
                        <el-table-column prop="orderNum" label="排序值" width="80" align="center"></el-table-column>
                        <el-table-column prop="operName" label="创建人" min-width="100" align="center"></el-table-column>
                        <el-table-column label="操作" width="120" align="center" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" @click="add('edit',scope.row)" v-auth:BTN_BRP_PLATFORM_MENU_UPDATE>编辑</el-button>
                                <el-button type="text" @click="del(scope.row.funcNo)" v-auth:BTN_BRP_PLATFORM_MENU_DEL>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="24" class="right mt10" v-show="page.total">
                    <pagination :total="page.total" :pageSize.sync="page.pageSize" :currentPage.sync="page.pageIndex" @change="getList"></pagination>
                </el-col>
                <el-col :span="24">
                    <div v-if="adds.show">
                        <add :form="adds.form"  :type="adds.type" :show.sync="adds.show" @change="getData"></add>
                    </div>
                </el-col>
            </el-row>
        </div>
    </section>
</template>
<script>
import Add from './mods/add';
import commonMix from '@/utils/mixins/commonMix';
const URL = {
    findList: 'yhlo.brp.application.findList',
    remove: 'yhlo.brp.func.remove',
    findListPage: 'yhlo.brp.func.findListPage', // 菜单分页查询
    funcTreeView: 'yhlo.brp.func.funcTreeView'
};
export default {
    mixins: [commonMix],
    data () {
        return {
            adds: {
                show: false, // 显示add状态
                form: {
                    permissionCodes: '',
                    funcCode: '',
                    funcName: '',
                    funcUrl: '',
                    funcType: '',
                    authMode: ''
                },
                type: 'add'
            },
            limitH: 30,
            collection: { // 应用集合
                code: '',
                selectList: []
            },
            tree: { // 树类型
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                checkNode: ''
            },
            page: { // 页码
                pageSize: 20,
                pageIndex: 1,
                total: 0
            },
            expandNods: ['.0.'], // 记录展开的节点
            defaultExpand: [], // 默认展开
            keywords: '', // 关键字
            list: [] // table 列表
        };
    },
    methods: {
        expandNode (node) {
            this.expandNods.push(node.no);
        },
        collapseNode (node) {
            this.expandNods = this.expandNods.filter(item => item !== node.no);
        },
        // 获取应用集合
        async getApplist () {
            return this.Http(URL.findList, { params: {} }).then((re) => {
                this.collection.code = re.data[0].code;
                this.collection.selectList = re.data;
            });
        },
        _setExpand (list, level) {
            let result = [],
                num = 0,
                traverse = (list, num) => {
                    if (num < level) {
                        list.forEach(item => {
                            result.push(item.no);
                            item.children && traverse(item.children, num + 1);
                        });
                    }
                };
            traverse(list, num);
            return result;
        },
        // 获取菜单tree
        async getMenu () {
            let as = await this.Http(URL.funcTreeView, { params: { appCode: this.collection.code, showAll: true, funcType: '' } }).then((re) => {
                this.tree.data = re.data;
                this.tree.checkNode = this.tree.checkNode || '.0.'; // 默认值
                this.defaultExpand = this.expandNods; // this._setExpand(this.tree.data, 1);
            });
            return as;
        },
        // 删除
        del (funcNo) {
            this.$confirm('确认要删除此菜单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.Http(URL.remove, {
                    funcNo: funcNo
                }).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getMenu().then(() => {
                        if (this.tree.checkNode) {
                            this.getList();
                        }
                    });
                });
            }).catch(() => {
            });
        },
        // 获取详情
        getList (pageIndex = this.page.pageIndex, pageSize = this.page.pageSize, node = this.tree.checkNode) {
            if (this.tree.data.length) {
                this.Http(URL.findListPage, {
                    params: {
                        keywords: this.keywords,
                        parentFuncNo: node,
                        appCode: this.collection.code
                    },
                    pageParams: {
                        pageSize: pageSize,
                        pageIndex: pageIndex
                    }
                }).then((res) => {
                    this.page.total = res.data.total;
                    this.page.pageIndex = res.data.pageIndex;
                    this.page.pageSize = res.data.pageSize;
                    if (res.data.rows) {
                        this.list = res.data.rows.map((item, index) => {
                            item.index = (this.page.pageIndex - 1) * this.page.pageSize + index + 1;
                            item.funcTypeX = this.formatData(item.funcType);
                            item.authModeX = this.formatData(item.authMode);
                            return item;
                        });
                    }
                });
            }
        },
        // 多用函数， 得到树的数据 或者添加树的节点
        async getData (addData) {
            // let appendData = (list, addItem) => {
            //     list.forEach(item => {
            //         item.children = item.children || [];
            //         item.children.length && appendData(item.children, addItem);
            //         if (item.no === addItem.parentNo) {
            //             item.children.unshift(addItem);
            //         }
            //     });
            // };
            /* if (addData) {
                    let addItem = {
                        label: addData.funcName,
                        no: addData.funcNo,
                        parentNo: addData.parentFuncNo
                    };
                    appendData(this.tree.data, addItem);
                } else {
                    await this.getMenu();
                } */
            await this.getMenu();
            this.$refs.myTree.setCurrentKey(this.tree.checkNode);
            if (this.tree.checkNode) {
                this.getList(1, 20);
            }
        },
        // tree check
        handleClick (data) {
            this.tree.checkNode = data.no;
            this.getList(1, 20, data.no);
        },
        // 格式化类型数据
        formatData (data) {
            let type = '';
            switch (data) {
            case 'MENU':
                type = '<span class="text-success">菜单</span>';
                break;
            case 'TABPAGE':
                type = '<span class="el-tag ">页</span>';
                break;
            case 'BUTTON':
                type = '<span class="text-info">按钮</span>';
                break;
            case '0':
                type = '需要授权可见';
                break;
            case '1':
                type = '无需授权可见';
                break;
            case '2':
                type = '仅管理员可见';
                break;
            default:
                break;
            }
            return type;
        },
        // 添加编辑
        async add (type, data) {
            this.adds.show = true;
            this.adds.type = type;
            if (type === 'add') { // 新增
                this.adds.form = {
                    treeData: this.tree.data,
                    funcUrl: '/',
                    authMode: '0',
                    orderNum: '',
                    pageTips: '',
                    funcType: 'MENU',
                    funcIcon: '',
                    appCode: this.collection.code,
                    permissionCodes: '',
                    parentFuncNo: this.tree.checkNode,
                    parentFunName: ''
                };
            } else { // 编辑
                let parentFunName = this.getParentName(this.tree.data, data.parentFuncNo);
                this.adds.form = { ...data, treeData: this.tree.data, parentFunName: parentFunName };
            }
        },
        // 获取parentName
        getParentName (data, parentFuncNo) {
            let name = '';
            for (let value of data) {
                if (value.no === parentFuncNo) {
                    name = value.label;
                    break;
                } else if (value.children && value.children.length) {
                    name = this.getParentName(value.children, parentFuncNo);
                    if (name) {
                        break;
                    }
                }
            }
            return name;
        }

    },
    mounted () {
        this.getApplist().then(() => {
            this.getData();
        });
    },
    components: {
        Add
    }
};
</script>

<style lang="scss">
    .application-menu {
        clear: both;
        overflow: hidden;
        .tree-box {
            width: 250px;
            padding: 10px;
            min-height: 300px;
            border: 1px #f4f4f4 solid;
            float: left;
        }
        .list {
            padding: 10px;
            margin-left: 250px;
        }
        .tree-container {
            .tree-scrollbar {
                width: 100%;
                .el-scrollbar__wrap {
                    max-height: 730px;
                }
            }
        }
    }
</style>
