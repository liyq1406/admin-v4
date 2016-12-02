<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.user.details.major.main_title') }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <div class="alert-record-summary">
            <div class="fl">
              <h1 class="mt10">
                <span class="major-client-name">{{ majorClient.name }}</span>
                <a class="icon-edit-major-client" v-link="'/operation/major-client/edit/' + $route.params.id">
                  <i class="fa fa-edit"></i>
                </a>
              </h1>
            </div>
            <div class="btnarea clearfix">
              <button @click.prevent.stop="toggle" class="mt20">
                <!-- <i class="fa fa-check"></i> -->
                <span v-if="majorClient.status===0">已停用</span>
                <span v-else>已启用</span>
              </button>
            </div>
          </div>
          <div v-stretch="182">
            <info-list :info="clientsInfo"></info-list>
          </div>
        </div>
        <div class="col-8 with-loading">
          <div class="position-map ml30 mt10">
            <x-map :addr="area" :zoom="majorClient.location?15:10" height="220px"></x-map>
          </div>
          <div class="position-msg ml30">
            <span> {{ area }} </span>
          </div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
import api from 'api'
import formatDate from 'filters/format-date'
import locParser from 'utils/location-parser'

export default {
  name: 'MajorClients',
  components: {
  },

  data () {
    return {
      // 当前大客户详情
      majorClient: {},
      secondaryNav: [],
      breadcrumbNav: [{
        label: '全部',
        link: '/operation/major-clients'
      }, {
        label: '客户信息'
      }],
      area: ''
    }
  },

  computed: {
    clientsInfo () {
      var result = {
        name: {
          label: this.$t('operation.user.details.contacter'),
          value: this.majorClient.contacter
        },
        phone: {
          label: this.$t('common.phone'),
          value: this.majorClient.contact_way
        },
        industry: {
          label: this.$t('operation.user.details.industry'),
          value: this.majorClient.industry
        },
        create_time: {
          label: this.$t('operation.user.details.create_date'),
          value: formatDate(this.majorClient.create_time)
        },
        area: {
          label: this.$t('operation.user.details.area'),
          value: this.area
        },
        location: {
          label: this.$t('operation.user.details.address'),
          value: this.majorClient.location
        }
      }
      return result
    }
  },

  route: {
    data (transition) {
      this.getMajorClient()
      let deviceDetailRoot = `/operation/major-clients/${this.$route.params.id}`

      return {
        secondaryNav: [{
          label: '设备列表',
          link: { path: `${deviceDetailRoot}/device` }
        }, {
          label: '账户管理',
          link: { path: `${deviceDetailRoot}/account` }
        }, {
          label: '组织架构',
          link: { path: `${deviceDetailRoot}/organization` }
        }, {
          label: '独立入口配置',
          link: { path: `${deviceDetailRoot}/config` }
        }]
      }
    }
  },

  methods: {
    toggle () {
      let status
      if (this.majorClient.status === 0) {
        status = 1
      } else {
        status = 0
      }
      api.heavyBuyer.setHeavyBuyerStatus(this.$route.params.id, status).then((res) => {
        if (res.status === 200) {
          // 设置成功
          this.getMajorClient()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    getMajorClient () {
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
          'city',
          'status'
        ],
        limit: 1,
        query: {
          'id': { $in: [this.$route.params.id] }
        }
      }
      api.heavyBuyer.getHeavyBuyer(params).then((res) => {
        this.loadingData = false
        this.majorClient = res.data.list[0]
        locParser.parse(this.majorClient.country || '', this.majorClient.province || '', this.majorClient.city || '', '', this.lang).then((res) => {
          if (res) {
            let loc
            if (res.country) {
              loc = res.country + ' '
            }
            if (res.state) {
              loc = loc + res.state + ' '
            }
            if (res.city) {
              loc = loc + res.city
            }
            this.area = loc
          }
        }).catch((res) => {
          // console.log(res)
        })
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
@import '../../../../assets/stylus/common'
  .position-map
    box-sizing border-box
  .position-msg
    padding-left 10px
    padding-top 5px
  .major-client-name
    display inline-block
    max-width 300px
    word-wrap normal
    white-space nowrap
    text-overflow ellipsis
  .icon-edit-major-client
    vertical-align text-bottom
  .btnarea
    button
      border 1px solid #bcbcbc
      outline none
      background-color #fafafa
      color #323232
      height 24px
      float right
      margin-right 20px
</style>
