<template>
  <div class="set-goods-dialog">
    <el-dialog title="设置存放商品" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" @open="openHandle" :destroy-on-close="true">
      <div class="head">
        <el-form ref="form" class="search-form" v-model="searchForm" label-suffix=":" size="mini" :inline="true" @submit.native.prevent>
          <el-form-item label="快速选择商品">
            <el-radio v-model="radio" label="code">编码</el-radio>
            <el-radio v-model="radio" label="name">商品名称</el-radio>
          </el-form-item>
          <el-input placeholder="输入编码(精确到规格)后按回车" size="mini" v-model="searchInput" @keyup.enter.native="searchHandle">
            <i slot="suffix" class="el-icon-search" @click="searchHandle"></i>
          </el-input>
        </el-form>
      </div>

      <el-table
        class="goods-table"
        ref="multipleTable"
        :data="goodsTableData"
        tooltip-effect="dark"
        style="width: 100%"
        header-row-class-name="table-head"
        :stripe="true"
      >
        <el-table-column type="index" width="40">
          <template slot="header"><i class="el-icon-more"></i></template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope"><i class="el-icon-close" @click="deleteGoods(scope)"></i></template>
        </el-table-column>
        <el-table-column prop="img" label="图" width="120">
          <template slot-scope="scope">{{ scope.row.img }}</template>
        </el-table-column>
        <el-table-column prop="code" label="商品编码" width="120" align="center"> </el-table-column>

        <el-table-column prop="name" label="商品名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column prop="spec" label="规格" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.spec }}</template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave" size="mini">保存</el-button>
        <el-button @click="handleCancel" size="mini">取消</el-button>
      </span>
    </el-dialog>

    <chooseGoodsDialog
      :tableData="searchRes"
      :dialogVisible="chooseGoodsDialog"
      @close-handle="handleCloseSetGoods"
      @add-handle="addHandle"
      :selected="goodsTableData"
    ></chooseGoodsDialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import chooseGoodsDialog from './choose-goods-dialog'
export default {
  components: { chooseGoodsDialog },
  props: {
    tableData: Array,
    dialogVisible: Boolean,
    chooseTableRow: Object,
    rowIndex: Number,
  },
  data() {
    return {
      searchForm: {
        code: '',
        name: '',
      },
      radio: 'code',
      searchInput: '',
      chooseGoodsDialog: false,
      goodsTableCopy: [],
      destroyDialog: true,
      goodsTableData: [],
      searchRes: [],
    }
  },
  computed: {
    ...mapState(['chosenItem', 'locationTable']),
    currentGoodsList() {
      return this.chooseTableRow.goodsList || []
    },
  },
  methods: {
    ...mapActions(['searchGoodsService', 'queryLocationTableList', 'setGoodsService']),
    openHandle() {
      //   this.goodsTableCopy = this.locationTable[this.rowIndex].goodsList
      this.goodsTableData = this.currentGoodsList
    },
    async searchHandle() {
      this.chooseGoodsDialog = true
      if (this.radio === 'code') {
        this.searchForm.code = this.searchInput
        this.searchForm.name = ''
      } else {
        this.searchForm.name = this.searchInput
        this.searchForm.code = ''
      }
      const params = {
        ...this.searchForm,
        currentPage: 1,
        pageSize: 10,
      }
      const res = await this.searchGoodsService(params)
      this.searchRes = res.list
    },
    async handleSave() {
      let gids = []
      this.searchForm = ''
      for (let i = 0; i < this.goodsTableData.length; i++) {
        gids.push(this.goodsTableData[i].id)
      }
      const params = {
        gids,
        kwid: this.locationTable[this.rowIndex].id,
      }
      await this.setGoodsService(params)
      const data = {
        kqid: this.chosenItem.id,
        currentPage: 1,
        pageSize: 10,
      }
      this.queryLocationTableList(data)
      this.$emit('close-handle')
    },
    handleCancel() {
      this.$emit('close-handle')
    },
    handleClose() {
      this.searchInput = ''
      this.$emit('close-handle')
    },
    handleCloseSetGoods() {
      this.chooseGoodsDialog = false
    },
    addHandle(selected) {
      this.goodsTableData = selected
    },
    deleteGoods(row) {
      this.goodsTableData.splice(row.$index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-form {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;

  /deep/.el-input {
    width: 45%;
  }

  /deep/ .el-input__suffix {
    height: 28px;
    display: flex;
    align-items: center;
  }
}
.el-icon-more {
  transform: rotate(90deg);
}
.el-table th,
.el-table tr {
  background-color: #fff;
}
</style>
