<template>
  <div class="main">
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="x-intro">提示：管理告警类型的类别。备注：每行设定一个问题类型，输入框为空时即默认为全部问题类型。</div>
        <div class="form">
          <div class="form-row">
            <div class="input-text-wrap">
              <textarea class="input-text" v-model="tags | formatTags"></textarea>
            </div>
          </div>
          <div class="form-action">
            <button class="btn btn-primary btn-lg" :class="{'disabled': setting}" :disabled="setting" @click.prevent="setTags">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'

export default {
  name: 'AlertSettings',

  data () {
    return {
      setting: false,
      tags: []
    }
  },

  route: {
    data () {
      this.getTags()
    }
  },

  methods: {
    getTags () {
      this.setting = true
      api.alert.getAlertTags().then((res) => {
        if (res.status === 200) {
          this.tags = res.data.tags
          this.setting = false
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    setTags () {
      var param = {
        tags: this.tags
      }
      this.setting = true
      if (this.tags.length > 8) {
        this.showNotice({
          type: 'error',
          content: '标签设置不能超过8个！'
        })
        this.setting = false
        return
      }
      api.alert.setAlertTags(param).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '标签设置成功！'
          })
          this.getTags()
          this.setting = false
        }
      }).catch((res) => {
        this.setting = false
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.x-intro
  background #eaedf2
  padding 10px 15px
  color #62878F

.form
  padding-top 10px

textarea.input-text
  height 300px
</style>
