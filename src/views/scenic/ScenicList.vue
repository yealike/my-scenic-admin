<template>
  <div class="app-container">
    <!-- 表单用于查询数据 -->
    <el-form :inline="true" :model="queryInfo" class="demo-form-inline">

      <el-form-item label="景点名">
        <el-input clearable v-model="queryInfo.name" placeholder="模糊查询"></el-input>
      </el-form-item>

      <el-form-item label="广告费">
        <el-select clearable
                   @change="adPriceChange"
                   v-model="queryInfo.minAdPrice"
                   placeholder="广告费"
        >
          <el-option label="100以下" value="100"></el-option>
          <el-option label="100~500" value="500"></el-option>
          <el-option label="500~1000" value="1000"></el-option>
          <el-option label="1000以上" value="1000+"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所在城市">
        <el-cascader :options="cityList"
                     :props="cityParams"
                     placeholder="选择城市"
                     clearable
                     @change="cityChange"
                     :show-all-levels="false"
        ></el-cascader>

      </el-form-item>

      <el-form-item label="星级">
        <el-select clearable v-model="queryInfo.star" placeholder="星级">
          <el-option label="一星" :value="1"></el-option>
          <el-option label="二星" :value="2"></el-option>
          <el-option label="三星" :value="3"></el-option>
          <el-option label="四星" :value="4"></el-option>
          <el-option label="五星" :value="5"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="doSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格用于显示数据 -->
    <el-table
      :data="scenicData"
      border
      style="width: 100%"
    >

      <el-table-column
        prop="name"
        align="center"
        label="景点名"
      >
      </el-table-column>

      <el-table-column
        label="封面图片"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-image
            style="border-radius: 5px"
            fit="fit"
            :src="scope.row.url"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column
        prop="cityName"
        align="center"
        style="text-align: center"
        label="城市"
      >
      </el-table-column>

      <el-table-column
        prop="position"
        align="center"
        label="具体位置"
      >
      </el-table-column>

      <el-table-column
        prop="star"
        width="80"
        align="center"
        label="推荐指数"
      >
      </el-table-column>

      <el-table-column
        prop="adPrice"
        width="80"
        align="center"
        label="广告费"
      >
      </el-table-column>

      <el-table-column
        prop="gmtCreate"
        align="center"
        label="创建时间"
      >
      </el-table-column>

      <el-table-column
        prop="gmtModify"
        align="center"
        label="修改时间"
      >
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button @click="showUpdate(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button @click="doDelete(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page-helper">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[5,10, 30, 50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </div>

    <!-- 对话框，用于修改数据回显 -->
    <el-dialog title="修改景点基本信息" :visible.sync="dialogFormVisible">
      <!-- 对话框嵌套的表单 -->
      <el-form :model="scenicBaseInfo" status-icon label-width="100px">
        <el-form-item label="景点名">
          <el-input clearable type="text" v-model="scenicBaseInfo.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="广告费">
          <el-input clearable type="text" v-model="scenicBaseInfo.adPrice" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="封面图片">
          <el-image
            style="border-radius: 5px;width: 150px;height: 100px;"
            fit="fit"
            :src="scenicBaseInfo.url"
          >
          </el-image>
          <!-- 图片上传组件 -->
          <el-upload
            style="display: inline-block;margin-left: 10px;vertical-align: bottom;"
            :action="imageUrl"
            list-type="picture-card"
            :on-success="uploadImage"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="所在城市">
          <el-cascader :options="cityList"
                       :props="cityParams"
                       placeholder="选择城市"
                       clearable
                       :value="scenicBaseInfo.cityId"
                       @change="cityChange"
                       :show-all-levels="false"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="具体位置">
          <el-input clearable type="text" v-model="scenicBaseInfo.position" autocomplete="off"></el-input>
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
      </el-form>

      <div slot="footer">
        <el-button style="background-color:#4ee061;" @click="updateOther">修改其他信息</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateScenic">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import scenicApi from '@/api/scenic/scenic'
import cityApi from '@/api/scenic/cityApi'

export default {
  name: 'ScenicList',
  data() {
    return {
      scenicData: [],
      page: {
        current: 1,
        limit: 5,
        total: 0
      },
      queryInfo: {
        name: '',
        minAdPrice: '',
        maxAdPrice: '',
        cityId: '',
        star: ''
      },
      // 城市列表
      cityList: [],
      cityParams: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      dialogFormVisible: false,
      scenicBaseInfo: {
        id: '',
        name: '',
        adPrice: '',
        url: '',
        cityId: '',
        position: '',
        star: ''
      },
      imageUrl: process.env.VUE_APP_BASE_API + '/scenic/scenic/oss'
    }
  },
  mounted() {
    this.initScenicList(this.page.current, this.page.limit, this.queryInfo)
    this.getCityList()
  },
  methods: {
    // 初始化数据
    initScenicList(current, limit, queryInfo) {
      scenicApi.getScenicList(current, limit, queryInfo)
        .then(resp => {
          this.scenicData = resp.data.records
          this.page.total = resp.data.total
          this.page.current = resp.data.current
        })
    },
    // 修改其他信息，路由跳转到其他组件
    updateOther() {
      this.$router.push({ path: '/scenic/publish/baseInfo/' + this.scenicBaseInfo.id })
    },
    // 显示修改对话框
    showUpdate(data) {
      // 显示对话框的同时，回显相应待修改的数据
      this.dialogFormVisible = true
      // console.log(data)
      scenicApi.getScenicById(data.id)
        .then(resp => {
          // console.log(resp.data.scenic)
          // Object.assign(this.scenicBaseInfo, resp.data.scenic)
          this.scenicBaseInfo.id = resp.data.scenic.id
          this.scenicBaseInfo.name = resp.data.scenic.name
          this.scenicBaseInfo.adPrice = resp.data.scenic.adPrice
          this.scenicBaseInfo.url = resp.data.scenic.url
          this.scenicBaseInfo.cityId = resp.data.scenic.cityId
          this.scenicBaseInfo.position = resp.data.scenic.position
          this.scenicBaseInfo.star = resp.data.scenic.star
          // console.log(this.scenicBaseInfo)
        })

    },
    // 图片上传成功之后的回调
    uploadImage(resp, file) {
      this.scenicBaseInfo.url = resp.data.url
      console.log('file==>', file)
    },
    // 执行修改操作
    updateScenic() {
      scenicApi.updateScenic(this.scenicBaseInfo)
        .then(resp => {
          // 修改成功，刷新页面
          this.initScenicList(this.page.current, this.page.limit, this.queryInfo)
          // 关闭对话框
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: '修改成功！'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message.error('删除失败了')
        })
    },
    // 当前页码发生改变
    handleCurrentChange(val) {
      this.initScenicList(val, this.page.limit, this.queryInfo)
    },
    // 页面大小发生改变
    handleSizeChange(val) {
      this.initScenicList(this.page.current, val, this.queryInfo)
    },
    // 搜索栏方法
    // 1.按条件查询景点
    doSearch() {
      console.log(this.queryInfo)
      this.initScenicList(1, this.page.limit, this.queryInfo)
    },
    // 2.获取城市列表，按照省市结构
    getCityList() {
      cityApi.getCityListWithProvince()
        .then(resp => {
          this.cityList = resp.data.list
          // console.log(this.cityList)
        })
    },
    // 级联选择城市发生改变
    cityChange(val) {
      // console.log(val[val.length - 1])
      this.queryInfo.cityId = val[val.length - 1]
    },
    adPriceChange(val) {
      if (val == '100') {
        this.queryInfo.minAdPrice = 0.0
        this.queryInfo.maxAdPrice = 100
      }
      if (val == '500') {
        this.queryInfo.minAdPrice = 100
        this.queryInfo.maxAdPrice = 500
      }
      if (val == '1000') {
        this.queryInfo.minAdPrice = 500
        this.queryInfo.maxAdPrice = 1000
      }
      if (val == '1000+') {
        this.queryInfo.minAdPrice = 1000
        this.queryInfo.maxAdPrice = 100000000
      }
    },
    // 删除一条数据
    doDelete(data) {
      // 确认框
      this.$confirm(`此操作将永久删除【${data.name}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        scenicApi.deleteScenicById(data.id)
          .then(resp => {
            this.initScenicList(this.page.current, this.page.limit, this.queryInfo)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(err => {
          this.$message.error('删除失败了')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

<style scoped>
.page-helper {
  padding: 0;
  margin-top: 30px;
  text-align: center;
  /*border: solid 1px #000000;*/
}
</style>
