<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>设置</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="x-intro">提示：管理用户反馈的问题类别。备注：每行设定一个问题类型，输入框为空时即默认为全部问题类型。</div>
        <div class="form">
          <div class="form-row">
            <div class="input-text-wrap">
              <textarea class="input-text"></textarea>
            </div>
          </div>
          <div class="form-action">
            <button class="btn btn-primary btn-lg">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../mixins'

export default {
  name: 'Settings',

  mixins: [globalMixins, pluginMixins]
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
