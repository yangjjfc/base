<template>
    <section class="container_setion">
        <!-- 已入驻企业列表 -->
        <el-row class="mgb10">
            <el-col :span="24">
                <div class="searchBox right">
                    <el-input placeholder="企业编号/企业名称" class="w300" size="small" v-model.trim="keywords" @keyup.enter.native="getList()"></el-input>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="getList(1)">查询</el-button>
                    <div class="spacer"></div>
                    <el-button size="small" @click="reverse">重置</el-button>
                </div>
            </el-col>
        </el-row>
        <div class="mgb10">
            <el-table :data="list" border stripe style="width: 100%">
                <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="enterpriseNo" label="企业编号" width="100"></el-table-column>
                <el-table-column prop="enterpriseName" label="企业名称"></el-table-column>
                <el-table-column prop="loginAccount" label="主账号" width="140"></el-table-column>
                <el-table-column prop="linkPhone" label="联系手机" width="105"></el-table-column>
                <el-table-column prop="openingApps" label="已开通应用"></el-table-column>
                <el-table-column prop="isOpened" label="开通状态" width="100" align="center">
                    <template slot-scope="scope">
                        <span :class="{'text-success': scope.row.isOpened === '已开通'}">{{scope.row.isOpened}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row)" v-auth:BTN_BRP_PLATFORM_RELEASE_AUTH_OPEN>处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-row class="right ">
            <yl-pagination :total="page.total" :pageSize.sync="page.pageSize" :currentPage.sync="page.pageIndex" @change="getList"></yl-pagination>
        </el-row>
        <div v-if="application.show">
            <add-application :show.sync="application.show" :data="application.data" @update="getList"></add-application>
        </div>
    </section>
</template>
<script>
import AddApplication from './mods/AddApplication.vue';

const URL = {
    list: 'yhlo.brp.enterprisePlatform.findPageForOpenAppList'
};
export default {
    name: '',
    data () {
        return {
            keywords: '',
            page: {
                pageIndex: 1,
                pageSize: 20,
                total: 0
            },
            list: [],
            application: {
                show: false,
                data: {}
            }
          
        };
    },
    methods: {
        edit (row) {
            this.application.show = true;
            this.application.data = row;
        },
        // 获取员工列表
        getList (pageIndex = this.page.pageIndex, pageSize = this.page.pageSize) {
            this.Http(URL.list, {
                params: {
                    keywords: this.keywords
                },
                pageParams: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                }
            }).then((res) => {
                this.page.total = res.data.total;
                this.page.pageIndex = res.data.pageIndex;
                this.page.pageSize = res.data.pageSize;
                if (res.data.rows) {
                    this.list = res.data.rows.map((item, index) => {
                        item.index = (this.page.pageIndex - 1) * this.page.pageSize + index + 1;
                        return item;
                    });
                }
            });
        },
        reverse () {
            this.keywords = '';
            this.getList(1);
        }
    },
    created () {
        let query = this.$route.query;
        if (query.enterpriseNo) {
            this.edit(this.$route.query);
        }
    },
    mounted () {
        this.getList();
    },
    components: {
        AddApplication
    }
};

</script>
<style lang="scss" scoped>
    .operating-bar {
        height: 32px;
    }

</style>
