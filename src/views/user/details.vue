<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/users'}" class="fa fa-arrow-circle-left">{{ $t('user.list') }}</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t('user.details') }}</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">{{ $t('user.fields.id') }}:</div>
              <div class="info">{{ user.id }}</div>
            </li>
            <li>
              <div class="label">{{ $t('user.fields.account') }}:</div>
              <div class="info">{{ user.account }}</div>
            </li>
            <li>
              <div class="label">{{ $t('user.fields.nick_name') }}:</div>
              <div class="info">{{ user.nickname }}</div>
            </li>
            <li>
              <div class="label">{{ $t('user.fields.phone') }}:</div>
              <div class="info">{{ user.phone }}</div>
            </li>
            <li>
              <div class="label">{{ $t('user.fields.create_date') }}:</div>
              <div class="info">{{ user.create_date | formatDate }}</div>
            </li>
            <li>
              <div class="label">{{ $t('user.fields.active_date') }}:</div>
              <div class="info">{{ user.active_date | formatDate }}</div>
            </li>
            <li>
              <div class="label">{{ $t('user.fields.is_vaild') }}:</div>
              <div class="info">{{ user.is_vaild ? $t('user.status.activate') :  $t('user.status.deactivate') }}</div>
            </li>
            <li>
              <div class="label">{{ $t('user.fields.region_id') }}:</div>
              <div class="info">{{ user.region_id }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t('user.devices_bound') }}</h2>
        </div>
        <div class="panel-bd">
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t('user.product_name') }}</th>
                <th>{{ $t('user.device_mac') }}</th>
                <th>{{ $t('user.device_status') }}</th>
                <th>{{ $t('user.device_authorize_code') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subDevice in subDevices">
                <td>{{ subDevice.product_id }}</td>
                <!--这里使用产品id 不是产品名称 debug-->
                <td>{{ subDevice.mac }}</td>
                <td><span v-if="subDevice.is_online==true">{{ $t('common.online') }}</span><span v-else="v-else">{{ $t('common.offline') }}</span></td>
                <td>{{ subDevice.authorize_code }}</td>
              </tr>
              <tr v-if="subDevices.length === 0">
                <td colspan="4" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                  <div v-else="v-else" class="tips-null">{{ $t('user.no_devices_bound') }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-bd">
          <button :class="{'btn-primary': user.status-0===1, 'btn-success': user.status-0===2, 'disabled': toggling}" :disabled="toggling" @click="toggleMember(user)" class="btn sxten"><i :class="{'fa-stop': user.status, 'fa-play': !user.status}" class="fa"></i>{{ user.status-0===1 ? '停用' : '启用' }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import api from '../../api'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'UserDetails',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'api': api
    },

    data () {
      return {
        user: {}, // 用户信息
        subDevices: [] // 用户绑定设备列表
      }
    },

    route: {
      data () {
        this.getUserInfo()
        this.getSubDevices()
      }
    },

    methods: {
      getUserInfo () {
        api.user.profile(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.user = res.data
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      getSubDevices () {
        api.user.subDeviceList(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.subDevices = res.data
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      deleteUser () {
        if (window.confirm('确定要停用当前用户吗？')) {
          var user_id = this.user.id
          api.user.banMember(user_id).then((res) => {
            if (res.status === 200) {
              console.log('已停用用户')
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      },

      // 新版切换状态
      toggleMember (user) {
        if (!this.toggling) {
          this.toggling = true
          api.user.toggleMember(user.id, user.status - 0 === 1 ? 2 : 1).then((res) => {
            // this.getTasks()
            if (res.status === 200) {
              user.status = user.status - 0 === 1 ? 2 : 1
            }
            this.toggling = false
          }).catch((res) => {
            this.handleError(res)
            this.toggling = false
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.sxten
  margin-top 10px
  margin-bottom 10px
</style>
