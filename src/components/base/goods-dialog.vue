<template>
  <div class="update-dialog">
    <el-dialog title="商品信息" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" :destroy-on-close="true" @open="openHandle">
      <div class="head">
        <el-form ref="form" v-model="searchForm" label-suffix=":" size="mini" :inline="true">
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="商品编码">
            <el-input v-model="searchForm.code"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleSearch" size="mini">查询</el-button>
        </el-form>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          current-page.sync="1"
          :page-size="10"
          layout="prev, pager, next"
          :total="20"
        >
        </el-pagination>
      </div>

      <el-table
        class="goods-table"
        ref="multipleTable"
        :data="this.goodsTable"
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
        <el-table-column prop="usage" label="条码" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="name" label="商品名称/规格">
          <template slot-scope="scope">{{ scope.row.name }}/{{ scope.row.spec }}</template>
        </el-table-column>
        <el-table-column prop="money" label="标准售价" width="120"> </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button @click="handleSave">确定并继续</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
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
      goodsTable: [],
      multipleSelectCopy: [],
    }
  },
  methods: {
    ...mapActions(['queryGoodsService', 'searchGoodsService']),
    handleClose() {
      this.$emit('close-handle')
    },
    handleSave() {
      this.$emit('add-handle', this.multipleSelectCopy)
      this.$emit('close-handle')
    },
    async openHandle() {
      const params = { currentPage: 1, pageSize: 10 }
      const data = await this.queryGoodsService(params)
      this.goodsTable = data
      //如果已有选中商品，进行默认选中修改
      //   if (this.selected.length > 0) {
      //     this.goodsTable.forEach((row) => {
      //       if (this.selected.includes(row.code)) {
      //         console.log(row)
      //         this.$refs.multipleTable.toggleRowSelection(row)
      //       }
      //     })
      //   }
      let that = this
      that.$nextTick(() => {
        if (that.selected.length > 0) {
          that.goodsTable.forEach((row) => {
            if (that.selected.includes(row.code)) {
              that.$refs.multipleTable.toggleRowSelection(row, true)
            }
          })
        }
      })
    },
    async handleSearch() {
      const res = await this.searchGoodsService(this.searchForm)
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
