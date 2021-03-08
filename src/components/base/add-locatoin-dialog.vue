<template>
  <div class="update-dialog">
    <el-dialog
      title="新建库位"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <el-form ref="form" v-model="form" label-suffix=":" size="mini" :inline="true">
        <el-form-item label="库位编码">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="使用方式">
            <el-select v-model="form.usage">
                <el-option v-for="(item, index) in useMethods" :key="index" :value="item"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: { dialogVisible: Boolean},
  data() {
    return {
      form: {},
      useMethods: ['拣选库位', '存储库位', '异常库位'],
    };
  },
  methods: {
    handleClose() {
      this.$emit('close-handle');
    },
    handleSave() {
        this.$emit('add-handle', this.form);
        this.$emit('close-handle');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
