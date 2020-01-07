<!--菜单数展示-->
<template>
    <div class="model-auth">
        <el-table :data="tableData" border stripe style="width: 100%" size="mini" :span-method="objectSpanMethod"
                  row-key="no" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
            <!--<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>-->
            <el-table-column prop="" label="一级菜单" width="150" align="">
                <template slot-scope="scope">
                    <el-checkbox :disabled="disabled" v-model="scope.row.modelChecked" :true-label="2" :false-label="0" @change="correlation(scope.row, 'model')" :indeterminate="scope.row.modelChecked == 1">
                        {{scope.row.modelName}}
                    </el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="" label="二级菜单" width="150">
                <template slot-scope="scope">
                    <el-checkbox :disabled="disabled" v-model="scope.row.funcChecked" :true-label="2" :false-label="0" @change="correlation(scope.row, 'func')" :indeterminate="scope.row.funcChecked == 1">
                        {{scope.row.name}}
                    </el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="功能类型">
                <template slot-scope="scope">
                    <div class="my-group">
                        <el-checkbox-group v-model="scope.row.buttons" @change="correlation(scope.row, 'button')" :disabled="disabled">
                            <el-checkbox v-for="city in scope.row.child" :label="city" :key="city.no" :indeterminate="city.half">{{city.label}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>

export default {

    data () {
        return {
            checkeds: [],
            tableData: [
                /* {
                            modelName: '',
                            modelId: '',
                            name: '',
                            no: '',
                            modelChecked: false,
                            funcChecked: false,
                            buttons: []
                        } */
            ],
            spanArr: [],
            pos: ''
        };
    },
    props: {
        list: {
            type: Array
        },
        disabled: Boolean
    },
    watch: {
        'list' (newVal, oldVal) {
            // console.log(oldVal);
            this.unfoldTree();
        }
    },
    methods: {
        // 保存旧数据
        saveOldData (list, checkeds) {
            list.forEach(item => {
                item.checked = checkeds.includes(item.no);
                item.children && this.saveOldData(item.children, checkeds);
            });
        },
        // 获取被选中的元素
        getCheckedNo () {
            let checkeds = [];
            this.tableData.forEach(item => {
                item.modelChecked > 0 && checkeds.push(item.modelId);
                item.funcChecked > 0 && checkeds.push(item.funcId);
                checkeds = checkeds.concat(item.buttons.map(data => data.no));
            });
            return checkeds;
        },
        // 展开数据
        unfoldTree () {
            this.tableData = [];
            this.list.forEach(item => {
                item.children = item.children || [];
                if (item.children.length) {
                    item.children.forEach(data => {
                        let node = {
                            modelName: item.label,
                            modelId: item.no, // 整棵树的唯一值
                            funcId: data.no,
                            name: data.label,
                            modelChecked: item.checked ? 2 : 0,
                            funcChecked: data.checked ? 2 : 0,
                            buttons: data.children ? data.children.filter(temp => temp.checked) : [],
                            meta: {
                                modelNo: item.no,
                                funcNo: data.no
                            },
                            child: data.children || []
                        };
                        this.tableData.push(node);
                    });
                } else {
                    console.log(item.label + '菜单下没有二级菜单');
                }
            });
            // 去遍历表格数据，每一行菜单和模块选中状态
            this.tableData.forEach(item => {
                this.setParentsStatus(item);
            });
            // console.log(this.tableData);
            this.getSpanArr(this.tableData);
        },
        // 关联父节点的状态
        setParentsStatus (row) {
            let isHalfCheck = row.buttons.length > 0;
            let isAllCheck = row.child.length === row.buttons.length;
            // 当有按钮的时候，才判断菜单的选中状态
            if (row.child.length > 0) {
                if (isAllCheck) {
                    row.funcChecked = 2;
                } else if (isHalfCheck) {
                    row.funcChecked = 1;
                } else {
                    row.funcChecked = 0;
                }
            }
            let modelChecked = this.getModelStatus(row.meta.modelNo);
            this.tableData.forEach(item => {
                if (item.meta.modelNo === row.meta.modelNo) {
                    item.modelChecked = modelChecked;
                }
            });
        },
        // 判断父节点的状态
        getModelStatus (modelNo) {
            let isChecked = 0,
                bortherStatus = [];
            this.tableData.forEach(item => {
                if (item.meta.modelNo === modelNo) {
                    bortherStatus.push(item.funcChecked);
                }
            });
            // console.log(bortherStatus);
            if (bortherStatus.every(item => item === 2)) {
                isChecked = 2;
            } else if (bortherStatus.every(item => item === 0)) {
                isChecked = 0;
            } else if (bortherStatus.includes(1) || bortherStatus.includes(2)) {
                isChecked = 1;
            } else {
                isChecked = 0;
            }
            return isChecked;
        },
        // 关联数据 保存源数据
        correlation (row, type) {
            if (type === 'model') {
                this.tableData.forEach(item => {
                    if (item.modelId === row.modelId) {
                        if (row.modelChecked === 2) {
                            item.funcChecked = 2;
                            item.buttons = item.child;
                        } else {
                            item.funcChecked = 0;
                            item.buttons = [];
                        }
                    }
                });
            }
            if (type === 'func') {
                if (row.funcChecked === 2) {
                    row.buttons = row.child;
                } else {
                    row.buttons = [];
                }
            }
            this.setParentsStatus(row);
            let checkeds = this.getCheckedNo();
            // console.log(checkeds);
            this.saveOldData(this.list, checkeds);
        },
        // 获取合并行配置
        getSpanArr (data) {
            this.spanArr = [];
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0;
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i].modelId === data[i - 1].modelId) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },
        // 合并行
        objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
            // console.log(row);
            if (columnIndex === 0) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        }
    },
    created () {
        // this.unfoldTree();
    },
    components: {}

};

</script>

<style lang="scss" scoped>
    .model-auth{
        ::v-deep .el-checkbox{
            width: 120px;
        }
        ::v-deep .el-checkbox + .el-checkbox {
            margin-left: 0;
        }
    }
</style>
