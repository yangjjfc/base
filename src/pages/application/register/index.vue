<!-- 应用管理 -> 应用注册 -->
<template>
    <section class="container_setion">
        <el-row>
            <el-row class="mgb10">
                <el-col :span="24">
                    <el-button type="primary" size="small" @click="update('add')" v-auth:BTN_BRP_PLATFORM_APP_ADD>新增</el-button>
                    <div class="right searchBox">
                        <el-input placeholder="应用编码/应用名称" class="w200" size="small" v-model.trim="keywords" @keyup.enter.native="getList()"></el-input>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
                    </div>
                </el-col>
            </el-row>
            <div class="mgb10">
                <el-table :data="list" border stripe style="width: 100%" size="mini">
                    <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column prop="code" label="应用编码" min-width="80" align="center"></el-table-column>
                    <el-table-column prop="name" label="应用名称" min-width="150" align=""></el-table-column>
                    <el-table-column prop="appKey" label="AppKey" min-width="120" align=""></el-table-column>
                    <el-table-column prop="secretKey" label="SecretKey" min-width="120" align=""></el-table-column>
                    <el-table-column prop="operTime" label="创建时间" min-width="150" align="center"></el-table-column>
                    <el-table-column prop="operName" label="创建人" min-width="90" align="center"></el-table-column>
                    <el-table-column label="操作" width="120" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="update('edit', scope.row)" v-auth:BTN_BRP_PLATFORM_APP_UPDATE>编辑</el-button>
                            <el-button type="text" @click="del(scope.row.id)" v-auth:BTN_BRP_PLATFORM_APP_DEL>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-row class="right mt10">
                <pagination :total="pagination.total" :pageSize.sync="pagination.pageSize" :currentPage.sync="pagination.pageIndex" @change="getList"></pagination>
            </el-row>
        </el-row>

        <div v-if="dialogShow">
            <add-dialog :show.sync="dialogShow" :form="form" :type="dialogType" @change="getList"></add-dialog>
        </div>
    </section>
</template>
<script>
import AddDialog from './mods/add';

const URL = {
    list: 'yhlo.brp.application.findListPage',
    del: 'yhlo.brp.application.remove'
};

export default {
    name: 'staffInfo',
    data () {
        return {
            form: {},
            keywords: '',
            pagination: {
                total: 0,
                pageSize: 20,
                pageIndex: 1
            },
            dialogType: 'add',
            dialogShow: false,
            value: '',
            list: []
        };
    },
    methods: {
        update (type, rowData) {
            if (type === 'add') {
                this.form = {};
            } else {
                this.form = { ...rowData };
            }

            this.dialogType = type;
            this.dialogShow = true;
        },
        del (id) {
            this.$confirm('确认要删除此应用吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.Http(URL.del, {
                    id: id
                }).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                });
            }).catch(() => {
            });
        },
        getList (pageIndex = this.pagination.pageIndex, pageSize = this.pagination.pageSize) {
            this.Http(URL.list, {
                pageParams: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                },
                params: {
                    keywords: this.keywords
                }
            }).then((res) => {
                this.pagination.total = res.data.total;
                this.pagination.pageIndex = res.data.pageIndex;
                this.pagination.pageSize = res.data.pageSize;
                this.list = res.data.rows.map((item, index) => {
                    item.index = (this.pagination.pageIndex - 1) * this.pagination.pageSize + index + 1;
                    return item;
                });
            });
        }
    },
    mounted () {
        this.getList();
    },
    components: {
        AddDialog
    }
};
</script>

<style lang="scss" scoped>

</style>
