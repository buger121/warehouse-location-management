<template lang="pug">
    div
        div.location-aside
            div.btns
                el-button(icon="el-icon-plus" size="mini" @click="handleEdit(1)")
                el-button(icon="el-icon-edit" size="mini" @click="handleEdit(2)")
                el-button(icon="el-icon-minus" size="mini" @click="handleDelete")
            div.tree
                el-tree(:data="this.locationTreeList" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true")
        updateDialog(:dialogVisible="updateDialogVisible" @close-handle="handleClose" :type="type" @add-handle="handleAdd" @edit-handle="handleUpdate")
</template>

<script>
import updateDialog from './base/update-dialog'
import { mapActions, mapState } from 'vuex'
import { isEmpty } from '@/utils/methods'
export default {
  components: { updateDialog },
  data() {
    return {
      defaultProps: {
        children: 'kqList',
        label: 'name',
      },
      updateDialogVisible: false,
      type: 0,
    }
  },
  async created() {
    this.queryLocationTreeList()
    // await this.$axios.get('/category/query')
  },
  computed: {
    ...mapState(['locationTreeList', 'chosenItem']),
  },
  methods: {
    ...mapActions(['queryLocationTreeList', 'queryLocationTableList', 'addLocationTreeService', 'deleteLocationTreeService']),
    async queryTree() {
      const { data = [] } = await this.$axios.get('/kq/listAll')
      const res = [{ name: '<<当前仓库>>', kqList: data, id: 0, isf: 1, type: 'head' }]
      this.treeData = res
    },
    async handleNodeClick(item) {
      this.$store.commit('SET_CHOSEN_ITEM', item)
      //加载表单数据
      const params = {
        kqid: this.chosenItem.id,
        currentPage: 1,
        pageSize: 10,
      }
      this.queryLocationTableList(params)
    },
    handleEdit(type) {
      if (isEmpty(this.chosenItem)) {
        // 当前未选择区域或库区
        this.$message('请先选择区域或库区')
      } else {
        this.updateDialogVisible = true
        this.type = type
      }
    },
    async handleUpdate(updateData) {
      //编辑
      const param = {
        name: updateData.name,
        code: updateData.code,
        id: this.chosenItem.id,
      }
      const res = await this.$axios.post('kq/update', param)
      if (res.data === 1) {
        this.$message({ message: '更新成功！', type: 'success' })
      }
      this.queryLocationTreeList()
      this.queryLocationTableList(this.chosenItem.id)
    },
    handleDelete() {
      if (isEmpty(this.chosenItem)) {
        // 当前未选择区域或库区
        this.$message('请先选择区域或库区')
      } else {
        this.$confirm('您真的要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const res = await this.deleteLocationTreeService(this.chosenItem.id)
            if (res.data === 1) {
              this.$message({ message: '删除成功！', type: 'success' })
            }
            this.queryLocationTreeList()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      }
    },
    async handleAdd(addData) {
      if (this.chosenItem.id === 0) {
        //新增区域
        const params = {
          fatherid: this.chosenItem.id,
          isf: 1,
          ...addData,
        }
        const res = await this.addLocationTreeService(params)
        if (res.data === 1) {
          this.$message({ message: '新增成功！', type: 'success' })
        }
      } else {
        const params = {
          fatherid: this.chosenItem.id,
          isf: 0,
          ...addData,
        }
        const res = await this.addLocationTreeService(params)
        if (res.data === 1) {
          this.$message({ message: '新增成功！', type: 'success' })
        }
      }
      this.queryLocationTreeList()
    },
    handleClose() {
      this.updateDialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.location-aside {
  width: 200px;

  .btns {
    margin-bottom: 20px;
  }
}
</style>
