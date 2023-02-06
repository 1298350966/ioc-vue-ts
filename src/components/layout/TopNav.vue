<template>
    <div class="top-nav" id="topNav" :style="TopNavStyle">
        <el-row type="flex"> 
            <el-col class="logo">
                <h4 class="menu-title">科皓基础应用开发平台</h4>
            </el-col>
            <el-col class="top-menu-col">
                <el-menu
                    ref="topMenu"
                    :default-active="this.activeMenu"
                    class="el-menu-demo"
                    mode="horizontal"
                    background-color="transparent"
                    :active-text-color="variables.menuActiveText"
                    :text-color="variables.menuText"
                    :unique-opened="false"
                    router
                    :style="{ top: menuTop }">
                    <template v-for="(item,index) in this.menus" >
                        <el-menu-item :index="item.path"  :key="index"
                        v-if="item.level === 1 && item.path.indexOf('/full/custom/') === -1 && item.path.indexOf('/companyRegister') === -1">
                            <menuIcon  :iconName="item.iconName" :iconUpload="item.iconUpload">
                            </menuIcon>
                            <span slot="title" style="display: inline-block">{{item.name}}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
                <i class="el-icon-arrow-right" v-show="topMenuCount > 1" @click="changeMenu"></i>
            </el-col>
            <el-col class="user-info-css">
                <i class="iconfont" style="margin-right: 5px;">&#xe678;</i>
                <el-tooltip class="item" effect="dark" :content="user.realName" placement="bottom-start">
                    <span v-if="user.realName !== null && user.realName !== ''" class="text-oneLine">{{ user.realName
                    }}</span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="user.username" placement="bottom-start">
                    <span v-if="user.realName === null || user.realName === ''" class="text-oneLine">{{ user.username
                    }}</span>
                </el-tooltip>
                <span>&nbsp; | &nbsp;</span>
                <span @click="loginOut">退出</span>
            </el-col>
        </el-row>
    </div>
</template>

<script type="es6">
    import {mapGetters} from 'vuex'
    import menuIcon from "./menuIcon"
    import { throttle } from "@/utils/throttle"
    import { TopMenu as variables} from '@/assets/theme/config/index.js'
    
    export default {
        components:{menuIcon},
        data() {
            return {
                name: 'TopNav',
                bodyHeight: document.documentElement.clientHeight - 65,
                unReadMsgCount: "",
                unDoneTaskCount: "",
                topMenuIndex: 0,
                topMenuCount: 1,
                activeMenu:""
            }
        },
        props: ["menus"],

        computed:{
            menuTop() {
                return (this.topMenuIndex * -60) + "px"
            },
            ...mapGetters({
                user: 'getUserInfo'
            }),
            variables() {
                return variables
            },
            TopNavStyle(){
                let style = {}
                for (const key in variables) {
                    style["--" + key] = variables[key]
                }
                return style
            }

        },
        mounted(){
            //  this.queryUnReadMsgNum();
             this.setTopMenuCount();
             window.addEventListener('resize', throttle(this.setTopMenuCount))
        },
        methods: {
            setTopMenuCount() {
                this.$nextTick(() => {
                    let topMenuHeight = this.$refs.topMenu.$el.scrollHeight
                    this.topMenuCount = Math.round(topMenuHeight / 60)
                    if (this.topMenuIndex + 1 > this.topMenuCount) {
                        this.topMenuIndex = 0
                    }
                })
            },
            changeMenu() {
                let topMenuHeight = this.$refs.topMenu.$el.scrollHeight
                this.topMenuCount = Math.round(topMenuHeight / 60)
                console.log(topMenuHeight, this.topMenuCount)
                if (topMenuHeight > (this.topMenuIndex + 2) * 60) {
                    this.topMenuIndex = this.topMenuIndex + 1
                } else {
                    this.topMenuIndex = 0
                }
            },
            loginOut() {
                // 此处请求的Api直接会绕过CAS的校验
                this.$confirm('确认注销当前用户吗?', '提示', {}).then(() => {
                    this.$Get(this.khConfig.api.getLogout, {}).then(res => {
                        if (!this.KHUtils.isNull(res)) {
                            window.location.href = res;
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: "注销失败,请联系管理员"
                            });
                        }
                    });
                }).catch((e) => {
                    console.log('$confirm catch' + e);
                })
            },
            // queryUnReadMsgNum() {
            //     this.unReadMsgCount = "";
            //     this.unDoneTaskCount = ""
            //     this.$Get(this.khConfig.api.queryWatiDoneTaskCount).then(res => {
            //         if (res.errCode === 0) {
            //             if (!this.KHUtils.isNull(res.count)) {
            //                 this.unDoneTaskCount = res.count;
            //             }
            //         }
            //     });

            //     this.$Get(this.khConfig.api.unReadMsgCount, null).then(res => {
            //         if (res.errCode === 0) {
            //             if (!this.KHUtils.isNull(res.totalCount)) {
            //                 this.unReadMsgCount = res.totalCount;
            //             }
            //         }
            //     });
            // },
            // handleGoToBacklog() {
            //     this.$router.push("/waitDoneTask/WaitDoneTask");
            // },
            // handleGoToMsg() {
            //     this.$router.push("/msg/MsgList");
            // },
            // handleGoToFormTask() {
            //     this.$router.push("/formTask/ExecutingFormTask");
            // }
        },
        watch: {
            $route(to, from) {
                if (to != from) {
                    this.activeMenu = to.matched[0] ? to.matched[0].path : ""
                }
            },
            menus(newVl, newOl) {
                if (newVl != newOl) {
                    this.setTopMenuCount();
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    
    
</style>
