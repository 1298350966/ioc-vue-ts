<template>
<div class="scrollBar">
  <div class="kanban-box" :style="kanbanBoxStyle">
    <div v-if="kanbanItems.length===0" title="当前图表无数据" class="no-data-message">
      <span>当前图表无数据</span>
    </div>
    <a class="sub-title" :href="item.style.subtitleUrl" target="_blank" v-if="item.style.subtitleVisible">
      {{item.style.subtitleText}}
    </a>
    <div :class="kanbanItemClass(index)" :style="[kanbanStyle,kanbanBorderStyle(index),kanbanItemPaddingStyle(index)]" v-for="(kanbanItem,index) in kanbanItems" :key="index">
      <div class="no-overflow kanban-item-container" :style="[kanbanContainerColorStyle,kanbanContainerBorderStyle]" ref="kanbanItemContainer">
        <div style="margin-top: 15px;margin-bottom: 15px;margin-left: 10px;margin-right: 10px">
          <div :style="kanbanMainPositionStyle">
            <div class="classAxis-value" :style="kanbanClassLabelStyle">
              <span :title="kanbanItem.classColVal">{{ kanbanItem.classColVal}}</span>
            </div>
            <div>
              <div class="valueAxis-main-label" :style="kanbanMainLabelStyle">
                <span :title="kanbanItem.valueCols[0].valueColName">{{kanbanItem.valueCols[0].valueColName}}</span>
              </div>
              <div class="valueAxis-main-value" :style="kanbanMainValueStyle">
              <span :title="kanbanItem.valueCols[0].valueColVal | formatFilters(item.data.valueAxis[0]) | dataUnitFilters(item.data.valueAxis[0], item)">
                {{ kanbanItem.valueCols[0].valueColVal | formatFilters(item.data.valueAxis[0]) | dataUnitFilters(item.data.valueAxis[0], item) }}
              </span>
              </div>
            </div>
          </div>
          <div class="valueAxis-vice-container" :style="kanbanVicePositionStyle">
            <div class="no-overflow" style="padding-right: 12px;display: flex;flex-direction: column;justify-content: space-around">
              <div class="valueAxis-vice-label" v-for="(valueCol,index1) in kanbanItem.valueCols" v-if="index1 >= 1" :key="index1" :style="kanbanViceLabelStyle">
                <span :title="valueCol.valueColName">{{valueCol.valueColName}}</span>
              </div>
            </div>
            <div class="no-overflow" style="display: flex;flex-direction: column;justify-content: space-around">
              <div class="valueAxis-vice-value" v-for="(valueCol,index1) in kanbanItem.valueCols" v-if="index1 >= 1" :key="index1" :style="kanbanViceValueStyle">
              <span :title="valueCol.valueColVal | formatFilters(item.data.valueAxis[index1]) | dataUnitFilters(item.data.valueAxis[index1], item) ">
                {{ valueCol.valueColVal | formatFilters(item.data.valueAxis[index1]) | dataUnitFilters(item.data.valueAxis[index1], item) }}
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    computed: {
      kanbanItemClass() {
        return function (index) {
          if (this.item.style.kanbanStyle === 0) {
            if ((index + 1) <= this.colNum * (this.rowNum - 1) && (index + 1) % this.colNum !== 0) {
              return 'kanban-item-rb';
            } else if ((index + 1) > this.colNum * (this.rowNum - 1) && this.rowNum !== 1 && (index + 1) % this.colNum !== 0) {
              return 'kanban-item-r';
            } else if ((index + 1) > this.colNum * (this.rowNum - 1) && this.rowNum === 1 && (index + 1) % this.colNum !== 0) {
              return 'kanban-item-r';
            } else if ((index + 1) <= this.colNum * (this.rowNum - 1) && (index + 1) % this.colNum === 0) {
              return 'kanban-item-b';
            } else {
              return 'kanban-item';
            }
          } else {
            return 'kanban-item';
          }
        };
      },
      kanbanItemPaddingStyle() {
        return function (index) {
          if (this.item.style.kanbanStyle === 1) {
            if (this.kanbanItems.length === 1) {
              return null;
            } else if (this.rowNum === 1) {
              if (index === 0) {
                return this.paddingRStyle;
              } else if (index === this.kanbanItems.length - 1) {
                return this.paddingLStyle;
              } else {
                return this.paddingRLStyle;
              }
            } else if (this.rowNum === 2) {
              if (index === 0) {
                return this.paddingRBStyle;
              } else if (index === this.kanbanItems.length - 1 && (index + 1) === this.rowNum * this.colNum) {
                return this.paddingTLStyle;
              } else if ((index + 1) % this.colNum === 0 && index !== this.kanbanItems.length - 1) {
                return this.paddingBLStyle;
              } else if ((index + 1 - 1) % this.colNum === 0 && index !== 0) {
                return this.paddingTRStyle;
              } else if ((index + 1) <= this.colNum) {
                return this.paddingRBLStyle;
              } else {
                return this.paddingTRLStyle;
              }
            } else if (this.rowNum > 2) {
              if (index === 0) {
                //左上角
                return this.paddingRBStyle;
              } else if (index === this.kanbanItems.length - 1 && (index + 1) === this.rowNum * this.colNum) {
                //右下角
                return this.paddingTLStyle;
              } else if ((index + 1) / this.colNum === 1) {
                //右上角
                return this.paddingBLStyle;
              } else if ((index + 1) === (this.rowNum - 1) * this.colNum + 1) {
                //左下角
                return this.paddingTRStyle;
              } else if ((index + 1) < this.colNum) {
                //最上边
                return this.paddingRBLStyle;
              } else if ((index + 1) > (this.rowNum - 1) * this.colNum + 1) {
                //最下边
                return this.paddingTRLStyle;
              } else if ((index + 1 - 1) % this.colNum === 0 && index !== 0) {
                //最左边
                return this.paddingTRBStyle;
              } else if ((index + 1) % this.colNum === 0) {
                //最右边
                return this.paddingTBLStyle;
              } else {
                //中间
                return this.paddingTRBLStyle;
              }
            }
          } else {
            return null;
          }
        };
      },
      kanbanBorderStyle() {
        return function (index) {
          if (this.item.style.kanbanStyle === 0) {
            if ((index + 1) <= this.colNum * (this.rowNum - 1) && (index + 1) % this.colNum !== 0) {
              return this.rbBorderStyle;
            } else if ((index + 1) > this.colNum * (this.rowNum - 1) && this.rowNum !== 1 && (index + 1) % this.colNum !== 0) {
              return this.rBorderStyle;
            } else if ((index + 1) > this.colNum * (this.rowNum - 1) && this.rowNum === 1 && (index + 1) % this.colNum !== 0) {
              return this.rBorderStyle;
            } else if ((index + 1) <= this.colNum * (this.rowNum - 1) && (index + 1) % this.colNum === 0) {
              return this.bBorderStyle;
            } else {
              return null;
            }
          } else {
            return null;
          }
        };
      }
    },

    props: {
      item: Object
    },

    watch: {
      "item.style": {
        handler: function (val) {
          this.initStyle();
        },
        deep: true
      }
    },

    mounted() {
      this.checkStyle();
      this.initStyle();
    },

    data() {
      return {
        kanbanItems: [],
        kanbanStyle: {},
        kanbanMainTitleStyle: {},
        kanbanClassLabelStyle: {},
        kanbanBoxStyle: {},
        kanbanMainLabelStyle: {},
        kanbanMainValueStyle: {},
        kanbanViceLabelStyle: {},
        kanbanViceValueStyle: {},
        kanbanMainPositionStyle: {},
        kanbanVicePositionStyle: {},
        kanbanContainerColorStyle: {},
        kanbanContainerBorderStyle: {
          'border': '1px solid #000000'
        },
        rBorderStyle: {
          'border-right-color': '#E8E8E8',
          'border-right-style': 'solid',
          'border-right-width': '2px',
        },
        bBorderStyle: {
          'border-bottom-color': '#E8E8E8',
          'border-bottom-style': 'solid',
          'border-bottom-width': '2px',
        },
        rbBorderStyle: {
          'border-right-color': '#E8E8E8',
          'border-right-style': 'solid',
          'border-right-width': '2px',
          'border-bottom-color': '#E8E8E8',
          'border-bottom-style': 'solid',
          'border-bottom-width': '2px'
        },
        paddingRStyle: {
          'padding-right': '5px'
        },
        paddingLStyle: {
          'padding-left': '5px'
        },
        paddingRLStyle: {
          'padding-right': '5px',
          'padding-left': '5px'
        },
        paddingRBStyle: {
          'padding-right': '5px',
          'padding-bottom': '5px'
        },
        paddingBLStyle: {
          'padding-bottom': '5px',
          'padding-left': '5px'
        },
        paddingTRStyle: {
          'padding-top': '5px',
          'padding-right': '5px'
        },
        paddingTLStyle: {
          'padding-top': '5px',
          'padding-left': '5px'
        },
        paddingTRBStyle: {
          'padding-top': '5px',
          'padding-right': '5px',
          'padding-bottom': '5px'
        },
        paddingRBLStyle: {
          'padding-right': '5px',
          'padding-bottom': '5px',
          'padding-left': '5px'
        },
        paddingTBLStyle: {
          'padding-top': '5px',
          'padding-bottom': '5px',
          'padding-left': '5px'
        },
        paddingTRLStyle: {
          'padding-top': '5px',
          'padding-right': '5px',
          'padding-left': '5px'
        },
        paddingTRBLStyle: {
          'padding-top': '5px',
          'padding-right': '5px',
          'padding-bottom': '5px',
          'padding-left': '5px'
        },
        datas: [],
        colNum: 1,
        rowNum: 1
      };
    },

    filters: {
      formatFilters: function (value, valueAxi) {
        if (value === null || value === 'null' || value === undefined) {
          return '—';
        }
        let valueStr = value.toString();
        if (valueAxi.hasOwnProperty('format')) {
          let places = valueAxi.format.places;
          let type = valueAxi.format.type;
          let formatValue = '';
          if (type === 'decimal') {
            if (places === '0') {
              formatValue = valueStr.split('.')[0];
            } else if (places === '1') {
              let strArray = valueStr.split('.');
              if (strArray.length > 1) {
                formatValue = strArray[0] + '.' + strArray[1].substring(0, 1);
              } else {
                formatValue = valueStr;
              }
            } else if (places === '2') {
              let strArray = valueStr.split('.');
              if (strArray.length > 1) {
                formatValue = strArray[0] + '.' + strArray[1].substring(0, 2);
              } else {
                formatValue = valueStr;
              }
            }
          } else if (type === 'percent') {
            if (places === '0') {
              formatValue = valueStr.split('.')[0] * 100 + '%';
            } else if (places === '1') {
              let strArray = valueStr.split('.');
              if (strArray.length > 1) {
                formatValue = (strArray[0] + '.' + strArray[1].substring(0, 1)) * 100 + '%';
              } else {
                formatValue = valueStr * 100 + '%';
              }
            } else if (places === '2') {
              let strArray = valueStr.split('.');
              if (strArray.length > 1) {
                formatValue = (strArray[0] + '.' + strArray[1].substring(0, 2)) * 100 + '%';
              } else {
                formatValue = valueStr * 100 + '%';
              }
            }
          } else if (type === 'default') {
            formatValue = valueStr;
          }
          return formatValue;
        }
        return valueStr;
      },
      dataUnitFilters: function (value, valueAxi, item) {
        if (value === '—') {
          return '—';
        }
        let valueStr = value.toString();
        for (let i = 0; i < item.style.dataUnit.length; i++) {
          let dataUnitItem = item.style.dataUnit[i];
          if (valueAxi.id === dataUnitItem.data.id) {
            let prefix = dataUnitItem.prefix;
            let suffix = dataUnitItem.suffix;
            return prefix + valueStr + suffix;
          }
        }
        return valueStr;
      }
    },

    methods: {
      //控件初始化
      initStyle() {
        this.renderKanbanMainTitle();
        this.renderKanbanBackgroundColor();
        this.renderKanbanLineStyle();
        this.renderKanbanFontStyle();
        this.renderKanbanPosition();
        this.renderKanbanBorder();
        this.renderGapSize();
        this.$nextTick(() => {
          this.renderKanbanOverFlowStyle();
        });
      },
      //样式配置初始化
      checkStyle() {
        if (!this.item.style.hasOwnProperty('dataUnit')) {
          this.$set(this.item.style, 'dataUnit', []);
        }
        if (!this.item.style.hasOwnProperty('kanbanStyle')) {
          this.$set(this.item.style, 'kanbanStyle', 0);
        }
        if (!this.item.style.hasOwnProperty('fillColor')) {
          this.$set(this.item.style, 'fillColor', '#FFFFFF');
        }
        if (!this.item.style.hasOwnProperty('gapSize')) {
          this.$set(this.item.style, 'gapSize', '5px');
        }
      },

      renderGapSize() {
        this.$set(this.paddingRStyle, 'padding-right', this.item.style.gapSize);
        this.$set(this.paddingLStyle, 'padding-left', this.item.style.gapSize);
        this.$set(this.paddingRLStyle, 'padding-right', this.item.style.gapSize);
        this.$set(this.paddingRLStyle, 'padding-left', this.item.style.gapSize);
        this.$set(this.paddingRBStyle, 'padding-right', this.item.style.gapSize);
        this.$set(this.paddingRBStyle, 'padding-bottom', this.item.style.gapSize);
        this.$set(this.paddingBLStyle, 'padding-bottom', this.item.style.gapSize);
        this.$set(this.paddingBLStyle, 'padding-left', this.item.style.gapSize);
        this.$set(this.paddingTRStyle, 'padding-top', this.item.style.gapSize);
        this.$set(this.paddingTRStyle, 'padding-right', this.item.style.gapSize);
        this.$set(this.paddingTLStyle, 'padding-top', this.item.style.gapSize);
        this.$set(this.paddingTLStyle, 'padding-left', this.item.style.gapSize);
        this.$set(this.paddingTRBStyle,'padding-top', this.item.style.gapSize)
        this.$set(this.paddingTRBStyle, 'padding-right', this.item.style.gapSize);
        this.$set(this.paddingTRBStyle, 'padding-bottom', this.item.style.gapSize);
        this.$set(this.paddingRBLStyle, 'padding-right', this.item.style.gapSize);
        this.$set(this.paddingRBLStyle, 'padding-bottom', this.item.style.gapSize);
        this.$set(this.paddingRBLStyle, 'padding-left', this.item.style.gapSize);
        this.$set(this.paddingTBLStyle, 'padding-top', this.item.style.gapSize);
        this.$set(this.paddingTBLStyle, 'padding-bottom', this.item.style.gapSize);
        this.$set(this.paddingTBLStyle, 'padding-left', this.item.style.gapSize);
        this.$set(this.paddingTRLStyle, 'padding-top', this.item.style.gapSize);
        this.$set(this.paddingTRLStyle, 'padding-right', this.item.style.gapSize);
        this.$set(this.paddingTRLStyle, 'padding-left', this.item.style.gapSize);
        this.$set(this.paddingTRBLStyle, 'padding-top', this.item.style.gapSize);
        this.$set(this.paddingTRBLStyle, 'padding-right', this.item.style.gapSize);
        this.$set(this.paddingTRBLStyle, 'padding-bottom', this.item.style.gapSize);
        this.$set(this.paddingTRBLStyle, 'padding-left', this.item.style.gapSize);
      },

      renderKanbanBorder() {
        if (this.item.style.kanbanStyle === 0) {
          if (this.kanbanContainerBorderStyle.hasOwnProperty('border')) {
              this.$delete(this.kanbanContainerBorderStyle, 'border');
          }
          if (this.item.style.borderColor === null) {
            this.$delete(this.rBorderStyle, 'border-right-color');
            this.$delete(this.bBorderStyle, 'border-bottom-color');
            this.$delete(this.rbBorderStyle, 'border-right-color');
            this.$delete(this.rbBorderStyle, 'border-bottom-color');
            this.$delete(this.rBorderStyle, 'border-right-style');
            this.$delete(this.bBorderStyle, 'border-bottom-style');
            this.$delete(this.rbBorderStyle, 'border-right-style');
            this.$delete(this.rbBorderStyle, 'border-bottom-style');
            this.$delete(this.rBorderStyle, 'border-right-width');
            this.$delete(this.bBorderStyle, 'border-bottom-width');
            this.$delete(this.rbBorderStyle, 'border-right-width');
            this.$delete(this.rbBorderStyle, 'border-bottom-width');
          } else {
            this.$set(this.rBorderStyle, 'border-right-color', this.item.style.borderColor);
            this.$set(this.bBorderStyle, 'border-bottom-color', this.item.style.borderColor);
            this.$set(this.rbBorderStyle, 'border-right-color', this.item.style.borderColor);
            this.$set(this.rbBorderStyle, 'border-bottom-color', this.item.style.borderColor);
            this.$set(this.rBorderStyle, 'border-right-style', this.item.style.borderStyle);
            this.$set(this.bBorderStyle, 'border-bottom-style', this.item.style.borderStyle);
            this.$set(this.rbBorderStyle, 'border-right-style', this.item.style.borderStyle);
            this.$set(this.rbBorderStyle, 'border-bottom-style', this.item.style.borderStyle);
            this.$set(this.rBorderStyle, 'border-right-width', this.item.style.borderWidth);
            this.$set(this.bBorderStyle, 'border-bottom-width', this.item.style.borderWidth);
            this.$set(this.rbBorderStyle, 'border-right-width', this.item.style.borderWidth);
            this.$set(this.rbBorderStyle, 'border-bottom-width', this.item.style.borderWidth);
          }
        } else {
          if (this.item.style.borderColor === null) {
            this.$delete(this.kanbanContainerBorderStyle, 'border');
          } else {
            this.$set(this.kanbanContainerBorderStyle, 'border', `${this.item.style.borderWidth} ${this.item.style.borderStyle} ${this.item.style.borderColor}`);
          }
        }
      },

      renderKanbanBackgroundColor() {
        this.$set(this.kanbanBoxStyle, 'background-color', this.item.style.backgroundColor);
        if (this.item.style.kanbanStyle === 1) {
          this.$set(this.kanbanContainerColorStyle, 'background-color', this.item.style.fillColor);
        } else {
          if (this.kanbanContainerColorStyle.hasOwnProperty('background-color')) {
            this.$delete(this.kanbanContainerColorStyle, 'background-color');
          }
        }
      },

      renderKanbanFontStyle() {
        if (this.item.style.fontSetVisible) {
          this.$set(this.kanbanClassLabelStyle, 'font-size', this.item.style.classLabelSize);
          this.$set(this.kanbanClassLabelStyle, 'color', this.item.style.classLabelColor);
          this.$set(this.kanbanMainLabelStyle, 'font-size', this.item.style.mainLabelSize);
          this.$set(this.kanbanMainLabelStyle, 'color', this.item.style.mainLabelColor);
          this.$set(this.kanbanMainValueStyle, 'font-size', this.item.style.mainValueSize);
          this.$set(this.kanbanMainValueStyle, 'color', this.item.style.mainValueColor);
          this.$set(this.kanbanViceLabelStyle, 'font-size', this.item.style.viceLabelSize);
          this.$set(this.kanbanViceLabelStyle, 'color', this.item.style.viceLabelColor);
          this.$set(this.kanbanViceValueStyle, 'font-size', this.item.style.viceValueSize);
          this.$set(this.kanbanViceValueStyle, 'color', this.item.style.viceValueColor);
        } else {
          this.$set(this.kanbanClassLabelStyle, 'font-size', '12px');
          this.$set(this.kanbanClassLabelStyle, 'color', 'rgba(0, 0, 0, 1)');
          this.$set(this.kanbanMainLabelStyle, 'font-size', '12px');
          this.$set(this.kanbanMainLabelStyle, 'color', 'rgba(0, 0, 0, 0.5)');
          this.$set(this.kanbanMainValueStyle, 'font-size', '24px');
          this.$set(this.kanbanMainValueStyle, 'color', 'rgba(0, 0, 0, 1)');
          this.$set(this.kanbanViceLabelStyle, 'font-size', '12px');
          this.$set(this.kanbanViceLabelStyle, 'color', 'rgba(0, 0, 0, 0.5)');
          this.$set(this.kanbanViceValueStyle, 'font-size', '12px');
          this.$set(this.kanbanViceValueStyle, 'color', 'rgba(0, 0, 0, 1)');
        }
      },

      renderKanbanMainTitle() {
        this.$set(this.kanbanMainTitleStyle, 'color', this.item.style.mainTitleColor);
      },

      //渲染超出浮动后显示滚动条
      renderKanbanOverFlowStyle() {
        if (this.kanbanItems.length > 0) {
          let kanbanItem = this.$refs['kanbanItemContainer'][0];
          let cHeight = kanbanItem.clientHeight;
          let sHeight = kanbanItem.scrollHeight;
          if (sHeight > cHeight) { //超过
            this.$set(this.kanbanStyle, 'height', null);
            this.$set(this.kanbanBoxStyle, 'padding-right', '3px');
          } else {
            this.$set(this.kanbanStyle, 'height', 100 / this.rowNum + '%');
            if (this.kanbanBoxStyle.hasOwnProperty('padding-right')) {
              this.$delete(this.kanbanBoxStyle, 'padding-right');
            }
          }
        }
      },

      //渲染行列占比
      renderKanbanLineStyle() {
        if (this.item.style.maxPerLineBlock <= 0) {
          this.item.style.maxPerLineBlock = 1;
        }
        let maxPerLineBlock = this.item.style.maxPerLineBlock;
        this.colNum = maxPerLineBlock;
        if (this.kanbanItems.length >= maxPerLineBlock) {
          this.$set(this.kanbanStyle, 'width', 100 / maxPerLineBlock + '%');
        } else {
          this.$set(this.kanbanStyle, 'width', 100 / this.kanbanItems.length + '%');
          this.colNum = this.kanbanItems.length;
        }
        this.rowNum = Math.ceil(this.kanbanItems.length / this.colNum);
        this.$set(this.kanbanStyle, 'height', 100 / this.rowNum + '%');
      },

      //渲染看板的布局
      renderKanbanPosition() {
        if (this.item.style.kanbanPosition === 0) {
          this.$set(this.kanbanMainPositionStyle, 'text-align', 'left');
          this.$set(this.kanbanVicePositionStyle, 'justify-content', 'flex-start');
        } else if (this.item.style.kanbanPosition === 1) {
          this.$set(this.kanbanMainPositionStyle, 'text-align', 'center');
          this.$set(this.kanbanVicePositionStyle, 'justify-content', 'center');
        }
      },

      //渲染看板数据
      renderKanban(item, res) {
        this.kanbanItems = [];
        let classAxi = item.data.classAxis[0];
        this.datas = res.datas;
        this.datas.forEach(resItem => {
          let kanbanItem = {
            classColVal: '',
            valueCols: [],
          };
          let classColVal = '';
          if (this.KHUtils.isNull(classAxi.express)) {
            if (this.KHUtils.isNull(classAxi.dateDim)) {
              classColVal = resItem[classAxi.column + '_' + classAxi.id];
            } else {
              classColVal = resItem[classAxi.column + '_' + classAxi.dateDim + '_' + +classAxi.id];
            }
          } else {
            classColVal = resItem[classAxi.alias + '_' + classAxi.id];
          }
          kanbanItem.classColVal = classColVal;
          if (!this.KHUtils.isNull(kanbanItem.classColVal)) {
            item.data.valueAxis.forEach(valueAxi => {
              let valueColVal = '';
              let valueColName = '';
              if (valueAxi.dataType === "String") {
                if (this.KHUtils.isNull(valueAxi.express)) {
                  valueColName = valueAxi.column + '_' + valueAxi.aggregate;
                  valueColVal = resItem[valueAxi.column + '_' + valueAxi.id];
                } else {
                  valueColName = valueAxi.alias;
                  valueColVal = resItem[valueAxi.alias + "_" + valueAxi.id];
                }
              } else {
                if (valueAxi.aggregate !== 'none') {
                  valueColName = valueAxi.column + '_' + valueAxi.aggregate;
                  if (!this.KHUtils.isNull(valueAxi.alias)) {
                    valueColName = valueAxi.alias;
                  }
                  if (this.KHUtils.isNull(valueAxi.express)) {
                    valueColVal = resItem[valueAxi.column + '_' + valueAxi.aggregate + '_' + valueAxi.id];
                  } else {
                    valueColVal = resItem[valueAxi.alias + "_" + valueAxi.aggregate + '_' + valueAxi.id];
                  }
                }
              }
              kanbanItem.valueCols.push({
                valueColName: valueColName,
                valueColVal: valueColVal
              });
            });
            if (kanbanItem.valueCols.length > 0) {
              if (!this.KHUtils.isNull(kanbanItem.valueCols[0].valueColVal) && !this.KHUtils.isUndefined(kanbanItem.valueCols[0].valueColVal)) {
                this.kanbanItems.push(kanbanItem);
              }
            }
          }
        });
        this.item.data = JSON.parse(JSON.stringify(this.item.data));
        this.initStyle();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .scrollBar{
    height: 100%;
    width: 100%;
    position: relative;
    box-sizing: border-box;
    overflow:auto;
  }
  .kanban-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    overflow: auto;
    position: relative;

    .no-data-message {
      border: 2px solid #F3F3F3;
      overflow: hidden;
      font-size: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 8px 20px;
      color: rgba(0, 0, 0, 0.5);
      margin: auto;
    }

    .sub-title {
      color: #000000;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
        color: #409eff;
      }
      position: absolute;
      right: 0px;
      top: 0px;
      z-index: 1;
    }

    .kanban-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
    }

    .kanban-item-rb {
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
    }

    .kanban-item-b {
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
    }

    .kanban-item-r {
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
    }

    .kanban-item-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .valueAxis-vice-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      flex-wrap: nowrap;
    }

    .classAxis-value {
      color: #000000;
      font-weight: bold;
      @extend .no-warp-ell-100;
    }

    .valueAxis-main-label {
      color: rgba(0, 0, 0, 0.5);
      @extend .no-warp-ell-100;
    }

    .valueAxis-main-value {
      color: #000000;
      font-weight: bold;
      line-height: 1.5;
      @extend .no-warp-ell-100;
    }

    .valueAxis-vice-label {
      color: rgba(0, 0, 0, 0.5);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .valueAxis-vice-value {
      color: #333333;
      font-weight: bold;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }

    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

      &:hover {
        background: #535353;
      }

      background: #C5C5C5;
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #EBEBED;
    }
  }

  //不换行并显示文字省略号占比100
  .no-warp-ell-100 {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .no-overflow {
    overflow: hidden;
  }
</style>
