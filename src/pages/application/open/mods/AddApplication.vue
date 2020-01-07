<template>
    <section>
        <yl-dialog title="企业开通应用" :show.sync="shows" width="1000px" hideSubmitButton>
            <div >
                <el-form :inline="true" label-width="100px" size="small" status-icon>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="企业名称：">{{data.enterpriseName}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="企业编号：">{{data.enterpriseNo}}</el-form-item>
                        </el-col>
                         <el-col :span="12">
                            <el-form-item label="主账号：">{{data.loginAccount}}</el-form-item>
                        </el-col>
                         <el-col :span="12">
                            <el-form-item  class="right">
                                <el-button type="primary" @click="handleNewApplication">开通新应用</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row class="mgb5" :gutter="10">
                    <el-table :data="list" border stripe style="width: 100%">
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="releaseName" label="应用名称"></el-table-column>
                        <el-table-column prop="appCode" label="应用编码"></el-table-column>
                        <el-table-column prop="releaseVersion" label="版本名称"></el-table-column>
                        <el-table-column prop="status" label="当前状态" width="80" align="center">
                            <template slot-scope="scope">
                                <span :class="{'text-success': scope.row.status === 'enabled'}">{{status[scope.row.status]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140" align="center" >
                            <template slot-scope="scope">
                                <el-button type="text" v-if="scope.row.status === 'enabled'" @click="handleChangeStatus(scope.row,'disabled')">停用</el-button>
                                <el-button type="text" v-else @click="handleChangeStatus(scope.row,'enabled')">启用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </div>
        </yl-dialog>
        <open-new-application v-if="open.show" :show.sync="open.show" :data="open.data" @update="eventUpdate"></open-new-application>
    </section>
</template>

<script>
import openNewApplication from './openNewApplication';
const URL = {
    detail: 'yhlo.brp.releaseAuth.getOpenReleaseByEnterpriseNo', // 通过企业编号查询企业应用详情
    changeReleaseStatus: 'yhlo.brp.releaseAuth.update'// 启用禁用
};
let status = {
    'enabled': '启用',
    'disabled': '禁用',
    'draft': '草稿'
};
export default {
    data () {
        return {
            status,
            form: {},
            open: {
                show: false,
                data: { }
            },
            list: []
        };
    },
    methods: {
        // 更新
        eventUpdate () {
            this.$emit('update');
            this.getDetail();
        },
        // 启用禁用
        handleChangeStatus (row, status) {
            this.Http(URL.changeReleaseStatus, {
                params: {
                    enterpriseNo: this.data.enterpriseNo,
                    releaseId: row.id,
                    status
                }
               
            }).then(res => {
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.eventUpdate();
            });
        },
       
        // 获取企业应用详情
        getDetail () {
            this.Http(URL.detail, {
                ignoreRepeat: true,
                enterpriseNo: this.data.enterpriseNo
            }).then(res => {
                this.list = res.data;
            });
        },
        // 开通新应用
        handleNewApplication () {
            this.open.data = this.data;
            this.open.show = true;
        }
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        data: {
            type: Object,
            required: true
        }
    },
    computed: {
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue); // 更新父组件shows
            }
        }
    },
    created () {
        this.getDetail();
    },
    mounted () {
    },
    components: {
        openNewApplication
    }
};
</script>

<style lang="scss" scoped>
    .batch-btns{
        padding-top: 100px;
        text-align: center;
        .batch-btn{
            display: initial;
        }
    }
</style>
