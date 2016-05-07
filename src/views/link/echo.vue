<template>
  <section>
    <div class="panel introducebg">
      <div class="introduce clearfix">
        <div class="pic">
          <img src="../../assets/images/amazon.png" alt="nest互联">
        </div>
        <div class="tips">
          <p>提示：amazon echo是亚马逊智能家庭网关中心，如可以响应用户的语音命令、播放音乐、阅读有声书籍、提供天气预报、发出烹饪和起床警报等。</p>
        </div>
      </div>
    </div>
    <div class="panel">
      <ul class="nestul">
        <li>
          <div class="nestli">
            <img src="../../assets/images/device_thumb.png">
            <div class="nestarea">
              <p class="nestname">nest thermostat</p>
              <div class="nestaction">
                <p class="nestinstro">coming soon……</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Devices_link',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {

      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../assets/stylus/common'
  .introducebg
    background-color #E4E4E4
    border none!important
    height 90px
  .introduce
    position relative
    .pic
      position absolute
      top 20px
      left 0
      display inline-block

    .tips
      font-size 12px
      display inline-block
      margin-left 156px
      margin-top 30px
      p
        margin 0
  .nestul
    li
      min-height 180px
      border-bottom 1px solid #E4E4E4
    li:last-child
      border-bottom none
  .nestli
    position relative
    padding 0 0 20px 0
    img
      position absolute
      top 20px
      left 10px
      width 120px
      height 120px
    .nestarea
      margin-left 150px
      padding-top 40px
      .nestaction
        i
          font-size 12px
          color #666666
          margin-left 10px
        b
          font-size 12px
          color #999999
  .editProduct
    margin-top 30px
    border 1px solid #E4E4E4
    background-color #F2F2F2
    box-sizing border-box
    padding 20px
    width 80%
  .form-row
    margin-bottom 20px
    label
      height 32px
      line-height 32px
  .form-actions
    button
      margin-left 25%
  .nestinstro
    color #999999
</style>
