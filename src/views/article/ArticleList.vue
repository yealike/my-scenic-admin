<template>
  <div class="app-container">
    <el-table
      :data="articleList"
      border
      @row-dblclick="rowClick"
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="标题"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="作者"
        align="center"
      >
      </el-table-column>

      <el-table-column
        label="封面图片"
        align="center"
        width="180"
      >
        <template v-slot="scope">
          <el-image
            style="border-radius: 5px"
            fit="fit"
            :src="scope.row.cover"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column
        prop="viewCount"
        align="center"
        label="浏览量"
      >
      </el-table-column>

      <el-table-column
        prop="praiseCount"
        align="center"
        label="点赞量"
      >
      </el-table-column>

      <el-table-column
        label="公众显示"
        align="center"
      >

        <template v-slot="scope">
          <el-switch
            v-model="scope.row.isShow"
            @change="changeStatus(scope.row)"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
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
        width="140"
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

    <!-- 对话框，用于修改数据 -->
    <el-dialog title="文章信息" :visible.sync="dialogFormVisible">
      <el-form :model="articleInfo" label-width="100px">

        <el-form-item label="文章标题">
          <el-input v-model="articleInfo.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="封面图片">
          <el-image
            style="border-radius: 5px;width: 150px;height: 100px;"
            fit="fit"
            :src="articleInfo.cover"
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

        <el-form-item label="浏览量">
          <el-input-number :min="0" v-model="articleInfo.viewCount" autocomplete="off"></el-input-number>
        </el-form-item>

        <el-form-item label="点赞量">
          <el-input-number :min="0" v-model="articleInfo.praiseCount" autocomplete="off"></el-input-number>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框用于显示文章 -->
    <el-dialog
      title="提示-->详细信息请移步用户端"
      :visible.sync="dialogVisible"
    >
      <span v-html="articleContent"></span>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import articleApi from '@/api/article/articleApi'

export default {
  name: 'ArticleList',
  data() {
    return {
      dialogVisible: false,
      articleContent: '',
      imageUrl: process.env.VUE_APP_BASE_API + '/scenic/scenic/oss',
      dialogFormVisible: false,
      pageInfo: {
        current: 1,
        limit: 5,
        total: 0
      },
      articleList: [],
      statusInfo: {
        id: '',
        isShow: false
      },
      articleInfo: {
        id: '',
        title: '',
        cover: '',
        viewCount: '',
        praiseCount: ''
      }
    }
  },
  mounted() {
    this.initArticle(this.pageInfo.current, this.pageInfo.limit)
  },
  methods: {
    initArticle(current, limit) {
      articleApi.getAllWithPage(current, limit)
        .then(resp => {
          // console.log(resp)
          this.articleList = resp.data.page.records
          this.pageInfo.current = resp.data.page.current
          this.pageInfo.limit = resp.data.page.size
          this.pageInfo.total = resp.data.page.total
        })
        .catch(err => {
          console.log('获取文章数据失败==>', err)
        })
    },
    // 显示修改对话框
    showUpdate(data) {
      this.dialogFormVisible = true
      this.articleInfo.id = data.id
      this.articleInfo.title = data.title
      this.articleInfo.cover = data.cover
      this.articleInfo.viewCount = data.viewCount
      this.articleInfo.praiseCount = data.praiseCount
    },
    submitUpdate() {
      // 关闭对话框
      this.dialogFormVisible = false
      articleApi.updateArticle(this.articleInfo)
        .then(resp => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          // 修改成功，重新初始化数据
          this.initArticle(this.pageInfo.current, this.pageInfo.limit)
        })
        .catch(err => {
          this.$message.error('修改失败')
        })
    },
    doDelete(data) {
      // 确认框
      this.$confirm(`此操作将永久删除【${data.title}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        articleApi.delOneArticle(data.id)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 删除成功，重新初始化数据
            this.initArticle(this.pageInfo.current, this.pageInfo.limit)
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
    handleSizeChange(val) {
      this.initArticle(1, val)
    },
    handleCurrentChange(val) {
      this.initArticle(val, this.pageInfo.limit)
    },
    changeStatus(val) {

      this.statusInfo.id = val.id
      this.statusInfo.isShow = val.isShow
      articleApi.updateShowStatus(this.statusInfo)
        .then(resp => {
          this.$message({
            type: 'success',
            message: '状态修改成功'
          })
          // 修改成功，重新初始化数据
          this.initArticle(this.pageInfo.current, this.pageInfo.limit)
        })
        .catch(err => {
          this.$message.error('状态修改失败！')
        })
    },
    // 图片上传成功之后的回调
    uploadImage(resp, file) {
      this.articleInfo.cover = resp.data.url
      console.log('file==>', file)
    },
    // 某行双击
    rowClick(data) {
      this.dialogVisible = true
      this.articleContent = data.content
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
