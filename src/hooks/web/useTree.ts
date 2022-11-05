import { ElTree } from 'element-plus'
import { reactive, UnwrapRef, toRefs, onMounted, ref, Ref, isRef } from 'vue'
import { Result, ResultColumnsData } from '@/libs/model'
import { QueryTreeParams, NodeAreaTreeStruct } from '../common'

/**
 *
 * @param requestPromiseFunc
 * @param aUrl
 * @param data
 * @param lazy 是否在onMounted中执行，false表示在onMounted中执行，true则不执行
 * @returns
 */
export default function <
  TreeStruct, // 树形结构（接口返回的字段）
  NodeStruct = NodeAreaTreeStruct, // 点击节点获取的结构
  Column = ResultColumnsData
>(
  requestPromiseFunc: (
    params: QueryTreeParams
  ) => Promise<Result<TreeStruct, Column[]>>,
  params: QueryTreeParams,
  lazy = false
) {
  const tdata = reactive({
    activeIndex: 0,
    loading: false,
    treeData: [] as TreeStruct,
    columns: [] as Column[], // columns数据
    activeSelectNode: {} as NodeStruct, // 当前点击的节点
  })
  const treeRef = ref<InstanceType<typeof ElTree>>()

  const fetchTreeList = async () => {
    tdata.loading = true
    const { result, columns } = await requestPromiseFunc(params)
    tdata.treeData = result as UnwrapRef<TreeStruct>
    columns && (tdata.columns = columns as unknown as UnwrapRef<Column[]>)
  }

  const handleNodeClick = (data: NodeStruct) => {
    tdata.activeSelectNode = data as UnwrapRef<NodeStruct>
  }

  // 采用回调的形式进行自定义处理
  const filterTreeNode = (
    value: string,
    data: NodeStruct,
    callback: (data: NodeStruct) => any
  ) => {
    if (!value) return true
    return callback(data)
  }

  const handleSearchTree = (e: Ref<string> | string) => {
    if (isRef(e)) {
      treeRef.value!.filter(e.value)
    } else {
      treeRef.value!.filter(e)
    }
  }

  if (!lazy) {
    onMounted(fetchTreeList)
  }

  return {
    ...toRefs(tdata),
    treeRef,
    handleNodeClick,
    filterTreeNode,
    handleSearchTree,
    fetchTreeList,
  }
}
