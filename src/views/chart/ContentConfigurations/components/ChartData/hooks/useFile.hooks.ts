import { ref, toRef, nextTick } from 'vue'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { readFile, downloadTextFile, JSONStringify, JSONParse } from '@/utils'
import { UploadRequestOptions } from 'element-plus'

export const useFile = (targetData: any) => {
  const uploadFileListRef = ref()

  //@ts-ignore
  const beforeUpload = ({ file }) => {
    uploadFileListRef.value = []
    const type = file.file.type
    if (type !== FileTypeEnum.JSON && type !== FileTypeEnum.TXT) {
      window['$message'].warning('仅支持上传 【JSON】 格式文件，请重新上传！')
      return false
    }
    return true
  }

  // 自定义上传操作
  const customRequest = (options: UploadRequestOptions) => {
    const { file } = options
    nextTick(() => {

      if (file) {
        readFile(file).then((fileData: any) => {
          targetData.value.option.dataset = JSONParse(fileData)
        })
      } else {
        window['$message'].error('导入数据失败，请稍后重试或联系管理员！')
      }
    })
  }

  // 下载文件
  const download = () => {
    try {

      window['$message'].success('下载中，请耐心等待...')
      downloadTextFile(JSONStringify(targetData.value.option.dataset), undefined, 'json')
    } catch (error) {
      window['$message'].error('下载失败，数据错误！')
    }
  }
  return {
    uploadFileListRef,
    beforeUpload,
    customRequest,
    download
  }
}
