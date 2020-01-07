<template>
    <el-dialog :title="(type === 'add' ? '新增应用': '编辑应用')" :visible.sync="shows" width="30%">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules" size="small" status-icon>
            <el-form-item label="应用编码" prop="code">
                <el-input v-model.trim="form.code" :disabled="(type === 'add' ? false: true)" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="应用名称" prop="name">
                <el-input v-model.trim="form.name" :maxlength="20"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="submitForm('form')">确 定</el-button>
            <el-button size="small" @click="shows = false">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { emitter } from 'ycloud-ui';
const URL = {
    checkCode: 'yhlo.brp.application.validateCodeOnly',
    checkName: 'yhlo.brp.application.validateNameOnly',
    checkNameUpdate: 'yhlo.brp.application.validateOnlyForUpdate',
    add: 'yhlo.brp.application.save',
    edit: 'yhlo.brp.application.update'
};

export default {
    mixins: [emitter],
    data () {
        return {
            code: [
                { required: true, message: '请输入应用编码', trigger: 'blur' },
                {
                    validator: this.formValid,
                    trigger: 'blur',
                    message: '应用编码已存在',
                    url: URL.checkCode,
                    params () {
                        return {
                            code: this.form.code
                        };
                    }
                }
            ],
            rules: {
                name: [
                    { required: true, message: '请输入应用名称', trigger: 'blur' },
                    {
                        validator: this.formValid,
                        trigger: 'blur',
                        message: '应用名称已存在',
                        url: (this.type === 'add' ? URL.checkName : URL.checkNameUpdate),
                        params () {
                            if (this.type === 'add') {
                                return { name: this.form.name };
                            } else {
                                return { 
                                    id: this.form.id,
                                    name: this.form.name
                                };
                            }
                        }
                    }
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
            default: () => ({}),
            required: true
        },
        type: {
            type: String,
            default: 'add',
            required: true
        }
    },
    methods: {
        async submitForm (formName) {
            if (this.validating) {
                await this.validating;
            }       
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Http((this.type === 'add' ? URL.add : URL.edit), {
                        params: {
                            id: this.form.id,
                            code: this.form.code,
                            name: this.form.name
                        }
                    }).then((res) => {
                        this.shows = false;
                        this.$message({
                            message: (this.type === 'add' ? '新增成功' : '修改成功'),
                            type: 'success'
                        });
                        this.$emit('change');
                    });
                } else {
                    return false;
                }
            });
        }
    },
    mounted () {
        if (this.type === 'add') {
            this.rules.code = this.code;
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
    }
};
</script>
