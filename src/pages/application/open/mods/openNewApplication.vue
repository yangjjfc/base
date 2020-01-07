<template>
    <section>
        <yl-dialog title="开通应用" :show.sync="shows" width="1000px" hideSubmitButton>
            <div >
                <el-form :inline="true" label-width="100px" size="small" status-icon>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="企业名称：">{{data.enterpriseName}}</el-form-item>
                        </el-col>
                         <el-col :span="12">
                            <el-form-item label="主账号：">{{data.loginAccount}}</el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <el-row class="mgb5" :gutter="10">
                    <el-table :data="list" border stripe style="width: 100%">
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="releaseName" label="产品名称"></el-table-column>
                        <el-table-column prop="appCode" label="产品编码"></el-table-column>
                        <el-table-column prop="releaseVersion" label="版本名称"></el-table-column>
                        <el-table-column label="操作" width="100" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="handleOpenApplication(scope.row)">开通应用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </div>
        </yl-dialog>
    </section>
</template>

<script>
const URL = {
    detail: 'yhlo.brp.releaseAuth.getNotOpenReleaseByEnterpriseNo', // 通过企业编号查询企业应用详情
    saveBatch: 'yhlo.brp.releaseAuth.save' // 添加
};
export default {
    data () {
        return {
            form: { },
            change: {
                show: false,
                data: {}
            },
            list: []
        };
    },
    methods: {
        handleOpenApplication (row) {
            this.Http(URL.saveBatch, {
                params: {
                    releaseId: row.id,
                    enterpriseNo: this.data.enterpriseNo,
                    status: 'enabled'
                }
            }).then(res => {
                this.$message({
                    type: 'success',
                    message: '新的应用已经开通，请登录系统查看!'
                });
                this.$emit('update');
                this.shows = false;
            });
        },
        // 获取企业应用详情
        getDetail () {
            this.Http(URL.detail, {
                enterpriseNo: this.data.enterpriseNo
            }).then(res => {
                this.list = res.data;
            });
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
            default: () => ({})
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
    }
   
};
</script>

<style lang="scss" scoped>
</style>
