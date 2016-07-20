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
              <h1>深圳市腾讯计算机系统有限公司</h1>
            </div>
          </div>
          <div v-stretch="230">
            <info-list :info="deviceInfo"></info-list>
          </div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Tab from 'components/Tab'
import InfoCard from 'components/InfoCard'
import InfoList from 'components/InfoList'
import Breadcrumb from 'components/Breadcrumb'

export default {
  name: 'MajorClients',

  mixins: [globalMixins],

  components: {
    Tab,
    Breadcrumb,
    InfoCard,
    InfoList
  },

  data () {
    return {
      alertSummary: {},
      deviceInfo: {
        link: {
          label: '联系人',
          value: '马化腾'
        },
        phone: {
          label: '联系方式',
          value: 13800138000
        },
        work: {
          label: '行业',
          value: '互联网行业'
        },
        createTime: {
          label: '创建时间',
          value: '2016-09-17 09:16:09'
        },
        area: {
          label: '所在地区',
          value: '广东 深圳'
        },
        address: {
          label: '详细地址',
          value: '腾讯大楼'
        }
      },
      secondaryNav: [],
      breadcrumbNav: [{
        label: '大客户管理',
        link: '/operation/users/major-clients'
      }, {
        label: '当前'
      }]
    }
  },

  route: {
    data (transition) {
      var majorRoot = `/operation/users/major-clients/${this.$route.params.id}`

      return {
        secondaryNav: [{
          label: '设备列表',
          link: { path: `${majorRoot}` }
        }, {
          label: '维保信息',
          link: { path: `${majorRoot}` }
        }, {
          label: '反馈记录',
          link: { path: `${majorRoot}` }
        }]
      }
    }
  }
}
</script>
