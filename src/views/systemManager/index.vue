<template>
  <div class="bg-white w-full h-full p-5 flex flex-col">
    <!-- <el-button @click="changeTT"></el-button> -->
    <SearchContainer :mode="mode" :height="height" @search="fetchTableList">
      <el-form :model="searchForm" label-width="100px" class="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="企业名称">
              <el-input
                v-model="searchForm.orgName"
                placeholder="请输入（选填）"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行业类别">
              <el-input
                v-model="searchForm.orgType"
                placeholder="请输入（选填）"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关键词">
              <el-input
                v-model="searchForm.keywords"
                placeholder="请输入（选填）"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </SearchContainer>
    <ButtonList class="mb-5">
      <template #left>
        <el-button
          type="primary"
          class="mr-2"
          :icon="Plus"
          @click="handleAddOrgDialog"
          :disalbed="formColumns.length === 0"
        >
          新增企业
        </el-button>
        <!-- <el-upload class="upload mr-2" :auto-upload="false" action
          :on-change="(e: UploadFile) => onChange(e, undefined, fetchTableList)" :show-file-list="false">
          <el-button type="info">批量导入</el-button>
        </el-upload>
        <el-button type="info" @click="downloadTemplate('electricitySystem')">导入模板下载</el-button> -->
      </template>
      <!-- <template #right>
        <el-button type="info" :icon="Download" @click="downloadExcel(total, columns)">下载</el-button>
      </template> -->
    </ButtonList>
    <el-table
      min
      :data="tableData"
      border
      class="flex-1"
      v-loading="loading"
      header-row-class-name="iemp-table-header"
    >
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
      <el-table-column label="序号" width="80" align="center">
        <template #default="scope">
          {{ onTableIndex(scope.$index) }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="col in columns"
        :key="col.name"
        :prop="col.name"
        :label="col.title"
      >
        <template #default="scope">
          {{ onDecodeDict(scope.row, col.name) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-button
              link
              size="default"
              type="primary"
              @click="handleEditOrgRecordDialog(scope.row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#FF7D00"
              title="确认删除此条记录？"
              @confirm="onDeleteRecord(scope.row)"
            >
              <template #reference>
                <el-button link size="default" type="primary">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :pages="current"
      :size="size"
      :current="current"
      @current-page="onCurrentPageChange"
      @page-sizes="onPageSizeChange"
    ></Pagination>
  </div>
  <el-dialog v-model="dialogVisiable" :title="dialogTitle" width="50%">
    <el-form
      class="flex flex-wrap p-10"
      :model="orgForm"
      ref="formRef"
      :rules="orgRules"
      label-width="160px"
      :inline="false"
    >
      <el-form-item
        class="w-1/2"
        :label="prop.title + '：'"
        :prop="prop.name"
        v-for="prop in formColumns"
        :key="prop.name"
      >
        <template v-if="prop.formItemType === 'select'">
          <el-select
            class="w-full"
            v-model="orgForm[prop.name]"
            value-key=""
            :placeholder="'请选择' + prop.title"
            clearable
            filterable
          >
            <el-option
              v-for="item in prop.selectOptions"
              :key="item.codeId"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <template v-if="prop.formItemType === 'input'">
          <el-input
            v-model="orgForm[prop.name]"
            :placeholder="'请输入' + prop.title"
          ></el-input>
        </template>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisiable = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit(formRef)">
          {{ dialogTitle.includes('编辑') ? '更新' : '创建' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 引入依赖
import { nextTick, watch } from 'vue'
import { Plus, Download } from '@element-plus/icons-vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { UploadFile } from 'element-plus'

// 引入组件
import SearchContainer from '@/components/SearchContainer.vue'
import ButtonList from '@/components/ButtonList.vue'
import Pagination from '@/components/Pagination.vue'

// 引入hooks
import useQueryTable from '@/hooks/web/useQueryTable'
import useSearchFormHeight from '@/hooks/web/useSearchFormHeight'
import useUpload from '@/hooks/web/useUpload'
import useForm from '@/hooks/web/useForm'
import useDialog from '@/hooks/web/useDialog'
import useDecodeDict from '@/hooks/web/useDecodeDict'

// 引入其它
import { getList, addSystem, updateSystem } from '@/api'
import type { ResultOrginfoStruct } from '@/libs/model'
import { downloadTemplate, downloadExcel } from '@/libs/utils'
import { submitForm } from '@/libs/formAndRules/form'
import { useGlobalStore } from '@/store'

// 接口获取页面字典
const useGlobal = useGlobalStore()
useGlobal.getDicts()

const { onDecodeDict } = useDecodeDict()

// 高度
const { mode, height } = useSearchFormHeight()

// 列表接口
const {
  loading,
  tableData,
  columns,
  total,
  size,
  current,
  fetchTableList,
  onEditRecord,
  onDeleteRecord,
  onCurrentPageChange,
  onPageSizeChange,
  onTableIndex,
} = useQueryTable<ResultOrginfoStruct>(getList, undefined, undefined, ['image'])

// searchForm表单结构
const { form: searchForm } = useForm(['orgName', 'orgType', 'keywords'])

// 弹框和表单
const {
  form: orgForm,
  rules: orgRules,
  formRef,
  formColumns,
  onResetForm,
  onEditForm,
} = useForm(columns, [
  {
    field: 'orgNo',
    beIn: true,
  },
])

const { dialogVisiable, dialogTitle } = useDialog()

const handleSubmit = submitForm(async (valid?: boolean) => {
  if (valid) {
    ;(dialogTitle.value.includes('编辑') &&
      (await updateSystem(orgForm.value))) ||
      (await addSystem(orgForm.value))

    dialogVisiable.value = false
    // 更新页面
    fetchTableList()
  }
})

// 重置表单
watch(dialogVisiable, newValue => {
  if (!newValue) {
    nextTick(() => {
      onResetForm(formRef.value)
    })
  }
})

const handleAddOrgDialog = () => {
  dialogTitle.value = '新建企业'
  dialogVisiable.value = true
}

const handleEditOrgRecordDialog = (row: ResultOrginfoStruct) => {
  dialogTitle.value = '编辑企业'
  onEditRecord(row) // 赋值给activeSelectRecord（也可以不执行这一步）
  dialogVisiable.value = true
  onEditForm(row, 'orgNo')
}

// 上传excel
const { onChange } = useUpload()

// const changeTT = () => {
//   window.eventCenterForAppNameVite?.dispatch({ index: ['app_system_manager', '/organizations/d1'] })
// }
</script>

<style scoped></style>
