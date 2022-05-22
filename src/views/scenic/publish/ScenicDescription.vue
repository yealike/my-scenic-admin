<template>
  <div class="app-container">
    <h3 class="my-publish-title">发布新景点</h3>
    <el-steps :active="1" :align-center="true" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="描述信息"></el-step>
      <el-step title="提示信息"></el-step>
      <el-step title="价格信息"></el-step>
    </el-steps>

    <!-- 表单组件 -->
    <div class="app-container">
      <el-form ref="form" :model="describe" label-width="80px">

        <el-form-item label="电话">
          <el-input v-model="describe.tel" autocomplete="off" placeholder="如： 0527-88888888"></el-input>
        </el-form-item>

        <el-form-item label="官网">
          <el-input v-model="describe.website" placeholder="如： www.baidu.com"></el-input>
        </el-form-item>

        <el-form-item label="开放时间">
          <el-input v-model="describe.opentime" placeholder="如： 上午8:00-11:30,下午13:00-18:00"></el-input>
        </el-form-item>
        <!-- 自定义富文本编辑器组件 -->
        <el-form-item label="描述">
          <editor v-model="describe.description"/>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="preStep">上一步</el-button>
          <el-button @click="saveAndNext">保存并下一步</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import Editor from '../../../../public/tinymce'
import descriptionApi from '@/api/scenic/descriptionApi'

export default {
  name: 'ScenicDescription',
  components: { Editor },
  data() {
    return {
      describe: {
        id: '',
        tel: '',
        website: '',
        opentime: '',
        description: '',
        // flag = 0表示该ID值的描述信息不存在，可插入，flag=1表示可修改
        flag: 0
      }
    }
  },
  mounted() {
    this.getScenicId()
    this.getDescription()
  },
  methods: {
    // 获取路径id
    getScenicId() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.describe.id = id
      }
    },
    // 去上一步
    preStep() {
      this.$router.push({ path: '/scenic/publish/baseInfo/' + this.describe.id })
    },
    saveAndNext() {
      // 添加数据库操作
      if (this.describe.flag === 0) {
        descriptionApi.saveDescription(this.describe)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$router.push({ path: '/scenic/publish/tips/' + this.describe.id })
            this.describe.flag = 1
          })
      }
      // 更新数据库数据操作
      if (this.describe.flag === 1) {
        descriptionApi.updateDescription(this.describe)
          .then(resp => {
            this.$router.push({ path: '/scenic/publish/tips/' + this.describe.id })
          })
      }
    },
    // 根据ID获取信息并回显
    getDescription() {
      descriptionApi.getDescriptionById(this.describe.id)
        .then(resp => {
          if (resp.data.description) {
            this.describe.flag = 1
            this.describe.website = resp.data.description.website
            this.describe.tel = resp.data.description.tel
            this.describe.opentime = resp.data.description.opentime
            this.describe.description = resp.data.description.description
          }
        })
        .catch(err => {

        })
    }
  }
}
</script>

<style scoped>
.my-publish-title {
  text-align: center;
}
</style>
