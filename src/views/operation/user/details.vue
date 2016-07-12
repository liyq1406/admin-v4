<template>
  <div class="main">
    <div class="breadcrumb"><a v-link="{path: '/users'}" class="fa fa-arrow-circle-left">{{ $t('ui.user.list') }}</a></div>
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t('ui.user.details') }}</h2>
      </div>
      <div class="panel-bd">
        <ul class="info-details">
          <li class="row">
            <div class="col-3 label">{{ $t('ui.user.fields.id') }}:</div>
            <div class="col-21 info">{{ user.id }}</div>
          </li>
          <li class="row">
            <div class="col-3 label">{{ $t('ui.user.fields.account') }}:</div>
            <div class="col-21 info">{{ user.account }}</div>
          </li>
          <li class="row">
            <div class="col-3 label">{{ $t('ui.user.fields.nick_name') }}:</div>
            <div class="col-21 info">{{ user.nickname }}</div>
          </li>
          <li class="row">
            <div class="col-3 label">{{ $t('ui.user.fields.phone') }}:</div>
            <div class="col-21 info">{{ user.phone }}</div>
          </li>
          <li class="row">
            <div class="col-3 label">{{ $t('ui.user.fields.create_date') }}:</div>
            <div class="col-21 info">{{ user.create_date | formatDate }}</div>
          </li>
          <li class="row">
            <div class="col-3 label">{{ $t('ui.user.fields.active_date') }}:</div>
            <div class="col-21 info">{{ user.active_date | formatDate }}</div>
          </li>
          <li class="row">
            <div class="col-3 label">{{ $t('ui.user.fields.is_vaild') }}:</div>
            <div class="col-21 info">{{ user.is_vaild ? $t('ui.user.status.activate') :  $t('ui.user.status.deactivate') }}</div>
          </li>
          <li class="row">
            <div class="col-3 label">{{ $t('ui.user.fields.region_id') }}:</div>
            <div class="col-21 info">{{ user.region_id }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t('ui.user.devices_bound') }}</h2>
      </div>
      <div class="panel-bd">
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>{{ $t('ui.user.product_name') }}</th>
              <th>{{ $t('ui.user.device_mac') }}</th>
              <th>{{ $t('ui.user.device_status') }}</th>
              <th>{{ $t('ui.user.device_authorize_code') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subDevice in subDevices">
              <td>{{ subDevice.product_id }}</td>
              <!--这里使用产品id 不是产品名称 debug-->
              <td>{{ subDevice.mac }}</td>
              <td><span v-if="subDevice.is_online==true">{{ $t('common.online') }}</span><span v-else>{{ $t('common.offline') }}</span></td>
              <td>{{ subDevice.authorize_code }}</td>
            </tr>
            <tr v-if="subDevices.length === 0">
              <td colspan="4" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                <div v-else class="tips-null">{{ $t('ui.user.no_devices_bound') }}</div>
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
</template>

<script>
  import api from 'api'
  import { globalMixins } from 'src/mixins'

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
          api.user.banMember(this.user.id).then((res) => {
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
