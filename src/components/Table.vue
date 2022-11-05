<template>
  <!-- <el-table min :data="tableData" border class="flex-1" v-loading="loading">
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
      <el-table-column show-overflow-tooltip v-for="col in columns" :key="col.name" :prop="col.name" :label="col.title">
        <template #default="scope">
          {{ decodeDict(scope.row, col.name) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-button link size="default" type="primary" @click="handleEditRecord(scope)">编辑</el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled" icon-color="#FF7D00"
              title="确认删除此条记录？" @confirm="onDeleteRecord(scope)">
              <template #reference>
                <el-button link size="default" type="primary">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table> -->
</template>

<style scoped>

</style>