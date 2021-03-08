<template lang="pug">
    div.search-form
        el-form(:inline="true" :model="form" label-suffix=":")
            el-form-item(label="库位编码" size="mini")
                el-input(v-model="form.code")
            el-form-item(label="使用方式" size="mini" )
                el-select(v-model="form.usage" clearable)
                    el-option(v-for="(item, index) in useMethods" :key="index" :value="item")
            el-form-item(label="商品" size="mini")
                el-input(v-model="form.goods" clearable :disabled="true")
                    i(class="el-icon-more" slot="suffix" @click="clickHandle")
            el-button(size="mini" type="primary" @click="searchHandle") 查询

        <goodsDialog :dialogVisible="goodsDialogVisible" @close-handle="handleClose" @add-handle="handleAdd" :selected="selected"/>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { unique } from '@/utils/methods'
import goodsDialog from './base/goods-dialog'
export default {
  components: { goodsDialog },
  data() {
    return {
      form: {},
      selected: [],
      useMethods: ['拣选库位', '存储库位', '异常库位'],
      goodsDialogVisible: false,
    }
  },
  computed: {
    ...mapState(['chosenItem']),
  },
  methods: {
    ...mapActions(['searchLocationService']),
    async searchHandle() {
      this.form.goods = this.form.goods.split(',')
      const params = {
        kqid: this.chosenItem.id,
        ...this.form,
      }
      const res = await this.searchLocationService(params)
      this.$store.commit('SET_LOCATION_TABLE', res.data)
    },
    clickHandle() {
      this.goodsDialogVisible = true
    },
    handleClose() {
      this.goodsDialogVisible = false
    },
    handleAdd(selectedGoods) {
      for (let i = 0; i < selectedGoods.length; i++) {
        this.selected.push(selectedGoods[i].code)
      }
      this.selected = unique(this.selected)
      this.form.goods = this.selected.join(',')
    },
  },
}
</script>

<style lang="scss" scoped></style>
