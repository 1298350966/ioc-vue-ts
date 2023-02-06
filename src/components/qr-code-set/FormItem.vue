<template>
    <div style="width: 100%">
        <template v-if="box.type === 'input'">
            <el-input
                style="width: 100%"
                v-if="
          box.options.dataType === 'number' ||
          box.options.dataType === 'integer' ||
          box.options.dataType === 'float'
        "
                :type="box.options.dataType"
                v-model.number="dataModel"
                :placeholder="box.options.placeholder"
                :disabled="box.options.disabled"
            ></el-input>
            <el-input
                style="width: 100%"
                v-else
                :type="box.options.dataType"
                v-model="dataModel"
                :disabled="box.options.disabled"
                :placeholder="box.options.placeholder"
            ></el-input>
        </template>
        <template v-if="box.type === 'text'">
            <span>{{box.options.defaultValue}}</span>
        </template>
        <template
            v-if="
        box.type === 'input_number' ||
        box.type === 'input_int' ||
        box.type === 'input_long' ||
        box.type === 'input_mobile' ||
        box.type === 'input_tel' ||
        box.type === 'input_mail' ||
        box.type === 'input_postal' ||
        box.type === 'input_website'
      "
        >
            <el-input
                style="width: 100%"
                v-model="dataModel"
                controls-position="right"
                :disabled="box.options.disabled"
            ></el-input>
        </template>
        <template v-if="box.type === 'textarea'">
            <el-input
                style="width: 100%"
                type="textarea"
                :rows="5"
                v-model="dataModel"
                :disabled="box.options.disabled"
                :placeholder="box.options.placeholder"
            ></el-input>
        </template>
        <template v-if="box.type === 'number'">
            <el-input-number
                style="width: 100%"
                v-model="dataModel"
                :step="box.options.step"
                controls-position="right"
                :disabled="box.options.disabled"
                :max="box.options.max"
                :min="box.options.min"
            ></el-input-number>
        </template>
        <template v-if="box.type === 'radio'">
            <el-radio-group
                style="width: 100%"
                v-model="dataModel"
                :disabled="box.options.disabled"
                @change="controlShow"
            >
                <el-radio
                    :label="item.value"
                    v-for="(item, index) in !box.options.remote
            ? box.options.remoteOptions
            : box.options.options"
                    :key="index"
                >
                    <template v-if="!box.options.remote">{{ item.label }}</template>
                    <template v-else>{{
                        box.options.showLabel ? item.label : item.value
                        }}</template>
                </el-radio>
            </el-radio-group>
        </template>
        <template v-if="box.type === 'checkbox'">
            <el-checkbox-group v-model="dataModel" :disabled="box.options.disabled" style="width: 100%">
                <el-checkbox
                    :label="item.value"
                    v-for="(item, index) in !box.options.remote
            ? box.options.remoteOptions
            : box.options.options"
                    :key="index"
                >
                    <template v-if="!box.options.remote">{{ item.label }}</template>
                    <template v-else>{{
                        box.options.showLabel ? item.label : item.value
                        }}</template>
                </el-checkbox>
            </el-checkbox-group>
        </template>
        <template v-if="box.type === 'time'">
            <el-time-picker
                style="width: 100%"
                v-model="dataModel"
                :is-range="box.options.isRange"
                :placeholder="box.options.placeholder"
                :start-placeholder="box.options.startPlaceholder"
                :end-placeholder="box.options.endPlaceholder"
                :readonly="box.options.readonly"
                :disabled="box.options.disabled"
                :editable="box.options.editable"
                :clearable="box.options.clearable"
                :arrowControl="box.options.arrowControl"
                :value-format="box.options.format"
            >
            </el-time-picker>
        </template>
        <template
            v-if="
        box.type === 'date' ||
        box.type === 'year' ||
        box.type === 'month' ||
        box.type === 'year_month'
      "
        >
            <el-date-picker
                style="width: 100%"
                v-model="dataModel"
                :type="box.options.type"
                :placeholder="box.options.placeholder"
                :start-placeholder="box.options.startPlaceholder"
                :end-placeholder="box.options.endPlaceholder"
                :readonly="box.options.readonly"
                :disabled="box.options.disabled"
                :editable="box.options.editable"
                :clearable="box.options.clearable"
                :value-format="box.options.timestamp ? 'timestamp' : box.options.format"
                :format="box.options.format"
            >
            </el-date-picker>
        </template>
        <template v-if="box.type === 'datetime'">
            <el-date-picker
                style="width: 100%"
                v-model="dataModel"
                type="datetime"
                :placeholder="box.options.placeholder"
                :start-placeholder="box.options.startPlaceholder"
                :end-placeholder="box.options.endPlaceholder"
                :readonly="box.options.readonly"
                :disabled="box.options.disabled"
                :editable="box.options.editable"
                :clearable="box.options.clearable"
                :value-format="box.options.timestamp ? 'timestamp' : box.options.format"
                :format="box.options.format"
            >
            </el-date-picker>
        </template>
        <template v-if="box.type === 'select'">
            <el-select
                style="width: 100%"
                @change="controlShow"
                popper-class="custom-select"
                popper-append-to-body
                v-model="dataModel"
                :disabled="box.options.disabled"
                :multiple="box.options.multiple"
                clearable
                :placeholder="box.options.placeholder"
                :filterable="box.options.filterable"
                value=""
            >
                <el-option
                    v-for="item in !box.options.remote
            ? box.options.remoteOptions
            : box.options.options"
                    :key="item.value"
                    :value="item.value"
                    :label="box.options.showLabel || !box.options.remote ? item.label : item.value"
                ></el-option>
            </el-select>
        </template>
        <template v-if="box.type === 'multiple_select'">
            <el-select
                style="width: 100%"
                v-model="dataModel"
                :popper-append-to-body="closeOnClickModal"
                :disabled="box.options.disabled"
                :multiple="box.options.multiple"
                clearable
                :placeholder="box.options.placeholder"
                :filterable="box.options.filterable"
                value=""
            >
                <el-option
                    v-for="item in !box.options.remote
            ? box.options.remoteOptions
            : box.options.options"
                    :key="item.value"
                    :value="item.value"
                    :label="box.options.showLabel || !box.options.remote ? item.label : item.value"
                ></el-option>
            </el-select>
        </template>
        <template v-if="box.type === 'switch'">
            <el-switch
                style="width: 100%"
                v-model="dataModel"
                :active-color="box.widgetActiveColor"
                :inactive-color="box.widgetInActiveColorr"
                :disabled="box.options.disabled"
            >
            </el-switch>
        </template>
        <template v-if="box.type === 'slider'">
            <el-slider
                style="width: 100%"
                v-model="dataModel"
                :min="box.options.min"
                :max="box.options.max"
                :disabled="box.options.disabled"
                :step="box.options.step"
                :show-input="box.options.showInput"
                :range="box.options.range"
            ></el-slider>
        </template>
        <!-- 用户单选和多选定制 -->
        <template v-if="box.type === 'user_select' || box.type === 'm_user_select'">
            <el-input
                v-if="box.type === 'user_select'"
                @focus="loadSysSelectData"
                clearable
                @clear="clearDataModel"
                :value="dataModel === '' || dataModel === undefined || dataModel === null ? '' :dataModel[box.label_model]"
                :disabled="isDisabled"
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
            ></el-input>

            <el-input
                v-if="box.type === 'm_user_select'"
                @focus="loadSysSelectData"
                clearable
                @clear="clearDataModel"
                :value="dataModel | arrayJsonVal"
                :disabled="isDisabled"
                :placeholder="box.options.placeholder"
                :style="{ width: box.options.width }"
            ></el-input>
            

            <el-dialog top="10vh" width="60%" :title="box.options.maps.title" :visible.sync="selectDialogVisible"
                       :close-on-click-modal="closeOnClickModal"
                       custom-class="select-tree-dialog" append-to-body @close="handleSave">
                       <el-row v-if="box.options.displayModel === 'table' && colsArray.length > 0">
                            <userSelectWidget 
                                :widgetType="box.type" 
                                :dataModel="dataModel"
                                :box="box"
                                :allowMultiSelect="box.type==='user_select'?false:true" 
                                @handleSelectionChange="handleSelectionChange"

                                >
                            </userSelectWidget>
                       </el-row>
            </el-dialog>

        </template>
        <template
            v-if="
        box.type === 'org_select' ||
        box.type === 'company_select' ||
        box.type === 'role_select' ||
        box.type === 'dic_select'
      "
        >
            <el-input
                style="width: 100%"
                @focus="loadSysSelectData"
                clearable
                @clear="clearDataModel"
                v-model="
          dataModel === '' || dataModel === undefined || dataModel === null
            ? ''
            : dataModel[box.label_model]
        "
                :disabled="box.options.disabled"
                :placeholder="box.options.placeholder"
            ></el-input>

            <el-dialog
                v-if="selectDialogVisible"
                :title="box.options.maps.title"
                :visible.sync="selectDialogVisible"
                :close-on-click-modal="closeOnClickModal"
                custom-class="select-tree-dialog"
                append-to-body
                @close="handleSave"
            >
                <el-row v-if="box.options.displayModel === 'tree'">
                    <el-input :placeholder="box.label_name" v-model="filterText" style="width: 50%">
                    </el-input>
                    <el-tree
                        :props="box.options.props"
                        :load="loadNode"
                        :filter-node-method="filterNode"
                        lazy
                        show-checkbox
                        check-strictly
                        @check="handleSave"
                        ref="tree"
                    >
                    </el-tree>
                </el-row>
                <el-row v-if="box.options.displayModel === 'table' && colsArray.length > 0">
                    <el-input
                        style="width: 160px"
                        :placeholder="box.type === 'user_select' ? '用户名' : box.label_name"
                        prefix-icon="el-icon-search"
                        v-model="keywords"
                        @blur="getDataSource"
                    ></el-input>
                    <el-table
                        :data="tableData"
                        v-loading="tableDataLoading"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        style="width: 96%"
                    >
                        <el-table-column
                            type="selection"
                            width="55px"
                            :props="box.options.maps.key"
                            fixed
                        ></el-table-column>
                        <el-table-column label="序号" width="60px" type="index" fixed>
                        </el-table-column>
                        <template v-for="col in colsArray">
                            <el-table-column
                                sortable
                                :prop="col.model"
                                :label="col.name"
                                :key="col.model"
                            >
                            </el-table-column>
                        </template>
                    </el-table>
                    <p style="width: 96%; margin: 0 auto">
                        <el-pagination
                            layout="prev, pager, next"
                            :current-page="queryCommonDataParam.pageNum"
                            @current-change="handleCurrentChange"
                            :total="totalPage"
                            style="float: right"
                        >
                        </el-pagination>
                    </p>
                </el-row>
            </el-dialog>
        </template>
        <template v-if="box.type === 'current_user'">
            <span>{{ dataModel[box.label_model]}}</span>
            <!-- <el-input
              v-model="user.realName"
              :style="{ width: box.options.width }"
              :placeholder="box.options.placeholder"
              :disabled="box.options.disabled"
            ></el-input> -->
        </template>
        <template v-if="box.type === 'data_select'">
            <template v-if="box.options.maps.source">
                <el-input
                    style="width: 100%"
                    @focus="loadDataSelectData"
                    clearable
                    @clear="clearDataModel"
                    :value="
            dataModel === '' || dataModel === undefined || dataModel === null
              ? ''
              : dataModel[box.label_model]
          "
                    :disabled="box.options.disabled"
                    :placeholder="box.options.placeholder"
                ></el-input>
                <el-dialog
                    :title="box.options.maps.title"
                    :visible.sync="selectDialogVisible"
                    :close-on-click-modal="closeOnClickModal"
                    custom-class="select-tree-dialog"
                    append-to-body
                    @close="handleSave"
                    width="60%"
                >
                    <el-input
                        style="width: 160px"
                        placeholder="模糊搜索"
                        prefix-icon="el-icon-search"
                        v-model="keywords"
                        @blur="searchDataSelectData"
                    ></el-input>
                    <el-table
                        :data="tableData"
                        v-loading="tableDataLoading"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        style="width: 96%"
                    >
                        <el-table-column
                            type="selection"
                            width="55px"
                            :props="box.options.maps.key"
                            fixed
                        ></el-table-column>
                        <el-table-column label="序号" width="60px" type="index" fixed>
                        </el-table-column>
                        <template v-for="col in colsArray">
                            <el-table-column
                                sortable
                                :prop="col.model"
                                :label="col.name"
                                :key="col.model"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                        </template>
                    </el-table>
                    <div
                        slot="footer"
                        class="dialog-footer"
                        style="position: relative; left: -4%; bottom: 10px"
                    >
                        <p style="width: 96%; margin: 0 auto">
                            <el-pagination
                                layout="prev, pager, next"
                                :current-page="queryCommonDataParam.pageNum"
                                @current-change="handleDataSelectCurrentChange"
                                :total="totalPage"
                                style="float: right"
                            >
                            </el-pagination>
                        </p>
                    </div>
                </el-dialog>
            </template>
            <template v-else>
                <el-input
                    style="width: 100%"
                    @focus="loadSysSelectData"
                    clearable
                    @clear="clearDataModel"
                    v-model="
            dataModel === '' || dataModel === undefined || dataModel === null
              ? ''
              : dataModel[box.label_model]
          "
                    :disabled="box.options.disabled"
                    :placeholder="box.options.placeholder"
                ></el-input>
                <el-dialog
                    :title="box.options.maps.title"
                    :visible.sync="selectDialogVisible"
                    :close-on-click-modal="closeOnClickModal"
                    custom-class="select-tree-dialog"
                    append-to-body
                    @close="handleSave"
                >

                    <el-input
                        style="width: 160px"
                        :placeholder="box.type === 'user_select' ? '用户名' : box.label_name"
                        prefix-icon="el-icon-search"
                        v-model="keywords"
                        @blur="getDataSource"
                    ></el-input>
                    <el-table
                        :data="tableData"
                        v-loading="tableDataLoading"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        style="width: 96%"
                    >
                        <el-table-column
                            type="selection"
                            width="55px"
                            :props="box.options.maps.key"
                            fixed
                        ></el-table-column>
                        <el-table-column label="序号" width="60px" type="index" fixed>
                        </el-table-column>
                        <template v-for="col in colsArray">
                            <el-table-column
                                sortable
                                :prop="col.model"
                                :label="col.name"
                                :key="col.model"
                            >
                            </el-table-column>
                        </template>
                    </el-table>
                    <p style="width: 96%; margin: 0 auto">
                        <el-pagination
                            layout="prev, pager, next"
                            :current-page="queryCommonDataParam.pageNum"
                            @current-change="handleCurrentChange"
                            :total="totalPage"
                            style="float: right"
                        >
                        </el-pagination>
                    </p>
                    </el-row>
                </el-dialog>
            </template>
        </template>
        <template v-if="box.type === 'file_upload' || box.type === 'image_upload'">
            <!--          <el-input v-model="dataModel" :hidden="true" style="width: 1px;float:left"
                                v-if="box.options.required"></el-input>-->
            <el-upload
                class="upload-demo"
                :action="this.khConfig.host.rest+box.options.action"
                :disabled="box.options.disabled"
                :multiple="box.options.multiple"
                :file-list="box.options.fileList"
                :limit="box.options.length"
                :on-exceed="handleExceed"
                :on-success="uploadCall"
                :on-remove="uploadRemove"
                :before-upload="beforeUpload"
            >
                <template v-if="box.type === 'image_upload'">
                    <el-button size="small" type="primary" >图片上传</el-button>
                    <div slot="tip" class="el-upload__tip">
                        只能上传jpg/png文件，且不超过{{box.options.maxFileSize}}M
                    </div>
                </template>
                <template  v-if="box.type === 'file_upload'">
                    <el-button size="small" type="primary" >上传附件</el-button>
                    <div slot="tip" class="el-upload__tip">
                        上传的附件大小不允许超过{{box.options.maxFileSize}}M
                    </div>
                </template>
            </el-upload>
            <div class="demo-image"
                 v-if="box.type === 'image_upload' && !KHUtils.isNull(dataModel)&& dataModel.split(',').length >0">
                <el-row :gutter="20" style="margin-top: 10px">
                    <div class="demo-image-box" v-for="imageId in dataModel.split(',')" >
                        <el-col :span="4">
                            <div>
                                <el-image
                                    :src="getImgeUrl(imageId)"
                                    @click="previewImage(imageId)"
                                ></el-image>
                                <i class="iconfont" @click="deleteFile(imageId)"
                                   style="">
                                    &#xe635;
                                </i>
                            </div>
                        </el-col>

                    </div>
                </el-row>
            </div>
            <div v-if="box.type === 'file_upload' && !KHUtils.isNull(dataModel) && dataModel.split(',') instanceof Array" style="width: 50%">
                <ul class="el-upload-list el-upload-list--text">
                    <li tabindex="0" class="el-upload-list__item is-success" v-for="(file,index) in fileObj">
                        <el-col :span="3" style="margin-top: 2%">
                            <img v-if="file.fileSuffix && file.fileSuffix.startsWith('doc')" alt=" "
                                 src="../../assets/images/word.png" @click="downLoadFile(file.fileId)"/>
                            <img v-if="file.fileSuffix && file.fileSuffix.startsWith('xls')" alt=" "
                                 src="../../assets/images/excel.png" @click="downLoadFile(file.fileId)"/>
                            <img v-if="file.fileSuffix && file.fileSuffix.startsWith('ppt')" alt=" "
                                 src="../../assets/images/ppt.png" @click="downLoadFile(file.fileId)"/>
                            <img
                                v-if="!file.fileSuffix || (file.fileSuffix && !file.fileSuffix.startsWith('doc') && !file.fileSuffix.startsWith('xls') && !file.fileSuffix.startsWith('ppt'))"
                                alt=" " src="../../assets/images/others.png" @click="downLoadFile(file.fileId)"/>
                        </el-col>
                        <el-col :span="21">
                            <p style="font-size: 10px">{{file.fileName}}</p>
                            <p style="font-size: 10px;position: relative;bottom: 15px;" v-if="file.fileSuffix && (file.fileSuffix.startsWith('jpg') || file.fileSuffix.startsWith('png'))" >
                                <a href="#" @click="downLoadFile(file.fileId)">下载</a>
                                <a href="#" @click="previewImage(file.fileId)">预览</a>
                            </p>
                            <p style="font-size: 10px;position: relative;bottom: 15px;" v-else>
                                <a href="#" @click="downLoadFile(file.fileId)">下载</a>
                                <a href="#" @click="previewFile(file.fileId)">预览</a>
                                <a href="#" @click="editFile(file.fileId)">在线编辑</a>
                                <a href="#" @click="deleteFile(file.fileId)">删除</a>
                            </p>
                        </el-col>
                    </li>
                </ul>
            </div>
        </template>
        <template v-if="box.type === 'signature'">
            <!--    <el-input v-model="dataModel" :hidden="true" style="width: 1px;float:left"
                          v-if="box.options.required"></el-input>-->
            <el-button size="small" type="primary" @click="signatureVisible = true" >签名</el-button>
            <div class="demo-image"
            >
                <div class="demo-image-box"  >
                    <el-image
                        v-show="dataModel"
                        style=" width:calc(100% - 100px);height: 200px;"
                        fit="contain"
                        :src="khConfig.api.imageDownload + '/' +dataModel"
                        :preview-src-list="srcObj[box.model]"
                    ></el-image>

                </div>
            </div>
            <el-dialog  title='签名' :visible.sync="signatureVisible"
                        :close-on-click-modal="closeOnClickModal"
                        custom-class="select-tree-dialog" append-to-body @close="handleSave">
                <signature  @onFileId="dataModel = $event;signatureVisible = false"></signature>

            </el-dialog>
        </template>
        <template v-if=" box.type === 'm_org_select'  || box.type === 'm_company_select'  || box.type === 'm_role_select'  || box.type === 'm_dic_select'">
            <el-input
                @focus="loadSysSelectData"
                clearable
                @clear="clearDataModel"
                :value=" dataModel | arrayJsonVal "
                :disabled="box.options.disabled"
                :placeholder="box.options.placeholder"
            ></el-input>

            <el-dialog :title="box.options.maps.title" :visible.sync="selectDialogVisible"
                       :close-on-click-modal="closeOnClickModal"
                       custom-class="select-tree-dialog" append-to-body @close="handleSave">
                <el-row v-if="box.options.displayModel === 'tree'">
                    <el-input
                        :placeholder="box.label_name"
                        v-model="filterText" style="width: 50%">
                    </el-input>
                    <el-tree
                        :props="box.options.props"
                        :load="loadNode"
                        :filter-node-method="filterNode"
                        lazy
                        show-checkbox
                        check-strictly
                        @check="handleSave"
                        ref="tree">
                    </el-tree>
                </el-row>
                <el-row v-if="box.options.displayModel === 'table' && colsArray.length > 0">
                    <el-input style="width: 160px;" :placeholder="box.type=== 'user_select'||'m_user_select' ? '用户名' :box.label_name"
                              prefix-icon="el-icon-search" v-model="keywords" @blur="getDataSource"></el-input>
                    <el-table
                        :data="tableData"
                        v-loading="tableDataLoading"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        style="width: 96%"
                    >
                        <el-table-column type="selection" width="55px" :props="box.options.maps.key"
                                         fixed></el-table-column>
                        <el-table-column label="序号" width="60px" type="index" fixed>
                        </el-table-column>
                        <template v-for='(col) in colsArray'>
                            <el-table-column
                                sortable
                                :prop="col.model"
                                :label="col.name"
                                :key="col.model"
                            >
                            </el-table-column>
                        </template>
                    </el-table>
                    <p style="width: 96%;margin: 0 auto">
                        <el-pagination
                            layout="prev, pager, next"
                            :current-page="queryCommonDataParam.pageNum"
                            @current-change="handleCurrentChange"
                            :total="totalPage" style="float: right">
                        </el-pagination>
                    </p>
                </el-row>
            </el-dialog>
        </template>
        <template v-if=" box.type === 'm_data_select'">
            <template v-if="box.options.maps.source">
                <el-input
                    @focus="loadDataSelectData"
                    clearable
                    @clear="clearDataModel"
                    :value="dataModel | arrayJsonVal"
                    :disabled="box.options.disabled"
                    :placeholder="box.options.placeholder"
                ></el-input>
                <el-dialog :title="box.options.maps.title" :visible.sync="selectDialogVisible"
                           :close-on-click-modal="closeOnClickModal"
                           custom-class="select-tree-dialog" append-to-body @close="handleSave" width="60%">
                    <el-input style="width: 160px;" placeholder="模糊搜索"
                              prefix-icon="el-icon-search" v-model="keywords" @blur="searchDataSelectData"></el-input>
                    <el-table
                        :data="tableData"
                        v-loading="tableDataLoading"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        style="width: 96%"
                    >
                        <el-table-column type="selection" width="55px" :props="box.options.maps.key"
                                         fixed></el-table-column>
                        <el-table-column label="序号" width="60px" type="index" fixed>
                        </el-table-column>
                        <template v-for='(col) in colsArray'>
                            <el-table-column
                                sortable
                                :prop="col.model"
                                :label="col.name"
                                :key="col.model"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                        </template>
                    </el-table>
                    <div slot="footer" class="dialog-footer" style="position: relative;left: -4%;bottom: 10px">
                        <p style="width: 96%;margin: 0 auto">
                            <el-pagination
                                layout="prev, pager, next"
                                :current-page="queryCommonDataParam.pageNum"
                                @current-change="handleDataSelectCurrentChange"
                                :total="totalPage" style="float: right">
                            </el-pagination>
                        </p>
                    </div>
                </el-dialog>
            </template>
            <template v-else>
                <el-input
                    @focus="loadSysSelectData"
                    clearable
                    @clear="clearDataModel"
                    v-model="dataModel === '' || dataModel === undefined || dataModel === null ? '' :dataModel[box.label_model]"
                    :disabled="box.options.disabled"
                    :placeholder="box.options.placeholder"
                    :style="{width: box.options.width}"
                ></el-input>
                <el-dialog :title="box.options.maps.title" :visible.sync="selectDialogVisible"
                           :close-on-click-modal="closeOnClickModal"
                           custom-class="select-tree-dialog" append-to-body @close="handleSave">
                    <el-row v-if="box.options.displayModel === 'tree'">
                        <el-input
                            :placeholder="box.label_name"
                            v-model="filterText" style="width: 50%">
                        </el-input>
                        <el-tree
                            :props="box.options.props"
                            :load="loadNode"
                            :filter-node-method="filterNode"
                            lazy
                            show-checkbox
                            check-strictly
                            @check="handleSave"
                            ref="tree">
                        </el-tree>
                    </el-row>
                    <el-row v-if="box.options.displayModel === 'table' && colsArray.length > 0">
                        <el-input style="width: 160px;" :placeholder="box.type=== 'user_select' ||box.type===  'm_user_select' ? '用户名' :box.label_name"
                                  prefix-icon="el-icon-search" v-model="keywords" @blur="getDataSource"></el-input>
                        <el-table
                            :data="tableData"
                            v-loading="tableDataLoading"
                            tooltip-effect="dark"
                            @selection-change="handleSelectionChange"
                            style="width: 96%"
                        >
                            <el-table-column type="selection" width="55px" :props="box.options.maps.key"
                                             fixed></el-table-column>
                            <el-table-column label="序号" width="60px" type="index" fixed>
                            </el-table-column>
                            <template v-for='(col) in colsArray'>
                                <el-table-column
                                    sortable
                                    :prop="col.model"
                                    :label="col.name"
                                    :key="col.model"
                                >
                                </el-table-column>
                            </template>
                        </el-table>
                        <p style="width: 96%;margin: 0 auto">
                            <el-pagination
                                layout="prev, pager, next"
                                :current-page="queryCommonDataParam.pageNum"
                                @current-change="handleCurrentChange"
                                :total="totalPage" style="float: right">
                            </el-pagination>
                        </p>
                    </el-row>
                </el-dialog>
            </template>
        </template>
        <template v-if="box.type === 'region_select'">
            <v-region @values="regionChange" :city="true" v-model="getRegionModel" class="form-control"
                      :disabled="box.options.disabled"></v-region>
        </template>
        <template v-if="box.type === 'gis_select'">
            <el-input
                @focus="openGisDialog"
                clearable
                @clear="clearDataModel"
                v-model="dataModel[box.modelExt.address]"
                :disabled="box.options.disabled"
                :placeholder="box.options.placeholder"
            ></el-input>
            <el-dialog title="地图定位"
                       :visible.sync="gisVisible"
                       :close-on-click-modal="closeOnClickModal"
                       :close-on-press-escape="closeOnClickModal"
                       width="60%"
                       append-to-body
                       @close="handlerGisClose">
                <gao-de-gis v-if=" gisMapVisible && box.options.gisType === '高德'" :from-parent-gis-obj="editGisObj"
                            :gis-init-obj="gisInitObj"
                            @recGisMsg="recGisMsg"
                            :child-resp="notifyChild"></gao-de-gis>
            </el-dialog>
        </template>
        <template v-if="box.type === 'm_data_ref'">
            <m-data-ref-widget :formId="formId" :dataModel.sync="dataModel" :box="box"></m-data-ref-widget>
        </template>
        <preview-image-dialog :visible.sync="imageDialogVisible" :imageId="imageId"></preview-image-dialog>
    </div>
