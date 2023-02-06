<template>
  <el-container id="container">
    <el-header class="myHeader" style="height:50px;background-color: #0B1532">
      <span style="color: white">数据集： </span><span class="blueFont">{{dataSetConf.dsName}}</span>
      <div style="float: right">
        <el-button type="primary" @click="saveDataSetConf">保存</el-button>
      </div>

    </el-header>
    <el-container style="height: 650px">
      <el-aside width="250px">
        <div class="search" style="height: 5%;">
          <el-input
            prefix-icon="el-icon-search"
            placeholder="输入关键字搜索"
            v-model="filterText">
          </el-input>
        </div>
        <el-container style="height: 48%">
          <el-header class="myHeader headerTitle" style="height:30px;background-color: #2b3551">
            <span class="whiteFont">维度</span>
            <div style="float: right;color: white">
              <i class="el-icon-setting" style="cursor: pointer"  @click="openColumnsSetDialog(1)"></i>
              <i class="el-icon-plus" style="cursor: pointer" @click="addDim"></i>
            </div>
          </el-header>
          <el-main class="columnsList">
            <el-tree
              class="dataSetTree"
              @node-contextmenu="handleDimContextMenu"
              :data="dimTreeData"
              @node-click="handleHiddenContextMenu"
              node-key="treeKey"
              :filter-node-method="filterNode"
              ref="dimTree"
              :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="blueFont" v-if="data.dataType==='String'" style="margin-right: 5px">Str.</span>
                <span class="blueFont" v-else-if="data.dataType==='Timestamp' || data.dataType==='Date' || data.dataType==='Time'" style="margin-right: 5px">Date.</span>
                <span class="blueFont" v-else-if="data.dataType==='Number'" style="margin-right: 5px">No.</span>
                <el-tooltip  effect="dark" :content="getDimOrMeasureTitle(data)" placement="bottom" :open-delay="500">
                  <span class="whiteFont title-span">{{getDimOrMeasureTitle(data)}}</span>
                </el-tooltip>
                <span class="dim-measure-set-icon" style="font-size: 10px;color: white" v-if="haveMenu(node)">
                  <i class="el-icon-setting el-icon--right" @click.stop="handleIconOpenDimContextMenu($event, data, node)"></i>
                </span>
                <!--<span class="dim-measure-set-icon">
                  <el-dropdown trigger="click" @command="handleCommand" v-if="haveMenu(node)">
                    <span class="el-dropdown-link" style="font-size: 10px;color: white">
                      <i class="el-icon-setting el-icon&#45;&#45;right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-edit" :command="beforeHandleCommand(node, data, 'dimEdit')">
                         编辑
                      </el-dropdown-item>
                      <el-dropdown-item v-if="data.dataType != 'Date' && data.dataType !='Timestamp'" icon="el-icon-sort" :command="beforeHandleCommand(node, data, 'switchMeasure')">
                        转换为度量
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-delete" :command="beforeHandleCommand(node, data, 'deleteDim')" >
                         删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>-->
              </span>
            </el-tree>
          </el-main>
        </el-container>
        <el-container style="height: 47%;">
          <el-header class="myHeader headerTitle" style="height:30px;background-color: #2B3551">
            <span class="whiteFont">度量</span>
            <div style="float: right;color: white">
              <i class="el-icon-setting" style="cursor: pointer" @click="openColumnsSetDialog(2)"></i>
              <i class="el-icon-plus" style="cursor: pointer" @click="addMeasume"></i>
            </div>
          </el-header>
          <el-main class="columnsList">
            <el-tree
              class="dataSetTree"
              @node-contextmenu="handleMeasureContextMenu"
              :data="measureTreeData"
              :filter-node-method="filterNode"
              @node-click="handleHiddenContextMenu"
              ref="measureTree"
              :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="greenFont" v-if="data.dataType==='String'" style="margin-right: 5px">Str.</span>
                <span class="greenFont" v-else-if="data.dataType==='Timestamp' || data.dataType==='Date' || data.dataType==='Time'" style="margin-right: 5px">Date.</span>
                <span class="greenFont" v-else-if="data.dataType==='Number'" style="margin-right: 5px">No.</span>
                <el-tooltip  effect="dark" :content="getDimOrMeasureTitle(data)" placement="bottom" :open-delay="500">
                  <span class="whiteFont title-span">{{getDimOrMeasureTitle(data)}}</span>
                </el-tooltip>
                <span class="dim-measure-set-icon" style="font-size: 10px;color: white" v-if="haveMenu(node)">
                  <i class="el-icon-setting el-icon--right" @click.stop="handleIconOpenMeasureContextMenu($event, data, node)"></i>
                </span>
                <!--<span class="dim-measure-set-icon">
                  <el-dropdown trigger="click" @command="handleCommand" v-if="!node.data.children || node.data.children.length == 0">
                    <span class="el-dropdown-link" style="font-size: 10px;color: white">
                     <i class="el-icon-setting el-icon&#45;&#45;right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-edit" :command="beforeHandleCommand(node,data,'measureEdit')">
                         编辑
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-sort" :command="beforeHandleCommand(node,data,'switchDim')">
                        转换为维度
                       </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-delete-solid" :command="beforeHandleCommand(node,data,'deleteMeasure')" >
                         删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>-->
              </span>
            </el-tree>
          </el-main>
        </el-container>
      </el-aside>
      <el-container>
        <!--<el-header class="myHeader" style="height:50px;">Header</el-header>-->
        <el-main style="background: white">
          <div class="rightButton" v-if="activeName == 'first'">
            <el-button type="primary" @click="queryDataSetInfo">刷新数据</el-button>
            <el-button type="primary" @click="showCondDialog">设置过滤条件</el-button>
            <el-button type="primary" @click="syncDataSet">同步表结构</el-button>
          </div>
          <!-- <div style=" z-index:99" v-if="activeName == 'second'" @click="saveATable">
             <el-button type="primary" @click="saveATable">保存关联表</el-button>
           </div>-->
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="height: 100%;z-index:50"
                   class="data-tabs">
            <el-tab-pane label="数据预览" name="first">
              <el-row style="margin-bottom: 10px" v-if="isRefresh">
                <el-table
                  :data="tableData"
                  border
                  stripe
                  height="500"
                  class="tableTitle"
                  v-loading="listLoading"
                >
                  <el-table-column :prop="getTableColumnName(item)" :show-overflow-tooltip='true' align="center" minWidth="150"
                                   v-for="(item,index) in columns" v-bind:key="index" style="width: auto">
                    <template slot="header" slot-scope="scope">
                      <el-tooltip class="item" effect="dark" :content="item.table" placement="top-start" :open-delay="500">
                        <div style="color: #555C70">
                          {{item.table}}
                        </div>
                      </el-tooltip>
                      <div>
                        <span class="blueFont" v-if="item.dataType==='String'">Str.</span>
                        <span class="blueFont"
                              v-else-if="item.dataType==='Timestamp' || item.dateType==='Date' || item.dateType==='Time'">Date.</span>
                        <span class="greenFont" v-else-if="item.dataType==='Number'">No</span>
                        <span class="blueFont" v-else>{{item.dataType}}</span>
                      </div>
                      <el-tooltip class="item" effect="dark" v-if="item.alias" :content="item.alias + '('+ item.column + ')'"
                                  placement="top-start" :open-delay="500">
                        <div style="color: #333333">{{item.alias}}<span v-if="item.alias">({{item.column}})</span></div>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" v-else :content="item.column" placement="top-start" :open-delay="500">
                        <div style="color: #333333"><span>{{item.column}}</span></div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
                <p style="width: 96%;margin: 0 auto">
                  <el-pagination
                    layout="prev, pager, next"
                    :current-page="params.pageNum"
                    @current-change="handleCurrentChange"
                    :total="totalPage" style="float: right">
                  </el-pagination>
                </p>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="关联表" name="second" style="overflow: auto;z-index: 50">
              <data-set-a-table :dsMeta="dsMeta" ref="ATableChild" :dataSetId="dataSetId" :datasourceId="datasourceId"
                                @saveATable="saveATable" @deleteJoinTable="deleteJoinTable"></data-set-a-table>
            </el-tab-pane>
          </el-tabs>

        </el-main>
      </el-container>
    </el-container>
    <el-dialog :title="isDim== true?'维度重命名':'度量重命名'" :close-on-click-modal="false" :visible.sync="columnsSetDialogVisible"
               close="columnsSetDialogVisible = false" :modal="false">
      <el-row style="margin-bottom: 30px;margin-left: 30px;margin-right: 30px">
        <el-table
          :data="isDim== true?dimColumns:measureColumns"
          border
          stripe
          style="width: 100%;"
        >
          <el-table-column :label="isDim== true?'维度':'度量'" align="center">
            <template slot-scope="scope">
              <span class="blueFont"> {{scope.row.column}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="table" label="所属表" align="center">
          </el-table-column>
          <el-table-column prop="dataType" label="类型" align="center">
          </el-table-column>
          <el-table-column prop="desc" :label="isDim== true?'维度描述':'度量描述'" align="center">
          </el-table-column>
          <el-table-column :label="isDim== true?'维度别名':'度量别名'" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.alias" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.column"
                         @click="deleteDimOrMeasure(scope.$index, isDim== true?dimColumns:measureColumns)" icon="el-icon-delete" circle
                         type="danger" size="small" slot="reference">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="columnsSetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveColumnsRename">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="primitiveColumnTitle" :close-on-click-modal="false" :modal="false" :visible="primitiveColumnDialogVisible"
               top="12%" width="35%" @close="closePrimitiveColumnDialog">
      <el-row style="padding: 2% 5% 0% 7%;border-bottom: 1px solid #EEEEEE;border-top: 1px solid #EEEEEE">
        <el-form label-width="100px"  label-position="right" :model="primitiveColumn" ref="primitiveColumn">
          <el-form-item :label="primitiveColumn.editType === 'dimEdit' ? '维度别名' : '度量别名'" prop="alias">
            <el-input v-model="primitiveColumn.alias" style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="物理字段名" prop="column">
            <el-input v-model="primitiveColumn.column" :disabled="true" style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="字段描述" prop="desc">
            <el-input v-model="primitiveColumn.desc" type="textarea" style="width: 80%"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row style="display: flex;flex-direction: row;justify-content: flex-end;padding-top: 15px;padding-right: 15px;padding-bottom: 15px">
        <el-button @click="closePrimitiveColumnDialog">取消</el-button>
        <el-button type="primary" @click="savePrimitiveColumn">确定</el-button>
      </el-row>
    </el-dialog>
    <el-dialog title="编辑计算字段（度量）" :close-on-click-modal="false" :visible.sync="addMeasumeDialogVisible" @close="closeAddMeasumeDialog"
               :modal="false">
      <el-tabs v-model="measureActiveName" type="border-card">
        <el-tab-pane name="first">
          <span slot="label"><i class="el-icon-edit"></i> 自定义编写</span>
          <el-row>
            <el-form :model="measureColumn" label-width="120px" :rules="measureCustomRules" ref="measureCustomColumn">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="名称" prop="alias">
                    <el-input v-model="measureColumn.alias" placeholder="请输入字段名称" style="width: 50%"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="表达式"  prop="express">
                    <el-popover
                      trigger="manual"
                      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                      v-model="measureSelectListVisible">
                      <i class="el-icon-close" style="position: absolute;right: 5px;top: 5px;cursor: pointer" @click="measureSelectListVisible=false"></i>
                      <ul style="padding: 5px 15px 15px 0px;height: 250px;overflow: auto;">
                        <li v-for="(group,index1) in columnsGroup" :key="index1">
                          <span style="font-size: small;color: grey">{{group.label}}</span>
                          <ul>
                            <li v-for="(item,index2) in group.options" :key="index2"
                                class="express-columns" @click="columnSelect(item, 'measureExpressInput')">
                              <span>{{ item.alias?item.alias + '(' +item.column + ')' : item.column }}</span>
                              <span class="express-str" v-if="item.dataType==='Number'">No</span>
                              <span class="express-no" v-else>{{ item.dataType==="String"?"Str.":"Date" }}</span>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <textarea id="measureExpressInput" class="express-text" slot="reference"
                                v-model="measureColumn.express" @keydown.219="callMeasureSelectList"/>
                    </el-popover>
                    <i class="el-icon-info" style="font-style: normal;font-size: 12px;color: #999">
                      可通过[ 唤出列表来插入维度或度量字段名
                    </i>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="字段描述" prop="desc">
                    <el-input type="textarea" v-model="measureColumn.desc"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="数据类型" prop="dataType">
                <el-radio v-model="measureColumn.dataType" label="String">文本</el-radio>
                <el-radio v-model="measureColumn.dataType" label="Number">数值</el-radio>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row style="display: flex;flex-direction: row;justify-content: flex-end">
            <el-button @click="closeAddMeasumeDialog">取消</el-button>
            <el-button type="primary" @click="saveCustomMeasume">确定</el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="second" v-if="measureKjVisible">
          <span slot="label"><i class="el-icon-edit-outline"></i> 快捷编辑</span>
          <el-form :model="measureColumn" label-width="120px" :rules="measureRules" ref="measureColumn">
            <el-row>
              <el-col :span="24">
                <el-form-item label="字段名称" prop="alias">
                  <el-input v-model="measureColumn.alias" placeholder="请输入字段名称" style="width: 50%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="aggregate-input-row">
              <span style="margin-left: 42px" class="aggregate-input">聚合类型</span>
              <el-select style="margin-left: 15px" v-model="addMeasumeType" placeholder="请选择">
                <el-option
                  v-for="item in measureFunctionType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span style="margin-left: 15px" class="aggregate-input">聚合字段</span>
              <el-select style="margin-left: 15px" v-model="measureName" placeholder="请选择" filterable
                         @change="measureSelect">
                <el-option
                  v-for="(item ,index) in columns"
                  :key="index"
                  :label="item.alias? item.table+'.'+item.column+ '(' +item.alias + ')' : item.table+'.'+item.column "
                  :value="'['+item.table+'.'+item.column+']'">
                </el-option>
              </el-select>
            </el-row>
            <el-form-item label="字段描述" prop="desc" style="margin-top: 20px">
              <el-input v-model="measureColumn.desc" style="width: 80%" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="数据类型" prop="dataType" style="margin-top: 20px">
              <el-radio v-model="measureColumn.dataType" label="String">文本</el-radio>
              <el-radio v-model="measureColumn.dataType" label="Number">数值</el-radio>
            </el-form-item>
          </el-form>
          <el-row style="display: flex;flex-direction: row;justify-content: flex-end">
            <el-button @click="closeAddMeasumeDialog">取消</el-button>
            <el-button type="primary" @click="saveMeasume">确定</el-button>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--新增维度-->
    <el-dialog title="编辑计算字段（维度）" :close-on-click-modal="false" :visible.sync="addDimDialogVisible" @close="closeAddDimDialog" :modal="false">
      <el-tabs v-model="dimActiveName" type="border-card">
        <el-tab-pane name="first">
          <span slot="label"><i class="el-icon-edit"></i> 自定义编写</span>
          <el-row>
            <el-form :model="dimColumn" label-width="120px" :rules="dimCustomRules" ref="dimCustomColumn">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="名称" prop="alias">
                    <el-input v-model="dimColumn.alias" placeholder="请输入字段名称" style="width: 50%"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="表达式"  prop="express">
                    <el-popover
                      trigger="manual"
                      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                      v-model="dimSelectListVisible">
                      <i class="el-icon-close" style="position: absolute;right: 5px;top: 5px;cursor: pointer" @click="dimSelectListVisible=false"></i>
                      <ul style="padding: 5px 15px 15px 0px;height: 250px;overflow: auto;">
                        <li v-for="(group,index1) in columnsGroup" :key="index1">
                          <span style="font-size: small;color: grey">{{group.label}}</span>
                          <ul>
                            <li v-for="(item,index2) in group.options" :key="index2"
                                class="express-columns" @click="columnSelect(item,'dimExpressInput')">
                              <span>{{ item.alias?item.alias + '(' +item.column + ')' : item.column }}</span>
                              <span class="express-str" v-if="item.dataType==='Number'">No</span>
                              <span class="express-no" v-else>{{ item.dataType==="String"?"Str.":"Date" }}</span>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <textarea id="dimExpressInput" class="express-text" slot="reference"
                                v-model="dimColumn.express" @keydown.219="callDimSelectList"/>
                    </el-popover>
                    <i class="el-icon-info" style="font-style: normal;font-size: 12px;color: #999">
                      可通过[ 唤出列表来插入维度或度量字段名
                    </i>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="字段描述" prop="desc">
                    <el-input type="textarea" v-model="dimColumn.desc"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="数据类型" prop="dataType">
                <el-radio v-model="dimColumn.dataType" label="String">文本</el-radio>
                <el-radio v-model="dimColumn.dataType" label="Number">数值</el-radio>
                <el-radio v-model="dimColumn.dataType" label="Date">日期时间</el-radio>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row style="display: flex;flex-direction: row;justify-content: flex-end">
            <el-button @click="closeAddDimDialog">取消</el-button>
            <el-button type="primary" @click="saveCustomDim">确定</el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="second" v-if="dimKjVisible">
          <span slot="label"><i class="el-icon-edit-outline"></i> 快捷编辑</span>
          <el-form :model="dimColumn" label-width="120px" :rules="dimRules" ref="dimColumn">
            <el-row>
              <el-col :span="24">
                <el-form-item label="字段名称" prop="alias">
                  <el-input v-model="dimColumn.alias" placeholder="请输入字段名称" style="width: 50%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="分组字段" prop="column">
                  <el-select v-model="dimName" placeholder="请选择" filterable @change="dimSelect">
                    <el-option
                      v-for="(item ,index) in columns"
                      :key="index"
                      :label="item.alias? item.table+'.'+item.column+ '(' +item.alias + ')' : item.table+'.'+item.column"
                      :value="'['+item.table+'.'+item.column+']'">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="字段描述" prop="desc">
                  <el-input type="textarea" v-model="dimColumn.desc"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="数据类型" prop="dataType">
                  <el-radio v-model="dimColumn.dataType" label="String">文本</el-radio>
                  <el-radio v-model="dimColumn.dataType" label="Number">数值</el-radio>
                  <el-radio v-model="dimColumn.dataType" label="Date">日期时间</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="display: flex;flex-direction: row;align-items: center;margin-left: 50px">
              <el-button size="mini" @click="addDimExpress" icon="el-icon-edit"
                         type="primary">添加
              </el-button>
            </el-row>
            <el-row style="padding-top: 10px;margin-left: 30px;margin-bottom: 30px">
              <el-table :data="dimExpressData" size="mini" highlight-current-row
                        border style="width: 95%">
                <el-table-column label="分组名称">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.groupName" placeholder="请输入分组名称"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="左区间">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.leftValue" placeholder="请输入左区间值"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="model" label="条件" width="80">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.leftType" placeholder="请选择"
                               size="mini" value="">
                      <el-option
                        v-for="(item,key) in expressType"
                        :key="key"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="分组字段" prop="columnName">
                </el-table-column>
                <el-table-column prop="model" label="条件" width="80">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.rightType" placeholder="请选择"
                               size="mini" value="">
                      <el-option
                        v-for="(item,index) in expressType"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="右区间">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.rightValue" placeholder="请输入右区间值"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger"
                               @click="deleteDimExpress(scope.$index, scope.row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-form>
          <el-row style="display: flex;flex-direction: row;justify-content: flex-end">
            <el-button @click="closeAddDimDialog">取消</el-button>
            <el-button type="primary" @click="saveDim">确定</el-button>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog title="数据集过滤条件设置" custom-class="filter-dialog" :visible.sync="filterVisible" :modal="false" @open="setCondFilters"
               @close="cancelFilterDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <data-set-filter :dsId="dataSetId" ref="dataSetFilter" @cancel="cancelFilterDialog"
                       @save="saveCondFilters"></data-set-filter>
    </el-dialog>
    <div class="custom-dropdown-menu" @click.stop>
      <div class="menu-item" v-if="customDimMenuVisible" @click="handleCommand(dimTreeItemObject, 'dimEdit')">
        <i class="el-icon-edit"></i><span style="margin-left: 5px">编辑</span>
      </div>
      <div class="menu-item" v-if="customDimMenuVisible && !dimTreeItemObject.data.express&&(dimTreeItemObject.data.dataType==='String' || dimTreeItemObject.data.dataType==='Number')"
           @click="handleCommand(dimTreeItemObject, 'switchMeasure')">
        <i class="el-icon-sort"></i><span style="margin-left: 5px">转换为度量</span>
      </div>
      <div class="menu-item" v-if="customDimMenuVisible" @click="handleCommand(dimTreeItemObject, 'deleteDim')">
        <i class="el-icon-delete"></i><span style="margin-left: 5px">删除</span>
      </div>
      <div class="menu-item" v-if="customMeasureMenuVisible" @click="handleCommand(measureTreeItemObject, 'measureEdit')">
        <i class="el-icon-edit"></i><span style="margin-left: 5px">编辑</span>
      </div>
      <div class="menu-item" v-if="customMeasureMenuVisible && !measureTreeItemObject.data.express&&(measureTreeItemObject.data.dataType==='String' || measureTreeItemObject.data.dataType==='Number')" @click="handleCommand(measureTreeItemObject, 'switchDim')">
        <i class="el-icon-sort"></i><span style="margin-left: 5px">转换为维度</span>
      </div>
      <div class="menu-item" v-if="customMeasureMenuVisible" @click="handleCommand(measureTreeItemObject, 'deleteMeasure')">
        <i class="el-icon-delete"></i><span style="margin-left: 5px">删除</span>
      </div>
    </div>
  </el-container>
</template>

<script>
  import DataSetATable from "@/components/report/dataSet/DataSetATable";
  import DataSetFilter from "@/components/report/dataSet/DataSetFilter";

  export default {
    components: {
      DataSetATable,
      DataSetFilter
    },
    props: ['dataSetId'],
    watch: {
      dataSetId: function (val) {
        this.dataSetId = val;
        this.tableData = [];
        this.totalPage = 0;
        this.KHReport.getDataSetConf(this);
        this.activeName = "first";
        this.dataSetConf = {};
        this.dsMeta = {};
        this.dimColumns = [];//维度集合
        this.measureColumns = [];//度量集合
        this.dimTreeData = [];
        this.measureTreeData = [];
        this.columns = [];


      },
      filterText(val) {
        this.$refs.dimTree.filter(val);
        this.$refs.measureTree.filter(val);
      }
    },
    data() {
      return {
        primitiveColumn: {
          alias: '',
          column: '',
          desc: '',
          table: '',
          editType: ''
        },
        alias: '',
        primitiveColumnTitle: '',
        primitiveColumnDialogVisible: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        activeName: "first",
        dimActiveName: "first",
        measureActiveName: "first",
        tableData: [],
        columns: [],//包含维度和度量,此集合中不包含新增的维度和度量，用于数据预览表格和新增维度和度量页面的字段选择数据绑定
        columnsGroup:[],
        dataSetConf: {},
        datasourceId: 0,
        dsMeta: {
          "datasource": "",
          "table": "",
          "joins": [],
          "columns": {
            "dim": [],
            "measure": []
          },
          "condFilters": [{}]
        },//数据集配置信息
        dimColumns: [],//维度集合
        measureColumns: [],//度量集合
        dimTreeData: [],
        measureTreeData: [],
        listLoading: false,
        totalPage: 0,
        params: {
          pageNum: 1,
          pageSize: 10,
        },
        columnsSetDialogVisible: false,
        isDim: false,//是否维度
        //新增维度
        addDimDialogVisible: false,
        dimColumn: {
          "id": null,
          "column": "",
          "desc": "",
          "dataType": "String",
          "alias": "",
          "express": "",
          "table": ""
        },
        addMeasumeType: "sum",
        measureFunctionType: [
          {value: 'sum', lable: 'sum'},
          {value: 'count', lable: 'count'},
          {value: 'avg', lable: 'avg'},
          {value: 'min', lable: 'min'},
          {value: 'max', lable: 'max'}
        ],
        dimName: "",
        measureName: "",
        dimRules: {
          alias: [
            {required: true, message: '请输入字段名称', trigger: 'blur'}
          ],
          column: [
            {required: true, message: '请选择分组字段', trigger: 'blur'}
          ],
          dataType: [
            {required: true, message: '请选择数据类型', trigger: 'blur'}
          ]
        },
        dimCustomRules: {
          alias: [
            {required: true, message: '请输入字段名称', trigger: 'blur'}
          ],
          express: [
            {required: true, message: '请填写表达式', trigger: 'blur'}
          ],
          dataType: [
            {required: true, message: '请选择数据类型', trigger: 'blur'}
          ]
        },
        measureCustomRules: {
          alias: [
            {required: true, message: '请输入字段名称', trigger: 'blur'}
          ],
          express: [
            {required: true, message: '请填写表达式', trigger: 'blur'}
          ],
          dataType: [
            {required: true, message: '请选择数据类型', trigger: 'blur'}
          ]
        },
        measureRules: {
          alias: [
            {required: true, message: '请输入字段名称', trigger: 'blur'}
          ],
          dataType: [
            {required: true, message: '请选择数据类型', trigger: 'blur'}
          ]
        },
        dimExpressData: [],
        expressType: [
          {value: '<', lable: '<'},
          {value: '<=', lable: '<='}
        ],
        //新增度量
        addMeasumeDialogVisible: false,
        measureColumn: {
          "id": null,
          "column": "",
          "desc": "",
          "dataType": "Number",
          "alias": "",
          "express": "",
          "table": ""
        },
        measureSelectListVisible: false,
        dimSelectListVisible: false,
        filterVisible: false,
        //刷新右边table界面
        isRefresh: true,
        measureKjVisible: true,
        dimKjVisible: true,
        filterText: '',
        customDimMenuVisible: false,
        customMeasureMenuVisible: false,
        dimTreeItemObject: {
          data: {},
          node: {}
        },
        measureTreeItemObject: {
          data: {},
          node: {}
        }
      }
    },
    mounted() {
      this.KHReport.getDataSetConf(this);
      //给当前组件添加关闭菜单事件
      let menu = document.getElementsByClassName('custom-dropdown-menu')[0];
      var style = menu.style;
      let container = document.getElementById('container');
      container.addEventListener('click', function () {
        style.display = 'none';
      }, false);
    },
    methods: {
      //设置维度、度量别名
      openColumnsSetDialog(type) {
        this.KHReport.convertColumns(this);
        if (type == 1) {//维度
          this.isDim = true;
          this.columnsSetDialogVisible = true;
        }
        if (type == 2) {//度量
          this.isDim = false;
          this.columnsSetDialogVisible = true;
        }
      },
      //保存重命名
      saveColumnsRename() {
        this.columnsSetDialogVisible = false;
        this.updateDimAlias();
        this.updateMeasureAlias();
        this.KHReport.convertColumns(this);
        this.refreshTable();

      },
      refreshTable() {
        this.isRefresh = false;
        this.$nextTick(function () {
          this.isRefresh = true;
        })
      },
      //更新别名到dsMeta中
      updateDimAlias() {
        if (this.dsMeta.columns.dim != null && this.dsMeta.columns.dim.length > 0 && this.dimColumns != null && this.dimColumns.length > 0) {
          this.dsMeta.columns.dim.forEach(item => {
            let table = item.table;
            if (item.columns != null && item.columns.length > 0) {
              item.columns.forEach(a => {
                this.dimColumns.forEach(b => {
                  if (b.table == table && b.column == a.column) {
                    a.alias = b.alias;
                  }
                })
              })
            }
          })
        }
      },
      updateMeasureAlias() {
        if (this.dsMeta.columns.measure != null && this.dsMeta.columns.measure.length > 0 && this.measureColumns != null && this.measureColumns.length > 0) {
          this.dsMeta.columns.measure.forEach(item => {
            let table = item.table;
            if (item.columns != null && item.columns.length > 0) {
              item.columns.forEach(a => {
                this.measureColumns.forEach(b => {
                  if (b.table == table && b.column == a.column) {
                    a.alias = b.alias;
                  }
                })
              })
            }
          })
        }
      },
      // 分页查询
      handleCurrentChange(val) {
        let _this = this;
        _this.params.pageNum = val;
        _this.queryDataSetInfo();
      },
      //新增维度
      addDim() {
        Object.assign(this.dimColumn, this.$options.data().dimColumn);
        this.addDimDialogVisible = true;
        this.dimName = "";
        this.dimExpressData = [];
      },
      //保存维度
      saveDim() {
        this.$refs.dimColumn.validate((valid) => {
          if (valid) {
            if (this.dimExpressData.length === 0) {
              this.$message({
                message: '请至少添加一个分组条件',
                type: 'warning'
              });
            } else {
              //转换成表达式
              let express = "";
              express = express.concat("case");
              let addSuccess = true;
              let showFlag = true;
              this.dimExpressData.forEach(obj => {
                if (this.KHUtils.isNull(obj.groupName)) {
                  if (showFlag) {
                    this.$message({
                      message: '分组名称不能为空',
                      type: 'warning'
                    });
                  }
                  showFlag = false;
                  addSuccess = false;
                } else if (this.KHUtils.isNull(obj.leftValue) && this.KHUtils.isNull(obj.rightValue)) {
                  if (showFlag) {
                    this.$message({
                      message: '分组名称至少需要一个判断条件',
                      type: 'warning'
                    });
                    showFlag = false;
                  }
                  addSuccess = false;
                } else {
                  if (!this.KHUtils.isNull(obj.leftValue) && !this.KHUtils.isNull(obj.rightValue)) {
                    express = express.concat(" when ");
                    if (obj.dataType == "Number") {
                      express = express.concat(obj.leftValue + obj.leftType + this.dimName);
                      express = express.concat(" and " + this.dimName + obj.rightType + obj.rightValue);
                    } else {
                      express = express.concat("'" + obj.leftValue + "'" + obj.leftType + this.dimName);
                      express = express.concat(" and " + this.dimName + obj.rightType + "'" + obj.rightValue + "'");
                    }

                    express = express.concat(" then '" + obj.groupName + "'");
                  } else {
                    if (!this.KHUtils.isNull(obj.leftValue)) {
                      express = express.concat(" when ");
                      if (obj.dataType == "Number") {
                        express = express.concat(obj.leftValue + obj.leftType + this.dimName);
                      } else {
                        express = express.concat("'" + obj.leftValue + "'" + obj.leftType + this.dimName);

                      }
                      express = express.concat(" then '" + obj.groupName + "'");
                    }
                    if (!this.KHUtils.isNull(obj.rightValue)) {
                      express = express.concat(" when ");
                      if (obj.dataType == "Number") {
                        express = express.concat(this.dimName + obj.rightType + obj.rightValue);

                      } else {
                        express = express.concat(this.dimName + obj.rightType + "'" + obj.rightValue) + "'";
                      }
                      express = express.concat(" then '" + obj.groupName + "'");
                    }
                  }
                }
              });
              if (addSuccess) {
                express = express.concat(" END ");
                this.dimColumn.express = express;
                this.addDsMetaDim();
                if (this.KHUtils.isNull(this.dimColumn.id)) {
                  this.createDimMeasureId();
                }
                this.KHReport.convertColumns(this);
              }
            }
          }
        });
      },
      saveCustomDim() {
        this.$refs.dimCustomColumn.validate((valid) => {
          if (valid) {
            this.dimColumn.column = "";
            this.addDsMetaCustomDim();
            if (this.KHUtils.isNull(this.dimColumn.id)) {
              this.createDimMeasureId();
            }
            this.KHReport.convertColumns(this);
          }
        });
      },
      addDsMetaCustomDim() {
        if (this.dsMeta.columns.dim != null && this.dsMeta.columns.dim.length > 0) {
          let obj = {};
          this.$set(obj, 'id', this.dimColumn.id);
          this.$set(obj, 'column', this.dimColumn.column);
          this.$set(obj, 'desc', this.dimColumn.desc);
          this.$set(obj, 'dataType', this.dimColumn.dataType);
          this.$set(obj, 'alias', this.dimColumn.alias);
          this.$set(obj, 'express', this.dimColumn.express);

          if (obj.express.indexOf('sum') >= 0
            || obj.express.indexOf('avg') >= 0
            || obj.express.indexOf('count') >= 0
            || obj.express.indexOf('max') >= 0
            || obj.express.indexOf('min') >= 0) {
            this.$message({
              message: '计算字段（维度）不能包含sum、avg、count、max、min等聚合函数',
              type: 'warning'
            });
            return;
          }

          let table = this.dimColumn.express.split('.')[0].split('[')[1];
          let flag = true;
          if (!this.KHUtils.isNull(table)) {
            for (let columnsGroupElement of this.columnsGroup) {
              if (columnsGroupElement.label === table) {
                flag = false;
                break;
              }
            }
          }
          if (flag) {
            this.$message({
              message: '表达式必须包含相关的表字段',
              type: 'warning'
            });
            return;
          }
          this.dimColumn.table = table;

          let exist = false;

          for (let i = 0; i < this.dsMeta.columns.dim.length; i++) {
            let item = this.dsMeta.columns.dim[i];
            if (item.table === this.dimColumn.table) {
              if (!this.KHUtils.isNull(obj.id)) {
                for (let j = 0; j < item.columns.length; j++) {
                  let column = item.columns[j];
                  if (column.id === obj.id) {
                    let isRepeat = this.checkRepeatAlias(obj, this.dimColumn.table);
                    if (isRepeat) {
                      return;
                    }
                    this.dsMeta.columns.dim[i].columns[j] = obj;
                    exist = true;
                    break;
                  }
                }
              } else {
                let isRepeat = this.checkRepeatAlias(obj, this.dimColumn.table);
                if (isRepeat) {
                  return;
                } else {
                  item.columns.push(obj);
                  exist = true;
                }
              }
              break;
            }
          }
          if (!exist) {
            if (!this.KHUtils.isNull(obj.id)) {
              for (let i = 0; i < this.dsMeta.columns.dim.length; i++) {
                let item = this.dsMeta.columns.dim[i];
                let flag = false;
                for (let j = 0; j < item.columns.length; j++) {
                  let column = item.columns[j];
                  if (column.id === obj.id) {
                    flag = true;
                    this.dsMeta.columns.dim[i].columns.splice(j, 1);
                    if (this.dsMeta.columns.dim[i].columns.length === 0) {
                      this.dsMeta.columns.dim.splice(i, 1);
                    }
                    break;
                  }
                }
                if (flag) {
                  break;
                }
              }
            }
            let flag = true;
            for (let i = 0; i < this.dsMeta.columns.dim.length; i++) {
              let item = this.dsMeta.columns.dim[i];
              if (item.table === table) {
                this.dsMeta.columns.dim[i].columns.push(obj);
                flag = false;
                break;
              }
            }
            if (flag) {
              this.dsMeta.columns.dim.push({
                table: table,
                columns: [obj]
              });
            }
          }
          this.addDimDialogVisible = false;
        }
      },
      addDsMetaDim() {
        if (this.dsMeta.columns.dim != null && this.dsMeta.columns.dim.length > 0) {
          let dim = this.dsMeta.columns.dim;
          let obj = {};
          this.$set(obj, 'id', this.dimColumn.id);
          this.$set(obj, 'column', '');
          this.$set(obj, 'desc', this.dimColumn.desc);
          this.$set(obj, 'dataType', this.dimColumn.dataType);
          this.$set(obj, 'alias', this.dimColumn.alias);
          this.$set(obj, 'express', this.dimColumn.express);

          let isRepeat = this.checkRepeatAlias(obj, this.dimColumn.table);
          if (isRepeat) {
            return;
          }
          let exist = false;

          for (let i = 0; i < dim.length; i++) {
            let item = dim[i];
            if (item.table === this.dimColumn.table) {
              if (!this.KHUtils.isNull(obj.id)) {
                for (let j = 0; j < item.columns.length; j++) {
                  let column = item.columns[j];
                  if (column.id === obj.id) {
                    this.dsMeta.columns.dim[i].columns[j] = obj;
                    exist = true;
                    break;
                  }
                }
              } else {
                exist = true;
                item.columns.push(obj);
              }
              break;
            }
          }
          if (!exist) {
            this.dsMeta.columns.dim.push({
              table: this.dimColumn.table,
              columns: [obj]
            });
          }
        }
        this.addDimDialogVisible = false;
      },
      dimSelect(value) {
        this.dimName = value;
        this.dimExpressData = [];

        this.columns.forEach(obj => {
          if (obj.table == value.split('.')[0].split('[')[1] && obj.column == value.split('.')[1].split(']')[0]) {
            this.dimColumn.column = value;
            this.dimColumn.table = obj.table;
          }
        });
      },
      //新增表达式列
      addDimExpress() {
        let obj = {
          groupName: "",
          leftValue: "",
          leftType: "<",
          columnName: this.dimName,
          rightValue: "",
          rightType: "<="
        }
        this.dimExpressData.push(obj);
      },
      //删除分组条件
      deleteDimExpress(index) {
        if (!this.KHUtils.isNull(this.dimExpressData) && this.dimExpressData.length > 0) {
          this.dimExpressData.splice(index, 1);
        }
      },

      //新增度量
      addMeasume() {
        Object.assign(this.measureColumn, this.$options.data().measureColumn);
        this.addMeasumeDialogVisible = true;
        this.measureName = "";
      },
      //保存度量
      saveCustomMeasume() {
        this.$refs.measureCustomColumn.validate((valid) => {
          if (valid) {
            this.measureColumn.column = "";
            this.addDsMetaCustomMeasure();
            if (this.KHUtils.isNull(this.measureColumn.id)) {
              this.createDimMeasureId();
            }
            this.KHReport.convertColumns(this);
          }
        });
      },
      saveMeasume(){
        this.$refs.measureColumn.validate((valid) => {
          if (valid) {
            //获得表达式
            if (this.KHUtils.isNull(this.measureName)) {
              this.$message({
                message: '请选择聚合字段',
                type: 'warning'
              })
            } else {
              let express = this.addMeasumeType + "(" + this.measureName + ")";
              this.measureColumn.express = express;
              this.addDsMetaMeasure();
              if (this.KHUtils.isNull(this.measureColumn.id)) {
                this.createDimMeasureId();
              }
              this.KHReport.convertColumns(this);
            }
          }
        });
      },
      addDsMetaCustomMeasure() {
        if (this.dsMeta.columns.measure != null && this.dsMeta.columns.measure.length > 0) {
          let obj = {};
          this.$set(obj, 'id', this.measureColumn.id);
          this.$set(obj, 'column', '');
          this.$set(obj, 'desc', this.measureColumn.desc);
          this.$set(obj, 'dataType', this.measureColumn.dataType);
          this.$set(obj, 'alias', this.measureColumn.alias);
          this.$set(obj, 'express', this.measureColumn.express);

          let table = this.measureColumn.express.split('.')[0].split('[')[1];

          let flag = true;
          if (!this.KHUtils.isNull(table)) {
            for (let columnsGroupElement of this.columnsGroup) {
              if (columnsGroupElement.label === table) {
                flag = false;
                break;
              }
            }
          }
          if (flag) {
            this.$message({
              message: '表达式必须包含相关的表字段',
              type: 'warning'
            });
            return;
          }

          this.measureColumn.table = table;

          let exist = false;

          for (let i = 0; i < this.dsMeta.columns.measure.length; i++) {
            let item = this.dsMeta.columns.measure[i];
            if (item.table === this.measureColumn.table) {
              if (!this.KHUtils.isNull(obj.id)) {
                for (let j = 0; j < item.columns.length; j++) {
                  let column = item.columns[j];
                  if (column.id === obj.id) {
                    let isRepeat = this.checkRepeatAlias(obj, this.dimColumn.table);
                    if (isRepeat) {
                      return;
                    }
                    this.dsMeta.columns.measure[i].columns[j] = obj;
                    exist = true;
                    break;
                  }
                }
              } else {
                let isRepeat = this.checkRepeatAlias(obj, this.dimColumn.table);
                if (isRepeat) {
                  return;
                } else {
                  item.columns.push(obj);
                  exist = true;
                }
              }
              break;
            }
          }
          if (!exist) {
            if (!this.KHUtils.isNull(obj.id)) {
              for (let i = 0; i < this.dsMeta.columns.measure.length; i++) {
                let item = this.dsMeta.columns.measure[i];
                let flag = false;
                for (let j = 0; j < item.columns.length; j++) {
                  let column = item.columns[j];
                  if (column.id === obj.id) {
                    flag = true;
                    this.dsMeta.columns.measure[i].columns.splice(j, 1);
                    if (this.dsMeta.columns.measure[i].columns.length === 0) {
                      this.dsMeta.columns.measure.splice(i, 1);
                    }
                    break;
                  }
                }
                if (flag) {
                  break;
                }
              }
            }
            let flag = true;
            for (let i = 0; i < this.dsMeta.columns.measure.length; i++) {
              let item = this.dsMeta.columns.measure[i];
              if (item.table === table) {
                this.dsMeta.columns.measure[i].columns.push(obj);
                flag = false;
                break;
              }
            }
            if (flag) {
              this.dsMeta.columns.measure.push({
                table: table,
                columns: [obj]
              });
            }
          }
          this.addMeasumeDialogVisible = false;
        }
      },
      addDsMetaMeasure() {
        if (this.dsMeta.columns.measure != null && this.dsMeta.columns.measure.length > 0) {
          let measure = this.dsMeta.columns.measure;
          let obj = {};
          this.$set(obj, 'id', this.measureColumn.id);
          this.$set(obj, 'column', '');
          this.$set(obj, 'desc', this.measureColumn.desc);
          this.$set(obj, 'dataType', this.measureColumn.dataType);
          this.$set(obj, 'alias', this.measureColumn.alias);
          this.$set(obj, 'express', this.measureColumn.express);
          let exist = false;
          let isRepeat = this.checkRepeatAlias(obj, this.measureColumn.table);
          if (isRepeat) {
            return;
          }
          for (let i = 0; i < measure.length; i++) {
            let item = measure[i];
            if (item.table === this.measureColumn.table) {
              if (!this.KHUtils.isNull(obj.id)) {
                for (let j = 0; j < item.columns.length; j++) {
                  let column = item.columns[j];
                  if (column.id === obj.id) {
                    this.dsMeta.columns.measure[i].columns[j] = obj;
                    exist = true;
                    break;
                  }
                }
              } else {
                exist = true;
                item.columns.push(obj);
              }
              break;
            }
          }
          if (!exist) {
            this.dsMeta.columns.measure.push({
              table: this.measureColumn.table,
              columns: [obj]
            });
          }
        }
        this.addMeasumeDialogVisible = false;
      },
      measureSelect(value){
        this.measureName = value
        this.columns.forEach(obj => {
          if (obj.table == value.split('.')[0].split('[')[1] && obj.column == value.split('.')[1].split(']')[0]) {
            this.measureColumn.column = value;
            this.measureColumn.table = obj.table;
          }
        });
      },
      //删除新增的自定义维度和度量
      deleteDimOrMeasure(index, tableData) {
        this.$confirm('此操作将删除该字段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = tableData[index];
          tableData.splice(index, 1);
          if (this.isDim) {
            if (this.dsMeta.columns.dim != null && this.dsMeta.columns.dim.length > 0) {
              for (let i = 0; i < this.dsMeta.columns.dim.length; i++) {
                let item = this.dsMeta.columns.dim[i];
                if (item.table === obj.table) {
                  if (item.columns != null && item.columns.length > 0) {
                    for (var j = 0; j < item.columns.length; j++) {
                      if (item.columns[j].alias == obj.alias && item.columns[j].express == obj.express) {
                        item.columns.splice(j, 1);
                        break;
                      }
                    }
                    if (item.columns.length === 0) {
                      this.dsMeta.columns.dim.splice(i, 1);
                    }
                  }
                  break;
                }
              }
            }
          } else {
            if (this.dsMeta.columns.measure != null && this.dsMeta.columns.measure.length > 0) {
              for (let i = 0; i < this.dsMeta.columns.measure.length; i++) {
                let item = this.dsMeta.columns.measure[i];
                if (item.table === obj.table) {
                  if (item.columns != null && item.columns.length > 0) {
                    for (var j = 0; j < item.columns.length; j++) {
                      if (item.columns[j].alias == obj.alias && item.columns[j].express == obj.express) {
                        item.columns.splice(j, 1);
                        break;
                      }
                    }
                    if (item.columns.length === 0) {
                      this.dsMeta.columns.measure.splice(i, 1);
                    }
                  }
                  break;
                }
              }
            }
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.KHReport.convertColumns(this);
        });

      },
      saveDataSetConf() {
        this.$confirm('确认保存数据集配置信息吗？', '提示', {}).then(() => {
          this.postDataSetConf(true);
        });
      },
      postDataSetConf(isRefrsh) {
        this.createDimMeasureId();
        this.tableData = [];
        let param = {
          dsId: this.dataSetId,
          dsMeta: this.dsMeta
        }
        this.$PostJson(this.khConfig.api.saveDataSetConf, param).then(res => {
          if (res.errCode === 0) {
            if (isRefrsh) {
              this.KHReport.getDataSetConf(this);
            }
            this.$notify({
              title: '成功',
              message: '数据配置信息保存成功',
              type: 'success'
            });

          }
        })
      },
      //切换table标签
      handleClick(tab, event) {
        if (tab.name == "second") {
          this.$refs.ATableChild.convertJoins();
        }
      },
      //保存表关联数据
      saveATable(table,isAdd) {
        let _this = this;
        if(isAdd){
          if(!_this.KHUtils.isNull(table)){
            //查询关联表的维度和度量
            let _this = this;
            let param = {
              datasourceId:this.datasourceId,
              table:table
            }
            _this.$Get(_this.khConfig.api.queryTableDimMeasure, param)
              .then(res => {
                if (res.errCode === 0) {
                  let addDimMeasure  = res.data;
                  if(addDimMeasure.dim instanceof Array && addDimMeasure.dim.length>0){
                    _this.dsMeta.columns.dim.push(addDimMeasure.dim[0]);
                  }

                  if(addDimMeasure.measure instanceof Array && addDimMeasure.measure.length>0){
                    _this.dsMeta.columns.measure.push(addDimMeasure.measure[0]);
                  }
                  _this.$refs.ATableChild.convertData();
                  _this.dataSetConf.dsMeta = JSON.stringify(this.dsMeta);
                  _this.KHReport.convertColumns(_this);
                }
              })
          }
        }else {
          _this.$refs.ATableChild.convertData();


        }


        //this.postDataSetConf(true);
      },
      deleteJoinTable(tableArray){
        //删除表相关的维度和度量信息
        let _this = this;
        _this.$refs.ATableChild.convertData();
        if(tableArray instanceof Array && tableArray.length>0){
            tableArray.forEach((table,index)=>{
              if(_this.dsMeta.columns.dim instanceof Array && _this.dsMeta.columns.dim.length>0){
                const index = _this.dsMeta.columns.dim.findIndex(obj =>obj.table == table);
                if(index != -1 && !_this.isExitTable(table)){
                  _this.dsMeta.columns.dim.splice(index,1);
                }

              }
              if(_this.dsMeta.columns.measure instanceof Array && _this.dsMeta.columns.measure.length>0){
                const index = _this.dsMeta.columns.measure.findIndex(obj =>obj.table == table);
                if(index != -1 && !_this.isExitTable(table)){
                  _this.dsMeta.columns.measure.splice(index,1);
                }
              }
            })
        }

        _this.dataSetConf.dsMeta = JSON.stringify(this.dsMeta);
        _this.KHReport.convertColumns(_this);
      },
      isExitTable(table){
          let _this = this;
          let isExit = false;
           if(_this.dsMeta.table === table){
               isExit = true;
           }

           if(_this.dsMeta.joins instanceof Array && _this.dsMeta.joins.length>0){
             _this.dsMeta.joins.forEach((item,index)=>{
                 if(item.dest == table){
                   isExit = true;
                 }
                 if(item.source == table){
                   isExit = true;
                 }
             })
           }
           return isExit;


      },

      //过滤相关
      showCondDialog() {
        this.filterVisible = true;
      },
      setCondFilters() {
        this.$nextTick(() => {
          let columns = JSON.stringify(this.dsMeta.columns);
          let condFilters = JSON.stringify(this.dsMeta.condFilters);
          this.$refs.dataSetFilter.init(columns, condFilters);
        });
      },
      cancelFilterDialog() {
        this.filterVisible = false;
      },
      saveCondFilters(val) {
        let condFilters = JSON.parse(val);
        this.dsMeta.condFilters = condFilters;
        this.cancelFilterDialog();
      },
      //数据集数据预览
      queryDataSetInfo(isRefresh) {
        if (isRefresh) {
          this.params = {
            pageNum: 1,
            pageSize: 10,
          }
        }

        this.listLoading = true;
        this.$Get(this.khConfig.api.querydataset + "/" + this.dataSetId, this.params)
          .then(res => {
            this.listLoading = false;
            if (res.errCode === 0) {
              this.totalPage = res.totalCount;
              this.tableData = res.datas;

            }

          })
      },
      //给维度和度量重新设置ID
      createDimMeasureId() {
        if (this.dsMeta && this.dsMeta.columns) {
          let index = 1;
          if (this.dsMeta.columns.dim && this.dsMeta.columns.dim.length > 0) {
            this.dsMeta.columns.dim.forEach(item => {
              if (item.columns && item.columns.length > 0) {
                item.columns.forEach(obj => {
                  obj.id = index;
                  index++;
                })
              }
            })
          }

          if (this.dsMeta.columns.measure && this.dsMeta.columns.measure.length > 0) {
            this.dsMeta.columns.measure.forEach(item => {
              if (item.columns && item.columns.length > 0) {
                item.columns.forEach(obj => {
                  obj.id = index;
                  index++;
                })
              }
            })
          }

        }
      },
      syncDataSet() {
        let param = `dsId=${this.dataSetId}`;
        this.$confirm('同步表结构只会同步所有表新增的字段！\n' +
          '所有表字段的删除、类型变更、comment修改不会被同步，原有数据集关联模型不受影响。\n' +
          '确定同步吗？', '同步表结构', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$Post(this.khConfig.api.syncDataSetStructure, param).then(res => {
            if (res.errCode === 0) {
              this.KHReport.getDataSetConf(this);
              this.$message({
                type: 'success',
                message: '同步表结构成功！'
              });
            } else {
              this.$router.go(0);
            }
          });
        });
      },

      closePrimitiveColumnDialog() {
        this.primitiveColumnDialogVisible = false;
        Object.assign(this.primitiveColumn, this.$options.data().primitiveColumn);
      },

      //关闭添加度量对话框
      closeAddMeasumeDialog() {
        this.$refs['measureCustomColumn'].resetFields();
        if (this.measureKjVisible === true) {
          this.$refs['measureColumn'].resetFields();
        }
        this.addMeasumeDialogVisible = false;
        this.measureSelectListVisible = false;
        this.measureKjVisible = true;
        this.measureActiveName = "first";
      },

      //关闭添加维度对话框
      closeAddDimDialog() {
        this.$refs['dimCustomColumn'].resetFields();
        if (this.dimKjVisible === true) {
          this.$refs['dimColumn'].resetFields();
        }
        this.addDimDialogVisible = false;
        this.dimSelectListVisible = false;
        this.dimKjVisible = true;
        this.dimActiveName = "first";
      },

      callDimSelectList(e) {
        this.dimSelectListVisible = true;
        e.preventDefault();
      },

      callMeasureSelectList(e) {
        this.measureSelectListVisible = true;
        e.preventDefault();
      },

      columnSelect(item, id) {
        var expressInput = document.getElementById(id); //根据id选择器选中对象
        var startPos = expressInput.selectionStart;// input 第0个字符到选中的字符
        var endPos = expressInput.selectionEnd;// 选中的字符到最后的字符
        if (startPos === undefined || endPos === undefined) return
        var txt = expressInput.value;
        let insertText = '';
        insertText = '[' + item.table + '.' + item.column + ']';
        var result = txt.substring(0, startPos) + insertText + txt.substring(endPos);
        expressInput.value = result;// 赋值给input的value
        // 重新定义光标位置
        expressInput.focus();
        expressInput.selectionStart = startPos + insertText.length;
        expressInput.selectionEnd = startPos + insertText.length;
        if (id === 'dimExpressInput') {
          this.dimColumn.express = result;// 赋值给表单中的的字段
          this.dimSelectListVisible = false;
        } else {
          this.measureColumn.express = result;// 赋值给表单中的的字段
          this.measureSelectListVisible = false;
        }
      },
      beforeHandleCommand(node, data, command) {
        return {
          'node': node,
          'data': data,
          'command': command
        }
      },
      savePrimitiveColumn() {
        if (this.primitiveColumn.editType === 'dimEdit') {
          let dim = this.dsMeta.columns.dim;
          for (let i = 0; i < dim.length; i++) {
            let dimItem = dim[i];
            if (dimItem.table === this.primitiveColumn.table) {
              for (let j = 0; j < dimItem.columns.length; j++) {
                let column = dimItem.columns[j];
                if (column.column === this.primitiveColumn.column) {
                  column.alias = this.primitiveColumn.alias;
                  column.desc = this.primitiveColumn.desc;
                }
              }
            }
          }
        } else {
          let measure = this.dsMeta.columns.measure;
          for (let i = 0; i < measure.length; i++) {
            let measureItem = measure[i];
            if (measureItem.table === this.primitiveColumn.table) {
              for (let j = 0; j < measureItem.columns.length; j++) {
                let column = measureItem.columns[j];
                if (column.column === this.primitiveColumn.column) {
                  column.alias = this.primitiveColumn.alias;
                  column.desc = this.primitiveColumn.desc;
                }
              }
            }
          }
        }
        this.KHReport.convertColumns(this);
        this.primitiveColumnDialogVisible = false;
      },
      handleCommand(obj, command) {
        let _this = this;
        let node = obj.node;
        let data = obj.data;
        _this.handleHiddenContextMenu()
        if (command == 'dimEdit') {
          if (!this.KHUtils.isNull(data.item.express)) {
            this.dimColumn = JSON.parse(JSON.stringify(data.item));
            this.alias = JSON.parse(JSON.stringify(data.item.alias));
            this.dimColumn.table = this.dimColumn.express.split('.')[0].split('[')[1];
            this.dimKjVisible = false;
            this.addDimDialogVisible = true;
          } else {
            this.primitiveColumnTitle = data.item.column;
            if (!this.KHUtils.isNull(data.item.alias)) {
              this.primitiveColumnTitle = data.item.alias + '(' + this.primitiveColumnTitle + ')';
            }
            this.primitiveColumnTitle = '编辑' + this.primitiveColumnTitle;
            this.primitiveColumn.column = data.item.column;
            this.primitiveColumn.alias = data.item.alias;
            this.primitiveColumn.desc = data.item.desc;
            this.primitiveColumn.table = data.table;
            this.primitiveColumn.editType = command;
            this.primitiveColumnDialogVisible = true;
          }
        } else if (command == 'measureEdit') {
          if (!this.KHUtils.isNull(data.item.express)) {
            this.measureColumn = JSON.parse(JSON.stringify(data.item));
            this.alias = JSON.parse(JSON.stringify(data.item.alias));
            this.measureColumn.table = this.measureColumn.express.split('.')[0].split('[')[1];
            this.measureKjVisible = false;
            this.addMeasumeDialogVisible = true;
          } else {
            this.primitiveColumnTitle = data.item.column;
            if (!this.KHUtils.isNull(data.item.alias)) {
              this.primitiveColumnTitle = data.item.alias + '(' + this.primitiveColumnTitle + ')';
            }
            this.primitiveColumnTitle = '编辑' + this.primitiveColumnTitle;
            this.primitiveColumn.column = data.item.column;
            this.primitiveColumn.alias = data.item.alias;
            this.primitiveColumn.desc = data.item.desc;
            this.primitiveColumn.table = data.table;
            this.primitiveColumn.editType = command;
            this.primitiveColumnDialogVisible = true;
          }
        } else if (command == 'switchMeasure') {
          let table = data.table;
          let item = data.item;
          let expressType = _this.KHReport.expressJudge(_this, item);
          if (expressType == "default") {
            if (item.dataType == "Date") {
              _this.$message.warning("日期类型不允许切换为度量");
              return false;
            }
          } else if (expressType == "caseExp" || expressType == "aggregateExp") {
            _this.$message.warning("表达式不允许切换为度量");
            return false;
          }
          if (this.KHUtils.isNull(item.express)) {
            for (let i = 0; i < this.dsMeta.condFilters.length; i++) {
              let condFilter = this.dsMeta.condFilters[i];
              if (table === condFilter.table && item.column === condFilter.column) {
                this.$message({type: 'warning', message: '字段已设置过滤条件，请先删除过滤条件，再操作'})
                return;
              }
            }
          }
          _this.dsMeta.columns.dim.forEach((dim, index) => {
            if (dim.table == table) {
              const key = dim.columns.findIndex(obj => obj.column + obj.alias + obj.express === item.column + item.alias + item.express);
              dim.columns.splice(key, 1);
              if (dim.columns.length === 0) {
                _this.dsMeta.columns.dim.splice(index, 1);
              }
              return false;
            }
          });
          let isExit = false;
          _this.dsMeta.columns.measure.forEach((measure, index) => {
            if (measure.table == table) {
              isExit = true;
              measure.columns.push(item);
              return false;
            }
          });
          if (!isExit) {
            let newObj = {table: "", columns: []};
            newObj.table = table;
            newObj.columns.push(item);
            _this.dsMeta.columns.measure.push(newObj);
          }
          _this.KHReport.convertColumns(_this);

        } else if (command == 'switchDim') {
          let table = data.table;
          let item = data.item;
          let expressType = _this.KHReport.expressJudge(_this, item);
          if (expressType == "default") {
            if (item.dataType == "Date") {
              _this.$message.warning("日期类型不允许切换为维度");
              return false;
            }
          } else if (expressType == "caseExp" || expressType == "aggregateExp") {
            _this.$message.warning("表达式不允许切换为维度");
            return false;
          }
          if (this.KHUtils.isNull(item.express)) {
            for (let i = 0; i < this.dsMeta.condFilters.length; i++) {
              let condFilter = this.dsMeta.condFilters[i];
              if (table === condFilter.table && item.column === condFilter.column) {
                this.$message({type: 'warning', message: '字段已设置过滤条件，请先删除过滤条件，再操作'})
                return;
              }
            }
          }
          _this.dsMeta.columns.measure.forEach((measure, index) => {
            if (measure.table == table) {
              const key = measure.columns.findIndex(obj => obj.column + obj.alias + obj.express === item.column + item.alias + item.express);
              measure.columns.splice(key, 1);
              if (measure.columns.length === 0) {
                _this.dsMeta.columns.measure.splice(index, 1);
              }
              return false;
            }
          });
          let isExit = false;
          _this.dsMeta.columns.dim.forEach((dim, index) => {
            if (dim.table == table) {
              isExit = true;
              dim.columns.push(item);
              return false;
            }
          });
          if (!isExit) {
            let newObj = {table: "", columns: []};
            newObj.table = table;
            newObj.columns.push(item);
            _this.dsMeta.columns.dim.push(newObj);
          }
          _this.KHReport.convertColumns(_this);
        } else if (command == 'deleteDim') {
          _this.$confirm(`是否删除  <span style="color: #e20b0b">${_this.getDimOrMeasureShowText(data.item)}</span>`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            let table = data.table;
            let item = data.item;
            if (this.KHUtils.isNull(item.express)) {
              for (let i = 0; i < this.dsMeta.condFilters.length; i++) {
                let condFilter = this.dsMeta.condFilters[i];
                if (table === condFilter.table && item.column === condFilter.column) {
                  this.$message({type: 'warning', message: '字段已设置过滤条件，请先删除过滤条件，再操作'})
                  return;
                }
              }
            }
            for (let i = 0; i < this.dsMeta.columns.dim.length; i++) {
              let dimItem = this.dsMeta.columns.dim[i];
              if (dimItem.table === table) {
                for (let j = 0; j < dimItem.columns.length; j++) {
                  let column = dimItem.columns[j];
                  if (column.id === item.id) {
                    this.dsMeta.columns.dim[i].columns.splice(j, 1);
                    if (this.dsMeta.columns.dim[i].columns.length === 0) {
                      this.dsMeta.columns.dim.splice(i, 1);
                    }
                    break;
                  }
                }
                break;
              }
            }
            _this.$message({
              type: "success",
              message: "字段删除成功"
            });
            _this.KHReport.convertColumns(_this);
          });
        } else if (command == 'deleteMeasure') {
          _this.$confirm(`是否删除  <span style="color: #e20b0b">${_this.getDimOrMeasureShowText(data.item)}</span>`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            let table = data.table;
            let item = data.item;
            if (this.KHUtils.isNull(item.express)) {
              for (let i = 0; i < this.dsMeta.condFilters.length; i++) {
                let condFilter = this.dsMeta.condFilters[i];
                if (table === condFilter.table && item.column === condFilter.column) {
                  this.$message({type: 'warning', message: '字段已设置过滤条件，请先删除过滤条件，再操作'})
                  return;
                }
              }
            }
            for (let i = 0; i < this.dsMeta.columns.measure.length; i++) {
              let measureItem = this.dsMeta.columns.measure[i];
              if (measureItem.table === table) {
                for (let j = 0; j < measureItem.columns.length; j++) {
                  let column = measureItem.columns[j];
                  if (column.id === item.id) {
                    this.dsMeta.columns.measure[i].columns.splice(j, 1);
                    if (this.dsMeta.columns.measure[i].columns.length === 0) {
                      this.dsMeta.columns.measure.splice(i, 1);
                    }
                    break;
                  }
                }
                break;
              }
            }
            _this.$message({
              type: "success",
              message: "字段删除成功"
            });
            _this.KHReport.convertColumns(_this);
          });
        }
      },

      filterNode(value, data, node) {
        if (!value) return true;
        if (node.level === 2) {
          return data.label.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        }
        if (node.level === 3 && node.parent.data.label.toUpperCase().indexOf(value.toUpperCase()) !== -1 && data.dataType === 'Date') {
          return true;
        }
        return false;
      },

      checkRepeatAlias(obj, table) {
        for (let i = 0; i < this.dsMeta.columns.dim.length; i++) {
          let item = this.dsMeta.columns.dim[i];
          if (item.table === table) {
            for (let j = 0; j < item.columns.length; j++) {
              let column = item.columns[j];
              if (column.alias) {
                if (column.alias === obj.alias && column.alias !== this.alias && obj.alias != this.alias) {
                  this.$message({type: 'warning', message: '计算字段名称重复，请检查！'});
                  return true;
                }
              } else {
                if (column.column === obj.alias && obj.alias != this.alias) {
                  this.$message({type: 'warning', message: '计算字段名称重复，请检查！'});
                  return true;
                }
              }
            }
          }
        }
        for (let i = 0; i < this.dsMeta.columns.measure.length; i++) {
          let item = this.dsMeta.columns.measure[i];
          if (item.table === table) {
            for (let j = 0; j < item.columns.length; j++) {
              let column = item.columns[j];
              if (column.alias) {
                if (column.alias === obj.alias && column.alias !== this.alias && obj.alias != this.alias) {
                  this.$message({type: 'warning', message: '计算字段名称重复，请检查！'});
                  return true;
                }
              } else {
                if (column.column === obj.alias && obj.alias != this.alias) {
                  this.$message({type: 'warning', message: '计算字段名称重复，请检查！'});
                  return true;
                }
              }
            }
          }
        }
        return false;
      },

      handleDimContextMenu(event, data, node, el) {
        if (node.level === 2) {
          let menu = document.getElementsByClassName('custom-dropdown-menu')[0];
          menu.style.display = 'flex';
          menu.style.left = event.clientX + 'px';
          menu.style.top = event.clientY + 'px';
          if ((event.clientY + menu.offsetHeight) >= document.body.clientHeight) {
            menu.style.top = event.clientY - 50 + 'px';
          }
          this.dimTreeItemObject.data = data;
          this.dimTreeItemObject.node = node;
          this.customDimMenuVisible = true;
          this.customMeasureMenuVisible = false;
        }
      },

      handleIconOpenDimContextMenu(event, data, node) {
        let menu = document.getElementsByClassName('custom-dropdown-menu')[0];
        menu.style.display = 'flex';
        menu.style.left = event.clientX + 'px';
        menu.style.top = event.clientY + 'px';
        if ((event.clientY + menu.offsetHeight) >= document.body.clientHeight) {
          menu.style.top = event.clientY - 50 + 'px';
        }
        this.dimTreeItemObject.data = data;
        this.dimTreeItemObject.node = node;
        this.customDimMenuVisible = true;
        this.customMeasureMenuVisible = false;
      },

      handleMeasureContextMenu(event, data, node, el) {
        if (node.level === 2) {
          let menu = document.getElementsByClassName('custom-dropdown-menu')[0];
          menu.style.display = 'flex';
          menu.style.left = event.clientX + 'px';
          menu.style.top = event.clientY + 'px';
          if ((event.clientY + menu.offsetHeight) >= document.body.clientHeight) {
            menu.style.top = event.clientY - 50 + 'px';
          }
          this.measureTreeItemObject.data = data;
          this.measureTreeItemObject.node = node;
          this.customMeasureMenuVisible = true;
          this.customDimMenuVisible = false;
        }
      },

      handleIconOpenMeasureContextMenu(event, data, node) {
        let menu = document.getElementsByClassName('custom-dropdown-menu')[0];
        menu.style.display = 'flex';
        menu.style.left = event.clientX + 'px';
        menu.style.top = event.clientY + 'px';
        if ((event.clientY + menu.offsetHeight) >= document.body.clientHeight) {
          menu.style.top = event.clientY - 50 + 'px';
        }
        this.measureTreeItemObject.data = data;
        this.measureTreeItemObject.node = node;
        this.customMeasureMenuVisible = true;
        this.customDimMenuVisible = false;
      },

      handleHiddenContextMenu(data, node, el) {
        let menu = document.getElementsByClassName('custom-dropdown-menu')[0];
        menu.style.display = 'none';
      }
    },
    computed: {
      getColumnsName(){
        return function (value) {
          let arr = value.split(".");
          if (arr.length == 1) {
            return arr[0];
          } else {
            return arr[1];
          }
        }
      },
      getTableColumnName() {
        return function (item) {
          if (item.id !== null) {
            return item.column + '_' + item.id;
          }
          return item.column;
        }
      },
      getDimOrMeasureTitle(){
        return function (data) {
          if(!this.KHUtils.isNull(data.label) && !this.KHUtils.isNull(data.alias)){
            return data.alias+"("+data.label+")";
          }else if(!this.KHUtils.isNull(data.label)){
            return data.label;
          }else if(!this.KHUtils.isNull(data.alias)){
            return data.alias;
          }
        }
      },
      getDimOrMeasureShowText() {
        return function (data) {
          if(!this.KHUtils.isNull(data.column) && !this.KHUtils.isNull(data.alias)){
            return data.column+"("+data.alias+")";
          }else if(!this.KHUtils.isNull(data.column)){
            return data.column;
          }else if(!this.KHUtils.isNull(data.alias)){
            return data.alias;
          }
        }
      },
      haveMenu() {
        return function (node) {
          if (node.level === 2) {
            return true;
          }
        };
      }
    }
  }
