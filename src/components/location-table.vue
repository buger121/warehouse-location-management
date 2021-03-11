<template>
  <div>
    <el-table
      class="locaton-table"
      ref="multipleTable"
      :data="this.locationTable"
      tooltip-effect="dark"
      style="width: 100%"
      header-row-class-name="table-head"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      :stripe="true"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index" width="40">
        <template slot="header"><i class="el-icon-more"></i></template>
      </el-table-column>
      <el-table-column type="selection" width="55">
        <template slot="header"><i class="el-icon-check"></i></template>
      </el-table-column>
      <el-table-column prop="kqname" label="库区名称" width="120">
        <template slot-scope="scope">{{ scope.row.kqname }}</template>
      </el-table-column>
      <!-- <el-table-column prop="code" label="库位编码" width="120"> </el-table-column> -->
      <el-table-column prop="code" label="库位编码" width="200">
        <template slot-scope="scope">
          <switchInput :value="scope.row.code" @update-code="updateCodeHandle"></switchInput>
        </template>
      </el-table-column>
      <el-table-column prop="usage" label="使用方式" show-overflow-tooltip width="250">
        <template slot-scope="scope">
          <switchSelect :selectName="scope.row.usage" @update-usage="updateUsgaeHandle" switchType="1"></switchSelect>
        </template>
      </el-table-column>
      <el-table-column prop="goodsList" label="优先商品">
        <!-- <template slot-scope="scope">{{ getGoodsName(scope.$index) }}</template> -->
        <template slot-scope="scope">
          <switchInput
            ref="child"
            :value="getGoodsName(scope.$index)"
            @updateGoods="updateGoodsHandle"
            switchType="2"
            @set-goods="setGoods(scope.row)"
          ></switchInput>
        </template>
      </el-table-column>
    </el-table>

    <setGoodsDialog
      :dialogVisible="setGoodsVisible"
      @close-handle="handleSetGoodsClose"
      :tableData="this.chosenLocation.goodsList"
      :chooseTableRow="chooseTableRow"
      :rowIndex="rowIndex"
    ></setGoodsDialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import switchInput from './base/switch-input'
import switchSelect from './base/switch-select'
import setGoodsDialog from './base/set-goods-dialog'
export default {
  components: { switchInput, switchSelect, setGoodsDialog },
  data() {
    return {
      tableData: [],
      tableSelection: [],
      chosenLocation: {},
      setGoodsVisible: false,
      chooseTableRow: {},
      rowIndex: 0,
    }
  },
  updated() {
    if (this.$refs.child) {
      this.$refs.child.changeMode()
    }
  },
  computed: {
    ...mapState(['locationTable', 'selectedLocation', 'chosenItem', 'locationPageInfo']),
  },
  methods: {
    ...mapMutations(['SET_LOCATION_PAGE']),
    ...mapActions(['updateLocationService', 'queryLocationTableList']),
    tableRowClassName({ row, rowIndex }) {
      //设置索引
      row.index = rowIndex
    },
    handleSelectionChange(val) {
      this.$store.commit('SET_SELECTED_LOCATION', val)
    },
    getGoodsName(index) {
      let names = [],
        data = this.locationTable[index].goodsList
      for (let i = 0; i < data.length; i++) {
        names.push(data[i].name)
      }
      return names.join(',')
    },
    rowClick(row) {
      this.chosenLocation = row
      this.rowIndex = row.index
    },
    async updateCodeHandle(code) {
      if (/[^\w./]/gi.test(code)) {
        this.$message('编码不能为中文或符号')
      }
      if (code.length > 4 && code.length < 64) {
        //输入编码长度不能为0
        const params = {
          id: this.chosenLocation.id,
          code: code,
          kqname: this.chosenLocation.kqname,
          usage: this.chosenLocation.usage,
        }
        const res = await this.updateLocationService(params)
        if (res.data === 1) {
          this.$message({
            type: 'success',
            message: '修改成功！',
          })
          const data = {
            kqid: this.chosenItem.id,
            currentPage: this.locationPageInfo.currentPage,
            pageSize: this.locationPageInfo.pageSize,
          }
          const rest = await this.queryLocationTableList(data)
          const newPage = {
            currentPage: rest.pageNum,
            total: rest.total,
            pageSize: rest.pageSize,
          }
          this.SET_LOCATION_PAGE(newPage)
        } else if (res.data === 0) {
          this.$message('编码重复，修改失败！')
        }
      } else if (code.length < 4 && code.length > 0) {
        this.$message('编码长度在4-64')
      } else if (code.length > 64) {
        this.$message('编码长度在4-64')
      } else if (code.length === 0) {
        this.$message('编码不能为空')
      }
    },
    updateGoodsHandle(goods) {
      console.log(goods)
    },
    async updateUsgaeHandle(usage) {
      const params = {
        id: this.chosenLocation.id,
        code: this.chosenItem.code,
        kqname: this.chosenLocation.kqname,
        usage: usage,
      }
      await this.updateLocationService(params)
      this.$message({
        type: 'success',
        message: '修改成功!',
      })
    },
    setGoods(row) {
      this.chooseTableRow = row
      this.setGoodsVisible = true
    },
    handleSetGoodsClose() {
      this.setGoodsVisible = false
      this.$refs.child.changeMode()
    },
  },
}
</script>

<style lang="scss" scoped>
.locaton-table {
  .el-icon-more {
    transform: rotate(90deg);
  }
  .el-table th,
  .el-table tr {
    background-color: #fff;
  }
}
</style>
