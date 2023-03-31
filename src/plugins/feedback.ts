import { ElMessage,ElMessageBox } from 'element-plus'
//挂载在 window 方便与在js中使用
window['$dialog'] = ElMessageBox
//挂载在 window 方便与在js中使用
window['$message'] = ElMessage