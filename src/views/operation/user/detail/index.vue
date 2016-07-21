<template>
  <div class="main">
    <div class="main-title">
      <h2>用户基本信息</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card :info="userSummary"></info-card>
          <div v-stretch="182">
            <info-list :info="userInfo"></info-list>
          </div>
        </div>
        <div class="col-8 device-map with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div id="user-map" class="mt10" style="height: 220px"></div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    <div class="panel">
      <div class="panel-hd panel-hd-full">
        <h2>账号状态</h2>
      </div>
      <div class="panel-bd">
        <span>{{ user.status-0===1 ? '已启用' : '已停用' }}</span>
        <button :class="{'btn-primary': user.status-0===1, 'btn-success': user.status-0===2, 'disabled': toggling}" :disabled="toggling" @click="toggleMember(user)" class="btn btn-sm"><i :class="{'fa-stop': user.status, 'fa-play': !user.status}" class="fa"></i>{{ user.status-0===1 ? '停用' : '启用' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  import { globalMixins } from 'src/mixins'
  import Breadcrumb from 'components/Breadcrumb'
  import InfoCard from 'components/InfoCard'
  import InfoList from 'components/InfoList'
  import Tab from 'components/Tab'

  export default {
    name: 'UserDetails',

    mixins: [globalMixins],

    components: {
      'api': api,
      Breadcrumb,
      InfoCard,
      InfoList,
      Tab
    },

    data () {
      return {
        user: {}, // 用户信息
        userInfo: {
          status: {},
          create_time: {},
          email: {},
          phone: {},
          age: {},
          sex: {},
          area: {},
          address: {},
          Id: {}
        },
        breadcrumbNav: [{
          label: '全部',
          link: '/operation/users/list'
        }, {
          label: '用户信息'
        }],
        userSummary: {},
        secondaryNav: []
      }
    },

    route: {
      data () {
        this.getUserInfo()

        var deviceDetailRoot = `/operation/users/details/${this.$route.params.id}`
        return {
          secondaryNav: [{
            label: '设备列表',
            link: { path: `${deviceDetailRoot}/devices` }
          }, {
            label: '维保信息',
            link: { path: `${deviceDetailRoot}/warranty` }
          }, {
            label: '反馈记录',
            link: { path: `${deviceDetailRoot}/issues` }
          }]
        }
      }
    },

    methods: {
      // getUserInfo () {
      //   api.user.profile(this.$route.params.id).then((res) => {
      //     if (res.status === 200) {
      //       // this.user = res.data
      //       this.userInfo.status = {
      //         label: '账号状态',
      //         value: res.data.status - 1 ? '停用' : '启用'
      //       }
      //       this.userInfo.create_time = {
      //         label: '创建时间',
      //         value: this.formatDate(res.data.create_date)
      //       }
      //       // TODO 接口字段缺失
      //       this.userInfo.email = {
      //         label: '邮箱',
      //         value: '12345@qq.com'
      //       }
      //       // TODO 接口字段缺失
      //       this.userInfo.phone = {
      //         label: '手机',
      //         value: '13800138000'
      //       }
      //       // TODO 接口字段缺失
      //       this.userInfo.age = {
      //         label: '年龄',
      //         value: '20'
      //       }
      //       // TODO 接口字段缺失
      //       this.userInfo.sex = {
      //         label: '性别',
      //         value: '男'
      //       }
      //       // TODO 接口字段缺失
      //       this.userInfo.area = {
      //         label: '所在区域',
      //         value: '广东省广州市天河区'
      //       }
      //       // TODO 接口字段缺失
      //       this.userInfo.address = {
      //         label: '详细地址',
      //         value: '海珠区聚德路龙腾18园'
      //       }
      //       this.userInfo.Id = {
      //         label: 'ID',
      //         value: res.data.id
      //       }
      //       // TODO 接口字段缺失
      //       this.userSummary = {
      //         title: '用户昵称',
      //         online: res.data.status - 1 ? '停用' : '启用',
      //         time: this.formatDate(res.data.create_date)
      //       }
      //     }
      //   }).catch((res) => {
      //     this.handleError(res)
      //   })
      // },
      getUserInfo () {
        // this.user = res.data
        this.userInfo.status = {
          label: '账号状态',
          value: '停用'
        }
        this.userInfo.create_time = {
          label: '创建时间',
          value: '2016-07-18 17:32:22'
        }
        // TODO 接口字段缺失
        this.userInfo.email = {
          label: '邮箱',
          value: '12345@qq.com'
        }
        // TODO 接口字段缺失
        this.userInfo.phone = {
          label: '手机',
          value: '13800138000'
        }
        // TODO 接口字段缺失
        this.userInfo.age = {
          label: '年龄',
          value: '20'
        }
        // TODO 接口字段缺失
        this.userInfo.sex = {
          label: '性别',
          value: '男'
        }
        // TODO 接口字段缺失
        this.userInfo.area = {
          label: '所在区域',
          value: '广东省广州市天河区'
        }
        // TODO 接口字段缺失
        this.userInfo.address = {
          label: '详细地址',
          value: '海珠区聚德路龙腾18园'
        }
        this.userInfo.Id = {
          label: 'ID',
          value: '1234'
        }
        // TODO 接口字段缺失
        this.userSummary = {
          title: 'xiaobai',
          online: true,
          time: '2016-07-18 17:32:01'
        }
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
