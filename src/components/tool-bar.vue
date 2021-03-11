<template>
  <div class="tool-bar">
    <div class="btns">
      <el-button size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd" :disabled="addDisabled" type="success">新增</el-button>
      <el-button size="mini" icon="el-icon-remove-outline" @click="handleDelete" :disabled="deleteDisabled" type="info">删除</el-button>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @next-click="nextPage"
        @prev-click="prevPage"
        :current-page="locationPageInfo.currentPage"
        :page-size="locationPageInfo.pageSize"
        layout=" total, prev, pager, next, jumper"
        :total="locationPageInfo.total"
      >
      </el-pagination>

      <addLocationDialog :dialogVisible="addLocationVisible" @close-handle="handleClose" @add-handle="AddLocationHandle" />
    </div>
  </div>
</template>

<script>
import addLocationDialog from './base/add-locatoin-dialog'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  components: { addLocationDialog },
  data() {
    return {
      addLocationVisible: false,
    }
  },
  computed: {
    ...mapState(['chosenItem', 'selectedLocation', 'locationPageInfo']),
    addDisabled: function () {
      if (this.chosenItem.isf === 0) {
        return false
      } else {
        return true
      }
    },
    deleteDisabled: function () {
      if (this.chosenItem.isf === 2 || this.selectedLocation.length === 0) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    ...mapMutations(['SET_LOCATION_PAGE']),
    ...mapActions(['addLocationService', 'queryLocationTableList', 'deleteLocationService']),
    handleSizeChange(val) {
      console.log(val)
    },
    handleCurrentChange(val) {
      this.nextPage(val)
      const pageInfo = this.locationPageInfo
      pageInfo.currentPage = val
      this.SET_LOCATION_PAGE(pageInfo)
    },
    async nextPage(currentPage) {
      const newPage = {
        currentPage,
        pageSize: this.locationPageInfo.pageSize,
      }
      const params = {
        kqid: this.chosenItem.id,
        ...newPage,
      }
      await this.queryLocationTableList(params)
      const pageInfo = this.locationPageInfo
      pageInfo.currentPage = currentPage
      this.SET_LOCATION_PAGE(pageInfo)
    },
    async prevPage(currentPage) {
      const newPage = {
        currentPage,
        pageSize: this.locationPageInfo.pageSize,
      }
      const params = {
        kqid: this.chosenItem.id,
        ...newPage,
      }
      await this.queryLocationTableList(params)
      const pageInfo = this.locationPageInfo
      pageInfo.currentPage = currentPage
      this.SET_LOCATION_PAGE(pageInfo)
    },
    handleAdd() {
      this.addLocationVisible = true
    },
    handleClose() {
      this.addLocationVisible = false
    },
    async AddLocationHandle(form) {
      const params = {
        kqid: this.chosenItem.id,
        kqname: this.chosenItem.name,
        ...form,
      }
      const res = await this.addLocationService(params)
      if (res.data === 1) {
        this.$message({ message: '插入成功', type: 'success' })
        const params = {
          kqid: this.chosenItem.id,
          ...this.locationPageInfo,
        }
        const res = await this.queryLocationTableList(params)
        const pageInfo = this.locationPageInfo
        pageInfo.currentPage = res.pageNum
        pageInfo.pageSize = res.pageSize
        pageInfo.total = res.total
        this.SET_LOCATION_PAGE(pageInfo)
      } else if (res.data === 0) {
        this.$message('库位编码重复，请重新输入！')
      }
    },
    async handleDelete() {
      let deleteId = []
      for (let i = 0; i < this.selectedLocation.length; i++) {
        deleteId.push(this.selectedLocation[i].id)
      }
      const res = await this.deleteLocationService(deleteId)
      if (res.data === 1) {
        this.$message({ message: '删除成功', type: 'success' })
        const params = {
          kqid: this.chosenItem.id,
          ...this.locationPageInfo,
        }
        const res = await this.queryLocationTableList(params)
        const pageInfo = this.locationPageInfo
        pageInfo.currentPage = res.pageNum
        pageInfo.pageSize = res.pageSize
        pageInfo.total = res.total
        this.SET_LOCATION_PAGE(pageInfo)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tool-bar {
  display: flex;
  justify-content: space-between;
}
</style>