</script>

<style scoped>
  .columnsList {
    border: 1px solid #525A70;
    padding: 0px 0px;
    height: 250px;
    overflow-y: auto;
    box-sizing: border-box;
    background-color: #3E4760;
  }

  .el-header {
    height: 50px;
  }

  .myHeader {
    line-height: 50px;
    height: 50px;
  }

  .myHeader.headerTitle {
    line-height: 30px;
    height: 30px;
  }

  .blueFont {
    color: #409EFF;
  }

  .whiteFont {
    color: white;
    font-size: 10px;
  }

  .greenFont {
    color: green;
  }

  .contentHolder {
    font-family: ms sans serif, arial;
    font-size: 10pt;
    width: 100;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>

<style lang="scss" scoped>
  .data-tabs {
    .el-tabs__content {
      height: calc(100% - 56px);
      > .el-tab-pane {
        height: 100%;
      }
    }

   ::v-deep .el-tabs__content{
      height: 550px;
    }

  }


  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    /*justify-content: space-between;*/
    font-size: 14px;
    padding-right: 8px;
  }

 ::v-deep .dataSetTree.el-tree {
    background-color: #3E4760;
  }

 ::v-deep .el-tree-node:focus > .el-tree-node__content {
    background-color: #66b1ff87 !important;
  }

 ::v-deep .el-tree-node__content:hover {
    background-color: #66b1ff87;
  }

 ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #66b1ff87;
  }

  .columnsList::-webkit-scrollbar {
    //display: none; /* Chrome Safari */
  }

  .blueFont {
    color: #409EFF
  }

  .tableTitle div {
    width: 100%;
  }

 ::v-deep .el-table th div {
    line-height: 20px;
    padding: 0px;
  }

  .rightButton {
    position: absolute;
    right: 25px;
    z-index: 99;
  }

 ::v-deep .filter-dialog .el-dialog__header {
    background-color: #F8F8FA;
  }

  .express-text {
    overflow: auto;
    height: 30%;
    width: 50%;
    resize: none;
    width: 100%;
    height: 350px;
    border: 1px solid #D9D9D9;
    font-size: 20px;
    font-family: 宋体;

    &:focus {
      outline: none;
    }
  }

  .express-columns {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &:hover {
      background-color: #00AAFB;
      color: #FFFFFF;
    }

    cursor: pointer;
  }

  .express-str {
    color: #64BD4F;
    font-size: 13px;
    margin-left: auto;
  }

  .express-no {
    color: #468CFF;
    font-size: 13px;
    margin-left: auto;
  }

  .aggregate-input-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .aggregate-input {
    &::before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }
  }
  .title-span {
    width: 130px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .dim-measure-set-icon{
    position: absolute;
    right: 10px;
  }

 ::v-deep .search {
    background-color: #3E4760;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .el-input__inner {
      border-radius: 0px;
      background-color: #3E4760;
      border: none;
      color: white;
    }
  }

  .custom-dropdown-menu {
    z-index: 1;
    position: fixed;
    border: 1px solid white;
    display: none;
    background-color: white;
    flex-direction: column;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, .12), 0 1px 2px 0 rgba(0, 0, 0, .24);
  }

  .menu-item {
    padding: 4px 20px 0 14px;
    font-size: 12px;
    line-height: 22px;
    cursor: pointer;

    &:hover {
      background-color: #E0ECFC;
    }
  }


  /*滚动条里面小方块*/
 ::v-deep .columnsList ::-webkit-scrollbar-thumb {
    background-color: #333A4E;
    border-radius: 10px;
  }

  /*滚动条整体样式*/
 ::v-deep .columnsList ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  /*滚动条里面轨道*/
 ::v-deep .columnsList ::-webkit-scrollbar-track {
    background: rgba(77, 86, 133, 0.1);
    border-radius: 10px;
  }

  /*滚动条里面小方块*/
 ::v-deep .columnsList ::-webkit-scrollbar-thumb {
    background-color: #EBEAEF;
    border-radius: 10px;
  }

  /*滚动条整体样式*/
 ::v-deep .columnsList ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  /*滚动条里面轨道*/
 ::v-deep .columnsList ::-webkit-scrollbar-track {
    background: rgba(77, 86, 133, 0.1);
    border-radius: 10px;
  }

  /*滚动条里面小方块*/
  .columnsList::-webkit-scrollbar-thumb {
    background-color: #EBEAEF;
    border-radius: 10px;
  }

  /*滚动条整体样式*/
  .columnsList::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  /*滚动条里面轨道*/
  .columnsList::-webkit-scrollbar-track {
    background: rgba(77, 86, 133, 0.1);
    border-radius: 10px;
  }



</style>
