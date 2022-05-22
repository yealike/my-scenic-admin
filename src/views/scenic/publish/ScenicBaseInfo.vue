<template>
  <div class="app-container">
    <!-- 步骤条组件 -->
    <h3 class="my-publish-title">发布新景点</h3>
    <el-steps :active="0" :align-center="true" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="描述信息"></el-step>
      <el-step title="提示信息"></el-step>
      <el-step title="价格信息"></el-step>
    </el-steps>

    <!-- 表单组件 -->
    <div class="app-container">
      <el-form :model="scenicBaseInfo" status-icon label-width="100px">

        <el-form-item label="景点名">
          <el-input clearable placeholder="景点名" type="text" v-model="scenicBaseInfo.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="广告费">
          <el-input-number placeholder="广告费"
                           :min="0"
                           v-model="scenicBaseInfo.adPrice"
                           autocomplete="off"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="封面图片">
          <el-image
            v-if="scenicBaseInfo.url"
            style="border-radius: 5px;width: 150px;height: 100px;"
            fit="fit"
            :src="scenicBaseInfo.url"
          >
          </el-image>
          <!-- 图片上传组件 -->
          <el-upload
            :action="imageUrl"
            style="display: inline-block;margin-left: 10px;vertical-align: bottom;"
            list-type="picture-card"
            :on-success="uploadImage"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="所在城市">
          <el-cascader :options="cityList"
                       :show-all-levels="false"
                       :props="cityParams"
                       @change="cityChange"
                       placeholder="选择城市"
                       clearable
                       v-model="scenicBaseInfo.cityId"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="坐标">
          <div style="display: flex">
            <el-input-number :min="-180" :max="180" :precision="6" v-model="scenicBaseInfo.longitude" placeholder="经度"
            ></el-input-number>
            <el-input-number :min="-90" :max="90" :precision="6" v-model="scenicBaseInfo.latitude"
                             style="margin-left: 3px;" placeholder="纬度"
            ></el-input-number>
          </div>
        </el-form-item>

        <el-form-item label="具体位置">
          <el-input clearable placeholder="具体位置" type="text" v-model="scenicBaseInfo.position" autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="星级">
          <el-select clearable
                     v-model="scenicBaseInfo.star"
                     placeholder="星级"
          >
            <el-option label="一星" :value="1"></el-option>
            <el-option label="二星" :value="2"></el-option>
            <el-option label="三星" :value="3"></el-option>
            <el-option label="四星" :value="4"></el-option>
            <el-option label="五星" :value="5"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="saveAndNext">保存并下一步</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import cityApi from '@/api/scenic/cityApi'
import scenicApi from '@/api/scenic/scenic'

export default {
  name: 'ScenicBaseInfo',
  data() {
    return {
      scenicBaseInfo: {
        name: '',
        adPrice: '',
        url: '',
        cityId: '',
        longitude: '',
        latitude: '',
        position: '',
        star: ''
      },
      // 城市列表
      cityList: [],
      cityParams: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      imageUrl: process.env.VUE_APP_BASE_API + '/scenic/scenic/oss',
      // flag=0插入，flag=1修改
      updateFlag: 0
    }
  },
  mounted() {
    this.getCityList()
    this.getScenicId()
    this.getScenicInfo()
  },
  methods: {
    // 获取路径id
    getScenicId() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
      }
    },
    // 图片上传成功的回调
    uploadImage(resp) {
      this.scenicBaseInfo.url = resp.data.url
    },
    // 2.获取城市列表，按照省市结构
    getCityList() {
      cityApi.getCityListWithProvince()
        .then(resp => {
          this.cityList = resp.data.list
          // console.log(this.cityList)
        })
    },
    // 根据ID查询景点基本信息
    getScenicInfo() {
      if (this.$route.params && this.$route.params.id) {
        scenicApi.getScenicById(this.$route.params.id)
          .then(resp => {
            if (resp.data.scenic) {
              this.updateFlag = 1
              this.scenicBaseInfo.name = resp.data.scenic.name
              this.scenicBaseInfo.adPrice = resp.data.scenic.adPrice
              this.scenicBaseInfo.url = resp.data.scenic.url
              this.scenicBaseInfo.cityId = resp.data.scenic.cityId
              this.scenicBaseInfo.longitude = resp.data.scenic.longitude
              this.scenicBaseInfo.latitude = resp.data.scenic.latitude
              this.scenicBaseInfo.position = resp.data.scenic.position
              this.scenicBaseInfo.star = resp.data.scenic.star
            }
          })
      }

    },
    /**
     * 保存并下一步
     * 1.将数据传给后端存入数据库
     * 2.后端返回存入的id
     * 3.将id拼接在路径后面供后续操作使用
     */
    saveAndNext() {
      // 添加景点基本信息
      if (this.updateFlag === 0) {
        scenicApi.addScenic(this.scenicBaseInfo)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.updateFlag = 1
            this.$router.push({ path: '/scenic/publish/description/' + resp.data.id })
            // this.$router.push({ path: '/scenic/publish/description/' + '445ca83ab2594e2f921992b6a811b336' })
          })
          .catch(err => {
            this.$message.error('操作失败')
          })
      }
      // 修改景点信息
      if (this.updateFlag === 1) {
        this.scenicBaseInfo.id = this.$route.params.id
        scenicApi.updateScenic(this.scenicBaseInfo)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.$router.push({ path: '/scenic/publish/description/' + this.$route.params.id })
          })
      }
    },
    // 选择的城市发生了变化
    cityChange(val) {
      this.scenicBaseInfo.cityId = val[val.length - 1]
    }
    // 根据id获取景点信息
  }
}
</script>

<style scoped>
.my-publish-title {
  text-align: center;
}

.my-form {
  width: 50%;
}
</style>
