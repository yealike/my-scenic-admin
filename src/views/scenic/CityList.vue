<template>
  <div class="app-container">
    <el-button @click="insertProvince" size="small" type="primary">添加省份</el-button>
    <el-tree :data="cityList"
             :expand-on-click-node="false"
             @node-click="clickNode"
             :props="cityParams"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="data.parentId===0"
            type="text"
            size="mini"
            @click="append(node,data)"
          >
            新增
          </el-button>

          <el-button
            type="text"
            size="mini"
            @click="update(node,data)"
          >
            修改
          </el-button>

          <el-button
            v-if="data.parentId!==0"
            type="text"
            size="mini"
            @click="remove(node, data)"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <!-- 对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="cityInfo" label-width="100px">
        <el-form-item label="城市名称">
          <el-input v-model="cityInfo.name" type="text" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{this.dialogFormVisible = false;this.cityInfo={}}">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cityApi from '@/api/scenic/cityApi'
import scenicApi from '@/api/scenic/scenic'

export default {
  name: 'CityList',
  data() {
    return {
      cityList: [],
      cityParams: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      cityInfo: {
        parentId: 0,
        name: ''
      },
      updateCityInfo: {
        id: 0,
        parentId: 0,
        name: ''
      },
      dialogFormVisible: false,
      dialogTitle: '',
      dialogFlag: 0
    }
  },
  mounted() {
    this.initCityData()
  },
  methods: {
    // 城市列表初始化数据
    initCityData() {
      cityApi.getCityListWithProvince()
        .then(resp => {
          this.cityList = resp.data.list
        })
    },
    // 结点被点击
    clickNode(nodeData) {
      // console.log(nodeData)
    },
    // 点击新增按钮
    append(node, data) {
      // 对话框flag = 1表示新增操作
      this.dialogFlag = 1
      this.dialogTitle = '新增城市'
      this.dialogFormVisible = true
      this.cityInfo.parentId = data.id
    },
    // 新增省份
    insertProvince() {
      this.dialogFlag = 1
      this.dialogTitle = '新增省份'
      this.dialogFormVisible = true
      this.cityInfo.parentId = 0
    },
    update(node, data) {
      // 对话框flag = 2表示修改
      this.dialogFlag = 2
      this.dialogFormVisible = true
      this.cityInfo.name = data.name
      this.updateCityInfo.id = data.id
      this.updateCityInfo.parentId = data.parentId
    },
    // 新增或修改城市
    submitData() {
      console.log(this.cityInfo)
      if (this.dialogFlag === 1) {
        cityApi.insertNewCity(this.cityInfo)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.initCityData()
            this.cityInfo = {}
          })
      }
      if (this.dialogFlag === 2) {
        this.updateCityInfo.name = this.cityInfo.name
        cityApi.updateCityById(this.updateCityInfo)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.initCityData()
            this.cityInfo = {}
          })
      }
      this.dialogFormVisible = false
    },
    // 删除城市
    remove(node, data) {
      // 确认框
      this.$confirm(`此操作将永久删除【${data.name}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cityApi.removeCityByName(data.id)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.initCityData()
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

</style>
