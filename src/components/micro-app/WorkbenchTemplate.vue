<template>
    <div>
        <el-container >
            <el-header style="border: 1px solid #eee;height: 40px">
                <el-row style="height: 40px">
                    <el-col class=" workbench-title">工作台分组<i class="el-icon-plus" style="margin-left: 30px" @click="newMneu"></i></el-col>
                    <el-col style="width: 800px;height: 100%;line-height: 40px;" v-if="currentMenu && JSON.stringify(currentMenu) != '{}'">
                        <span class="menu-title">{{currentMenu.menuName}}</span>
                        <el-button type="primary" round size="mini" @click="rename">重命名</el-button>
                        <el-button  round size="mini" @click="deleteMenu">删除</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <el-container style="height: 400px;border-right: 1px solid #eee; "  v-loading="cardLoading">
                <el-aside width="210px" class="aside-border">
                    <el-menu  @open="handleOpen" @close="handleClose">
                        <template v-for="(item,index) in menuData">
                            <el-submenu :index="item.menuName+''" v-if="item.type == 1">
                                <template slot="title">
                                   <!-- <i class="el-icon-message"></i>-->
                                    {{item.menuName}}</template>
                                <template
                                    v-if="item.type == 1&& item.children instanceof Array && item.children.length >0">
                                    <template v-for="(child,key) in item.children" >
                                        <el-menu-item :index="item.menuName+'-'+child.menuName"
                                                      @click.native="itemMenuClick(child)">{{child.menuName}}
                                        </el-menu-item>
                                    </template>
                                </template>
                            </el-submenu>
                        </template>
                    </el-menu>
                </el-aside>

                <el-container>
                    <el-main style="border-bottom: 1px solid #eee">
                        <template v-if="currentMenu.level == 1">
                            <div>
                                <el-row style="margin-bottom: 20px">
                                    <i class="el-icon-eleme"></i>
                                    <span style="font-size: 15px;font-weight: bold;">下级菜单</span>
                                </el-row>
                                <el-row style="height: 40px;background-color:#EAF1F7;line-height: 40px">
                                    <el-button  icon="el-icon-sort"  size="mini" round style="float: right;margin-left: 10px;margin-top: 6px">排序</el-button>
                                    <el-button type="primary"  size="mini" icon="el-icon-plus" round style="float: right;margin-top: 6px" @click="newGrouping">新建分组</el-button>
                                </el-row>
                                <template >
                                    <el-row class="menu-item" v-for="(child,index) in currentMenu.children" :key="index" style="padding-left: 10px;padding-right: 10px">
                                        <span>{{child.menuName+'('+child.children.length+')'}}</span>
                                        <el-col :span="12"></el-col>
                                        <el-col style="width: 50px">

                                        </el-col>
                                        <i class="el-icon-arrow-right" style="float: right;margin-top: 10px"></i>
                                    </el-row>
                                </template>
                            </div>

                        </template>
                        <template v-else-if="currentMenu.level ==2">
                            <div>
                                <el-row style="margin-bottom: 20px">
                                    <i class="el-icon-eleme"></i>
                                    <span style="font-size: 15px;font-weight: bold;">应用管理</span>
                                </el-row>
                                <el-row style="height: 40px;background-color:#EAF1F7;line-height: 40px">
                                    <el-button  icon="el-icon-sort"  size="mini" round style="float: right;margin-left: 10px;margin-top: 6px">排序</el-button>
                                    <el-button type="primary"  size="mini" icon="el-icon-plus" round style="float: right;margin-top: 6px" @click="addMicroApp">添加</el-button>
                                </el-row>
                                <template >
                                    <el-row :span="24" class="menu-item" v-for="(child,index) in currentMenu.children" :key="index" style="padding-left: 10px;padding-right: 10px">
                                        <i class="el-icon-arrow-right" style="float: right;margin-top: 10px"></i>
                                        <el-col  style="height: 100%;width: 50px">
                                            <el-avatar v-if="KHUtils.isNull(child.appIconId)" shape="square" size="small" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" style="margin-top: 6px"></el-avatar>
                                            <el-avatar v-else shape="square" size="small" :src="getImgeUrl(child.appIconId)" style="margin-top: 6px"></el-avatar>
                                        </el-col>
                                        <el-col :span="5">
                                            <span class="text-hidden">{{child.menuName}}</span>
                                        </el-col>
                                        <el-col :span="5">
                                            <template v-if="child.quickApp == 1">
                                                <el-tag type="success">快捷应用</el-tag>
                                            </template>
                                        </el-col>
                                        <el-col :span="5" style="float: right">
                                            <template v-if="child.quickApp == 1">
                                                <el-button type="text" @click="child.quickApp = 0">移除快捷应用</el-button>
                                            </template>
                                            <template v-else>
                                                <el-button type="text" @click="child.quickApp = 1">添加快捷应用</el-button>
                                            </template>
                                            <el-button type="text" @click="removeMicroApp(child)">移除</el-button>
                                        </el-col>

                                    </el-row>
                                </template>
                            </div>
                        </template>
                    </el-main>
                </el-container>
            </el-container>

            <span style="font-size: 16px;font-weight: bold;margin-top: 10px;margin-bottom: 10px">复制已有模板</span>
            <el-footer style="background-color: #F6F6F7;padding: 20px;height: auto" class="footer-template">

                <el-row :gutter="12" style="margin-bottom: 10px">
                    <template v-for="(item,index) in templateData">
                        <el-col :span="8" >
                            <el-card shadow="always" @click.native="copyTemplateMenu(item.id)">
                               <el-row> <span style="font-size: 16px;color: #409EFF">{{item.templateName}}</span></el-row>
                               <el-row style="margin-top: 5px"> <span style="font-size: 14px;color: #909399">{{item.applyIndustry}}</span></el-row>
                            </el-card>
                        </el-col>
                    </template>


                </el-row>

            </el-footer>
            <el-footer>
                <el-row>
                    <el-pagination style="float: right;margin: 10px"
                                   background
                                   :current-page.sync="templateParam.pageNum"
                                   :page-size.sync="templateParam.pageSize"
                                   layout="total, prev, pager, next, jumper"
                                   :total="templateTotal"
                                   @current-change="handleCurrentChange"
                    />
                </el-row>
                <!--<el-row style="float: right">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button @click="dialogVisible = false" type="primary">确定</el-button>
                </el-row>-->

            </el-footer>
        </el-container>
        <el-dialog title="重命名" :visible.sync="renameDialogVisible"  :modal="false" width="20%"  custom-class="col-cond-filter-dialog">
            <el-input v-model="renameTitle" style="margin-bottom: 30px"></el-input>
             <span slot="footer" class="dialog-footer">
                <el-button @click="renameDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMenuName">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新建分组" :visible.sync="newGroupDialogVisible"  :modal="false" width="20%"  custom-class="col-cond-filter-dialog">
            <el-input v-model="newGroupTitle" style="margin-bottom: 30px"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newGroupDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveNewGrouping">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新建分组" :visible.sync="newMenuDialogVisible"  :modal="false" width="20%"  custom-class="col-cond-filter-dialog">
            <el-input v-model="newMenuTitle" style="margin-bottom: 30px"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newMenuDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveNewMenu">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新建应用" :visible.sync="microAppDialogVisible"  :modal="false" width="80%"  custom-class="col-cond-filter-dialog">
            <app-list
               @closeMicroDialog="closeMicroDialog" @saveMicroApp="saveMicroApp"></app-list>
        </el-dialog>
    </div>
