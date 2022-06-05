<template>
  <div class="app-container">

    <!-- 行内表单用于封装查询信息 -->
    <el-form :inline="true" :model="queryInfo">
      <el-form-item label="酒店名">
        <el-input clearable autocomplete="off" v-model="queryInfo.name" placeholder="酒店名:模糊查询"></el-input>
      </el-form-item>

      <el-form-item label="商圈">
        <el-input clearable autocomplete="off" v-model="queryInfo.business" placeholder="商圈:模糊查询"></el-input>
      </el-form-item>

      <el-form-item label="地址">
        <el-input clearable autocomplete="off" v-model="queryInfo.address" placeholder="地址:模糊查询"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select clearable autocomplete="off" v-model="queryInfo.brand" :filterable="true" @change="brandChange"
                   placeholder="品牌"
        >
          <el-option v-for="item in categoryInfo.brand" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="城市">
        <el-select clearable autocomplete="off" v-model="queryInfo.city" :filterable="true" @change="cityChange"
                   placeholder="选中城市"
        >
          <el-option v-for="item in categoryInfo.city" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="星级">
        <el-select clearable
                   autocomplete="off"
                   v-model="queryInfo.starName"
                   :filterable="true"
                   @change="starNameChange"
                   placeholder="品牌"
        >
          <el-option v-for="item in categoryInfo.starName" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="排序">
        <el-select clearable
                   autocomplete="off"
                   v-model="queryInfo.sort"
                   @change="sortChange"
                   placeholder="排序"
        >
          <el-option label="价格" value="price"></el-option>
          <el-option label="评分" value="sort"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="hotelList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="酒店名"
        align="center"
      >
      </el-table-column>

      <el-table-column
        label="图片"
        align="center"
        width="180"
      >
        <template v-slot="scope">
          <el-image
            style="border-radius: 5px"
            fit="fit"
            :src="scope.row.pic"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column
        prop="address"
        label="地址"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="score"
        label="评分"
        align="center"
      >
      </el-table-column>

      <el-table-column
        label="品牌"
        align="center"
      >
        <template v-slot="scope">
          <el-tag>
            {{ scope.row.brand }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="city"
        label="城市"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="starName"
        label="星级"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="business"
        label="商圈"
        align="center"
      >
      </el-table-column>

      <el-table-column
        label="经纬度"
        width="100"
        align="center"
      >
        <template v-slot="scope">
          <span style="color: #0b63f1">{{ scope.row.longitude }}</span><br>
          <span style="color: #f10b0b">{{ scope.row.latitude }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        width="120"
        fixed="right"
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
        :current-page="pageInfo.current"
        :page-sizes="[5,10, 30, 50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </div>

    <!-- 对话框-用于修改数据 -->
    <el-dialog title="酒店信息" :visible.sync="dialogFormVisible">
      <el-form :model="hotelInfo" label-width="100px">

        <el-form-item label="酒店名">
          <el-input v-model="hotelInfo.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="封面图片">
          <el-image
            style="border-radius: 5px;width: 150px;height: 100px;"
            fit="fit"
            :src="hotelInfo.pic"
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

        <el-form-item label="酒店地址">
          <el-input v-model="hotelInfo.address" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="酒店价格">
          <el-input-number :min="0" v-model="hotelInfo.price" autocomplete="off"></el-input-number>
        </el-form-item>

        <el-form-item label="酒店评分">
          <el-input-number :min="0" v-model="hotelInfo.score" autocomplete="off"></el-input-number>
        </el-form-item>

        <el-form-item label="酒店品牌">
          <el-input v-model="hotelInfo.brand" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="所在城市">
          <el-input v-model="hotelInfo.city" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="酒店星级">
          <el-input v-model="hotelInfo.starName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="所属商圈">
          <el-input v-model="hotelInfo.business" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="经度">
          <el-input-number :min="-180"
                           :max="180"
                           :precision="6"
                           v-model="hotelInfo.longitude"
                           placeholder="经度"
                           autocomplete="off"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="纬度">
          <el-input-number :min="-90"
                           :max="90"
                           :precision="6"
                           v-model="hotelInfo.latitude"
                           placeholder="纬度"
                           autocomplete="off"
          ></el-input-number>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import hotelApi from '@/api/scenic/hotelApi'

export default {
  name: 'HotelList',
  data() {
    return {
      imageUrl: process.env.VUE_APP_BASE_API + '/scenic/scenic/oss',
      dialogFormVisible: false,
      hotelInfo: {
        id: '',
        name: '',
        address: '',
        price: '',
        score: '',
        brand: '',
        city: '',
        starName: '',
        business: '',
        latitude: '',
        longitude: '',
        pic: ''
      },
      hotelList: [],
      /**
       * 查询条件
       * 名称--模糊查询
       * 品牌--
       * 城市--
       * 地址--模糊查询
       * 星级--
       * 商圈--模糊查询
       */
      queryInfo: {
        name: '',
        brand: '',
        city: '',
        address: '',
        starName: '',
        business: '',
        price: '',
        score: ''
      },
      categoryInfo: {
        brand: [],
        city: [],
        starName: []
      },
      pageInfo: {
        current: 1,
        limit: 5,
        total: 0
      }
    }
  },
  mounted() {
    this.initHotel(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
    this.category()
  },
  methods: {
    initHotel(queryInfo, current, limit) {
      hotelApi.getPage(queryInfo, current, limit)
        .then(resp => {
          this.hotelList = resp.data.records
          this.pageInfo.current = resp.data.current
          this.pageInfo.limit = resp.data.limit
          this.pageInfo.total = resp.data.total
          this.queryInfo.score = false
          this.queryInfo.price = false

        })
        .catch(err => {
          console.log('查询失败==>', err)
        })
    },
    // 查询数据
    category() {
      hotelApi.getCategory()
        .then(resp => {
          this.categoryInfo.brand = resp.data.category.brandList
          this.categoryInfo.city = resp.data.category.cityList
          this.categoryInfo.starName = resp.data.category.starList
          console.log(this.categoryInfo)
        })
        .catch(err => {
          console.log('没有查到查询数据==>', err)
        })
    },
    // 展示修改框
    showUpdate(data) {
      this.dialogFormVisible = true
      this.hotelInfo.id = data.id
      this.hotelInfo.name = data.name
      this.hotelInfo.address = data.address
      this.hotelInfo.price = data.price
      this.hotelInfo.score = data.score
      this.hotelInfo.brand = data.brand
      this.hotelInfo.city = data.city
      this.hotelInfo.starName = data.starName
      this.hotelInfo.business = data.business
      this.hotelInfo.latitude = data.latitude
      this.hotelInfo.longitude = data.longitude
      this.hotelInfo.pic = data.pic
    },
    // 删除一条信息
    doDelete(data) {
      // 确认框
      this.$confirm(`此操作将永久删除【${data.name}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hotelApi.delOneHotel(data.id)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 删除成功，重新初始化数据
            this.initHotel(this.queryInfo, this.pageInfo.limit, this.pageInfo.limit)
          }).catch(err => {
          this.$message.error('删除失败了')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 页面大小改变
    handleSizeChange(val) {
      this.initHotel(this.queryInfo, 1, val)
    },
    // 页码改变--当前页
    handleCurrentChange(val) {
      this.initHotel(this.queryInfo, val, this.pageInfo.limit)
    },
    // 查询
    onSubmit() {
      this.initHotel(this.queryInfo, 1, 5)
      this.$message({
        type: 'success',
        message: '查询成功'
      })
    },
    // 品牌选中
    brandChange(val) {
      this.queryInfo.brand = val
    },
    // 城市改变
    cityChange(val) {
      this.queryInfo.city = val
    },
    // 星级改变
    starNameChange(val) {
      this.queryInfo.starName = val
    },
    // 排序字段选中
    sortChange(val) {
      if (val == 'price') {
        this.queryInfo.price = true
      } else if (val == 'score') {
        this.queryInfo.score = true
      }
    },
    // 图片上传成功之后的回调
    uploadImage(resp, file) {
      this.hotelInfo.pic = resp.data.url
      console.log('file==>', file)
    },
    // 修改信息
    submitUpdate() {
      hotelApi.updateHotel(this.hotelInfo)
        .then(resp => {
          this.$message({
            type: 'success',
            message: '修改成功！'
          })
          this.dialogFormVisible = false
          // 修改成功，重新初始化数据
          this.initHotel(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
        })
        .catch(err => {
          this.$message.error('修改失败')
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
