<template>
  <div>
    <!-- 数据筛选 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>数据筛选</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-form ref="form" :model="filterParams" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="全部"></el-radio>
            <el-radio
            v-for="(item, index) in statTypes"
            :key="item.label"
            :label="index">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <article-channel v-model="filterParams.channel_id"></article-channel>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="range_date"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
          @click="handleFilter"
          :loading="articleLoading">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据筛选 -->

    <!-- 文章列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>一共有<strong>{{ totalCount }}</strong>条数据</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-table
        class="article-list"
        :data="articles"
        style="width: 100%"
        v-loading="articleLoading">
        <el-table-column
          label="封面"
          width="180">
          <template slot-scope="scope">
            <img
              width="20"
              v-for="item in scope.row.cover.images"
              :key="item"
              :src="item">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          width="180"
          label="状态">
          <template slot-scope="scope">
            <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
          <template>
            <el-button size="mini" type="primary" plain>修改</el-button>
            <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 数据分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :current-page="page"
        :page-size="pageSize"
        :disabled="articleLoading"
        >
      </el-pagination>
      <!-- /数据分页 -->
    </el-card>
    <!-- /文章列表 -->
  </div>
</template>
<script>
import ArticleChannel from '@/components/article-channel'
export default {
  name: 'ArticleList',
  components: {
    ArticleChannel
  },
  data() {
    return {
      articles: [],
      filterParams: {
        status: '',
        channelId: '',
        beginPubdate: '',
        endPubdate: ''
      },
      range_date: '',
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      pageSize: 10, // 每页大小
      totalCount: 0, // 总数据量
      page: 1, // 当前页码
      articleLoading: false // 加载中
    }
  },
  created() {
    ArticleChannel.loadChannels()
  },
  methods: {
    async loadArticles() {
      const filterData = {}
      for (let key in this.filterParams) {
        const item = this.filterParams[key]
        if (item !== null && item !== undefined && item !== '') {
          this.filterParams[key] = item
        }
      }
      this.articleLoading = true
      const data = await this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page: this.page,
          per_page: this.pageSize,
          ...filterData
        }
      })
      this.articles = data.results
      this.totalCount = data.total_count
      this.articleLoading = false
    },
    handleCurrentChange(page) {
      this.page = page
      this.loadArticles()
    },
    handleFilter() {
      this.page = 1
      this.loadArticles()
    },
    handleDateChange(value) {
      this.filterParams.beginPubdate = value[0]
      this.filterParams.endPubdate = value[1]
    },
    async handleDelete(item) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$http({
          method: 'DELETE',
          url: `/articles/${item.id}`
        })
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.loadArticles()
      } catch (err) {
        if (err === 'cancel') {
          return this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
        this.$message.error('删除失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.filter-card {
  margin-bottom: 15px;
}
.article-list {
  margin-bottom: 30px;
}
</style>
