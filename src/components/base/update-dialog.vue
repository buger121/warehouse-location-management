<template>
  <div class="update-dialog">
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" @open="openHandle" :destroy-on-close="true">
      <el-form ref="form" :model="form" label-suffix=":" size="mini" :rules="rules">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
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
import { mapState } from 'vuex'
export default {
  props: { dialogVisible: Boolean, type: Number },
  data() {
    const checkData = (rule, value, callback) => {
      if (value) {
        if (/[^\w./]/gi.test(value)) {
          callback(new Error('编码不能为中文或符号！'))
        } else {
          callback()
        }
      }
    }
    const validateDuplicate = (rule, value, callback) => {
      if (this.form.name === this.form.code) {
        callback(new Error('编码与名称不能重复'))
      } else {
        callback()
      }
    }
    return {
      form: {
        code: '',
        name: '',
      },
      title: '',
      rules: {
        name: [
          { required: true, message: '请输入区域名称', trigger: 'blur' },
          { min: 4, max: 64, message: '长度在 4 到 64 个字符', trigger: 'blur' },
          { validator: checkData, trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入区域编码', trigger: 'blur' },
          { min: 4, max: 64, message: '长度在 4 到 64 个字符', trigger: 'blur' },
          { validator: validateDuplicate, trigger: 'blur' },
          { validator: checkData, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapState(['chosenItem']),
  },
  methods: {
    openHandle() {
      this.form = {}
      switch (this.type) {
        case 1:
          if (this.chosenItem.isf === 2) {
            this.title = '新增区域'
          } else if (this.chosenItem.isf === 1) {
            this.title = '新增库区'
          }
          break
        case 2:
          if (this.chosenItem.isf === 1) {
            this.title = '编辑区域'
          } else if (this.chosenItem.isf === 0) {
            this.title = '编辑库区'
          }
          this.$set(this.form, 'code', this.chosenItem.code)
          this.$set(this.form, 'name', this.chosenItem.name)
          break
      }
    },
    handleClose() {
      this.$emit('close-handle')
    },
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          switch (this.type) {
            case 1:
              //新增
              this.$emit('add-handle', this.form)
              break
            case 2:
              //编辑
              this.$emit('edit-handle', this.form)
              break
          }
          this.$emit('close-handle')
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-direction: column;
  align-items: center;

  .el-form-item {
    display: flex;
  }
}
/deep/ .el-dialog__footer {
  text-align: center;
}
</style>
