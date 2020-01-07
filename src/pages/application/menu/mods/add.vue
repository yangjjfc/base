<template>
    <div>
        <el-dialog :title="(type === 'add' ? '添加菜单权限': '编辑菜单权限')" :visible.sync="shows" width="800px">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules" size="small" status-icon>
                <el-form-item label="上级菜单" prop="parentFuncNo">  <!--//:filterStrings.sync="form.parentFunName" -->

                    <TreeSelect v-if="type === 'add'" :options="form.treeData" :defaultExpandLevel="2"  v-model.trim="form.parentFuncNo"
                                 placeholder="上级菜单" :max-height="200" :normalizer="normalizer"></TreeSelect>
                    <el-input v-else v-model.trim="form.parentFunName" :disabled="type === 'edit'"></el-input>
                </el-form-item>
                <el-form-item label="菜单编码" prop="funcCode">
                    <el-input v-model.trim="form.funcCode" placeholder="菜单编码" :disabled="type === 'edit'"></el-input>
                </el-form-item>
                <el-form-item label="菜单名称" prop="funcName">
                    <el-input v-model.trim="form.funcName" placeholder="菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" prop="funcUrl">
                    <el-input v-model.trim="form.funcUrl" placeholder="菜单路径"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型" prop="funcType">
                    <el-select v-model="form.funcType" placeholder="菜单类型" readonly :disabled="type === 'edit'">
                        <el-option label="菜单" value="MENU"></el-option>
                        <el-option label="标签页" value="TABPAGE"></el-option>
                        <el-option label="按钮" value="BUTTON"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单Logo图标">
                    <el-select v-model="form.funcIcon" placeholder="菜单Logo图标" filterable >
                        <el-option v-for="item in iconLists" :value="item" :label="item" :key="item">
                            <span >
                                <yl-icon :icon="item" class="mgr10" style="width: 18px; height: 18px;"></yl-icon>
                                <span class="icon-txt">{{item}}</span>
                            </span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限集合" prop="permissionCodes" ref="permissionCodeDom">
                    <el-row>
                        <el-col :span="21">
                            <el-input type="textarea" v-model.trim="form.permissionCodes" placeholder="权限集合" readonly :maxlength="1000"></el-input>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="text" class="mgl10" @click="addAuth">添加权限</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="排序值" prop="orderNum">
                    <el-input-number v-model.trim="form.orderNum" :min="0" :max="9999"></el-input-number>
                </el-form-item>
                <el-form-item label="授权模式" prop="authMode">
                    <el-select v-model="form.authMode" placeholder="授权模式">
                        <el-option label="需要授权可见" value="0"></el-option>
                        <el-option label="无需授权可见" value="1"></el-option>
                        <el-option label="仅管理员可见" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="页面操作提示">
                    <el-input type="textarea" v-model.trim="form.pageTips"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="submitForm('form')">确 定</el-button>
                <el-button size="small" @click="shows = false">取 消</el-button>
            </span>
        </el-dialog>

        <yl-dialog :title="(type === 'add' ? '添加菜单权限': '编辑菜单权限')" :show.sync="showAuth" width="800px" @submit="updateAuthList">
            <MenuAuthList ref="menuAuthList" :permissionCodes="permissionCodes"></MenuAuthList>
        </yl-dialog>

    </div>
</template>

<script>
import { mapActions } from 'vuex';
/* import TreeSelect from '@/components/tree-select/tree'; */
import MenuAuthList from '@/pages/application/version/mods/MenuAuthList';
const URL = {
    add: 'yhlo.brp.func.save',
    edit: 'yhlo.brp.func.update'
};

export default {
    data () {
        return {
            showAuth: false, // 显示权限
            iconLists: [],
            normalizer (node) {
                if (node.children && !node.children.length) {
                    delete node.children;
                }
                return {
                    id: node.no,
                    label: node.label,
                    children: node.children
                };
            },
            rules: {
                parentFuncNo: [
                    { required: true, message: '请选择上级菜单', trigger: 'change' }
                ],
                funcCode: [
                    { required: true, message: '请输入菜单编码', trigger: 'blur' }
                ],
                funcName: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' }
                ],
                funcUrl: [
                    { required: true, message: '请输入菜单路径', trigger: 'blur' }
                ],
                funcType: [
                    { required: true, message: '请选择菜单类型', trigger: 'change' }
                ],
                /* funcIcon: [
                     { required: true, message: '请选择菜单Logo图标', trigger: 'change' }
                     ], */
                permissionCodes: [
                    { required: true, message: '请选择权限集合', trigger: 'blur' },
                    {
                        max: 1000, message: '长度不大得于1000', trigger: 'blur'
                    }
                ],
                authMode: [
                    { required: true, message: '请输入授权模式', trigger: 'blur' }
                ]
            }
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false,
            required: true
        },
        form: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            default: 'add',
            required: true
        }
    },
    methods: {
        ...mapActions(['GetIcons']),
        // 获取图标集合
        getIconsList () {
            this.GetIcons().then(data => {
                this.iconLists = data;
            });
        },
        // 提交
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Http((this.type === 'add' ? URL.add : URL.edit), {
                        params: this.form
                    }).then((res) => {
                        this.shows = false;
                        this.$message({
                            message: (this.type === 'add' ? '新增成功' : '修改成功'),
                            type: 'success'
                        });
                        this.$emit('change', res.data);
                    });
                } else {
                    return false;
                }
            });
        },
        // 显示权限
        addAuth () {
            this.showAuth = true;
        },
        // 更新权限集合
        updateAuthList () {
            let child = this.$refs.menuAuthList;
            this.form.permissionCodes = child.rightCodes.join(',');
            if (this.form.permissionCodes.length > 1000) {
                this.$message.warning('字符超长，请重新选择');
            }
            if (child.rightCodes.length) {
                this.$refs.permissionCodeDom.clearValidate();
            }
            this.showAuth = false;
        },
        // 下拉树校验
        selectChange () {
        }
    },
    created () {
        this.getIconsList();
    },
    computed: {
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue);
            }
        },
        // 权限传参
        permissionCodes: {
            get () {
                if (this.form.permissionCodes) {
                    return this.form.permissionCodes.split(',');
                } else {
                    return [];
                }
            }
        }
    },
    components: {
        MenuAuthList
    }
};
</script>
