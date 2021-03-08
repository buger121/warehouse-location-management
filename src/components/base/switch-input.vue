<template>
  <div class="switchInnput" @click="focusEvent" v-if="modeID === 0">
    <span>{{ value }}</span>
  </div>
  <div v-else-if="modeID === 1">
    <el-input
      ref="numberInput"
      size="mini"
      v-model.number="inputValue"
      @input="numberChange($event)"
      @blur="blurEvent"
      @keyup.enter.native="$event.target.blur"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
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
    },
    blurEvent() {
      this.modeID = 0
      //   console.log(this.inputValue)
      this.$emit('update-code', this.inputValue)
    },
  },
}
</script>
