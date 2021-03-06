<template>
  <div class="update-dialog">
    <el-dialog title="商品信息" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" :destroy-on-close="true" @open="openHandle">
      <div class="head">
        <el-form ref="form" v-model="searchForm" label-suffix=":" size="mini" :inline="true">
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.name" placeholder="名称支持多关键字"></el-input>
          </el-form-item>
          <el-form-item label="商品编码">
            <el-input v-model="searchForm.code" placeholder="编码"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleSearch" size="mini">查询</el-button>
        </el-form>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          current-page.sync="1"
          :page-size="this.pageInfo.pageSize"
          layout="prev, pager, next"
          :total="this.pageInfo.total"
        >
        </el-pagination>
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
        <el-table-column prop="usage" label="条码" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="name" label="商品名称/规格">
          <template slot-scope="scope">{{ scope.row.name }}/{{ scope.row.spec }}</template>
        </el-table-column>
        <el-table-column prop="money" label="标准售价" width="120"> </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button @click="handleContinue">确定并继续</el-button>
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
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    }
  },
  methods: {
    ...mapActions(['queryGoodsService', 'searchGoodsService']),
    handleClose() {
      this.searchForm = {}
      this.$emit('close-handle')
    },
    handleSave() {
      this.searchForm = {}
      this.$emit('add-handle', this.multipleSelectCopy)
      this.$emit('close-handle')
    },
    handleContinue() {
      this.$emit('add-handle', this.multipleSelectCopy)
    },
    async openHandle() {
      const data = await this.queryGoodsService(this.pageInfo)
      this.goodsTable = data.list
      this.pageInfo.pageSize = data.pageSize
      this.pageInfo.currentPage = data.pageNum
      this.pageInfo.total = data.total
      //如果已有选中商品，进行默认选中修改
      let that = this
      that.$nextTick(() => {
        if (that.selected.length > 0) {
          that.goodsTable.forEach((row) => {
            if (that.selected.includes(row.id)) {
              that.$refs.multipleTable.toggleRowSelection(row, true)
            }
          })
        }
      })
    },
    async handleSearch() {
      const params = {
        ...this.searchForm,
        ...this.pageInfo,
      }
      const res = await this.searchGoodsService(params)
      this.goodsTable = res.list
      this.pageInfo.total = res.total
      this.pageInfo.currentPage = res.pageNum
      this.pageInfo.pageSize = res.pageSize
    },
    handleSelectionChange(val) {
      this.multipleSelectCopy = val
    },
    handleSizeChange() {},
    async handleCurrentChange(currentPage) {
      this.pageInfo.currentPage = currentPage
      const data = await this.queryGoodsService({ ...this.pageInfo, ...this.searchForm })
      this.goodsTable = data.list
      this.pageInfo.pageSize = data.pageSize
      this.pageInfo.currentPage = data.pageNum
      this.pageInfo.total = data.total
    },
  },
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: space-between;
}
</style>
