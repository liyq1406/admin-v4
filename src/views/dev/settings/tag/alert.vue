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
            <button class="btn btn-primary btn-lg" @click.prevent="">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
// import api from 'api'

export default {
  name: 'AlertSettings',

  mixins: [globalMixins],

  data () {
    return {
      tags: []
    }
  },

  route: {
    data () {
    }
  },

  methods: {
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
