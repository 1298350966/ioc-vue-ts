<template>
  <div>
    <!--列设置-->
    <div :class="item.key!=='$seq' && item.key !== '$opt' ? 'item-display mover' : 'item-display'" v-if="showType==='cols'" style="border: 1px solid #468CFF" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <el-tooltip effect="dark" content="移除链接" placement="top" :open-delay="1000">
        <i class="el-icon-link" style="cursor: pointer" v-if="item.isJump" @click="onChangeIsJump"></i>
      </el-tooltip>
      <span class="item-label" style="padding-left: 5px;cursor: default"
            :title="getItemLabel" v-text="getItemLabel"></span>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip v-if="item.key!=='$seq' && item.key !== '$opt'" effect="dark" content="更多" placement="top" :open-delay="1000">
          <i class="el-icon-caret-bottom" style="cursor: pointer" @click="onShowMenu"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="deleteCol"></i>
        </el-tooltip>
      </div>
    </div>
    <!--过滤器item-->
    <div class="item-display mover" v-if="showType==='condFilters'" style="border: 1px solid #2BC048" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <span class="item-label" style="padding-left: 5px;cursor: default"
            :title="getItemLabel" v-text="getItemLabel"></span>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip effect="dark" content="过滤配置" placement="top" :open-delay="1000">
          <i class="el-icon-s-operation" style="cursor: pointer" @click="onShowCondFilterConfigDialog"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="deleteCondFilter"></i>
        </el-tooltip>
      </div>
    </div>
    <!--操作按钮-->
    <div class="item-display mover" v-if="showType==='optButtons'" style="border: 1px solid #00b2ac" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <el-tooltip effect="dark" content="移除链接" placement="top" :open-delay="1000">
        <i class="el-icon-link" style="cursor: pointer" v-if="item.jumpInfo" @click="onChangeIsJump"></i>
      </el-tooltip>
      <span class="item-label" style="padding-left: 5px;cursor: default" :title="item.label">{{ item.label }}</span>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip  effect="dark" content="更多" placement="top" :open-delay="1000">
          <i class="el-icon-caret-bottom" style="cursor: pointer" @click="onShowMenu"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="deleteOptButton"></i>
        </el-tooltip>
      </div>
    </div>
    <!--通用按钮-->
    <div class="item-display mover" v-if="showType==='btns'" style="border: 1px solid #ee9900" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <el-tooltip effect="dark" content="移除链接" placement="top" :open-delay="1000">
        <i class="el-icon-link" style="cursor: pointer" v-if="item.jumpInfo" @click="onChangeIsJump"></i>
      </el-tooltip>
      <span class="item-label" style="padding-left: 5px;cursor: default" :title="item.label">{{ item.label }}</span>
      <div class="item-opt" v-show="itemOptVisible">
        <!-- v-if="item.key == 'add' && item.key !== 'remove' && item.key!=='import' && item.key!=='export'" -->
        <el-tooltip  effect="dark" content="更多" placement="top" :open-delay="1000">
          <i class="el-icon-caret-bottom" style="cursor: pointer" @click="onShowMenu"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="deleteBtn"></i>
        </el-tooltip>
      </div>
    </div>
    <!--排序设置-->
    <div class="item-display mover" v-if="showType==='querySort'" style="border: 1px solid #f56c6c" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <div class="item-label">
        <el-tooltip  v-if="item.sort===0" effect="dark" content="升序" placement="left-start" :open-delay="1000">
          <i class="el-icon-sort-up" style="padding-left: 5px;cursor: pointer" @click="onChangeSortType"></i>
        </el-tooltip>
        <el-tooltip  v-if="item.sort===1" effect="dark" content="降序" placement="left-start" :open-delay="1000">
          <i class="el-icon-sort-down" style="padding-left: 5px;cursor: pointer" @click="onChangeSortType"></i>
        </el-tooltip>
        <span style="cursor: default" :title="getItemLabel" v-text="getItemLabel"></span>
      </div>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="deleteQuerySort"></i>
        </el-tooltip>
      </div>
    </div>
    <!--导入设置-->
    <div class="item-display mover" v-if="showType==='import'" style="border: 1px solid #FFD700" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <div class="item-label" style="padding-left: 5px;cursor: default" :title="getItemLabel + ' ' + '->' + ' ' + item.excelName">
        <span v-text="getItemLabel"></span>
        <i class="el-icon-right"></i>
        <span v-text="item.excelName"></span>
      </div>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip effect="dark" content="映射报表列名" placement="top" :open-delay="1000">
          <i class="el-icon-edit" style="cursor: pointer" @click="openExcelNameDialog"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="deleteImportSetting"></i>
        </el-tooltip>
      </div>
    </div>
    <!--导出设置-->
    <div class="item-display mover" v-if="showType==='export'" style="border: 1px solid #CE62D6" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <div class="item-label" style="padding-left: 5px;cursor: default" :title="getItemLabel + ' ' + '->' + ' ' + item.excelName">
        <span v-text="getItemLabel"></span>
        <i class="el-icon-right"></i>
        <span v-text="item.excelName"></span>
      </div>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip effect="dark" content="映射报表列名" placement="top" :open-delay="1000">
          <i class="el-icon-edit" style="cursor: pointer" @click="openExcelNameDialog"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="deleteExportSetting"></i>
        </el-tooltip>
      </div>
    </div>
    <!--菜单-->
    <transition name="el-zoom-in-top">
      <div :id="getMenuId" class="custom-dropdown-menu" :style="menuStyle" v-if="menuVisible">
           <div class="menu-item"  @mousedown="openBaseSetDialog">
              <i class="el-icon-setting"></i><span style="margin-left: 5px">基础设置</span>
          </div>
          <template v-if="showType==='optButtons' && item.key == 'export'">
              <div class="menu-item" v-if=" showType==='optButtons' " @mousedown="openSaveExportDialog(showType)">
                  <i class="el-icon-link"></i><span style="margin-left: 5px">导出设置</span>
              </div>
          </template>
          <template v-else>
              <div class="menu-item" v-if="showType==='cols'" @mousedown="openRenameDialog">
                  <i class="el-icon-edit"></i><span style="margin-left: 5px">重命名</span> 
              </div>                                                             
                  <!-- v-if="item.key == 'add' && item.key !== 'remove' && item.key!=='import' && item.key!=='export'" --> 
                         
              <div class="menu-item" v-if="(showType==='cols' || showType==='optButtons' || showType==='btns') && item.key != 'edit' && item.key !='delete' && item.key !='detail' && (!['add','remove','import','export'].includes(item.key)) " @mousedown="openSaveJumpInfoDialog(showType)">
                  <i class="el-icon-link"></i><span style="margin-left: 5px">跳转设置</span>
              </div>
          </template>
          <template v-if="['add','edit','detail'].includes(item.key)">
              <div class="menu-item" @mousedown="displaySettingsDialogVisible=true">
                  <i class="el-icon-link"></i><span style="margin-left: 5px">显示设置</span>
              </div>
          </template>
      </div>
    </transition>
    <!--字段重命名-->
    <el-dialog title="重命名" :visible.sync="renameDialogVisible" v-if="renameDialogVisible" :append-to-body="true"
               @close="closeRenameDialog" custom-class="rename-excelName-dialog"
               width="35%" :close-on-click-modal="false" :close-on-press-escape="false">
      <template v-slot:default>
        <div class="rename-content">
          <div style="margin-right: 15px">
            <span v-if="showType==='cols'">字段别名</span>
            <span v-if="showType==='optButtons'">操作按钮名称</span>
            <span v-if="showType==='btns'">通用按钮名称</span>
            <el-input v-model="renameContent" style="width: 150px"></el-input>
          </div>
          <div style="margin-top: 10px" v-if="showType==='cols'">
            <span style="margin-right: 12px">列名称</span>
            <el-input v-model="item.name" :disabled="true" style="width: 150px"></el-input>
            <span style="margin-left: 10px">列物理字段</span>
            <el-input v-model="item.key" :disabled="true" style="width: 150px"></el-input>
          </div>
          <div v-if="showType==='optButtons'">
            <span>操作按钮物理字段</span>
            <el-input v-model="item.key" :disabled="true" style="width: 150px"></el-input>
          </div>
          <div v-if="showType==='btns'">
            <span>通用按钮物理字段</span>
            <el-input v-model="item.key" :disabled="true" style="width: 150px"></el-input>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <el-button @click="closeRenameDialog">取 消</el-button>
        <el-button type="primary" @click="saveRenameContent">确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="设置映射报别列名" :visible.sync="excelNameDialogVisible" v-if="excelNameDialogVisible" :append-to-body="true"
               @close="closeExcelNameDialog" custom-class="rename-excelName-dialog"
               width="35%" :close-on-click-modal="false" :close-on-press-escape="false">
      <template v-slot:default>
        <div style="display: flex;flex-direction: row;align-items: center;padding: 25px 25px">
          <div style="margin-right: 15px">
            <span>映射报表列名</span>
            <el-input v-model="excelNameContent" style="width: 150px"></el-input>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <el-button @click="closeExcelNameDialog">取 消</el-button>
        <el-button type="primary" @click="saveExcelNameDialog">确 定</el-button>
      </template>
    </el-dialog>
    
    <el-dialog title="基础设置" :visible.sync="baseSetDialogVisible" v-if="baseSetDialogVisible" :append-to-body="true"
               @close="closeBaseSetDialog" custom-class="rename-excelName-dialog"
               width="35%" :close-on-click-modal="false" :close-on-press-escape="false">
      <template v-slot:default>
        <div v-if="showType==='cols'" style="display: flex;flex-direction: row;align-items: center;padding: 25px 25px">
          <div style="margin-right: 15px">
            <span>宽度大小</span>
            <el-input v-model="colWidth" type="number" style="width: 150px"></el-input>
          </div>
        </div>
        <div v-if="showType==='optButtons' || showType==='btns'">
            <el-row  style="display: flex;flex-direction: row">
                <div style="display: flex;flex-direction: column;margin-right: auto">
                    <span>名称</span>
                    <el-input style="width: 150px" v-model="optBtnBaseSet.label"></el-input>
                </div>
                <div style="display: flex;flex-direction: column;">
                    <span style="margin-right: 15px">图标</span>
                    <custom-upload class="custom-upload" :fileName="imgName" :fileUrl="imgSrc" @fromCustomChild="getFileIdFromCusUpload"></custom-upload>
                </div>
            </el-row>
            <el-row style="margin-top: 10px;" v-show="showType==='optButtons'">
                <el-row style="padding: 10px" @click.native="addBtnCondition">
                    <span>条件</span>
                    <i class="el-icon-plus"></i>
                </el-row>
                <el-row v-if="optBtnBaseSet.cond instanceof Array && optBtnBaseSet.cond.length >0" v-for="(cond,index) in optBtnBaseSet.cond" :key="index" :span="24" style="margin-top: 10px">
                    <el-col :span="5">
                        <el-select v-model="cond.model" placeholder="请选择">
                            <el-option
                                v-for="item in colsArray"
                                :key="item.model"
                                :label="item.name"
                                :value="item.model">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10" style="margin-left: 10px;margin-right: 10px">
                        <el-input :value="getBtnCondValue(cond.values)" placeholder="请添加内容"  :disabled="true"></el-input>
                    </el-col>
                    <el-col :span="1" style="margin-left: 10px;margin-right: 10px">
                        <el-button type="text" @click="addBtnCondValue(cond)">添加</el-button>
                    </el-col>
                    <el-col :span="4" style="margin-top: 7px">
                        <i class="el-icon-delete" @click="deleteBtnCondition(index)"></i>
                    </el-col>

                </el-row>
            </el-row>

        </div>
      </template>
      <template v-slot:footer>
        <el-button @click="closeBaseSetDialog">取 消</el-button>
        <el-button type="primary" @click="saveBaseSet">确 定</el-button>
      </template>
    </el-dialog>
      <el-dialog title="添加" :visible.sync="addBtnValueDialogVisible" v-if="addBtnValueDialogVisible" :append-to-body="true"
                 custom-class="rename-excelName-dialog"
                 width="35%" :close-on-click-modal="false" :close-on-press-escape="false">
          <el-input v-model="condValue" placeholder="请输入内容"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addBtnValueDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveBtnCondValue">确 定</el-button>
          </span>
    </el-dialog>
    <!--显示设置-->
    <el-dialog title="显示设置" :visible.sync="displaySettingsDialogVisible" v-if="displaySettingsDialogVisible"  :append-to-body="true" width="40%" top="20vh"
              custom-class="report-setting-config-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <template v-slot:default>
         <displaySettings :config="item.displayConfig"  ref="displaySettings" ></displaySettings>
      </template>
      <template v-slot:footer>
        <el-button @click="displaySettingsDialogVisible = false ">取消</el-button>
        <el-button type="primary" @click="saveDisplaySettings">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import CustomUpload from "@/components/CustomUpload";
  import displaySettings from "./components/displaySettings.vue";

  export default {
    props: {
      isDraggable: {type: Boolean},
      colsArray: {type: Array},
      item: {type: Object}, //当前的设置字段
      showType: {type: String} //列设置为cols 过滤器为condFilters
    },

    components: {
      CustomUpload,
      displaySettings
    },

    computed: {
      getMenuId() {
        return this.showType + '-' + (this.showType === 'cols' || this.showType === 'optButtons' || 'btns' ? this.item.key : this.showType === 'condFilters' ? this.item.model : '');
      },
      getRenameField() {
        if (this.showType === 'cols') {
          return 'alias';
        } else if (this.showType === 'optButtons') {
          return 'label';
        } else if (this.showType === 'btns') {
          return 'label';
        }
      },
      getItemLabel() {
        return this.showType === 'cols' || this.showType === 'querySort' ? (this.item.alias ? this.item.alias : this.item.name) + '(' + this.item.key + ')'
          : (this.item.alias ? this.item.alias : this.item.name) + '(' + this.item.model + ')';
      },
        getBtnCondValue() {
          return function (values) {
            if(values instanceof Array && values.length >0){
                return values.join(",");
            }else {
                return "";
            }
          };
      },
    },

    data() {
      return {
        displaySettingsDialogVisible:false,
        menuVisible: false,
        renameDialogVisible: false,
        renameType: '',
        renameContent: '',
        colWidth: 0,
        excelNameDialogVisible: false,
        excelNameContent: '',
        optBtnBaseSet: {
          label: '',
          imageId: '',
            cond:[]
        },
        baseSetDialogVisible: false,
        itemOptVisible: false,
        imgSrc: '',
        imgName: '',
        menuStyle: {},
          addBtnValueDialogVisible:false,
          condValue:"",
          currentBtnCond:null
      };
    },

    methods: {
        saveDisplaySettings(){
          console.log(11111);
          this.item.displayConfig = this.$refs.displaySettings.displayConfig
          this.displaySettingsDialogVisible = false
        },
        addBtnCondition(){
            if(this.KHUtils.isNull(this.optBtnBaseSet.cond)){
                this.$set(this.optBtnBaseSet,'cond',[]);
            }
            let obj = {
                model:"",
                 values:[]
            }
            this.optBtnBaseSet.cond.push(obj);
        },
        deleteBtnCondition(index){
            if(this.optBtnBaseSet.cond instanceof Array && this.optBtnBaseSet.cond.length >0){
                this.optBtnBaseSet.cond.splice(index,1)
            }
        },
        addBtnCondValue(cond){
            this.condValue = "";
            this.currentBtnCond = cond;
            this.addBtnValueDialogVisible = true;
        },
        saveBtnCondValue(){
            if(!this.KHUtils.isNull(this.condValue)){
                this.currentBtnCond.values.push(this.condValue);
            }
            this.addBtnValueDialogVisible = false;
        },
      onShowMenu(e) {
        this.menuVisible = true;
        let path = e.path || (e.composedPath && e.composedPath());
        this.$nextTick(() => {
          for (let i = 0; i < path.length; i++) {
            let element = path[i];
            if (element.className.indexOf('item-display') >= 0) {
              let x = element.getBoundingClientRect().x;
              let y = element.getBoundingClientRect().y;
              let menu = document.getElementById(this.getMenuId);
              menu.style.left = x + 'px';
              menu.style.top = y + element.offsetHeight + 3 + 'px';
              if ((y + 15 + menu.offsetHeight) >= document.body.clientHeight) {
                menu.style.top = y + 15 - menu.clientHeight + 'px';
              }
              this.$set(this.menuStyle, 'width', element.offsetWidth + 'px');
              break;
            }
          }
        });
        let _this = this;

        function closeMenu(e) {
          _this.menuVisible = false;
          document.body.removeEventListener('mousedown', closeMenu);
        }

        document.body.addEventListener('mousedown', closeMenu);
      },
      closeMenu() {
        this.$nextTick(() => {
          this.menuVisible = false;
          this.itemOptVisible = false;
        });
      },
      openRenameDialog() {
        this.renameContent = this.item[this.getRenameField];
        this.renameDialogVisible = true;
        this.$nextTick(() => {
          this.$forceUpdate();
        });
        this.closeMenu();
      },

      closeRenameDialog() {
        this.renameDialogVisible = false;
        this.renameContent = '';
      },
      saveRenameContent() {
        this.item[this.getRenameField] = this.renameContent;
        this.renameDialogVisible = false;
        this.renameContent = '';
        this.closeMenu();
      },
      deleteCol() {
        this.$emit('removeCol', this.item);
      },
      deleteCondFilter() {
        this.$emit('removeCondFilter', this.item);
      },
      deleteBtn() {
        this.$emit('removeBtn', this.item);
      },
      deleteOptButton() {
        this.$emit('removeOptButton', this.item);
      },
      deleteQuerySort() {
        this.$emit('removeQuerySort', this.item);
      },
      deleteImportSetting() {
        this.$emit('removeImportSetting', this.item);
      },
      deleteExportSetting() {
        this.$emit('removeExportSetting', this.item);
      },
      onShowCondFilterConfigDialog() {
        this.$emit('showCondFilterConfigDialog', this.item);
      },
      openSaveJumpInfoDialog(type) {
        this.$emit('showSaveJumpInfoDialog', this.item, type);
        this.closeMenu();
      },
        openSaveExportDialog(type) {
            this.$emit('openSaveExportDialog', this.item);
            this.closeMenu();
        },
      onChangeSortType() {
        this.item.sort = this.item.sort === 1 ? 0 : 1;
      },
      onChangeIsJump() {
        this.$confirm('是否移除链接设置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.item.hasOwnProperty('isJump')) {
            this.item.isJump = !this.item.isJump;
          }
          this.$delete(this.item, 'jumpInfo');
        });
      },
      closeExcelNameDialog() {
        this.excelNameDialogVisible = false;
      },
      saveExcelNameDialog() {
        if (this.showType === 'import') {
          this.$emit('setImportExcelName', list => {
            let exist = false;
            for (let i = 0; i < list.length; i++) {
              let listItem = list[i];
              if (listItem.excelName === this.excelNameContent) {
                exist = true;
                break;
              }
            }
            if (exist && this.excelNameContent !== this.item.excelName) {
              this.$message({showClose: true, type: "warning", message: "映射报表列名存在相同的字段"});
            } else {
              this.item.excelName = this.excelNameContent;
              this.closeExcelNameDialog();
            }
          });
        } else {
          this.$set(this.item, 'excelName', this.excelNameContent);
          this.closeExcelNameDialog();
        }
      },
      openExcelNameDialog() {
        this.excelNameContent = this.item.excelName;
        this.excelNameDialogVisible = true;
      },
      openBaseSetDialog() {
        if (this.showType === 'cols') {
          if (!this.item.hasOwnProperty('width')) {
            this.colWidth = 0;
          } else {
            let width = this.item.width;
            width = width.split('px')[0];
            this.colWidth = parseInt(width);
          }
          this.baseSetDialogVisible = true;
        } else if (this.showType === 'optButtons' || this.showType === 'btns') {
          this.optBtnBaseSet.label = this.item.label;
          this.optBtnBaseSet.imageId = this.item.imageId;
          if(this.item.cond instanceof Array && this.item.cond.length >0){
              this.$set(this.optBtnBaseSet,'cond',this.item.cond);
          }else {

          }

          if (this.item.imageId) {
            this.$Get(this.khConfig.api.getFileInfo + '/' + this.optBtnBaseSet.imageId).then(res => {
              this.imgName = res.originalName;
              this.imgSrc = window.location.origin + this.khConfig.host.rest + this.khConfig.api.imageDownload + '/' + this.optBtnBaseSet.imageId;
              this.baseSetDialogVisible = true;
            });
          } else {
            this.imgName = '';
            this.imgSrc = '';
            this.baseSetDialogVisible = true;
          }
        }
        this.closeMenu();
      },
      closeBaseSetDialog() {
        this.baseSetDialogVisible = false;
      },
      saveBaseSet() {
        if (this.showType === 'cols') {
          if (this.colWidth !== 0) {
            let width = this.colWidth;
            width = width + 'px';
            this.item.width = width;
          } else {
            this.$delete(this.item, 'width');
          }
        } else if (this.showType === 'optButtons' || this.showType === 'btns') {
          this.item.label = this.optBtnBaseSet.label;
          this.item.imageId = this.optBtnBaseSet.imageId;
            this.item.cond = this.optBtnBaseSet.cond;
        }
        this.closeBaseSetDialog();
      },
      onMouseenter() {
        if (!this.isDraggable) {
          this.itemOptVisible = true;
        }
      },
      onMouseleave() {
        this.itemOptVisible = false;
      },
      onMousemove() {
        if (!this.isDraggable) {
          this.itemOptVisible = true;
        } else {
          this.itemOptVisible = false;
        }
      },
      getFileIdFromCusUpload(fileId) {
        this.optBtnBaseSet.imageId = fileId;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .custom-dropdown-menu {
    z-index: 9999;
    position: fixed;
    padding: 5px 0px;
    display: flex;
    flex-direction: column;
    background-color: rgb(11, 21, 50);
    color: hsla(0, 0%, 100%, .65);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
  }

  .menu-item {
    padding: 1px 12px;
    font-size: 12px;
    line-height: 22px;
    cursor: pointer;

    &:hover {
      color: #fff;
      background-color: rgba(196, 211, 255, .08);
    }
  }

  ::v-deep .rename-excelName-dialog {
    .el-dialog__body {
      padding: 10px 20px !important;
    }
    .el-dialog__header {
      padding-left: 5px;
      padding-top: 5px;
      padding-bottom: 5px;
      background-color: #F8F8FA;
      border-bottom: 1px solid #E8E8E8;
    }
    .el-dialog__footer {
      padding-top: 5px;
      padding-bottom: 5px;
      background-color: #F8F8FA !important;
    }
    .el-dialog__title {
      margin-left: 10px;
      line-height: 36px;
    }
    .el-dialog__headerbtn {
      top: 10px;
    }
  }

  .item-display {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 30px;
    align-items: center;
    color: #FFFFFF;
  }

  .item-label {
    margin-right: auto;
    white-space: nowrap;
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
  }

  .item-opt {
    margin-left: auto;
    margin-right: 5px;
    white-space: nowrap;
  }

  ::v-deep .custom-upload {
    .el-upload {
      float: none;
    }
  }

  .rename-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 25px;
  }
</style>
