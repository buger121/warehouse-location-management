<template>
  <div class="switch-select">
    <div class="select-box" @click="focusEvent" v-if="modeID === 0">
      <span>{{ selectName }}</span>
    </div>

    <div v-else-if="modeID === 1">
      <el-select size="mini" @blur="blurEvent" @change="selectChange" v-model="selectValue">
        <el-option v-for="(item, index) in selectList" :key="index" :value="item" :label="item"> </el-option>
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
  watch: {
    modeId(val) {
      if (val) {
        this.selectValue = this.value
      }
    },
  },
  methods: {
    selectChange(value) {
      console.log(value)
      this.selectValue = value
      this.blurEvent()
    },
    focusEvent() {
      this.modeID = 1
    },
    blurEvent() {
      this.modeID = 0
      //   console.log(this.selectValue)
    },
  },
}
</script>
