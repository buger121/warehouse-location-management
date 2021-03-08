<template>
  <div class="tool-bar">
    <div class="btns">
      <el-button size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
      <el-button size="mini" icon="el-icon-remove-outline" @click="handleDelete">删除</el-button>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-size="100"
        layout=" total, prev, pager, next, jumper"
        :total="13"
      >
      </el-pagination>

      <addLocationDialog :dialogVisible="addLocationVisible" @close-handle="handleClose" @add-handle="AddLocationHandle"/>
    </div>
  </div>
</template>

<script>
import addLocationDialog from './base/add-locatoin-dialog'
import {mapActions, mapState} from 'vuex'
export default {
  components: { addLocationDialog },
  data() {
    return {
        addLocationVisible: false
    };
    
  },
  computed: {
      ...mapState(['chosenItem', 'selectedLocation'])
  },
  methods: {
    ...mapActions(['addLocationService', 'queryLocationTableList', 'deleteLocationService']),
    handleSizeChange(val) {
      console.log(val);
    },
    handleCurrentChange(val) {
      console.log(val);
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
            ...form
        }
        const res = await this.addLocationService(params)
        if(res.data === 1) {
            this.$message({message: '插入成功', type: 'success'})
            await this.queryLocationTableList(this.chosenItem.id)
        }
    },
    async handleDelete() {
        let deleteId = []
        for( let i=0; i<this.selectedLocation.length; i++) {
            deleteId.push(this.selectedLocation[i].id)
        }
        const res = await this.deleteLocationService(deleteId)
        console.log(res)
        if(res.data === 1) {
            this.$message({message: '删除成功', type: 'success'})
            await this.queryLocationTableList(this.chosenItem.id)
        }
    }
  },
};
</script>

<style lang="scss" scoped>
.tool-bar {
  display: flex;
  justify-content: space-between;
}
</style>
