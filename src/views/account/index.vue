<template>
  <div class="page-in account-page">
    <div class="main-title bordered">
      <h2>{{ $t("layout.my_account") }}</h2>
    </div>
    <div class="sec-nav mt30">
      <ul>
        <li class="sec-nav-item">
          <a v-link="{path: '/account/info'}"><i class="fa fa-user"></i>{{ $t("layout.account_menu.account") }}</a>
        </li>
        <li class="sec-nav-item" v-if="currentMember.role && currentMember.role===1">
          <a v-link="{path: '/account/members'}"><i class="fa fa-users"></i>{{ $t("layout.account_menu.members") }}</a>
        </li>
        <li class="sec-nav-item" v-if="currentMember.role && currentMember.role===1">
          <a v-link="{path: '/account/authorize'}"><i class="fa fa-expeditedssl"></i>{{ $t("layout.account_menu.authorize") }}</a>
        </li>
        <li class="sec-nav-item" v-if="currentMember.role && currentMember.role===1">
          <a v-link="{path: '/account/security'}"><i class="fa fa-shield"></i>{{ $t("layout.account_menu.security") }}</a>
        </li>
        <li class="sec-nav-item">
          <a v-link="{path: '/account/corp'}"><i class="fa fa-newspaper-o"></i>{{ $t("layout.account_menu.corp") }}</a>
        </li>
      </ul>
    </div>
    <section class="main-wrap">
      <!-- Start: 路由视图 -->
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
      <!-- End: 路由视图 -->
    </section>
  </div>
</template>

<script>
export default {
  name: 'Account',

  layouts: ['topbar', 'account-sidebar'],
  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  data () {
    return {
      nav: [{
      }]
    }
  },

  ready () {
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/stylus/common'

.account-page
  background-color #FFF

  .main-wrap
    top 57px
    border-left 1px solid light-border-color

.sec-nav
  position relative
  z-index 1

  .sec-nav-item
    .v-link-active
      background-color #F3F3F3
      color gray-dark
      position relative

      &:before
        absolute right -15px top 50%
        margin-top -7px
        content ""
        triangle #D3D3D3 14px right

      &:after
        absolute right -14px top 50%
        margin-top -7px
        content ""
        triangle #F3F3F3 14px right
</style>

<style lang="css" scoped>
  /*为ie加的hack*/
  .main-wrap{
  	z-index: 2\0
  }
</style>
