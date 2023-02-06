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
    <!--查询设置-->
    <div class="item-display mover" v-if="showType==='conditions'" style="border: 1px solid #CE62D6" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <span class="item-label" style="padding-left: 5px;cursor: default" :title="getItemLabel" v-text="getItemLabel"></span>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="$emit('removeCondition',item)"></i>
        </el-tooltip>
      </div>
    </div>
      <!--枚举查询设置-->
      <div class="item-display mover" v-if="showType==='enumConditions'" style="border: 1px solid #CE62D6" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
          <span class="item-label" style="padding-left: 5px;cursor: default" :title="getItemLabel" v-text="getItemLabel"></span>
          <div class="item-opt" v-show="itemOptVisible">
              <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
                  <i class="el-icon-delete" style="cursor: pointer" @click="$emit('removeEnumCondition',item)"></i>
              </el-tooltip>
          </div>
      </div>
    <!--排序设置-->
    <div class="item-display mover" v-if="showType==='querySort'" style="border: 1px solid #f56c6c" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <el-tooltip  v-if="item.sort===0" effect="dark" content="升序" placement="left-start" :open-delay="1000">
        <i class="el-icon-sort-up" style="padding-left: 5px;cursor: pointer" @click="onChangeSortType"></i>
      </el-tooltip>
      <el-tooltip  v-if="item.sort===1" effect="dark" content="降序" placement="left-start" :open-delay="1000">
        <i class="el-icon-sort-down" style="padding-left: 5px;cursor: pointer" @click="onChangeSortType"></i>
      </el-tooltip>
      <span class="item-label" style="cursor: default" :title="getItemLabel" v-text="getItemLabel"></span>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="deleteQuerySort"></i>
        </el-tooltip>
      </div>
    </div>
    <!--标题设置-->
    <div class="item-display mover" v-if="showType==='title'" style="border: 1px solid #00b2ac" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <span class="item-label" style="padding-left: 5px;cursor: default" :title="getItemLabel" v-text="getItemLabel"></span>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip effect="dark" content="更多" placement="top" :open-delay="1000">
          <i class="el-icon-caret-bottom" style="cursor: pointer" @click="onShowMenu"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="$emit('removeTitle',item)"></i>
        </el-tooltip>
      </div>
    </div>
    <!--右上角设置-->
    <div class="item-display mover" v-if="showType==='rightTop'" style="border: 1px solid #FFD700" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <span class="item-label" style="padding-left: 5px;cursor: default" :title="getItemLabel" v-text="getItemLabel"></span>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip effect="dark" content="更多" placement="top" :open-delay="1000">
          <i class="el-icon-caret-bottom" style="cursor: pointer" @click="onShowMenu"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="$emit('removeRightTop',item)"></i>
        </el-tooltip>
      </div>
    </div>
    <!--左下角设置-->
    <div class="item-display mover" v-if="showType==='leftBottom'" style="border: 1px solid #FFD700" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <span class="item-label" style="padding-left: 5px;cursor: default" :title="getItemLabel" v-text="getItemLabel"></span>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip effect="dark" content="更多" placement="top" :open-delay="1000">
          <i class="el-icon-caret-bottom" style="cursor: pointer" @click="onShowMenu"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="$emit('removeLeftBottom',item)"></i>
        </el-tooltip>
      </div>
    </div>
    <!--右下角设置-->
    <div class="item-display mover" v-if="showType==='rightBottom'" style="border: 1px solid #ee9900" @mouseenter="onMouseenter" @mouseleave="onMouseleave" @mousemove="onMousemove">
      <span class="item-label" style="padding-left: 5px;cursor: default" :title="getItemLabel" v-text="getItemLabel"></span>
      <div class="item-opt" v-show="itemOptVisible">
        <el-tooltip effect="dark" content="更多" placement="top" :open-delay="1000">
          <i class="el-icon-caret-bottom" style="cursor: pointer" @click="onShowMenu"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top" :open-delay="1000">
          <i class="el-icon-delete" style="cursor: pointer" @click="$emit('removeRightBottom',item)"></i>
        </el-tooltip>
      </div>
    </div>
    <!--菜单-->
    <transition name="el-zoom-in-top">
      <div :id="getMenuId" class="custom-dropdown-menu" :style="menuStyle" v-if="menuVisible">
        <div class="menu-item" v-if="showType==='cols'" @mousedown="openRenameDialog">
          <i class="el-icon-edit"></i><span style="margin-left: 5px">重命名</span>
        </div>
        <div class="menu-item" v-if="showType==='title' || showType==='leftBottom' || showType==='rightBottom' || showType==='rightTop'" @mousedown="openFormatDialog">
          <i class="el-icon-edit"></i><span style="margin-left: 5px">格式设置</span>
        </div>
      </div>
    </transition>
    <!--字段重命名-->
    <el-dialog title="重命名" :visible.sync="renameDialogVisible" v-if="renameDialogVisible" :append-to-body="true"
               @close="closeRenameDialog" custom-class="rename-dialog"
               width="35%" :close-on-click-modal="false" :close-on-press-escape="false">
      <template v-slot:default>
        <div class="rename-content">
          <div style="width: 300px">
            <span style="width: 60px;display: inline-block">字段别名</span>
            <el-input v-model="renameContent" style="width: 150px"></el-input>
          </div>
          <div style="margin-top: 10px;width: 600px">
            <span style="width: 60px;display: inline-block">列名称</span>
            <el-input v-model="item.name" :disabled="true" style="width: 150px"></el-input>
            <span style="width: 80px;display: inline-block;margin-left: 15px">列物理字段</span>
            <el-input v-model="item.key" :disabled="true" style="width: 150px"></el-input>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <el-button @click="closeRenameDialog">取 消</el-button>
        <el-button type="primary" @click="saveRenameContent">确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="格式设置" :visible.sync="formatDialogVisible" v-if="formatDialogVisible" :append-to-body="true"
               @close="closeFormatDialog" custom-class="rename-dialog"
               width="35%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="format" label-position="right" label-width="50px">
        <el-form-item label="前缀">
          <el-input style="width: 300px" v-model="format.prefix" placeholder="前缀"></el-input>
        </el-form-item>
        <el-form-item label="后缀">
          <el-input style="width: 300px" v-model="format.suffix" placeholder="后缀"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeFormatDialog">取 消</el-button>
        <el-button type="primary" @click="saveFormat">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import CustomUpload from "@/components/CustomUpload";

  export default {
    props: {
      isDraggable: {type: Boolean},
      colsArray: {type: Array},
      item: {type: Object}, //当前的设置字段
      showType: {type: String} //列设置为cols 过滤器为condFilters
    },

    components: {
      CustomUpload
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
        return this.showType === 'cols' || this.showType === 'querySort' || this.showType === 'headIocn' || this.showType === 'headTitle' || this.showType === 'headDescribe' || this.showType === 'title' || this.showType === 'leftBottom' || this.showType === 'rightBottom' || this.showType === 'conditions' || this.showType === 'enumConditions' || this.showType === 'rightTop' ? (this.item.alias ? this.item.alias : this.item.name) + '(' + this.item.key + ')'
            : (this.item.alias ? this.item.alias : this.item.name) + '(' + this.item.model + ')';
      }
    },

    data() {
      return {
        menuVisible: false,
        renameDialogVisible: false,
        formatDialogVisible: false,
        renameType: '',
        renameContent: '',
        colWidth: 0,
        excelNameContent: '',
        optBtnBaseSet: {
          label: '',
          imageId: ''
        },
        itemOptVisible: false,
        imgSrc: '',
        imgName: '',
        menuStyle: {},
        format: {
          prefix: "",
          suffix: ""
        }
      };
    },

    methods: {
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
        this.closeMenu();
      },
      openFormatDialog() {
        this.format = JSON.parse(JSON.stringify(this.item.format));
        this.formatDialogVisible = true;
      },
      closeFormatDialog() {
        this.formatDialogVisible = false;
      },
      saveFormat() {
        this.item.format = JSON.parse(JSON.stringify(this.format));
        this.closeFormatDialog();
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
      deleteQuerySort() {
        this.$emit('removeQuerySort', this.item);
      },
      onShowCondFilterConfigDialog() {
        this.$emit('showCondFilterConfigDialog', this.item);
      },
      onChangeSortType() {
        this.item.sort = this.item.sort === 1 ? 0 : 1;
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

  ::v-deep .rename-dialog {
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
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 25px;
  }
</style>
