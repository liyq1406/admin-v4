<template>
  <div class="panel major-clients-config">
    <div class="part onoff-server-box">
      <div class="pic-box">
        <i class="fa fa-desktop"></i>
      </div>
      <div class="text-box">
        <div class="describe">
          <span>通过独立入口配置，可实现大客户以独立的网址登陆云智易平台，并且可对其权限进行配置；如：可设定大客户访问界面UI、产品权限、功能权限等；</span>
        </div>
        <div class="control mt10">
          <span class="label mr20">开启独立入口服务</span>
          <switch></switch>
        </div>
      </div>
    </div>

    <div class="part form">
      <div class="panel-sub-hd bordered mb20">域名配置</div>
      <div class="form-row row pl10">
        <label class="form-control col-4">域名</label>
        <div class="controls col-20">
          <div class="input-text-wrap">
            <input type="text" class="input-text">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// import api from 'src/api'
// import formatDate from 'filters/format-date'

export default {
  name: 'config',

  components: {
  },

  data () {
    return {

    }
  },
  computed: {

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

  .major-clients-config
    padding 10px
    box-sizing border-box
    .part
      margin-bottom 30px
    .pl10
      padding-left 10px
      box-sizing border-box
    .onoff-server-box
      width 700px
      height 100px
      position relative
      padding-left 190px
      box-sizing border-box
      .pic-box
        width 190px
        min-height 100px
        line-height 60px
        position absolute
        left 0
        /*background red*/
        font-size 100px
        text-align center
      .text-box
        line-height 28px
</style>
