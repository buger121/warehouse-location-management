<template>
  <div class="update-dialog">
    <el-dialog
      title="商品信息"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
      @open="openHandle"
      @opened="openedHandle"
    >
      <div class="head">
        <el-form ref="form" v-model="searchForm" label-suffix=":" size="mini" :inline="true">
          <el-form-item label="商品">
            <el-input v-model="searchForm.name" placeholder="名称支持多关键字"></el-input>
          </el-form-item>
          <el-form-item label="编码">
            <el-input v-model="searchForm.code" placeholder="编码或规格值"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleSearch" size="mini">查询</el-button>
        </el-form>
      </div>

      <el-table
        class="goods-table"
        ref="multipleTable"
        :data="goodsTable"
        tooltip-effect="dark"
        style="width: 100%"
        header-row-class-name="table-head"
        @selection-change="handleSelectionChange"
        :stripe="true"
      >
        <el-table-column type="selection" width="55">
          <template slot="header"><i class="el-icon-check"></i></template>
        </el-table-column>
        <el-table-column prop="img" label="图" width="120">
          <template slot-scope="scope">{{ scope.row.img }}</template>
        </el-table-column>
        <el-table-column prop="code" label="商品编码" width="120"> </el-table-column>
        <el-table-column prop="name" label="商品名称/规格">
          <template slot-scope="scope">{{ scope.row.name }}/{{ scope.row.spec }}</template>
        </el-table-column>
        <el-table-column prop="money" label="标准售价" width="120"> </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    tableData: Array,
    dialogVisible: Boolean,
    selected: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      searchForm: {},
      multipleSelectCopy: [],
      chosen: [],
      //   goodsTable: [],
    }
  },
  computed: {
    goodsTable: function () {
      return this.tableData || []
    },
  },
  methods: {
    ...mapActions(['queryGoodsService', 'searchGoodsService']),
    handleClose() {
      this.chosen = []
      this.goodsTable = []
      this.$emit('close-handle')
    },
    handleSave() {
      this.chosen = []
      this.$emit('add-handle', this.multipleSelectCopy)
      this.$emit('close-handle')
    },
    async openHandle() {
      //   this.goodsTable = this.tableData
      //如果已有选中商品，进行默认选中修改
      //   let that = this
      //   for (let i = 0; i < that.selected.length; i++) {
      //     that.chosen.push(that.selected[i].code)
      //   }
      //   that.$nextTick(() => {
      //     if (that.chosen.length > 0) {
      //       that.tableData.forEach((row) => {
      //         if (that.chosen.includes(row.code)) {
      //           that.$refs.multipleTable.toggleRowSelection(row, true)
      //         }
      //       })
      //     }
      //   })
    },
    async openedHandle() {
      let that = this
      for (let i = 0; i < that.selected.length; i++) {
        that.chosen.push(that.selected[i].code)
      }
      that.$nextTick(() => {
        if (that.chosen.length > 0) {
          that.tableData.forEach((row) => {
            if (that.chosen.includes(row.code)) {
              that.$refs.multipleTable.toggleRowSelection(row, true)
            }
          })
        }
      })
    },
    async handleSearch() {
      const params = {
        ...this.searchForm,
        currentPage: 1,
        pageSize: 10,
      }
      const res = await this.searchGoodsService(params)
      this.goodsTable = res.data
    },
    handleSelectionChange(val) {
      this.multipleSelectCopy = val
    },
    handleSizeChange() {},
    handleCurrentChange() {},
  },
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: space-between;
}
</style>
