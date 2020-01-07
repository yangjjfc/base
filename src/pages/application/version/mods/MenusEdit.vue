<!--修改菜单-->
<template>
    <section>
        <div class="menu-title">
            <el-button size="small" type="primary" @click="returnList">返回</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules" size="small">
            <el-form-item label="上级菜单">
                <el-input v-model.trim="form.parentFuncName" disabled size="small"></el-input>
            </el-form-item>
            <el-form-item label="菜单编码">
                <el-input v-model.trim="form.funcCode" disabled size="small"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称" prop="funcName">
                <el-input v-model.trim="form.funcName"></el-input>
            </el-form-item>
            <el-form-item label="菜单类型" prop="funcType">
                <el-select v-model="form.funcType" placeholder="" disabled size="small">
                    <el-option label="菜单" value="MENU"></el-option>
                    <el-option label="标签页" value="TABPAGE"></el-option>
                    <el-option label="按钮" value="BUTTON"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="菜单路径">
                <el-input v-model.trim="form.funcUrl"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" >
                <el-select v-model="form.funcIcon" placeholder="" size="small">
                    <el-option label="菜单" v-for="item in iconList" :value="item" :key="item">
                        <span>
                            <yl-icon class="" :icon="item"></yl-icon>
                            <span class="icon-txt">{{item}}</span>
                        </span>
                    </el-option>
                </el-select>

                <!--<i class="iconfont" :class="form.funcIcon"></i>-->
            </el-form-item>
            <el-form-item label="权限集合" >
                <el-row :gutter="5">
                    <el-col :span="19">
                        <el-card class="box-card">
                            <span>{{form.permissionCodes + ''}}</span>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="small" @click="showEditAuthList">修改权限</el-button>
                    </el-col>
                </el-row>

            </el-form-item>
            <el-form-item label="授权模式" prop="authMode">
                <el-select v-model="form.authMode" placeholder="请选择授权模式">
                    <el-option label="需要授权可见" value="0"></el-option>
                    <el-option label="无需授权可见" value="1"></el-option>
                    <el-option label="仅管理员可见" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="页面操作提示">
                <el-input type="textarea" v-model.trim="form.pageTips"></el-input>
            </el-form-item>
            <el-form-item label="排序值">
                <el-input-number v-model.trim="form.orderNum" :min="0" :max="9999"></el-input-number>
            </el-form-item>

        </el-form>
    </section>
</template>
<script>
export default {
    data () {
        return {
            form: {
                parentFuncName: '',
                funcCode: '',
                funcName: '',
                funcType: '',
                funcIcon: '',
                funcUrl: '',
                permissionCodes: [],
                orderNum: '',
                pageTips: '',
                authMode: ''
            },
            rules: {
                funcName: [
                    { required: true, message: '菜单名称必填', trigger: 'change' }
                ],
                funcType: [
                    { required: true, message: '请选择菜单类型', trigger: 'change' }
                ],
                authMode: [
                    { required: true, message: '请选择授权模式', trigger: 'change' }
                ]
            }
        };
    },
    props: {
        formData: {
            type: Object,
            required: true
        },
        iconList: {
            type: Array
        },
        permissionCodes: {
            type: [Array, String]
        }
    },
    methods: {  
        returnList () {
            this.$emit('returnList');
        },
        showEditAuthList () {
            this.$emit('showEditAuthList', this.form.permissionCodes);
        }

    },
    watch: {
        permissionCodes: {
            deep: true,
            handler: function (val, oldVal) {
                this.form.permissionCodes = val;
            }
        }
    },
    created () {
        Object.assign(this.form, this.formData);
    },
    components: {}

};

</script>

<style lang="scss" scoped>
    .icon-txt{
        padding-left: 5px;
    }
    .menu-title{
        margin-bottom: 10px;
        text-align: right;
    }
</style>
