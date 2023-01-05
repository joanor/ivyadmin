/**
 * 带分页的table
 */

import { reactive, toRefs, UnwrapRef, onMounted, watch, Ref } from 'vue'
import { RequestOptions } from 'ivy2'
import { ElMessage } from 'element-plus'
import type { Result, ResultColumnsData, ResultPaging } from '@/api/model'
import { URLType } from '../common'
import { textSize } from '@/libs/utils'
import { useGlobalStore } from '@/store'

// 拿到字典，去设置列的selectOption字段
const useGlobal = useGlobalStore()

interface HookOption<T, U> {
  hookQueryParams?: U // 调用hooks时传递的参数
  expectOrderColumnNames?: string[] // 期待的列的排序
  expectPickedColumnNames?: string[] // 期待存在的列
  expectOmitedColumnNames?: string[] // 期待忽略的列
  customColumn?: { name: keyof T; width?: string; fixed?: boolean }[] // 期待的列的宽度
  lazy?: boolean // 是否懒加载，true表示是懒加载，不会在onMounted中执行，否则会在onMounted中执行
  opt?: RequestOptions
  baseWidth?: number // 基础的列宽
}

/**
 * 获取tableData数据以及与此相关的数据
 * @param requestPromiseFunc 请求接口
 * @param baseUrl 请求接口中的baseUrl
 * @param option 配置
 */
export default function <
  Struct, // 数组table的对象类型
  QueryParams extends Recordable = Recordable
>(
  requestPromiseFunc: (
    data: QueryParams,
    opt?: RequestOptions
  ) => Promise<Result<ResultPaging<Struct>>>,
  option: HookOption<Struct, QueryParams> = {}
) {
  const initialHookOption = {
    hookQueryParams: {} as QueryParams,
    expectOrderColumnNames: [] as string[], // 期待的列的排序
    expectPickedColumnNames: [] as string[], // 期待存在的列
    expectOmitedColumnNames: [] as string[], // 期待忽略的列
    customColumn: [] as Required<
      HookOption<Struct, QueryParams>
    >['customColumn'], // 期待的列的宽度
    lazy: false, // 是否懒加载，true表示是懒加载，不会在onMounted中执行，否则会在onMounted中执行
    opt: {} as RequestOptions,
    baseWidth: 50,
    ...option,
  }

  const {
    hookQueryParams,
    expectOrderColumnNames,
    expectPickedColumnNames,
    expectOmitedColumnNames,
    customColumn,
    lazy,
    opt,
    baseWidth,
  } = initialHookOption
  /**
   * 带分页
   */

  const tdata = reactive({
    loading: false, // 是否loading
    tableData: [] as Struct[], // 列表数据
    columns: [] as ResultColumnsData[], // 接口返回中的columns数据，原始的未经过过滤的列
    tableColumns: [] as ResultColumnsData[], // 也是columns数据，只是有的时候页面中的table的某些列不需要显示，这里通过tableColumns来保存处理后显示的列
    total: 0, // 总数
    size: 10, // pageSize
    current: 1, // currentPage
    keywords: '', // 关键词
    currentSelectedRecord: {} as Struct, // 当前选中的record
  })

  const fetchTableList = async (
    data = {} as QueryParams,
    hookQuery = {} as HookOption<Struct, QueryParams>,
    queryOpt?: RequestOptions
  ) => {
    tdata.loading = true
    try {
      const { result, columns } = await requestPromiseFunc(
        {
          page: {
            current: tdata.current,
            size: tdata.size,
          },
          ...hookQueryParams, // 调用hooks时候传递的参数
          ...data, // 调用fetchTableList时传递的参数（可以覆盖上面调用hooks时候传递的参数）
          ...hookQuery,
        },
        {
          ...opt, // 调用hooks时候传递的RequestOptions
          ...queryOpt, // 调用fetchTableList时传递的RequestOptions
        }
      )

      tdata.tableData = result.records as unknown as UnwrapRef<Struct[]>
      tdata.currentSelectedRecord = tdata
        .tableData[0] as unknown as UnwrapRef<Struct>

      if (columns) {
        // 设置字典字段的选项
        columns.forEach(v => {
          const r = v.notes?.match(/[A-Z](_*[A-Z]*)+[A-Z]/g)
          if (r) {
            v.dictName = r[r.length - 1]
            v.selectOption = useGlobal.dicts[r[r.length - 1]]
            if (v.selectOption) {
              v.trigger = 'change'
              v.component = 'select'
              v.message = `请选择${v.title}`
            }
          } else {
            v.dictName = v.name.toUpperCase()
          }
        })

        /**
         * 以下从第1步到第4步，生成的是页面中展示的table字段
         */

        // 1、过滤不需要出现在页面中的table字段
        const columns2 = columns.filter(v => !v.hidden)

        // 2、初始的列的名称组成的数组
        const column2Names = columns2.map(v => v.name)

        // 3、设置默认的列宽度（50为初始的列宽度偏移量）和默认的是否固定列
        columns2.forEach(v => {
          v.width = textSize(v.title).width + baseWidth + ''
          v.fixed = false
        })

        // 4、重新排序并过滤需要忽略的列
        const tmpOrderedColumnNames = Array.from(
          new Set([...expectOrderColumnNames, ...column2Names])
        )

        // let orderedColumnNames: string[] = []
        const orderedColumnNames =
          expectPickedColumnNames.length > 0
            ? tmpOrderedColumnNames.filter(
                columnName => expectPickedColumnNames.indexOf(columnName) > -1
              )
            : tmpOrderedColumnNames.filter(
                columnName => expectOmitedColumnNames.indexOf(columnName) === -1
              )

        // 生成排序并过滤过的列的对象数组
        const orderedColumns = orderedColumnNames
          .map<ResultColumnsData | undefined>(columnName => {
            return columns2.find(column => column.name === columnName)
          })
          .filter(v => v) as ResultColumnsData[]

        // 设置自定义的列的宽度和是否固定列
        orderedColumns.forEach(v => {
          const tmpColumn = customColumn.find(column => column.name === v.name)
          if (tmpColumn) {
            v.width = tmpColumn.width
            v.fixed = tmpColumn.fixed
          }
        })

        tdata.columns = columns
        tdata.tableColumns = orderedColumns
      }
      tdata.total = result.total
      tdata.size = result.size
      tdata.current = result.current
    } catch (err) {
      console.error(err)
    } finally {
      tdata.loading = false
    }
  }

  /**
   * 更改当前页
   * @param current
   */
  const onCurrentPageChange = (current: number) => {
    tdata.current = current
  }

  // 更改pageSize
  const onPageSizeChange = (size: number) => {
    tdata.size = size
  }

  // 编辑行记录时
  const onCurrentSelectRecord = (row: Struct) => {
    tdata.currentSelectedRecord = row as UnwrapRef<Struct>
  }

  /**
   * 生成分页列表的序号
   * table的第一条数据的index是从0开始的，所以index要加上1
   * @param index
   */
  const onTableIndex = (index: number) =>
    index + 1 + (tdata.current - 1) * tdata.size

  // 当不是懒加载的时候
  if (!lazy) {
    onMounted(fetchTableList)
  }

  return {
    ...toRefs(tdata),
    fetchTableList, // 调用接口
    onCurrentSelectRecord, // 当编辑行数据的时候
    onCurrentPageChange, // 当改变当前页的时候
    onPageSizeChange, // 当改变size的时候
    onTableIndex,
  }
}
