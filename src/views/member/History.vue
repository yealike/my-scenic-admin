<template>
  <div class="app-container">

    <!-- 行内表单-用于封装查询条件 -->
    <el-form :inline="true" :model="queryInfo">
      <el-form-item label="用户id">
        <el-input clearable v-model="queryInfo.userId" placeholder="用户id"></el-input>
      </el-form-item>
      <el-form-item label="标签名">
        <el-select clearable v-model="queryInfo.tag" placeholder="选择标签名">
          <el-option label="景点" value="景点"></el-option>
          <el-option label="酒店" value="酒店"></el-option>
          <el-option label="文章" value="文章"></el-option>
          <el-option label="博主" value="博主"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格显示数据 -->
    <el-table
      border
      :data="history"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        prop="id"
        label="主键id"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="tag"
        label="标签"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="tagId"
        label="标签id"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="title"
        label="标签主题"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="userId"
        label="用户id"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="count"
        label="浏览次数"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="link"
        label="链接地址"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="gmtCreate"
        label="创建时间"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="gmtModify"
        label="修改时间"
      >
      </el-table-column>

      <el-table-column
        fixed="right"
        align="center"
        width="130"
        label="操作"
      >
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showUpdate(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="doDelete(scope.row)"></el-button>
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
        :page-sizes="[10, 30, 50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </div>

    <!-- 对话框，用于修改数据 -->

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="historyInfo" label-width="100px">
        <el-form-item label="标签id">
          <el-input v-model="historyInfo.tagId" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="标签">
          <el-select clearable v-model="historyInfo.tag" placeholder="选择标签">
            <el-option label="景点" value="景点"></el-option>
            <el-option label="酒店" value="酒店"></el-option>
            <el-option label="文章" value="文章"></el-option>
            <el-option label="博主" value="博主"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户id">
          <el-input v-model="historyInfo.userId" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="标签主题">
          <el-input v-model="historyInfo.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="浏览次数">
          <el-input-number v-model="historyInfo.count" autocomplete="off"></el-input-number>
        </el-form-item>

        <el-form-item label="链接地址">
          <el-input v-model="historyInfo.link" autocomplete="off"></el-input>
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
import historyApi from '@/api/member/history'

export default {
  name: 'History',
  data() {
    return {
      dialogFormVisible: false,
      history: [],
      pageInfo: {
        current: 1,
        limit: 10,
        total: 0
      },
      queryInfo: {
        tag: '',
        userId: ''
      },
      historyInfo: {
        id: '',
        tag: '',
        tagId: '',
        title: '',
        userId: '',
        count: '',
        link: ''
      }
    }
  },
  mounted() {
    this.initHistory(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
  },
  methods: {
    initHistory(query, current, limit) {
      historyApi.getAllHistory(query, current, limit)
        .then(resp => {
          this.history = resp.data.records
          this.pageInfo.current = resp.data.current
          this.pageInfo.limit = resp.data.limit
          this.pageInfo.total = resp.data.total
        })
        .catch(err => {
          console.log('初始化数据失败==>', err)
        })
    },
    // 展示修改对话框
    showUpdate(data) {
      this.dialogFormVisible = true
      this.historyInfo.id = data.id
      this.historyInfo.tag = data.tag
      this.historyInfo.tagId = data.tagId
      this.historyInfo.title = data.title
      this.historyInfo.userId = data.userId
      this.historyInfo.count = data.count
      this.historyInfo.link = data.link
    },
    // 删除一条数据
    doDelete(data) {
      // 确认框
      this.$confirm(`此操作将永久删除该记录, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        historyApi.delOneHistory(data.id)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            // 删除成功，重新初始化数据
            this.initHistory(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
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
      this.initHistory(this.queryInfo, this.pageInfo.current, val)
    },
    // 页码发生改变
    handleCurrentChange(val) {
      this.initHistory(this.queryInfo, val, this.pageInfo.limit)
    },
    // 根据条件查询
    onSubmit() {
      this.initHistory(this.queryInfo, 1, 10)
    },
    // 提交修改信息
    submitUpdate() {
      this.dialogFormVisible = false
      historyApi.updateOneHistory(this.historyInfo)
        .then(resp => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          // 修改成功--刷新页面
          this.initHistory(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
        })
        .catch(err => {
          console.log('修改失败==>', err)
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
