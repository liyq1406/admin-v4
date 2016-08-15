<template>
  <div class="main">
    <div class="main-title bordered">
      <div class="title-wrap upgrade-warning-wrap">
        <h2>升级管理</h2>
        <div class="upgrade-warning">
          <!-- <i class="fa fa-warning"></i> -->
          (提示：app升级功能目前仅限Android程序使用)
        </div>
      </div>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="row">
          <div class="col-5 upgrade-app-wrap">
            <div @click="selectApp($index)" class="upgrade-app" :class="[$index === curIndex ? 'select-app' : '']" v-for="i in 4">
              <div class="row">
                <a v-link="{path: '/dev/apps/upgrade/123'}">
                  <!-- <div class="col-3 select-icon">
                    <i class="fa fa-check-square-o"></i>
                  </div> -->
                  <div class="left-distribution">
                    <div class="name" :class="[$index === curIndex ? 'select-title' : '']">26度佳</div>
                    <div class="version">
                      <label>[当前版本]</label>
                      <span>v2.0</span>
                    </div>
                    <!-- <div class="distribution">
                      <label>[版本描述]</label>
                      <span>bug fix ；增加用户反馈</span>
                    </div> -->
                  </div>
                  <!-- <div class="col-3 right-icon">
                    <i class="fa fa-cloud-upload"></i>
                  </div>
                  <div class="col-3 right-icon">
                    <i class="fa fa-clock-o"></i>
                  </div> -->
                </a>
              </div>
            </div>
          </div>
          <div class="col-19">
            <router-view transition="view" transition-mode="out-in" class="view"></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Data',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
    },

    data () {
      return {
        curIndex: 0
      }
    },

    route: {
      data () {
        this.$route.router.go('/dev/apps/upgrade/123')
      }
    },
    methods: {
      selectApp (index) {
        this.curIndex = index
      }
    }
  }
</script>
<style lang="stylus">
@import '../../../assets/stylus/common'
.upgrade-warning-wrap
  position relative
  .upgrade-warning
    display inline-block
    margin 10px 0 0 10px
    color #666666
    i
      color #EB4F38
      margin-right 5px
.upgrade-app-wrap
  position relative
  .upgrade-app
    background-color #F2F2F2
    border 1px solid #E8E8E8
    border-right none
    margin-bottom 15px
    position relative
    .select-icon
      i
        margin-top 13px
        margin-left 15px
        font-size 18px
    .left-distribution
      margin-left 10px
      label, span
        line-height 22px
      padding 10px 0
      .version, .distribution
        color #BCBCBC
    .right-icon
      padding-left 5px
      opacity 0.7
      i
        font-size 40px
        line-height 80px
        margin-left 5px
    a
    &:hover
      color #666 !important
      text-decoration none

.select-app
  background-color white !important
  margin-right -1px !important
  border-right none !important
  z-index 1
.select-title
  font-size 14px
  font-weight 700
  font-color #333333
</style>
