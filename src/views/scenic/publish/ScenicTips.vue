<template>
  <div class="app-container">
    <h3 class="my-publish-title">发布新景点</h3>
    <el-steps :active="2" :align-center="true" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="描述信息"></el-step>
      <el-step title="提示信息"></el-step>
      <el-step title="价格信息"></el-step>
    </el-steps>

    <!-- 表单组件 -->
    <el-form :model="Tips" status-icon label-width="100px">

      <el-form-item label="旅游时节">
        <el-input type="text" v-model="Tips.season" placeholder="例如： 四季皆宜，尤以4-10月最佳。" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="交通线路">
        <editor1 v-model="Tips.traffic" name="editor1" height="300px"/>
      </el-form-item>

      <el-form-item label="小贴士">
        <editor2 v-model="Tips.tips" name="editor2" height="300px"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="preStep">上一步</el-button>
        <el-button type="success" @click="saveAndNext">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import tipsApi from '@/api/scenic/tipsApi'

import editor1 from '../../../../public/tinymce'
import editor2 from '../../../../public/tinymce'

export default {
  name: 'ScenicTips',
  components: { editor1, editor2 },
  data() {
    return {
      /**
       * 旅游提示信息，id，旅游时节，交通线路，小贴士
       */
      Tips: {
        id: '',
        season: '',
        traffic: '',
        tips: ''
      },
      // 修改信息标志符，如果是0表示插入操作，如果是1表示修改操作
      updateFlag: 0
    }
  },
  mounted() {
    this.getTipsByID()
    this.getScenicId()
  },
  methods: {
    // 获取路径id
    getScenicId() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.Tips.id = id
      }
    },
    // 去上一步
    preStep() {
      this.$router.push({ path: '/scenic/publish/description/' + this.Tips.id })
    },
    saveAndNext() {
      // 执行插入操作
      if (this.updateFlag === 0) {
        tipsApi.saveTips(this.Tips)
          .then(resp => {
            this.updateFlag = 1
            this.$router.push({ path: '/scenic/publish/price/' + this.Tips.id })
          })
      }
      // 执行更新操作
      if (this.updateFlag === 1) {
        tipsApi.updateTips(this.Tips)
          .then(resp => {
            this.$router.push({ path: '/scenic/publish/price/' + this.Tips.id })
          })
      }
    },
    // 根据ID查询提示信息
    getTipsByID() {
      tipsApi.getTipsById(this.$route.params.id)
        .then(resp => {
          if (resp.data.information) {

            // 信息不为空，那么数据可回显，修改标识符修改为1，表示当前信息为可修改，而不是插入
            this.updateFlag = 1
            this.Tips.season = resp.data.information.season
            this.Tips.traffic = resp.data.information.traffic
            this.Tips.tips = resp.data.information.tips
          }
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
