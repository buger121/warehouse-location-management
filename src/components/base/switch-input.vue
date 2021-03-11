<template>
  <div class="switchInnput" @click="focusEvent" v-if="modeID === 0">
    <span>{{ value }}</span>
  </div>
  <div v-else-if="modeID === 1">
    <el-input
      ref="number-input"
      size="mini"
      v-model="inputValue"
      :disabled="disabled"
      @input="numberChange($event)"
      @blur="blurEvent"
      @keyup.enter.native="$event.target.blur"
    >
      <i slot="suffix" class="el-input__icon el-icon-more" v-if="switchType === '2'" @click="clickHandle"></i>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    switchType: {
      type: String,
    },
  },
  computed: {
    disabled: function () {
      if (this.switchType === '2') {
        return true
      } else {
        return false
      }
    },
  },
  data() {
    return {
      //0正常情况，显示数值 1表示需要输入
      modeID: 0,
      inputValue: '',
    }
  },
  methods: {
    numberChange(val) {
      this.inputValue = val
    },
    focusEvent() {
      this.modeID = 1
      this.inputValue = this.value
      this.$nextTick(() => {
        this.$refs['number-input'].focus()
      })
    },
    blurEvent() {
      this.modeID = 0
      if (this.value !== this.inputValue) {
        this.$emit('update-code', this.inputValue)
      }
    },
    clickHandle() {
      this.$emit('set-goods')
    },
    changeMode() {
      if (this.modeID === 1) {
        this.modeID = 0
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-input.is-disabled .el-input__icon {
  /* cursor: not-allowed; */
  cursor: default;
}
.switchInnput {
  height: auto;
  min-height: 23px;
}
</style>