</template>

<script>
    import AppList from "@/components/micro-app/AppList"
    export default {
        name: "WorkbenchTemplate",
        components:{
            AppList
        },
        props: ['templateId'],
        data(){
            return {
                menuData:[],
                currentMenu:{},
                renameDialogVisible:false,
                renameTitle:"",
                newGroupDialogVisible:false,
                newGroupTitle:"",
                newMenuDialogVisible:false,
                newMenuTitle:"",
                templateParam:{
                    pageSize: 6,
                    pageNum: 1
                },
                templateData:[],
                templateTotal:0,
                microAppDialogVisible:false,
                cardLoading:false,

            }
        },
        watch:{
            templateId: {
                deep: true,
                handler() {
                    this.currentMenu = {};
                    this.queryTemplateMenuTree(true,this.templateId);
                }
            },
        },
        computed:{
          getImgeUrl(){
              return function (imageId) {
                  return this.khConfig.api.imageDownload + "/"+imageId;
                  //return "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png";
              }
          }
        },
        mounted(){
            let  _this = this;
            _this.queryTemplateMenuTree(true,_this.templateId);
            _this.listTemplateData()
        },
        methods: {
            subMenuClick(menu){
                console.log(1, menu)
            },
            itemMenuClick(menu){
                let _this = this;
                _this.currentMenu = menu;
            },
            handleOpen(key, keyPath) {
               let _this = this;
                if(_this.menuData instanceof Array && _this.menuData.length>0){
                    _this.menuData.forEach((menu,index)=>{
                        if(key == menu.menuName+''){
                            _this.currentMenu = menu;
                        }
                    } )
                }

            },
            handleClose(key,keyPath){
                let _this = this;
                if(_this.menuData instanceof Array && _this.menuData.length>0){
                    _this.menuData.forEach((menu,index)=>{
                        if(key == menu.menuName+''){
                            _this.currentMenu = menu;
                        }
                    } )
                }
            },
            //重命名
            rename(){
                let _this = this;
                _this.renameDialogVisible = true;
                _this.renameTitle = _this.currentMenu.menuName;
            },
            saveMenuName(){
                let _this = this;
                _this.currentMenu.menuName = _this.renameTitle;
                _this.renameDialogVisible = false;

            },
            //新建分组
            newGrouping(){
              let _this = this;
              _this.newGroupTitle = "";
              _this.newGroupDialogVisible = true;
            },
            saveNewGrouping(){
                let _this = this;
                _this.newGroupDialogVisible = false;
                let groupObj = {
                    id:null,
                    menuName:_this.newGroupTitle,
                    level:2,
                    type:1,
                    sort:_this.currentMenu.children.length+1,
                    children:[]
                }
                _this.currentMenu.children.push(groupObj);
            },
            //新建顶部菜单
            newMneu(){
                let _this = this;
                _this.newMenuTitle = "";
                _this.newMenuDialogVisible = true;
            },
            saveNewMenu(){
                let _this = this;
                _this.newMenuDialogVisible = false;
                let menuObj = {
                    id:null,
                    menuName:_this.newMenuTitle,
                    level:1,
                    type:1,
                    sort:_this.menuData.length+1,
                    children:[]
                }
                _this.menuData.push(menuObj);
            },
            //删除菜单
            deleteMenu(){
                this.$confirm('是否确认删除 "'+this.currentMenu.menuName+'"?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(this.menuData instanceof Array && this.menuData.length>0){
                        this.deleteTemplateMenu(this.menuData);
                    }

                }).catch(() => {

                });
            },
            deleteTemplateMenu(menus){
              let _this = this;
              if(menus instanceof Array && menus.length>0){
                  for(var i = 0;i<menus.length;i++){
                      let menu = menus[i];
                      if(menu.menuName == _this.currentMenu.menuName){
                          menus.splice(i,1);
                          break;
                      }else {
                          _this.deleteTemplateMenu(menu.children);
                      }
                  }
              }
            },
            //添加微应用
            addMicroApp(){
              let _this = this;
              _this.microAppDialogVisible = true;
            },
            closeMicroDialog(){
                let _this = this;
                _this.microAppDialogVisible = false;
            },
            saveMicroApp(microApps){
                let _this = this;
                _this.microAppDialogVisible = false;
                if(microApps instanceof Array && microApps.length>0){
                    for(var i = 0;i<microApps.length;i++){
                        let app = microApps[i];
                        let newObj = {
                            id:null,
                            menuName:app.appName,
                            level:3,
                            type:2,
                            appId:app.id,
                            quickApp:0,
                            appType:app.appType,
                            appIconId:app.iconId,
                            sort:_this.currentMenu.children.length+1
                        }
                        _this.currentMenu.children.push(newObj);
                    }
                }
            },
            //移除微应用
            removeMicroApp(app){
                let _this = this;
                _this.$confirm('是否移除 "'+app.menuName+'"应用?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(_this.currentMenu.children instanceof Array && _this.currentMenu.children.length >0){
                        for(var i = 0;i<_this.currentMenu.children.length;i++){
                            let child =  _this.currentMenu.children[i];
                            if(child.appId == app.appId){
                                _this.currentMenu.children.splice(i,1);
                                break;
                            }
                        }
                    }

                }).catch(() => {

                });

            },
            //查询模板列表
            listTemplateData(){
                this.templateData = [];
                this.$Get(this.khConfig.api.queryMicroAppTemplate, this.templateParam).then(res => {
                    if (res.errCode === 0) {
                        this.templateTotal = res.count;
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                            console.log(res.datas);
                            if(res.datas instanceof Array && res.datas.length >0){
                                for(var i = 0;i<res.datas.length;i++){
                                    let template = res.datas[i];
                                    if(template.id != this.templateId){
                                        this.templateData.push(template);
                                    }
                                }
                            }

                        }
                    } else {

                    }
                });
            },
            handleCurrentChange(val){
                let _this = this;
                _this.templateParam.pageNum = val;
                _this.listTemplateData();
            },
            saveWorkbench(){
                let postJsParam = {
                    templateId:this.templateId,
                    templateMenus:this.menuData
                }
                this.$PostJson(this.khConfig.api.saveTemplateMenu, postJsParam).then(res => {
                    if (res.errCode === 0) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    } else {

                    }
                }).catch((e) => {

                });
            },
            queryTemplateMenuTree(isInit,id){
                let _this = this;
                _this.menuData = [];
                _this.$Get(this.khConfig.api.queryTemplateMenuTreeByTemplateId+"/"+id).then(res => {
                    _this.cardLoading = false;
                    if (res.errCode === 0) {
                        _this.menuData = res.datas;
                        if(isInit){
                            if(_this.menuData == null || _this.menuData.length == 0){
                                _this.menuData= [{
                                    "id": null,
                                    "menuName": "安全管理",
                                    "level": 1,
                                    "type": 1,
                                    "sort":1,
                                    "children": []
                                },{
                                    "id": null,
                                    "menuName": "健康管理",
                                    "level": 1,
                                    "type": 1,
                                    "sort":2,
                                    "children": []
                                },{
                                    "id": null,
                                    "menuName": "环保管理",
                                    "level": 1,
                                    "type": 1,
                                    "sort":3,
                                    "children": []
                                },{
                                    "id": null,
                                    "menuName": "其他",
                                    "level": 1,
                                    "type": 1,
                                    "sort":4,
                                    "children": []
                                }
                                ]
                            }
                        }else {
                            //清空复制模板的id
                            _this.cleanMenuId(_this.menuData);
                        }
                    } else {

                    }
                });
            },
            cleanMenuId(menus){
                if(menus instanceof Array && menus.length >0){
                    menus.forEach((menu,index)=>{
                        menu.id = null;
                        if(menu.children instanceof Array && menu.children.length>0){
                            this.cleanMenuId(menu.children);
                        }
                    })
                }
            },
            copyTemplateMenu(templateId){
                this.cardLoading = true
                this.queryTemplateMenuTree(false,templateId)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .workbench-title {
        width: 190px;
        height: 100%;
        text-align: center;
        line-height: 40px;
        color: #409EFF;
        font-size: 16px;
        border-right:  1px solid #eee;
    }
    .menu-title {
        margin-left: 20px;
        font-weight: bolder;
        font-size: 15px;
        margin-right: 20px;
    }
    .menu-item{
        height: 40px;
        border:  1px solid #eee;
        line-height: 40px;
    }

   ::v-deep .col-cond-filter-dialog {
    .el-dialog__body {
        padding: 15px 15px !important;
        background-color: #FFFFFF;
        overflow-y: auto !important;

    /*滚动条里面小方块*/
    &::-webkit-scrollbar-thumb {
         background-color: #EBEAEF;
         border-radius: 10px;
     }
    /*滚动条整体样式*/
    &::-webkit-scrollbar {
         width: 6px;
         height: 6px;
     }
    /*滚动条里面轨道*/
    &::-webkit-scrollbar-track {
         background: #FFFFFF;
         border-radius: 10px;
     }
    }

    .el-dialog__header {
        background-color: #F8F8FA;
        border-bottom: 1px solid #E8E8E8;
        padding-left: 10px !important;
        padding-top: 15px !important;
        padding-bottom: 15px !important;
    }

    .el-dialog__footer {
        padding-top: 5px;
        padding-bottom: 5px;
        background-color: #F8F8FA !important;
    }
    }
   ::v-deep .footer-template{
        .el-card__body{
            padding: 10px;
        }
    }
   ::v-deep.el-menu-item, .el-submenu__title {
        height: 47px;
        line-height: 47px;
        position: relative;
        -webkit-box-sizing: border-box;
        white-space: nowrap;
        list-style: none;
    }
   ::v-deep.el-submenu__title {
        height: 47px;
        line-height: 47px;
    }
    .text-hidden {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
   ::v-deep .el-menu {
        border-right: solid 0px #e6e6e6;
        list-style: none;
        position: relative;
        margin: 0;
        padding-left: 0;
        background-color: #FFF;
    }
    .aside-border{
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
    }

</style>
