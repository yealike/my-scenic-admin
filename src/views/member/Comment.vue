<template>
  <div class="app-container">

    <el-form :inline="true" :model="queryInfo">
      <el-form-item label="用户ID">
        <el-input clearable v-model="queryInfo.userId" placeholder="精确查询"></el-input>
      </el-form-item>

      <el-form-item label="用户名">
        <el-input clearable v-model="queryInfo.username" placeholder="模糊查询"></el-input>
      </el-form-item>

      <el-form-item label="内容">
        <el-input clearable v-model="queryInfo.content" placeholder="模糊查询"></el-input>
      </el-form-item>

      <el-form-item label="被评论者ID">
        <el-input clearable v-model="queryInfo.parentUserId" placeholder="精确查询"></el-input>
      </el-form-item>

      <el-form-item label="被评论者名称">
        <el-input clearable v-model="queryInfo.parentUsername" placeholder="模糊查询"></el-input>
      </el-form-item>

      <el-form-item label="标签">
        <el-select clearable v-model="queryInfo.tag" placeholder="选择标签">
          <el-option label="景点" value="景点"></el-option>
          <el-option label="酒店" value="酒店"></el-option>
          <el-option label="文章" value="文章"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标签ID">
        <el-input clearable v-model="queryInfo.tagId" placeholder="精确查询"></el-input>
      </el-form-item>

      <el-form-item label="特殊评论">
        <el-select clearable @change="specialChange" v-model="queryInfo.special" placeholder="特殊评论">
          <el-option label="公众不展示" value="公众不展示"></el-option>
          <el-option label="一级评论" value="一级评论"></el-option>
          <el-option label="置顶评论" value="置顶评论"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="排序方式">
        <el-select clearable @change="sortChange" v-model="queryInfo.sort" placeholder="排序方式">
          <el-option label="点赞最多" value="点赞最多"></el-option>
          <el-option label="被踩最多" value="被踩最多"></el-option>
          <el-option label="最新发布" value="最新发布"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格用于展示数据 -->
    <el-table
      :data="commentList"
      border
      height="600"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        prop="id"
        label="主键"
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
        label="标签ID"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="tagTitle"
        label="标签主题"
      >
      </el-table-column>

      <el-table-column
        width="200"
        align="center"
        label="内容"
      >
        <template v-slot="scope">
          <span style="color: blue">{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="level"
        label="级别"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="userId"
        label="评论者ID"
      >
      </el-table-column>

      <el-table-column
        width="120"
        align="center"
        label="评论者名称"
      >
        <template v-slot="scope">
          <span style="color: #fea995">{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="150"
        align="center"
        label="评论者头像"
      >
        <template v-slot="scope">
          <el-image style="border-radius: 5px"
                    :src="scope.row.avatar"
                    fit="fit"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="parentUserId"
        label="被评论者ID"
      >
      </el-table-column>

      <el-table-column
        width="120"
        align="center"
        label="被评论者名称"
      >
        <template v-slot="scope">
          <span style="color: #10febc">{{ scope.row.parentUserName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="150"
        align="center"
        label="被评论者头像"
      >
        <template v-slot="scope">
          <el-image style="border-radius: 5px"
                    :src="scope.row.parentAvatar"
                    fit="fit"
          >
          </el-image>
        </template>
      </el-table-column>

      <!-- 是否置顶，开关组件 -->
      <el-table-column
        align="center"
        width="100"
        label="是否置顶"
      >
        <template v-slot="scope">
          <el-switch
            v-if="scope.row.level == 1"
            v-model="scope.row.isTop"
            @change="changeTop(scope.row)"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
          <span v-if="scope.row.level != 1">一级评论可置顶</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="parentId"
        label="父评论ID"
      >
      </el-table-column>

      <!-- 是否显示，开关组件 -->
      <el-table-column
        align="center"
        width="100"
        label="公众展示"
      >
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.isShow"
            @change="changeStatus(scope.row)"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="点赞量"
      >
        <template v-slot="scope">
          <span style="color: #50fa7b">{{ scope.row.praiseCount }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="踩次数"
      >
        <template v-slot="scope">
          <span style="color: red">{{ scope.row.praiseCount }}</span>
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
import commentApi from '@/api/member/comment'

export default {
  name: 'Comment',
  data() {
    return {
      commentList: [],
      queryInfo: {
        userId: '',
        username: '',
        content: '',
        parentUserId: '',
        parentUsername: '',
        tag: '',
        tagId: '',
        isNotShow: false,
        oneLevel: false,
        isTop: false,
        praise: false,
        low: false,
        isNew: false
      },
      pageInfo: {
        current: 1,
        limit: 5,
        total: 0
      },
      statusInfo: {
        id: '',
        status: ''
      }
    }
  },
  mounted() {
    this.initComments(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
  },
  methods: {
    initComments(queryInfo, current, limit) {
      commentApi.getPageWithQuery(queryInfo, current, limit)
        .then(resp => {
          // console.log(resp)
          this.commentList = resp.data.records
          this.pageInfo.current = resp.data.current
          this.pageInfo.limit = resp.data.limit
          this.pageInfo.total = resp.data.total

          // this.queryInfo.isNotShow = false
          // this.queryInfo.oneLevel = false
          // this.queryInfo.isTop = false
          // this.queryInfo.praise = false
          // this.queryInfo.low = false
          // this.queryInfo.isNew = false
        })
    },
    // 显示修改对话框
    showUpdate(data) {

    },
    // 删除一条数据
    doDelete(data) {
      // 确认框
      this.$confirm(`此操作将永久删除该记录, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除一条评论
        commentApi.delComments(data.id)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            // 删除成功，刷新列表
            this.initComments(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
          })
          .catch(err => {
            this.$message.error('删除失败！')
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改展示状态
    changeStatus(data) {
      this.statusInfo.id = data.id
      this.statusInfo.status = data.isShow
      commentApi.updateStatus(this.statusInfo)
        .then(resp => {
          this.$message({
            type: 'success',
            message: '状态修改成功！'
          })
          // 修改成功刷新列表
          this.initComments(this.queryInfo, 1, 5)
        })
        .catch(err => {
          this.$message.error('状态修改失败！')
        })
    },
    // 置顶状态改变
    changeTop(data) {
      // console.log(data)
      commentApi.updateTop(data)
        .then(resp => {
          this.$message({
            type: 'success',
            message: '置顶信息修改成功'
          })
          // 修改成功刷新列表
          this.initComments(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
        })
        .catch(err => {
          this.$message.error('置顶信息修改失败')
        })
    },
    // 页面大小改变
    handleSizeChange(val) {
      this.initComments(this.queryInfo, 1, val)
    },
    // 页码改变
    handleCurrentChange(val) {
      this.initComments(this.queryInfo, val, this.pageInfo.limit)
    },
    // 条件查询
    onSubmit() {
      this.initComments(this.queryInfo, this.pageInfo.current, this.pageInfo.limit)
    },
    // 特殊评论发生变化
    specialChange(val) {
      if (val === '公众不展示') {
        this.queryInfo.isNotShow = true
      } else if (val === '一级评论') {
        this.queryInfo.oneLevel = true
      } else if (val === '置顶评论') {
        this.queryInfo.isTop = true
      } else {
        this.queryInfo.isNotShow = false
        this.queryInfo.oneLevel = false
        this.queryInfo.isTop = false
      }
    },
    // 排序方式变化
    sortChange(val) {
      if (val === '点赞最多') {
        this.queryInfo.praise = true
      } else if (val === '被踩最多') {
        this.queryInfo.low = true
      } else if (val === '最新发布') {
        this.queryInfo.isNew = true
      } else {
        this.queryInfo.praise = false
        this.queryInfo.low = false
        this.queryInfo.isNew = false
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
