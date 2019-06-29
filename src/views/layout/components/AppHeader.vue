<template>
  <el-row :gutter="20">
    <el-col :span="10">江苏传智播客教育科技股份有限公司</el-col>
    <el-col :span="5" :offset="5">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <img width="30" :src="userInfo.photo">
          {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command='a'>用户设置</el-dropdown-item>
          <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<script>
import { getUser, removeUser } from '@/utils/auth'
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  created() {
    this.userInfo = getUser()
  },
  methods: {
    handleLogout() {
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: 'yes',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        removeUser()
        this.$router.push({ name: 'login' })
        this.$message({
          message: '退出成功',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: '退出取消',
          type: 'info'
        })
      })
    },
    handleCommand(dropdownItem) {
      console.log(dropdownItem)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
