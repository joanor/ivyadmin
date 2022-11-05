import { reactive, Ref, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox, UploadFile, UploadFiles } from 'element-plus'
import { read, utils } from 'xlsx'
import { batchAddSystem } from '@/api'

type CheckType = 'excel' | 'image' | 'pdf'

const checkFileType = (rawFile: UploadFile, type: CheckType) => {
  const file = rawFile.raw
  if (file) {
    if (type === 'image') {
      const isJPG = file.type.includes('image')
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        ElMessage.error({
          message: '上传头像图片只能是图片格式!',
        })
      }
      if (!isLt2M) {
        ElMessage.error({
          message: '上传头像图片大小不能超过 5MB!',
        })
      }
      return isJPG && isLt2M
    } else if (type === 'excel') {
      if (!file.type.includes('vnd.ms-excel')) {
        ElMessage.error({
          message: '上传文件不是excel',
        })
      }
      return file.type.includes('vnd.ms-excel')
    } else if (type === 'pdf') {
      if (!file.type.includes('pdf')) {
        ElMessage.error({
          message: '上传文件不是pdf',
        })
      }
      return file.type.includes('pdf')
    }
  } else {
    return false
  }
}
import type { UploadProps, UploadUserFile } from 'element-plus'
import { URLType } from '../common'
export default function () {
  const data = reactive({
    fileList: [] as unknown as Ref<UploadUserFile[]>,
    jsonExcel: [] as Recordable[],
    base64URL: '',
    acceptType: '.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP',
  })

  const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log(file, uploadFiles)
  }

  const handlePreview: UploadProps['onPreview'] = uploadFile => {
    console.log('onPreview', uploadFile)
  }

  const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    console.log(`handleExceed`)
    ElMessage.warning(
      `The limit is 3, you selected ${
        files.length
      } files this time, add up to ${files.length + uploadFiles.length} totally`
    )
  }

  const beforeRemove: UploadProps['beforeRemove'] = (
    uploadFile,
    uploadFiles
  ) => {
    return ElMessageBox.confirm(
      `Cancel the transfert of ${uploadFile.name} ?`
    ).then(
      () => true,
      () => false
    )
  }

  const onChange = (
    rawFile: UploadFile,
    rawFiles?: UploadFiles,
    func?: () => void,
    bUrl: URLType = 'orginformation',
    type: CheckType = 'excel'
  ) => {
    console.log(`rawFile`, rawFile)
    if (checkFileType(rawFile, type)) {
      if (type === 'excel') {
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(rawFile.raw as Blob)
        fileReader.onload = async ev => {
          const blobData = ev?.target?.result
          const workbook = read(blobData, {
            type: 'binary',
          })
          const wsname = workbook.SheetNames[0] //取第一张表
          data.jsonExcel = utils
            .sheet_to_json(workbook.Sheets[wsname], {
              defval: '',
            })
            .slice(1) as Recordable[]
          await batchAddSystem(data.jsonExcel, bUrl)
          func && func()
        }
      } else {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(rawFile.raw as Blob)
        fileReader.onload = async (ev: any) => {
          data.base64URL = ev?.target?.result || ''
        }

        func && func()
      }
    }
  }

  return {
    ...toRefs(data),
    handleRemove,
    handlePreview,
    handleExceed,
    beforeRemove,
    onChange,
  }
}
