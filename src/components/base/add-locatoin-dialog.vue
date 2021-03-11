<template>
  <div class="update-dialog">
    <el-dialog title="新建库位" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" :destroy-on-close="true">
      <el-form ref="form" :model="form" label-suffix=":" size="mini" :inline="true" :rules="rules">
        <el-form-item label="库位编码" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="使用方式" prop="usage">
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
  props: { dialogVisible: Boolean },
  data() {
    return {
      form: {},
      useMethods: ['拣选库位', '存储库位', '异常库位'],
      rules: {
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 4, max: 64, message: '长度在 4 到 64 个字符', trigger: 'blur' },
        ],
        usage: [{ required: true, message: '请选择使用方式', trigger: 'blur' }],
      },
    }
  },
  methods: {
    handleClose() {
      this.form = {}
      this.$emit('close-handle')
    },
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('add-handle', this.form)
          this.$emit('close-handle')
          this.form = {}
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