</template>

<script>
    import PreviewImageDialog from "@/components/PreviewImageDialog.vue";
    import signature from '@/components/form-build/signature/signature';
    import GaoDeGis from '@/components/gis/GaoDeGis';
    import MDataRefWidget from "@/components/form-widget/MDataRefWidget.vue";
    import userSelectWidget from "@/components/form-widget/UserSelectWidget.vue";
    import { mapGetters } from "vuex";
    export default {
        props:['box','models','value','formId'],
        components: {
            PreviewImageDialog,
            signature,
            GaoDeGis,
            MDataRefWidget,
            userSelectWidget
        },
        // props: {
        //   box: {
        //     type: Object,
        //     default: function () {
        //       return {};
        //     },
        //   },
        //   value: {
        //     type: Object | String | Number,
        //     default: "",
        //   },
        //   models:{
        //     type: Object | String | Number,
        //     default: "",
        //   }
        // },
        computed:{
            ...mapGetters({
                user: "getUserInfo",
            }),
            getRegionModel : {
                get(){
                    if(this.box.type === 'region_select'){
                        let newObj = { 'town': '' };
                        newObj.province = this.value[this.box.modelExt.provinceCode] ? this.value[this.box.modelExt.provinceCode] : "";
                        newObj.city = this.value[this.box.modelExt.cityCode] ? this.value[this.box.modelExt.cityCode] : "";
                        newObj.area = this.value[this.box.modelExt.areaCode] ? this.value[this.box.modelExt.areaCode] : "";
                        return newObj;
                    }
                },
                set(val){

                }
            },
            dataModel:{
                get(){
                    if(this.box.type === 'switch'){
                        if(this.value == "0"){
                            return true;
                        } else {
                            return false;
                        }
                    }else if(this.box.type === 'multiple_select' || this.box.type === 'checkbox'){
                        if(this.KHUtils.isNull(this.value)){
                            return [];
                        }else {
                            return this.value.split(",");
                        }
                    }else if(this.box.type == 'region_select'){
                        if(this.KHUtils.isNull(this.value)){
                            return {};
                        }else {
                            return this.value;
                        }
                    }else if(this.box.type == 'year' || this.box.type == 'month'){
                        if(this.value == null || this.value  == undefined){
                            return "";
                        }else {
                            return this.value+"";
                        }
                    }else if(this.box.type == 'current_user'){
                        if(this.KHUtils.isNull( this.value)){
                            this.value = {};
                            this.value[this.box.model] = this.user.id;
                            this.value[this.box.label_model] = this.user.realName;
                            this.$emit('input',this.value);
                            return this.value;
                        }else {
                            if( this.value instanceof Object){
                                if(this.KHUtils.isNull(this.value[this.box.label_model])){
                                    this.value = {};
                                    this.value[this.box.model] = this.user.id;
                                    this.value[this.box.label_model] = this.user.realName;
                                    this.$emit('input',this.value);
                                    return this.value;
                                }else {
                                    return this.value;
                                }
                            }
                        }


                    }else{
                        return this.value
                    }

                },
                set(val){
                    debugger
                    if(this.box.type === 'switch'){
                        if(val){
                            this.$emit('input',"0");
                        }else {
                            this.$emit('input',"1");
                        }
                    }else if(this.box.type === 'multiple_select' || this.box.type === 'checkbox'){
                        if(val instanceof Array && val.length >0){
                            this.$emit('input',val.join(","))
                        }else {
                            this.$emit('input',"")
                        }
                    }else {
                        this.$emit('input',val)
                    }
                }
            },
            getImgeUrl(){
                return function (imageId) {
                    return this.khConfig.api.imageDownload + "/" + imageId;
                }
            },
        },
        created() {
            let _this = this;
            // 文件的处理
            if (_this.box.type === 'file_upload') {
                if (!_this.KHUtils.isNull(_this.dataModel)) {
                    _this.fileObj = [];
                    _this.dataModel.split(",").forEach(obj => {
                        // 查询文件的详细信息
                        let xhr;
                        if (window.ActiveXObject) {
                            xhr = new ActiveXObject("Microsoft.XMLHTTP");
                        } else {
                            xhr = new XMLHttpRequest();
                        }
                        // 原生Ajax同步请求
                        xhr.open("GET", _this.khConfig.host.rest + _this.khConfig.api.getFileInfo + "/" + obj, false);
                        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                                let res = JSON.parse(xhr.responseText);
                                if (res.errCode === 0) {
                                    let newObj = {};
                                    newObj.fileName = res.originalName;
                                    newObj.fileId = res.fileId;
                                    newObj.fileSuffix = res.suffix;
                                    _this.fileObj.push(newObj);
                                }
                            }
                        };
                        // 传递参数
                        xhr.send();
                    })
                }
            }

            /*       if(_this.box.type === 'current_user'){
             if(_this.KHUtils.isNull( _this.value)){
             _this.value = {};
             _this.value[this.box.model] = _this.user.id;
             _this.value[this.box.label_model] = _this.user.realName;
             }else {
             if( _this.value instanceof Object){
             if(_this.KHUtils.isNull(_this.value[this.box.label_model])){
             _this.value = {};
             _this.value[this.box.model] = _this.user.id;
             _this.value[this.box.label_model] = _this.user.realName;
             }
             }
             }

             }*/


            _this.initGis();



        },
        data() {
            return {
                filterText: "",
                keywords: "", // 搜索关键字
                colsArray: [],
                totalPage: 0,
                queryCommonDataParam: {
                    pageNum: 1, // 查询参数
                    pageSize: 10,
                },
                tableData: [],
                tableDataLoading: false,
                selectTableData: [], // 被选择的列表数据
                notifyChild: 0, // gis 地图
                gisVisible: false,
                gisMapVisible:false,
                gisInitObj: {},
                editGisObj: {}, // 编辑GIS
                selectDialogVisible: false,
                closeOnClickModal: false,
                // dataModel: this.value || '',
                srcObj: {},
                fileObj: {},
                bValue: "",
                eValue: "",
                address: "",
                regionObj: {
                    province: "130000",
                    city: "130500",
                    area: "130523",
                    town: "350104008",
                },
                selected: { province: "130000", city: "130500", area: "130523", town: "" },
                signatureVisible: false,
                imageId:"",
                imageDialogVisible:false,
                signatureVisible:false,
                fileObj:[],//附件
            };
        },
        methods: {
            openGisDialog(){
                this.gisVisible = true;
                this.gisMapVisible = true;
            },
            initGis(){
                let _this = this;
                // Gis定位
                if (_this.box.type === 'gis_select') {
                    _this.gisInitObj = {};
                    if (!_this.KHUtils.isNull(_this.box.options.city)) {
                        _this.gisInitObj.gisInitCity = _this.box.options.city;
                    } else {
                        _this.gisInitObj[_this.box.model].gisInitCity = '南昌';
                    }
                    if (!_this.KHUtils.isNull(_this.box.options.zoom)) {
                        _this.gisInitObj.gisInitZoom = _this.box.options.zoom;
                    } else {
                        _this.gisInitObj.gisInitCity = 13;
                    }
                    if (!_this.KHUtils.isNull(_this.box.options.lat) && !_this.KHUtils.isNull(_this.box.options.lnt)) {
                        _this.gisInitObj.gisInitLat = _this.box.options.lat;
                        _this.gisInitObj.gisInitLnt = _this.box.options.lnt;
                    } else {
                        _this.gisInitObj.gisInitLat = 28.683016;
                        _this.gisInitObj.gisInitLnt = 115.857963;
                    }
                }
                // 编辑GIS控件地图初始化处理
                if (_this.box.type === 'gis_select') {
                    if (!_this.KHUtils.isNull(_this.dataModel)) {
                        _this.address = _this.dataModel[_this.box.modelExt.address];
                        let tempDataModel = _this.KHUtils.clone(_this.dataModel);
                        _this.editGisObj = {};
                        let tempObj = {};
                        tempObj.lat = tempDataModel[_this.box.modelExt.lat];
                        tempObj.lnt = tempDataModel[_this.box.modelExt.lnt];
                        tempObj.address = tempDataModel[_this.box.modelExt.address];
                        _this.editGisObj = tempObj;
                    }
                }
            },
            previewImage(imageId){
                this.imageId = imageId;
                this.imageDialogVisible = true
            },
            searchDataSelectData() {
                let _this = this;
                _this.queryCommonDataParam.pageNum = 1;
                _this.loadDataSelectData();
            },
            // 表单重构后通用数据查询
            loadDataSelectData() {
                let _this = this;
                if (
                    !(_this.box.options.maps.source.columns instanceof Array) ||
                    (_this.box.options.maps.source.columns instanceof Array &&
                    _this.box.options.maps.source.columns.length <= 0)
                ) {
                    return false;
                }
                let param = {
                    cond: _this.keywords,
                    pageNum: _this.queryCommonDataParam.pageNum,
                    pageSize: _this.queryCommonDataParam.pageSize,
                };
                let mountedOrPreview = _this.KHUtils.isNull(_this.formId);
                let tempCols = "";
                _this.colsArray = [];
                _this.box.options.maps.source.columns.forEach((cl) => {
                    tempCols += cl.column + ",";
                    let newObj = {};
                    newObj.name = cl.name;
                    newObj.model = cl.column;
                    _this.colsArray.push(newObj);
                });
                if (tempCols.length > 0) {
                    tempCols = tempCols.substr(0, tempCols.length - 1);
                }
                if (mountedOrPreview) {
                    param.tbName = _this.box.options.maps.source.table;
                    param.cols = tempCols;
                } else {
                    param.formId = _this.formId;
                    param.fk = _this.box.key;
                }
                _this.selectDialogVisible = true;
                _this.tableDataLoading = true;
                _this
                    .$Get(
                        mountedOrPreview
                            ? _this.khConfig.api.previewquerydata
                            : _this.khConfig.api.mountedquerydata,
                        param
                    )
                    .then((res) => {
                        if (res.errCode === 0) {
                            _this.totalPage = res.totalCount;
                            _this.tableData = res.datas;
                        }
                        _this.tableDataLoading = false;
                    });
            },
            // 通用数据、组织、用户等控件清空input框提交时,一并将绑定的dataModel也清空
            clearDataModel() {
                let _this = this;
                if (
                    this.box.type === "m_data_select" ||
                    this.box.type === "m_org_select" ||
                    this.box.type === "m_user_select" ||
                    this.box.type === "m_company_select" ||
                    this.box.type === "m_role_select" ||
                    this.box.type === "m_dic_select"
                ) {
                    _this.dataModel = "";
                } else {
                    deep(_this.dataModel);
                    function deep(obj) {
                        for (let k in obj) {
                            obj[k] = "";
                            if (obj[k] instanceof Object) {
                                deep(obj[k]);
                            }
                        }
                    }
                }
            },
            // 组织,用户等控件加载选择项数据
            loadSysSelectData() {
                let _this = this;
                if (_this.box.options.displayModel === "table") {
                    _this.getDataSource();
                } else {
                    if (_this.KHUtils.isNull(_this.box.options.remoteUrl)) {
                        _this.$notify.warning({
                            title: "警告",
                            message: "接口地址为空",
                        });
                        return false;
                    }
                    let param = {};
                    if (
                        _this.box.type === "user_select" ||
                        _this.box.type == "m_user_select" ||
                        _this.box.type === "company_select" ||
                        _this.box.type === "m_company_select"
                    ) {
                        param.pageSize = 10000000;
                        param.pageNum = 1;
                    } else if (_this.box.type === "dic_select" || _this.box.type === "m_dic_select") {
                        param.typeCode = this.box.typeCode;
                        param.parentId = null;
                    } else {
                        param.parentId = null;
                    }
                    console.log(param);
                    this.$Get(_this.box.options.remoteUrl, param).then((res) => {
                        if (res.errCode === 0) {
                            if (
                                _this.box.type === "data_select" ||
                                _this.box.type === "m_data_select" ||
                                _this.box.type === "company_select" ||
                                _this.box.type === "m_company_select"
                            ) {
                                _this.tableData = res.datas; // 通用数据特殊化处理;
                            } else {
                                _this.tableData = res.list;
                            }
                            if (!_this.KHUtils.isNull(_this.tableData)) {
                                _this.selectDialogVisible = true;
                            }
                        }
                    });
                }
            },
            // 树形展示搜索
            filterNode(value, data) {
                if (!value) return true;
                return data[this.box.options.maps.name].indexOf(value) !== -1;
            },
            // 通用数据树形展示
            loadNode(node, resolve) {
                let _this = this;
                if (
                    !_this.box.options.remoteUrl ||
                    _this.KHUtils.isNull(this.box.options.remoteUrl)
                ) {
                    return false;
                }
                if (node.level === 0) {
                    return resolve(_this.tableData);
                }
                if (
                    this.box.type === "data_select" ||
                    this.box.type === "m_data_select" ||
                    this.box.type === "user_select" ||
                    this.box.type === "m_user_select" ||
                    this.box.type === "role_select" ||
                    this.box.type === "m_role_select" ||
                    this.box.type === "company_select" ||
                    this.box.type === "m_company_select"
                ) {
                    return resolve([]); // 无上下级关系
                } else {
                    let param = {};
                    if (this.box.type === "dic_select" || this.box.type === "m_dic_select") {
                        param.parentId = node.data.id; // 数据字典的特殊化处理,选择时带出code,name;
                        console.log(node.data);
                    } else {
                        param.parentId = node.data[this.box.options.maps.key];
                    }
                    this.$Get(this.box.options.remoteUrl, param).then((res) => {
                        if (res.errCode === 0) {
                            return resolve(res.list);
                        }
                    });
                }
            },
            // 通用数据控件数据源查询
            getDataSource() {
                let _this = this;

                if (
                    !_this.box.options.remoteUrl ||
                    _this.KHUtils.isNull(this.box.options.remoteUrl)
                ) {
                    _this.$notify.warning({
                        title: "警告",
                        message: "未选择任何的数据配置项",
                    });
                    return false;
                }
                if (_this.box.type === "user_select" || _this.box.type === "m_user_select") {
                    _this.queryCommonDataParam.wd = _this.keywords;
                } else if (
                    _this.box.type === "company_select" ||
                    this.box.type === "m_company_select"
                ) {
                    _this.queryCommonDataParam.companyName = _this.keywords;
                } else {
                    _this.queryCommonDataParam.condition = _this.keywords;
                }
                _this.tableDataLoading = true;
                _this.$Get(_this.box.options.remoteUrl, _this.queryCommonDataParam).then((res) => {
                    if (res.errCode === 0) {
                        _this.totalPage = res.totalCount;
                        // 展示形式为表格
                        if (_this.box.options.displayModel === "table") {
                            if (res.desc) {
                                _this.colsArray = [];
                                let dataObj = res.desc;
                                Object.keys(dataObj).forEach(function (key) {
                                    let newObj = {};
                                    newObj.name = dataObj[key];
                                    newObj.model = key;
                                    _this.colsArray.push(newObj);
                                });
                            } else {
                                if (
                                    _this.box.type === "user_select" ||
                                    _this.box.type === "m_user_select"
                                ) {
                                    _this.colsArray = [
                                        { name: "用户名", model: "username" },
                                        {
                                            name: "真实名称",
                                            model: "realName",
                                        },
                                        { name: "所属组织", model: "orgName" },
                                        { name: "手机号", model: "phone" },
                                        { name: "邮箱", model: "email" },
                                    ];
                                } else if (
                                    _this.box.type === "company_select" ||
                                    _this.box.type === "company_select"
                                ) {
                                    _this.colsArray = [
                                        { name: "企业名称", model: "companyName" },
                                        {
                                            name: "行政区划",
                                            model: "administrativeAreaName",
                                        },
                                        { name: "所属行业", model: "industryName" },
                                        { name: "行业类别", model: "industyType" },
                                        {
                                            name: "国民经济行业类型",
                                            model: "economicTypeName",
                                        },
                                        { name: "组织机构代码", model: "companyCode" },
                                    ];
                                }
                            }
                            if (res.datas) {
                                _this.tableData = res.datas;
                            } else {
                                _this.tableData = res.list;
                            }
                        }
                        if (!_this.KHUtils.isNull(_this.tableData)) {
                            _this.selectDialogVisible = true;
                        }
                    }
                    _this.tableDataLoading = false;
                });
            },
            // 分页查询
            handleDataSelectCurrentChange(val) {
                this.queryCommonDataParam.pageNum = val;
                this.loadDataSelectData();
            },
            // 分页查询
            handleCurrentChange(val) {
                this.queryCommonDataParam.pageNum = val;
                this.getDataSource();
            },
            // 列表选中触发
            handleSelectionChange(array) {
                console.log(array);
                if (array instanceof Array && array.length === 0) {
                    return false;
                }
                this.selectTableData = [];

                if (
                    !(
                        this.box.type == "m_data_select" ||
                        this.box.type == "m_org_select" ||
                        this.box.type == "m_user_select" ||
                        this.box.type == "m_role_select" ||
                        this.box.type == "m_company_select" ||
                        this.box.type == "m_dic_select"
                    )
                ) {
                    if (array instanceof Array && array.length >= 2) {
                        this.$notify.warning({
                            title: "警告",
                            message: "选择关联的数据不允许超过一条",
                        });
                        return false;
                    }
                }
                this.selectTableData = array;
                this.handleSave();
                //this.selectDialogVisible = false;
                //debugger
            },
            // 定位信息返回
            recGisMsg(obj) {
                let _this = this;
                _this.address = obj.address;
                _this.dataModel = {};
                let gisModel = {};
                this.$emit('input',this.dataModel)
                gisModel[_this.box.modelExt.lat] = obj.lat ? obj.lat : "";
                gisModel[_this.box.modelExt.lnt] = obj.lnt ? obj.lnt : "";
                gisModel[_this.box.modelExt.address] = obj.address ? obj.address : "";
                this.$emit('input',gisModel)
                _this.gisMapVisible = false;
                _this.gisVisible = false;
                // console.log("GisObj:" + JSON.stringify(obj));
            },
            // 关闭GIs窗口通知子组件返回数据给父组件
            handlerGisClose() {
                this.notifyChild++;
            },
            // 数据选择控件保存
            handleSave() {
                let _this = this;
                let selected = {};
                if (
                    _this.box.type === "data_select" ||
                    _this.box.type === "org_select" ||
                    _this.box.type === "user_select" ||
                    _this.box.type === "company_select" ||
                    _this.box.type === "role_select" ||
                    _this.box.type === "dic_select"
                ) {
                    // 以列表的形式展示
                    if (_this.box.options.displayModel === "table") {
                        if (
                            _this.KHUtils.isNull(_this.selectTableData) ||
                            _this.selectTableData.length <= 0
                        ) {
                            return false;
                        }
                        selected = _this.selectTableData[0];
                    } else {
                        let data = _this.$refs.tree.getCheckedNodes();
                        if (data.length >= 2) {
                            this.$notify.warning({
                                title: "警告",
                                message: "选择关联的数据不允许超过一条",
                            });
                            return false;
                        }
                        if (_this.KHUtils.isNull(data) || data.length === 0) {
                            data = this.$refs.tree.getCurrentNode();
                        }
                        selected = data[0];
                    }
                    let label = _this.box.options.maps.name;
                    let key = _this.box.options.maps.key;
                    _this.dataModel = {};
                    _this.dataModel[this.box.model] = selected[key];
                    _this.dataModel[this.box.label_model] = selected[label];
                    // 是否配置表单其他字段也从选中的数据中带出
                    if (_this.box.options.maps) {
                        if (_this.box.options.maps.mapping) {
                            if (_this.box.options.maps.mapping instanceof Array) {
                                let mappingArray = _this.box.options.maps.mapping;
                                for (let i = 0, n = mappingArray.length; i < n; i++) {
                                    let obj = mappingArray[i];
                                    if (!_this.KHUtils.isNull(selected[obj.selectKey])) {
                                        _this.dataModel[obj.model] = selected[obj.selectKey];
                                    }
                                }
                            }
                        }
                    }
                    this.$emit('input',_this.dataModel)
                    _this.selectDialogVisible = false;
                }else if( _this.box.type === 'm_data_select' || _this.box.type === 'm_org_select' || _this.box.type === 'm_user_select' || _this.box.type === 'm_company_select' || _this.box.type === 'm_role_select' || _this.box.type === 'm_dic_select' ){
                    let label = _this.box.options.maps.name;
                    let key = _this.box.options.maps.key;
                    //let dataModel
                    if (_this.box.options.displayModel === 'table') {
                        if (_this.KHUtils.isNull(_this.selectTableData) || _this.selectTableData.length <= 0) {
                            return false;
                        }
                        let JsopDataModel = []
                        _this.selectTableData.forEach((value)=>{
                            let obj = {
                                k:value[key],
                                v:value[label]
                            }
                            JsopDataModel.push(obj)
                        })
                        _this.dataModel  =  JSON.stringify(JsopDataModel)
                        //debugger
                    } else{
                        let data = _this.$refs.tree.getCheckedNodes();
                        let JsopDataModel = []
                        data.forEach(value =>{
                            let obj = {
                                k:value[key],
                                v:value[label]
                            }
                            JsopDataModel.push(obj)
                        })
                        _this.dataModel  =  JSON.stringify(JsopDataModel)
                        // debugger
                    }
                    // 是否配置表单其他字段也从选中的数据中带出
                    if (_this.box.options.maps) {
                        if (_this.box.options.maps.mapping) {
                            if (_this.box.options.maps.mapping instanceof Array) {
                                let mappingArray = _this.box.options.maps.mapping;

                                for (let i = 0, n = mappingArray.length; i < n; i++) {
                                    let obj = mappingArray[i];
                                    if (!_this.KHUtils.isNull(selected[obj.selectKey])) {
                                        _this.dataModel[obj.model] = selected[obj.selectKey]
                                    }
                                }
                            }
                        }
                    }
                    console.log("dataModel:" + JSON.stringify(_this.dataModel));

                }
            },
            // 行政区划选择
            regionChange(data) {
                console.log("regionObj :" + JSON.stringify(data));
                let regionModel = {};
                if (data.province) {
                    if (data.province.value) {
                        this.dataModel[this.box.modelExt.province] = data.province.value; // 省
                        this.dataModel[this.box.modelExt.provinceCode] = data.province.key;
                    }
                } else {
                    this.dataModel[this.box.modelExt.province] = ""; // 省
                    this.dataModel[this.box.modelExt.provinceCode] = "";
                }
                if (data.city) {
                    if (data.city.value) {
                        this.dataModel[this.box.modelExt.city] = data.city.value; // 市
                        this.dataModel[this.box.modelExt.cityCode] = data.city.key;
                    }
                } else {
                    this.dataModel[this.box.modelExt.city] = ""; // 市
                    this.dataModel[this.box.modelExt.cityCode] = "";
                }
                if (data.area) {
                    if (data.area.value) {
                        this.dataModel[this.box.modelExt.area] = data.area.value; // 县
                        this.dataModel[this.box.modelExt.areaCode] = data.area.key;
                    }
                } else {
                    this.dataModel[this.box.modelExt.area] = "";
                    this.dataModel[this.box.modelExt.areaCode] = "";
                }
                this.$emit('input',this.dataModel)
            },
            // 移除文件
            deleteFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.warning("请选择移除的文件");
                    return false;
                }
                if (!this.KHUtils.isNull(this.dataModel) && this.dataModel.split(",").length >0) {
                    let modelArray = this.dataModel.split(",");
                    // 移除该节点的上级节点
                    let deleteIndex = [];
                    for (let i = 0, n = modelArray.length; i < n; i++) {
                        if (fileId === modelArray[i]) {
                            deleteIndex.push(i);
                        }
                    }
                    for (let i = deleteIndex.length - 1; i >= 0; i--) {
                        modelArray.splice(deleteIndex[i], 1);
                    }
                    this.dataModel = modelArray.join(",");
                }
            },
            // 下载文件
            downLoadFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.warning("下载失败,未上传任何文件");
                    return false;
                }
                this.$OpenUrl(this.khConfig.api.fileDownload + "/" + fileId);
            },
            // 在线预览
            previewFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.error("预览失败,未上传任何文件");
                    return false;
                }
                window.open("/static/wps.html?_w_fileId=" + fileId + "&_w_type=read");
            },
            // 在线编辑
            editFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.error("编辑失败,未上传任何文件");
                    return false;
                }
                window.open("/static/wps.html?_w_fileId=" + fileId + "&_w_type=write");
            },
            // 单选框选择触发事件
            controlShow() {
                this.$emit("func", { ...this.box, data: this.dataModel });
            },
            // 文件上传成功的钩子函数
            uploadCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$notify({
                        title: "成功",
                        message: "上传成功",
                        type: "success",
                    });
                    // 如果是编辑
                    if (!this.KHUtils.isNull(this.dataModel) && this.dataModel.split(",").length >0) {
                        let modelArray = this.dataModel.split(",");
                        for (let i = 0, n = fileList.length; i < n; i++) {
                            let flag = true;
                            let fileId = fileList[i].response.datas[0].fileId;
                            for (let j = 0; j < modelArray.length; j++) {
                                if (modelArray[j].endsWith(fileId)) {
                                    flag = false;
                                }
                            }
                            if (flag) {
                                if (this.box.type === "image_upload" || this.box.type === "image_upload") {
                                    modelArray.push(fileId);
                                } else {
                                    modelArray.push(fileId);
                                }
                            }
                        }
                        if(modelArray instanceof Array && modelArray.length >0){
                            this.dataModel = modelArray.join(",");
                        }

                    } else {
                        // 新增操作
                        let str = "";
                        for (let i = 0, n = fileList.length; i < n; i++) {
                            str += fileList[i].response.datas[0].fileId + ",";
                        }
                        //去掉最后一个逗号(如果不需要去掉,就不用写)
                        if (str.length > 0) {
                            str = str.substr(0, str.length - 1);
                        }
                        this.dataModel = str;
                    }

                } else {
                    this.$notify.error({
                        title: "错误",
                        message: response.errMsg,
                    });
                    return false;
                }
            },
            // 文件上传成功后移除的钩子函数
            uploadRemove(file, fileList) {
                if (file.response.errCode === 0) {
                    if (file.response.datas != null && file.response.datas.length > 0) {
                        let compareKey = file.response.datas[0].fileId;
                        // 如果是编辑
                        if (
                            this.models[this.box.model] instanceof Array &&
                            this.models[this.box.model].length > 0
                        ) {
                            let modelArray = this.models[this.box.model];
                            const index = modelArray.findIndex((obj) => obj === compareKey);
                            modelArray.splice(index, 1);
                        } else {
                            if (!this.KHUtils.isNull(this.models[this.box.model])) {
                                let modelArray = this.models[this.box.model].split(",");
                                const index = modelArray.findIndex((obj) => obj === compareKey);
                                modelArray.splice(index, 1);
                                if (modelArray.length > 0) {
                                    let str = "";
                                    for (let i = 0, n = modelArray.length; i < n; i++) {
                                        str += modelArray[i] + ",";
                                    }
                                    //去掉最后一个逗号(如果不需要去掉,就不用写)
                                    if (str.length > 0) {
                                        str = str.substr(0, str.length - 1);
                                    }
                                    this.models[this.box.model] = str;
                                } else {
                                    this.models[this.box.model] = "";
                                }
                            }
                        }
                    }
                }
            },
            // 文件上传前的钩子函数
            beforeUpload(file) {
                if (this.box.type === "image_upload") {
                    if (file.type !== "image/jpeg" && file.type !== "image/png") {
                        this.$message.error("只能上传jpg/png文件");
                        return false;
                    }
                }
                const limitSize = file.size / 1024 / 1024 < this.box.options.maxFileSize;
                if (!limitSize) {
                    this.$message.error(`上传文件大小不能超过 ${this.box.options.maxFileSize}M`);
                    return false;
                }
            },
            // 文件超限
            handleExceed(files, fileList) {
                this.$message.warning(
                    `当前限制选择 ${this.box.options.length}个文件，本次选择了 ${
                        files.length
                        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
                );
                return false;
            },
        },
        watch: {
            filterText(val) {
                if (this.box.options.displayModel === "tree") {
                    this.$refs.tree.filter(val);
                }
            },
            // dataModel: {
            //             deep: true,
            //             handler(val) {
            //               this.$emit("input",val);
            //                 if (val instanceof Object) {
            //                     f(val, this);
            //                 } else {
            //                     this.models[this.box.model] = val;
            //                     this.$emit('update:models', {
            //                         // ...this.models,
            //                         [this.box.model]: val
            //                     });
            //                 }

            //                 function f(val, _this) {
            //                     Object.keys(val).forEach(function (key) {
            //                         _this.models[key] = val[key];
            //                         _this.$emit('update:models', {
            //                             ..._this.models,
            //                             [_this.box.model]: val
            //                         });
            //                     })
            //                 }
            //             }

            //         },
            // 解决在编辑时,修改了一些字段后，删除图片或附件,之前修改的值会恢复到修改之前的缺陷修复;
            models: {
                deep: true,
                handler(val) {
                    this.dataModel = val[this.box.model];
                },
            },
            bValue: {
                deep: true,
                handler(val) {
                    this.dataModel = val + "&nbsp" + this.eValue;
                },
            },
            eValue: {
                deep: true,
                handler(val) {
                    this.dataModel = this.bValue + "&nbsp" + val;
                },
            },
        },
    };
</script>

<style  lang="scss" scoped>
    .demo-image .demo-image-box {
        /*float: left;*/
        // padding: 10px 0;
        position: relative;

        .iconfont {
            background-color: $primary-color;
            position: relative;
            bottom: 2px;
            right: 20px;
            font-size: 16px;
            cursor: pointer;
            color: #ffffff;
            z-index: 4;
        }

        .el-image {
            width: 100px;
            height: 100px;
            outline: 1px solid $primary-color;
            border: 1px solid $primary-color;
        }
    }

    .upload-demo > > > .el-upload {
        float: left;
        padding-right: 10px;
    }
</style>
