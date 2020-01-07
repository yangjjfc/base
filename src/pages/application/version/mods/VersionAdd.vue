<template>
    <yl-dialog :title="optType == 'add' ? '新增版本' : '编辑版本'" :show.sync="shows" width="800px" @submit="save">
        <div class="versionAdd" ref="bindForm">
            <el-form :model="myForm" :rules="rules" ref="myForm" size="small" label-width="100px" class="demo-ruleForm" :inline="true">
                <el-form-item label="选择应用" prop="appCode">
                    <el-select v-model.trim="myForm.appCode" placeholder="请选择" size="small"  @change="getList">
                        <el-option v-for="item in appList" :label="item.name" :value="item.code" :key="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本名称" prop="releaseName">
                    <el-input v-model.trim="myForm.releaseName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="URL地址" prop="releaseUrl">
                    <el-input v-model.trim="myForm.releaseUrl" size="small"></el-input>
                </el-form-item>
                <el-form-item label="版本号" prop="releaseVersion">
                    <el-input v-model.trim="myForm.releaseVersion" size="small"></el-input>
                </el-form-item>
                <el-form-item label="权限设置" class="full">
                    <MenusTree :list.sync="treeList"></MenusTree>
                </el-form-item>
            </el-form>
        </div>
    </yl-dialog>
</template>
<script>
import MenusTree from './MenusTree.vue';
const URL = {
    allTree: 'yhlo.brp.releaseFun.releaseFuncTreeCheckView',
    // includeTree: 'yhlo.brp.releaseFun.authTreeView',
    add: 'yhlo.brp.release.save',
    update: 'yhlo.brp.release.update'
};
export default {

    data () {
        return {
            myForm: {
                appCode: '',
                releaseName: '',
                releaseUrl: '',
                funcNos: [],
                releaseVersion: ''
            },
            treeList: [],
            rules: {
                appCode: [
                    { required: true, message: '请选择应用', trigger: 'blur' }
                ],
                releaseName: [
                    { required: true, message: '版本名称必填', trigger: 'blur' }
                ],
                releaseUrl: [
                    { required: true, message: 'url必填', trigger: 'blur' }
                ],
                releaseVersion: [
                    { required: true, message: '版本号必填', trigger: 'blur' }
                ]
            }
        };
    },
    props: {
        show: {
            type: Boolean
        },
        // 编辑时传的数据
        formData: {
            type: Object
        },
        appList: {
            type: Array
        },
        optType: {
            type: String
        }

    },
    computed: {
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue);
            }
        }
    },
    methods: {
        // 获取树
        getList () {
            let param = { appCode: this.myForm.appCode, releaseId: this.myForm.releaseId };
            // param.showAll = true;
            this.Http(URL.allTree, {
                params: param
            }).then((result) => {
                let data = result.data;
                this.treeList = data;
                // this.treeList =
                // let checkedNos = this.traverseCheckds(this.treeConfig.rows);
            });
        },
        traverseCheckds (list, isAllNodes, result = []) {
            list.forEach(item => {
                if (isAllNodes) {
                    result.push(item.no);
                } else {
                    item.checked && result.push(item.no);
                }
                item.children && this.traverseCheckds(item.children, isAllNodes, result);
            });
            return result;
        },
        _getCheckedList (list, checkeds) {
            list.forEach(item => {
                item.checked && checkeds.push(item.no);
                item.children && this._getCheckedList(item.children, checkeds);
            });
        },
        // 发布
        save () {
            this.myForm.funcNos = [];
            this._getCheckedList(this.treeList, this.myForm.funcNos);
            let add = () => {
                    this.Http(URL.add, { params: this.myForm }).then((result) => {
                        this.$message({
                            message: '创建成功',
                            type: 'success'
                        });
                        this.shows = false;
                        this.$emit('update');
                    }, () => {

                    });
                },
                update = () => {
                    this.Http(URL.update, { params: this.myForm }).then((result) => {
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        });
                        this.shows = false;
                        this.$emit('update');
                    }, () => {

                    });
                };
            this.$refs.myForm.validate((valid) => {
                if (valid) {
                    if (this.myForm.id) {
                        update();
                    } else {
                        add();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    created () {
        if (this.formData) {
            Object.assign(this.myForm, this.formData);
            this.myForm.releaseId = this.myForm.id;
        }
        this.optType === 'edit' && this.getList();
    },
    components: {
        MenusTree
    }

};

</script>

<style lang="scss" >
    .versionAdd {
        .el-form-item.full{
            width: 100%;
            .el-form-item__content{
                width: 85%;
            }
        }
    }
</style>
