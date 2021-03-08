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
          <switchSelect :selectName="scope.row.usage" @update-usage="updateUsgaeHandle"></switchSelect>
        </template>
      </el-table-column>
      <el-table-column prop="goodsList" label="优先商品">
        <template slot-scope="scope">{{ getGoodsName(scope.$index) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import switchInput from './base/switch-input'
import switchSelect from './base/switch-select'
export default {
  components: { switchInput, switchSelect },
  data() {
    return {
      tableData: [],
      tableSelection: [],
      chosenLocation: {},
    }
  },
  computed: {
    ...mapState(['locationTable', 'selectedLocation', 'chosenItem']),
  },
  methods: {
    ...mapActions(['updateLocationService', 'queryLocationTableList']),
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
    },
    async updateCodeHandle(code) {
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
          message: '新增成功！',
        })
        const data = {
          kqid: this.chosenItem.id,
          currentPage: 1,
          pageSize: 10,
        }
        this.queryLocationTableList(data)
      }
    },
    updateUsgaeHandle(usage) {
      console.log(usage)
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
