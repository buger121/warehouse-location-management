<template lang="pug">
    div
        div.location-aside
            div.btns
                el-button(icon="el-icon-plus" size="mini" @click="handleEdit(1)" :disabled="addDisabled" type="success")
                el-button(icon="el-icon-edit" size="mini" @click="handleEdit(2)"
                :disabled="editDisabled" type="danger")
                el-button(icon="el-icon-minus" size="mini" @click="handleDelete"
                :disabled="deleteDisabled" type="info")
            div.tree
                el-tree(:data="this.locationTreeList" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true")
        updateDialog(:dialogVisible="updateDialogVisible" @close-handle="handleClose" :type="type" @add-handle="handleAdd" @edit-handle="handleUpdate")
</template>

<script>
import updateDialog from './base/update-dialog'
import { mapActions, mapState, mapMutations } from 'vuex'
import { isEmpty } from '@/utils/methods'
export default {
  components: { updateDialog },
  data() {
    return {
      defaultProps: {
        children: 'kqList',
        label: 'name',
        pageInfo: {},
      },
      updateDialogVisible: false,
      type: 0,
    }
  },
  async created() {
    this.queryLocationTreeList()
  },
  computed: {
    ...mapState(['locationTreeList', 'chosenItem', 'locationPageInfo']),
    addDisabled: function () {
      if (this.chosenItem.isf === 0) {
        return true
      } else {
        return false
      }
    },
    editDisabled: function () {
      if (this.chosenItem.isf === 2) {
        return true
      } else {
        return false
      }
    },
    deleteDisabled: function () {
      if (this.chosenItem.isf === 2) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_LOCATION_PAGE']),
    ...mapActions(['queryLocationTreeList', 'queryLocationTableList', 'addLocationTreeService', 'deleteLocationTreeService']),
    async handleNodeClick(item) {
      this.$store.commit('SET_CHOSEN_ITEM', item)

      //初始化pageInfo
      this.pageInfo = {
        total: 0,
        pageSize: 10,
        currentPage: 1,
      }
      this.SET_LOCATION_PAGE(this.pageInfo)
      //加载表单数据
      const params = {
        kqid: this.chosenItem.id,
        ...this.pageInfo,
      }
      const res = await this.queryLocationTableList(params)
      this.pageInfo.total = res.total
      this.pageInfo.currentPage = res.pageNum
      this.SET_LOCATION_PAGE(this.pageInfo)
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
      if (res.data > 0) {
        this.$message({ message: '更新成功！', type: 'success' })
      } else if (res.data === 0) {
        this.$message('区域名重复，请重新输入!')
      }
      this.queryLocationTreeList()
      const data = {
        kqid: this.chosenItem.id,
        ...this.locationPageInfo,
      }
      const rest = this.queryLocationTableList(data)
      this.SET_LOCATION_PAGE({
        currentPage: rest.pageNum,
        pageSize: rest.pageSize,
        total: rest.total,
      })
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
            if (res.data > 0) {
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
        if (res.data > 0) {
          this.$message({ message: '新增成功！', type: 'success' })
        } else if (res.data === 0) {
          this.$message('区域名称重复，请重新输入！')
        }
      } else {
        //新增库区
        const params = {
          fatherid: this.chosenItem.id,
          isf: 0,
          ...addData,
        }
        const res = await this.addLocationTreeService(params)
        console.log(res)
        if (res.data === 1) {
          this.$message({ message: '新增成功！', type: 'success' })
        } else if (res.data === 0) {
          this.$message('库区名称重复，请重新输入')
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
