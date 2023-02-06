<template>
    <div class="formDetail">
        <el-tooltip v-if="item.enableQrCode" class="item QRCode" effect="dark" content="查看二维码" placement="top">
            <img alt=" " src="@/assets/images/qr-code.png"
                @click="handleViewQrCode('query')" />
        </el-tooltip>
        <template v-if="tableShowType === 'transverse'">
            <form-detail-build v-if="hackReset" :data.sync="formConfig" :value.sync="dataModels"
                :addOrEdit.sync="addOrEdit" :form-id="formId" ref="buildForm">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-detail-build>
            <template v-if="tableFormConfig.length > 0">
                <el-tabs v-model="formActiveName">
                    <el-tab-pane v-for="item in tableFormConfig" :label="item.name" :name="item.model"
                        :key="item.model">
                        <single-table v-if="hackReset" :item="item" :data-config="formConfig.config" :form-id="formId"
                            :parent-id="parentBusinessId" :isDetail="true"></single-table>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </template>
        <template v-else>
            <portrait-restructure-form-detail-build v-if="hackReset" :data.sync="formConfig" :value.sync="dataModels"
                :addOrEdit.sync="addOrEdit" :form-id="formId" :tableFormConfig="tableFormConfig"
                :parentBusinessId="parentBusinessId" ref="buildForm">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </portrait-restructure-form-detail-build>
        </template>
        <el-dialog title="二维码管理" custom-class="advanced-set-dialog" :visible.sync="qrCodeVisible" :append-to-body="true"
            :close-on-click-modal="false" :modal="false" width="600px">
            <qr-code-manager :formId="formId" :qrCodeType="qrCodeType" :dataId="businessId"
                v-if="qrCodeVisible"></qr-code-manager>
        </el-dialog>
    </div>
</template>

<script>
import PortraitRestructureFormDetailBuild from "@/components/form-build/PortraitRestructureFormDetailBuild";
import SingleTable from "@/components/table/SingleTable";
import QrCodeManager from '@/components/qr-code-set/QrCodeManager'
import FormDetailBuild from "@/components/form-build/RestructureFormDetailBuild";
export default {
    props: ["formId", "item", "addOrEdit", "tableShowType", "hackReset", "formConfig", "dataModels", "allCols", "tableFormConfig", "formActiveName", "parentBusinessId", "businessId",],
    components: {
        SingleTable,
        QrCodeManager,
        PortraitRestructureFormDetailBuild,
        FormDetailBuild
    },
    data() {
        return {
            qrCodeType: "",
            qrCodeVisible: false,
            nextLoading: false,
            parentSaveDisable: false,
        }
    },
    methods: {
        //查看二维码
        handleViewQrCode(qrCodeType) {
            this.qrCodeType = qrCodeType;
            this.qrCodeVisible = true
        },
        
    }
}
</script>

<style>

</style>