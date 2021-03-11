<template lang="pug">
    div.search-form
        el-form(:inline="true" :model="form" label-suffix=":" ref="form" :rules="rules")
            el-form-item(label="库位编码" size="mini" prop="code")
                el-input(v-model="form.code")
            el-form-item(label="使用方式" size="mini" )
                el-select(v-model="form.usage" clearable)
                    el-option(v-for="(item, index) in useMethods" :key="index" :value="item")
            el-form-item(label="商品" size="mini" class="goods-name")
                el-input(v-model="form.gids" clearable :disabled="true")
                    i(class="el-icon-more" slot="suffix" @click="clickHandle")
                span(class="delete-icon" @click="clearHandle") x
            el-button(size="mini" type="primary" @click="searchHandle") 查询

        <goodsDialog :dialogVisible="goodsDialogVisible" @close-handle="handleClose" @add-handle="handleAdd" :selected="selected"/>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { unique } from '@/utils/methods'
import goodsDialog from './base/goods-dialog'
export default {
  components: { goodsDialog },
  data() {
    const checkData = (rule, value, callback) => {
      if (value) {
        if (/[^\w./]/gi.test(value)) {
          callback(new Error('请不要输入中文和空格！'))
        } else {
          callback()
        }
      }
    }
    return {
      form: {},
      selected: [],
      useMethods: ['拣选库位', '存储库位', '异常库位'],
      goodsDialogVisible: false,
      gids: [],
      rules: {
        code: [{ validator: checkData, trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapState(['chosenItem']),
  },
  methods: {
    ...mapMutations(['SET_LOCATION_PAGE']),
    ...mapActions(['searchLocationService']),
    async searchHandle() {
      if (this.form.gids !== undefined) {
        this.gids = this.form.gids.split(',')
      }
      const params = {
        kqid: this.chosenItem.id,
        ...this.form,
        gids: this.gids,
        currentPage: 1,
        pageSize: 10,
      }
      const res = await this.searchLocationService(params)
      const newPage = {
        pageSize: res.pageSize,
        total: res.total,
        currentPage: res.pageNum,
      }
      this.$store.commit('SET_LOCATION_TABLE', res.list)
      this.SET_LOCATION_PAGE(newPage)

      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.form.gids !== undefined) {
            this.gids = this.form.gids.split(',')
          }
          const params = {
            kqid: this.chosenItem.id,
            ...this.form,
            gids: this.gids,
            currentPage: 1,
            pageSize: 10,
          }
          const res = await this.searchLocationService(params)
          this.$store.commit('SET_LOCATION_TABLE', res.list)
          const newPage = {
            currentPage: res.pageNum,
            pageSize: res.pageSize,
            total: res.total,
          }
          this.SET_LOCATION_PAGE(newPage)
        } else {
          return false
        }
      })
    },
    clickHandle() {
      this.goodsDialogVisible = true
    },
    handleClose() {
      this.goodsDialogVisible = false
    },
    handleAdd(selectedGoods) {
      this.selected = []
      for (let i = 0; i < selectedGoods.length; i++) {
        this.selected.push(selectedGoods[i].id)
      }
      this.selected = unique(this.selected)
      this.form.gids = this.selected.join(',')
    },
    clearHandle() {
      console.log(this.form.gids)
      //清空商品信息
      const se = []
      this.handleAdd(se)
    },
  },
}
</script>

<style lang="scss" scoped>
.delete-icon {
  position: absolute;
  left: calc(82%);
  opacity: 0.5;
  cursor: default;
}
</style>
