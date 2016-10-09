<template>
  <div class="main">
    <div class="main-title">
      <h2>大客户管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <div class="alert-record-summary">
            <div class="up">
              <h1 class="mt10">{{ majorClient.name }}</h1>
            </div>
          </div>
          <div v-stretch="182">
            <info-list :info="clientsInfo"></info-list>
          </div>
        </div>
        <div class="col-8 with-loading">
          <div class="position-map ml30 mt10">
            <x-map :addr="(majorClient.city || '') + majorClient.location" :zoom="majorClient.location?15:10" height="220px"></x-map>
          </div>
          <div class="position-msg ml30">
            <span v-show="majorClient.province"> {{ (majorClient.province + ' ' + (majorClient.city || '')) }} </span>
          </div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    <!-- <div class="panel">
      <div class="panel-hd panel-hd-full">
        <h2>账号状态</h2>
      </div>
      <div class="panel-bd">
        <span>{{ clientsInfo.status-0===1 ? '已启用' : '已停用' }}</span>
        <button :class="{'btn-primary': clientsInfo.status-0===1, 'btn-success': clientsInfo.status-0===2, 'disabled': toggling}" :disabled="toggling" @click="toggleMember(clientsInfo)" class="btn btn-sm"><i :class="{'fa-stop': clientsInfo.status, 'fa-play': !clientsInfo.status}" class="fa"></i>{{ clientsInfo.status-0===1 ? '停用' : '启用' }}</button>
      </div>
    </div> -->
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import Tab from 'components/Tab'
import InfoCard from 'components/InfoCard'
import InfoList from 'components/InfoList'
import Breadcrumb from 'components/Breadcrumb'
import { formatDate } from 'filters/format-date'
import Map from 'components/Map'

export default {
  name: 'MajorClients',

  mixins: [globalMixins],

  components: {
    Tab,
    Breadcrumb,
    InfoCard,
    'x-map': Map,
    InfoList
  },

  data () {
    return {
      // 当前大客户详情
      majorClient: {},
      secondaryNav: [],
      breadcrumbNav: [{
        label: '大客户管理',
        link: '/operation/users/major-clients'
      }, {
        label: '当前'
      }]
    }
  },

  computed: {
    clientsInfo () {
      var result = {
        name: {
          label: '联系人',
          value: this.majorClient.name
        },
        phone: {
          label: '联系电话',
          value: this.majorClient.phone
        },
        industry: {
          label: '行业',
          value: this.majorClient.industry
        },
        email: {
          label: '邮箱',
          value: this.majorClient.email
        },
        create_time: {
          label: '创建时间',
          value: formatDate(this.majorClient.create_time)
        },
        area: {
          label: '所在地区',
          value: `${this.majorClient.country || ''}${this.majorClient.province || ''}${this.majorClient.city || ''}`
        },
        location: {
          label: '详细地址',
          value: this.majorClient.location
        }
      }
      return result
    }
  },

  route: {
    data (transition) {
      this.getMajorClient()
      var majorRoot = `/operation/users/major-clients/${this.$route.params.id}`

      return {
        secondaryNav: [{
          label: '设备列表',
          link: { path: `${majorRoot}/devices` }
        // }, {
        //   label: '经销商',
        //   link: { path: `${majorRoot}/dealers` }
        }]
      }
    }
  },

  methods: {
    getMajorClient () {
      console.log('获取大客户列表')
      this.loadingData = true
      var params = {
        filter: [
          'id',
          'name',
          'email',
          'phone',
          'industry',
          'location',
          'contacter',
          'create_time',
          'country',
          'province',
          'city'
        ],
        limit: 1,
        query: {
          'id': { $in: [this.$route.params.id] }
        }
      }
      api.heavyBuyer.getHeavyBuyer(params).then((res) => {
        this.loadingData = false
        this.majorClient = res.data.list[0]
        this.total = res.data.count
      }).catch((err) => {
        this.loadingData = false
        this.handleError(err)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .position-map
    box-sizing border-box
  .position-msg
    padding-left 10px
    padding-top 5px
</style>
