import { reactive, toRefs, UnwrapRef, onMounted } from 'vue'
import type { Result, ResultColumnsData, ResultData } from '@/libs/model'
import { RequestOptions } from 'ivy2'
import { deleteSystem } from '@/api'
import { ElMessage } from 'element-plus'
import { URLType } from '../common'

interface Table$Scope {
  $index: number
  cellIndex: number
  column: Record<string, any>
  expanded: boolean
  row: Record<string, any>
  [x: string]: any
}

interface TableQueryParams {
  data?: {
    codeSortId?: number
    codeType?: string
    dispSn?: number
    name?: string
    validFlag?: string
  }
  page?: {
    current?: number
    size?: number
  }
}

/**
 * 获取tableData数据以及与此相关的数据
 * @param requestPromiseFunc 请求接口
 * @param baseUrl 请求接口中的baseUrl
 * @param h_data  请求接口中需要的参数
 * @param ignores  tableData中需要隐藏的字段（不显示在页面中）
 * @param lazy  是否是懒请求，false 表示 在onMounted中会请求，否则不会
 * @returns
 */
export default function <
  Struct, // 数组table的对象类型
  QueryParams = TableQueryParams
  // Column = ResultColumnsData // 接口返回的columns的数组对象类型
>(
  requestPromiseFunc: (
    data: QueryParams,
    baseUrl?: URLType,
    opt?: RequestOptions
  ) => Promise<Result<ResultData<Struct>, ResultColumnsData[]>>,
  baseUrl?: URLType,
  h_data: QueryParams = {} as QueryParams,
  ignores: string[] = [],
  lazy = false
) {
  const tdata = reactive({
    loading: false, // 是否loading
    tableData: [] as Struct[], // 列表数据
    columns: [] as ResultColumnsData[], // columns数据
    total: 0, // 总数
    size: 10, // pageSize
    current: 1, // currentPage
    keywords: '', // 关键词,
    activeSelectRecord: {} as Struct, // 编辑时当前选中的record
  })

  const fetchTableList = async (f_data: QueryParams = {} as QueryParams) => {
    tdata.loading = true
    try {
      const { result, columns } = await requestPromiseFunc(
        {
          page: {
            current: tdata.current,
            size: tdata.size,
          }, // 默认分页
          ...h_data, // 调用hooks时候传递的参数 (h是hooks的简写)
          ...f_data, // 调用fetchTableList时传递的参数  (f是fetchTableList的简写)
        },
        baseUrl
      )

      tdata.tableData = result.records as unknown as UnwrapRef<Struct[]>
      columns &&
        (tdata.columns = columns.filter(
          column => ignores.indexOf(column.name) === -1
        ))
      tdata.loading = false
      tdata.total = result.total
      tdata.size = result.size
      tdata.current = result.current
    } catch (err) {
      tdata.loading = false
    }
  }

  // 更改当前页
  const onCurrentPageChange = (current: number) => {
    tdata.current = current
  }

  // 更改pageSize
  const onPageSizeChange = (size: number) => {
    tdata.size = size
  }

  // 编辑行记录时
  const onEditRecord = (row: Struct) => {
    tdata.activeSelectRecord = row as UnwrapRef<Struct>
  }

  // 删除行记录
  const onDeleteRecord = async (
    data: Struct,
    callback?: () => void,
    message = '删除记录成功'
  ) => {
    await deleteSystem(data, baseUrl)
    ElMessage.success({
      message,
    })
    // 更新接口
    if (callback) {
      callback()
    } else {
      fetchTableList()
    }
  }

  const onTableIndex = (index: number) => {
    // table的第一条数据的index是从0开始的，所以index要加上1
    return index + 1 + (tdata.current - 1) * tdata.size
  }

  if (!lazy) {
    onMounted(fetchTableList)
  }

  return {
    ...toRefs(tdata),
    fetchTableList, // 调用接口
    onEditRecord, // 当编辑行数据的时候
    onDeleteRecord, // 当删除行数据的时候
    onCurrentPageChange, // 当改变当前页的时候
    onPageSizeChange, // 当改变size的时候
    onTableIndex,
  }
}
