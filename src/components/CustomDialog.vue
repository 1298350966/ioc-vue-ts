<template>
    <el-dialog
        class="custom-dialog-container"
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :show-close="showClose"
        :close-on-press-escape="false"
        append-to-body
        center
        :width="width"
        ref="elDialog"
        :id="id"
    >
    <span v-if="show">
      <slot></slot>
    </span>
        
        <span v-if="action" slot="footer" class="dialog-footer" v-loading="loading"
              :element-loading-text="loadingText">
      <slot name="action">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </slot>
    </span>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            visible: Boolean,
            showClose: {
                type: Boolean,
                default: true
            },
            loadingText: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: '600px'
            },
            form: {
                type: Boolean,
                default: true
            },
            action: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            show() {
                if (this.form) {
                    return this.showForm;
                } else {
                    return true
                }
            }
        },
        watch: {
            dialogVisible(value) {
                if (!value) {
                    this.loading = false;
                    this.$emit('on-close');
                    setTimeout(() => {
                        this.showForm = false
                    }, 300)
                } else {
                    this.showForm = true
                }
            },
            visible(val) {
                this.dialogVisible = val
            }
        },
        data() {
            return {
                color: 'red',
                loading: false,
                dialogVisible: this.visible,
                id: 'custom_dialog_' + new Date().getTime(),
                showForm: false
            }
        },
        methods: {
            close() {
                this.dialogVisible = false
            },
            submit() {
                this.loading = true;
                this.$emit('on-submit')
            },
            end() {
                this.loading = false
            }
        },
    }
</script>

<style lang="scss" scoped>
    .custom-dialog-container > > > .el-dialog__footer {
        margin: 0 20px;
        padding: 15px 0 16px;
        text-align: center;
        position: relative;
        
        .dialog-footer {
            display: block;
            
            .circular {
                display: inline-block;
                vertical-align: middle;
                margin-right: 5px;
                width: 24px;
                height: 24px;
            }
            
            .el-loading-text {
                display: inline-block;
                vertical-align: middle;
            }
            
            .el-loading-spinner {
                margin-top: -12px;
            }
        }
    }
</style>
