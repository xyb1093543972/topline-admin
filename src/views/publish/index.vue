<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>发布文章</span>
      <div>
        <el-button type="success" @click='handlePublish(false)'>发布</el-button>
        <el-button type="primary" @click='handlePublish(true)'>存入草稿</el-button>
      </div>
    </div>
    <el-row>
      <el-col :span="10">
        <!-- 表单 -->
        <el-form ref="form" :model="articleForm" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="articleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" v-model="articleForm.content"></el-input>
          </el-form-item>
          <el-form-item label="封面">
            <!-- <el-radio-group>
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group> -->
          </el-form-item>
          <el-form-item label="频道">
            <article-channel v-model="articleForm.channel_id"></article-channel>
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-form-item>
        </el-form>
        <!-- /表单 -->
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import articleChannel from '@/components/article-channel'
export default {
  components: {
    articleChannel
  },
  data() {
    return {
      articleForm: {
        title: '',
        content: '',
        channel_id: 3,
        cover: {
          type: 0,
          images: []
        }
      }
    }
  },
  methods: {
    async handlePublish(draft) {
      try {
        await this.$http({
          method: 'POST',
          url: '/articles',
          params: {
            draft
          },
          data: this.articleForm
        })
        this.$message({
          message: '发布成功',
          type: 'success'
        })
      } catch (err) {
        this.$message.error('发布失败', err)
      }
    }
  }
}
</script>
<style lang='less' scoped>
.publish-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
