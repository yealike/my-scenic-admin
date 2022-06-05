<template>
  <div class="app-container">

    <el-form :inline="true" :model="queryInfo">
      <el-form-item label="作者ID">
        <el-input clearable v-model="queryInfo.userId" placeholder="输入作者ID"></el-input>
      </el-form-item>

      <el-form-item label="作者名">
        <el-input clearable v-model="queryInfo.username" placeholder="模糊查询"></el-input>
      </el-form-item>

      <el-form-item label="文章ID">
        <el-input clearable v-model="queryInfo.articleId" placeholder="输入文章ID"></el-input>
      </el-form-item>

      <el-form-item label="文章标题">
        <el-input clearable v-model="queryInfo.title" placeholder="模糊查询"></el-input>
      </el-form-item>

      <el-form-item label="封面图片">
        <el-select clearable @change="checkCover" v-model="queryInfo.flag" placeholder="是否封面">
          <el-option label="封面" value="封面"></el-option>
          <el-option label="非封面" value="非封面"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格用于显示 -->
    <el-table
      :data="imageList"
      border
      style="width: 100%"
    >

      <el-table-column
        align="center"
        prop="id"
        label="主键ID"
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
            :src="scope.row.url"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column
        width="120"
        align="center"
        prop="userId"
        label="用户ID"
      >
      </el-table-column>

      <el-table-column
        align="center"
        width="120"
        prop="username"
        label="用户名"
      >
      </el-table-column>

      <el-table-column
        width="120"
        align="center"
        prop="articleId"
        label="文章ID"
      >
      </el-table-column>

      <el-table-column
        width="120"
        align="center"
        prop="title"
        label="文章标题"
      >
      </el-table-column>

      <el-table-column
        align="center"
        label="是否是封面"
      >
        <template v-slot="scope">
          <span v-if="scope.row.isCover" style="color: red">封面</span>
          <span v-else>非封面</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="排序字段"
      >
        <template v-slot="scope">
          <span v-if="scope.row.isCover" style="color: red">{{ scope.row.sort }}</span>
          <span v-else>非封面</span>
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        align="center"
        prop="gmtCreate"
        label="创建时间"
      >
      </el-table-column>

      <el-table-column
        width="160"
        align="center"
        prop="gmtModify"
        label="修改时间"
      >
      </el-table-column>

      <el-table-column
        align="center"
        width="140"
        label="操作"
        fixed="right"
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
  </div>
</template>

<script>
import imagesApi from '@/api/article/imagesApi'

export default {
  name: 'ImageList',
  data() {
    return {
      imageInfo: {
        id: '',
        url: '',
        userId: '',
        articleId: '',
        isCover: false,
        sort: 0
      },
      queryInfo: {
        userId: '',
        username: '',
        articleId: '',
        title: '',
        isCover: ''
      },
      pageInfo: {
        current: 1,
        limit: 5,
        total: 0
      },
      imageList: []
    }
  },
  mounted() {
    this.initImageList(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
  },
  methods: {
    initImageList(queryInfo, current, limit) {
      imagesApi.getAllWithPage(queryInfo, current, limit)
        .then(resp => {
          this.imageList = resp.data.records
          this.pageInfo.current = resp.data.current
          this.pageInfo.limit = resp.data.limit
          this.pageInfo.total = resp.data.total
        })
    },
    // 展示修改对话框
    showUpdate(data) {
      console.log(data)
    },
    // 删除一条信息
    doDelete(data) {
      // 确认框
      this.$confirm(`此操作将永久删除该图片, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        imagesApi.delOneImage(data.id)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 删除成功，重新初始化数据
            this.initImageList(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
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
      this.initImageList(this.queryInfo, 1, val)
    },
    // 页码改变
    handleCurrentChange(val) {
      this.initImageList(this.queryInfo, val, this.pageInfo.limit)
    },
    // 查询结果
    onSubmit() {
      this.initImageList(this.queryInfo, 1, this.pageInfo.limit)
    },
    // 选择封面
    checkCover(val) {
      if (val === '封面') {
        this.queryInfo.isCover = true
        // console.log(true)
      } else if (val === '非封面') {
        this.queryInfo.isCover = false
        // console.log(false)
      } else {
        this.queryInfo.isCover = ''
        // console.log('')
      }
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
