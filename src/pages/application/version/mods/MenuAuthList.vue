<!--修改权限集合组件 -->
<template>
    <section>
        <el-row class="mgb10">
            <el-col :span="24">
                <div class="operating-bar">
                    <div class="operating-bar-r">
                        <el-input placeholder="权限编码/权限名称" v-model.trim="search.keywords" @keyup.enter.native="getList()" class="w200" size="small"></el-input>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="getList()">查询</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="17">
                <div class="mgb10">
                    <el-table :data="list" border stripe style="width: 100%" @selection-change="handleSelectionChange" ref="myTable" :height="350">
                        <el-table-column type="selection" width="45"></el-table-column>
                        <el-table-column prop="apiName" label="协议名称" width="120"></el-table-column>
                        <el-table-column prop="apiCode" label="协议编码"></el-table-column>
                    </el-table>
                </div>
                <div>
                    <yl-pagination :total="page.total" :pageSize.sync="page.pageSize" :currentPage.sync="page.pageIndex" @change="getList"></yl-pagination>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="my-card">
                    <div class="card-item" v-for="(item, index) in rightCodes" :key="index">
                        <el-button size="mini" class="right" type="text" @click="remove(item)">
                            <yl-icon icon="icon-tongyong-2"></yl-icon>
                        </el-button>
                        <span class="text">{{item}}</span>
                    </div>
                </div>
            </el-col>
        </el-row>

    </section>
</template>
<script>
const URL = {
    list: 'yhlo.brp.func.queryByApiParamVoAndPage'
};
let unique = (arr) => {
    let res = [];
    let json = {};
    for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
};
export default {
    data () {
        return {
            search: {
                keywords: ''
            },
            page: {
                total: 0,
                pageSize: 20,
                pageIndex: 1
            },
            leftCodes: [],
            tempCodes: [],
            // rightCodes:[],
            list: []
        };
    },
    props: {
        permissionCodes: {
            type: [Array]
        }
    },
    // 右侧选中的code 是由 传进组件的codes 和 本页列表 选中的nodes 组合的。
    computed: {
        rightCodes: function () {
            return unique(this.tempCodes.concat(this.leftCodes));
        }
    },
    methods: {
        getList (pageIndex = 1) {
            let param = {
                page: this.page,
                params: this.search
            };
            param.page.pageIndex = pageIndex;
            this.tempCodes = this.rightCodes.slice(0);

            this.Http(URL.list, param).then((result) => {
                let data = result.data,
                    checkedNodes;
                this.page.pageIndex = data.pageIndex;
                this.page.pageSize = data.pageSize;
                this.page.total = data.total;
                this.list = data.rows || [];
                checkedNodes = this.list.filter((item) => ~this.rightCodes.indexOf(item.apiCode));

                this.$nextTick(function () {
                    this._updateList(checkedNodes);
                });
            });
        },
        _updateList (checkedNodes) {
            checkedNodes.forEach(row => {
                this.tempCodes = this.tempCodes.filter(data => data !== row.apiCode);
                this.$refs.myTable.toggleRowSelection(row);
            });
        },
        // 改变选择的权限
        handleSelectionChange (val) {
            this.leftCodes = val.map(item => item.apiCode);
        },
        remove (item) { // 如果左侧选中，就从左侧驱动修改，如果左侧没有，就从右侧删除
            let checkedNodes = this.list.filter(data => data.apiCode === item);
            if (checkedNodes.length) {
                this._updateList(checkedNodes);
            } else {
                this.tempCodes = this.tempCodes.filter(data => data !== item);
            }
        }
    },
    created () {
        this.tempCodes = this.permissionCodes.slice(0);
    },
    mounted () {
        this.getList();
    },
    components: {}

};

</script>

<style lang="scss" scoped >
$h:350px;
.my-card {
    height: $h;
    overflow: auto;
    ::v-deep .el-card__body{
         padding: 5px;
    }
}

.card-item {
    border: solid 1px #eee;
    border-radius: 5px;
    padding: 2px 5px;
    margin-bottom: 5px;
    clear: both;
    overflow: auto;
    line-height: 30px;
    .text {
        padding-right: 10px;
    }
}
</style>
