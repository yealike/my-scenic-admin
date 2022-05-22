<template>
  <div class="app-container">
    <h3 class="my-publish-title">发布新景点</h3>
    <el-steps :active="3" :align-center="true" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="描述信息"></el-step>
      <el-step title="提示信息"></el-step>
      <el-step title="价格信息"></el-step>
    </el-steps>

    <!-- 表格 -->
    <div class="app-container">
      <el-button @click="doAddPrice" type="primary" style="margin-bottom: 10px;float: right">新增价格</el-button>
      <el-table :data="priceList" border stripe style="width: 100%">
        <el-table-column
          prop="price"
          label="价格"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="description"
          label="描述"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="sortId"
          label="排序字段"
          align="center"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button @click="showUpdate(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="doDelete(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" style="margin-top: 12px;" @click="preStep">返回上一步</el-button>
      <el-button type="success" style="margin-top: 12px;" @click="finalPublish">最终发布</el-button>
    </div>

    <!-- 嵌套表单的对话框 -->
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <el-form :model="priceInfo" label-width="100px">
        <el-form-item label="价格">
          <el-input-number :min="0" :precision="2" v-model="priceInfo.price" placeholder="输入价格：39.9" autocomplete="off"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="价格描述">
          <el-input v-model="priceInfo.description" placeholder="例如：老人票" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="排序字段">
          <el-input-number :min="0" v-model="priceInfo.sortId" placeholder="数字越小最靠前" autocomplete="off"
          ></el-input-number>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{this.dialogFormVisible = false;this.priceInfo={}}">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import priceApi from '@/api/scenic/priceApi'

export default {
  name: 'ScenicPrice',
  data() {
    return {
      priceList: [],
      priceInfo: {
        id: '',
        scenicId: this.$route.params.id,
        sortId: 0,
        price: '',
        description: ''
      },
      // flag=0添加，flag=1修改
      updateFlag: 0,
      dialogFormVisible: false,
      // 0表示修改对话框，1表示新增对话框
      dialogFlag: 0,
      title: ''
    }
  },
  mounted() {
    this.getPriceList()
  },
  methods: {
    preStep() {
      this.$router.push({ path: '/scenic/publish/tips/' + this.$route.params.id })
    },
    // 最终发布回到发布景点的首页
    finalPublish() {
      this.$message({
        type: 'success',
        message: '发布成功'
      })
      this.$router.push({ path: '/scenic/publish/baseInfo' })
    },
    // 显示新增对话框
    doAddPrice() {
      this.title = '新增价格'
      this.dialogFormVisible = true
      this.updateFlag = 0
    },
    // 显示修改对话框
    showUpdate(data) {
      this.title = '修改价格信息'
      this.dialogFormVisible = true
      this.priceInfo.id = data.id
      this.priceInfo.scenicId = data.scenicId
      this.priceInfo.price = data.price
      this.priceInfo.description = data.description
      this.priceInfo.sortId = data.sortId
      this.updateFlag = 1
    },
    submitData() {
      // 新增操作==>不需要价格ID但是需要景点ID
      if (this.updateFlag === 0) {
        this.priceInfo.id = ''
        priceApi.saveScenicPrice(this.priceInfo)
          .then(resp => {
            // 关闭弹窗
            this.dialogFormVisible = false
            // 提示新增成功
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            // 刷新列表
            this.getPriceList()
            // 数据恢复初始状态
            this.priceInfo = {
              scenicId: this.$route.params.id,
              sortId: 0,
              price: '',
              description: ''
            }

          })
      }
      // 修改操作===>需要当前价格ID，景点ID
      if (this.updateFlag === 1) {
        priceApi.updatePriceByScenicId(this.priceInfo)
          .then(resp => {
            // 关闭弹窗
            this.dialogFormVisible = false
            // 提示新增成功
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            // 刷新列表
            this.getPriceList()
            // 数据恢复初始状态
            this.priceInfo = {
              id: '',
              scenicId: this.$route.params.id,
              sortId: 0,
              price: '',
              description: ''
            }
          })
      }
    },
    // 删除一条价格信息
    doDelete(data) {
      priceApi.deletePrice(data.id)
        .then(resp => {
          this.getPriceList()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => {
          this.$message.error('删除失败')
        })
    },
    // 根据景点ID查询价格列表
    getPriceList() {
      //445ca83ab2594e2f921992b6a811b336
      priceApi.getPriceListById(this.$route.params.id)
        .then(resp => {
          this.priceList = resp.data.priceList
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
