<template>
  <div class="switch-select">
    <div class="select-box" @click="focusEvent" v-if="modeID === 0">
      <span>{{ selectName }}</span>
    </div>

    <div v-else-if="modeID === 1">
      <el-select size="mini" @blur="blurEvent" @change="selectChange" v-model="selectValue" ref="usage-select">
        <el-option v-for="item in selectList" :key="item" :value="item" :label="item" @click.native="clickHandle"> </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      modeID: 0,
      selectValue: '',
      selectList: ['拣选库位', '存储库位', '异常库位'],
    }
  },
  methods: {
    selectChange(value) {
      this.selectValue = value
      if (value !== this.selectName) {
        this.$emit('update-usage', this.selectValue)
      }
    },
    focusEvent() {
      this.modeID = 1
      this.selectValue = this.selectName
      this.$nextTick(() => {
        this.$refs['usage-select'].focus()
      })
    },
    blurEvent() {
      //   this.modeID = 0
    },
    clickHandle() {
      this.modeID = 0
      this.selectName = this.selectValue
    },
  },
}
</script>
