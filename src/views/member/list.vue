<template>
  <div class="app-container">
    <!-- 表单组件用于查询 -->
    <el-form :inline="true" :model="queryInfo">
      <el-form-item label="用户名">
        <el-input v-model="queryInfo.username" clearable placeholder="模糊查询"></el-input>
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="queryInfo.email" clearable placeholder="试试搜索@qq.com"></el-input>
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="queryInfo.gender" clearable placeholder="性别">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="用户状态">
        <el-select v-model="queryInfo.isShow" clearable placeholder="用户状态">
          <el-option label="可用用户" :value="1"></el-option>
          <el-option label="停用用户" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格组件用于显示 -->
    <el-table
      :data="userList"
      border
      style="width: 100%"
    >

      <el-table-column
        align="center"
        prop="username"
        width="160"
        label="用户名"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="email"
        width="160"
        label="邮箱"
      >
      </el-table-column>

      <el-table-column
        width="180"
        align="center"
        label="头像"
      >
        <template v-slot="scope">
          <el-image style="border-radius: 5px"
                    :src="scope.row.avatar"
                    fit="fit"
          >
          </el-image>
        </template>
      </el-table-column>

      <!-- 是否显示，开关组件 -->
      <el-table-column
        align="center"
        width="100"
        label="是否可用"
      >

        <!--        v-model="scope.row.isShow==1"-->
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
        width="60"
        label="性别"
      >
        <template v-slot="scope">
          <span v-if="scope.row.gender==0">
            女
          </span>
          <span v-if="scope.row.gender==1">
            男
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="birth"
        width="100"
        align="center"
        label="出生日期"
      >
      </el-table-column>

      <el-table-column
        prop="fans"
        align="center"
        width="60"
        label="粉丝数"
      >
      </el-table-column>

      <el-table-column
        prop="focus"
        align="center"
        width="60"
        label="关注数"
      >
      </el-table-column>

      <el-table-column
        prop="articalCount"
        align="center"
        width="60"
        label="创作数"
      >
      </el-table-column>

      <el-table-column
        prop="intro"
        align="center"
        label="简介"
      >
      </el-table-column>

      <el-table-column
        prop="gmtCreate"
        align="center"
        width="160"
        label="创建时间"
      >
      </el-table-column>

      <el-table-column
        prop="gmtModify"
        align="center"
        width="160"
        label="修改时间"
      >
      </el-table-column>

      <el-table-column
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

    <!-- 对话框，用于修改数据 -->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <el-form :model="updateInfo" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="updateInfo.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="updateInfo.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="头像">
          <el-image
            style="border-radius: 5px;width: 150px;height: 100px;"
            fit="fit"
            :src="updateInfo.avatar"
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

        <el-form-item label="用户状态">
          <el-select v-model="updateInfo.isShow" placeholder="性别">
            <el-option label="可用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="性别">
          <el-select v-model="updateInfo.gender" placeholder="性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出生日期">
          <el-date-picker
            v-model="updateInfo.birth"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="粉丝数">
          <el-input-number v-model="updateInfo.fans" :min="0" placeholder="粉丝数"></el-input-number>
        </el-form-item>

        <el-form-item label="关注数">
          <el-input-number v-model="updateInfo.focus" :min="0" placeholder="关注数"></el-input-number>
        </el-form-item>

        <el-form-item label="文章数">
          <el-input-number v-model="updateInfo.articalCount" :min="0" placeholder="发布数"></el-input-number>
        </el-form-item>

        <el-form-item label="简介">
          <el-input v-model="updateInfo.intro" placeholder="简介"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框结束 -->
  </div>
</template>

<script>
import member from '@/api/member/member'

export default {
  name: 'UserList',
  data() {
    return {
      // 对话框是否显示
      dialogFormVisible: false,
      // 查询参数
      queryInfo: {
        username: '',
        email: '',
        gender: '',
        birth: '',
        isShow: ''
      },
      // 页面信息
      pageInfo: {
        current: 1,
        limit: 5,
        total: 0
      },
      // 用户列表
      userList: [],
      // 修改信息
      updateInfo: {
        id: '',
        username: '',
        email: '',
        avatar: '',
        isShow: 0,
        gender: 0,
        birth: '',
        fans: '',
        focus: '',
        intro: '',
        articalCount: 0
      },
      // 显示状态
      statusInfo: {
        id: '',
        status: ''
      },
      // 头像上传地址
      imageUrl: process.env.VUE_APP_BASE_API + '/scenic/scenic/oss'
    }
  },
  mounted() {
    this.initUserList(this.pageInfo.current, this.pageInfo.limit, this.queryInfo)
  },
  methods: {
    initUserList(current, limit, queryInfo) {
      member.getUserList(current, limit, queryInfo)
        .then(resp => {
          this.userList = resp.data.userInfo.records
          this.pageInfo.total = resp.data.userInfo.total
          this.pageInfo.current = resp.data.userInfo.current
          this.pageInfo.limit = resp.data.userInfo.size
        })
    },
    // 修改显示状态，自动获取最新状态
    changeStatus(data) {
      this.statusInfo.id = data.id
      this.statusInfo.status = data.isShow
      console.log(this.statusInfo)
      member.updateStatus(this.statusInfo)
        .then(resp => {
          if (resp.success) {
            this.$message({
              type: 'success',
              message: '状态修改成功'
            })
          } else {
            this.$message.error('状态修改失败')
          }
          this.initUserList(this.pageInfo.current, this.pageInfo.limit, this.queryInfo)
        })
    },
    // 页面大小发生改变
    handleSizeChange(limit) {
      // alert(limit)
      this.initUserList(this.pageInfo.current, limit, this.queryInfo)
    },
    // 当前页码发生改变
    handleCurrentChange(current) {
      // console.log(current)
      this.initUserList(current, this.pageInfo.limit, this.queryInfo)
    },
    // 发送查询请求
    onSubmit() {
      this.initUserList(1, 5, this.queryInfo)
    },
    // 删除一条数据
    doDelete(data) {
      // 确认框
      this.$confirm(`此操作将永久删除【${data.username}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        member.deleteOne(data.id)
          .then(resp => {
            if (resp.success) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
            } else {
              this.$message.error('删除失败！')
            }
            this.initUserList(this.pageInfo.current, this.pageInfo.limit, this.queryInfo)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 头像上传成功回调
    // 图片上传成功之后的回调
    uploadImage(resp) {
      this.updateInfo.avatar = resp.data.url
    },
    showUpdate(data) {
      this.dialogFormVisible = true
      this.updateInfo.id = data.id
      this.updateInfo.username = data.username
      this.updateInfo.email = data.email
      this.updateInfo.avatar = data.avatar
      this.updateInfo.isShow = data.isShow
      this.updateInfo.gender = data.gender
      this.updateInfo.birth = data.birth
      this.updateInfo.fans = data.fans
      this.updateInfo.focus = data.focus
      this.updateInfo.intro = data.intro
      this.updateInfo.articalCount = data.articalCount
    },
    // 提交修改操作
    submitUpdate() {
      member.updateOne(this.updateInfo)
        .then(resp => {
          if (resp.success) {
            this.dialogFormVisible = false
            this.initUserList(this.pageInfo.current, this.pageInfo.limit, this.queryInfo)
            this.$message({
              type: 'success',
              message: '修改成功！'
            })
          } else {
            this.$message.error('修改失败！')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '修改失败！'
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
