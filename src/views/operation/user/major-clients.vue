<template>
  <div class="main major-clients">
    <div class="main-title">
      <h2>大客户管理</h2>
    </div>

    <div class="row statistic-group">
      <div class="col-6">
        <statistic :info="majorSummary.monthIncrease" :title="majorSummary.monthIncrease.title" :has-target="true" align="left">
          <div slot="targetArea">{{majorSummary.monthIncrease.target.title}}:{{majorSummary.monthIncrease.target.value}} <i class="change-reduse">({{majorSummary.monthIncrease.target.change}})</i></div>
        </statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.number" :title="majorSummary.number.title" :has-target="true" align="left">
          <div slot="targetArea">{{majorSummary.monthIncrease.target.title}}:{{majorSummary.monthIncrease.target.value}} <i class="change-reduse">({{majorSummary.monthIncrease.target.change}})</i></div>
        </statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.completion" :title="majorSummary.completion.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.percent" :title="majorSummary.percent.title" align="left" :has-action="true">
        </statistic>
      </div>
    </div>
    <div class="panel mt20">
      <!-- <div class="panel-hd">
        <h2>用户趋势</h2>
      </div> -->
      <div class="panel-bd">
        <div class="filter-bar filter-bar-head">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
            </div>
            <div class="filter-group-item">
              <date-time-range-picker></date-time-range-picker>
            </div>
            <div class="filter-group-item">
              <radio-button-group :items="locales.data.PERIODS" :value.sync="7"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
            </div>
          </div>
        </div>
        <time-line :data="trends" :type="'smooth'"></time-line>
      </div>
    </div>
    <div class="panel mt10">
      <div class="panel-hd">
        <div class="actions">
          <button class="btn btn-primary" @click="onShowAddModal">
            <i class="fa fa-plus"></i>
            新增大客户
          </button>
        </div>
        <h2>大客户列表</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <v-select :label="selectedFilterIndustry || '全部'" width='110px' size="small">
                  <span slot="label">显示</span>
                  <select v-model="selectedFilterIndustry" @change="getMajorClient">
                    <option :value="">全部</option>
                    <option v-for="industry in industrys" :value="industry">{{industry}}</option>
                  </select>
                </v-select>
              </div>
            </div>
            <div class="filter-group fr">
              <search-box :key.sync="query" :active="searching" :placeholder="'搜索客户名称'" @cancel="getMajorClient(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getMajorClient(true)">
                <button slot="search-button" @click="getMajorClient(true)" class="btn btn-primary"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @theader-device-sum="sortBySomeKey" @theader-create-time="sortBySomeKey" @tbody-name="goDetails">
            <!-- <div class="select-box" slot="theader-industry">
              <v-select label="行业" width='80px' size="small">
              </v-select>
            </div> -->
          </c-table>
        </div>
      </div>
    </div>
    <modal :show.sync="showAddModal" @close="onAddCancel" width="524px">
      <h3 slot="header">添加大客户</h3>
      <div slot="body" class="form">
        <validator name="majorClientValidation">
          <form @submit.prevent="addMajorClient">
            <div class="form-row row">
              <label class="form-control col-6">客户名称:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入名称'" class="input-text-wrap">
                  <input v-model="addModal.name" type="text" name="addModal.name" v-validate:name="{required: true}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.name.touched && $majorClientValidation.name.required">名称为必填</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">联系人:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入联系人'" class="input-text-wrap">
                  <input v-model="addModal.contacter" type="text" name="contacter" v-validate:contacter="{required: false}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.contacter.touched && $majorClientValidation.contacter.required">联系人为必填</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">联系电话:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入联系电话'" class="input-text-wrap">
                  <input v-model="addModal.phone" type="text" name="phone" v-validate:phone="{required: true}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.phone.touched && $majorClientValidation.phone.required">联系电话为必填</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">邮箱:</label>
              <div class="controls col-18">
                <div v-placeholder="'请输入邮箱'" class="input-text-wrap">
                  <input v-model="addModal.email" type="text" name="email" v-validate:email="{required: true}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.email.touched && $majorClientValidation.email.required">邮箱为必填</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">行业:</label>
              <div class="controls filter-group-item col-18">
                <v-select :label="addModal.industry">
                  <select v-model="addModal.industry">
                    <option v-for="industry in industrys" :value="industry">{{industry}}</option>
                  </select>
                </v-select>
                <!-- <div v-placeholder="'请输入行业'" class="input-text-wrap">
                  <input v-model="addModal.industry" type="text" name="addModal.industry" v-validate:industry="{required: true}" class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.industry.touched && $majorClientValidation.industry.required">行业为必填</span>
                </div> -->
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">所在地:</label>
              <div class="controls col-18">
                <div class="clearfix">
                  <!-- 国家 -->
                  <div class="fl mr5 w120">
                    <div v-placeholder="'国家'" class="input-text-wrap">
                      <input v-model="addModal.country" type="text" name="country" v-validate:country="{required: false}" class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$majorClientValidation.country.touched && $majorClientValidation.country.required">国家为必填</span>
                    </div>
                  </div>
                  <!-- 省份 -->
                  <div class="fl mr5 w120">
                    <div v-placeholder="'省份'" class="input-text-wrap">
                      <input v-model="addModal.province" type="text" name="province" v-validate:province="{required: true}" class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$majorClientValidation.province.touched && $majorClientValidation.province.required">省份为必填</span>
                    </div>
                  </div>
                  <!-- 城市 -->
                  <div class="fl w120">
                    <div v-placeholder="'城市'" class="input-text-wrap">
                      <input v-model="addModal.city" type="text" name="city" v-validate:city="{required: true}" class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$majorClientValidation.city.touched && $majorClientValidation.city.required">城市为必填</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">详细地址:</label>
              <div class="controls col-18">
                <!-- 地址 -->
                <div v-placeholder="'请输入地址'" class="input-text-wrap">
                  <textarea v-model="addModal.location" type="text" name="location" v-validate:location="{required: true}" class="input-text"></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$majorClientValidation.location.touched && $majorClientValidation.location.required">地址为必填</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
  </div>
</template>

<script>
import api from 'api'
import SearchBox from 'components/SearchBox'
import Select from 'components/Select'
import Table from 'components/Table'
import { globalMixins } from 'src/mixins'
import Statistic from 'components/Statistic'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Modal from 'components/Modal'
import { formatDate } from 'src/filters'
import Mock from 'mockjs'
import _ from 'lodash'

export default {
  name: 'MajorClients',

  mixins: [globalMixins],

  components: {
    'search-box': SearchBox,
    'v-select': Select,
    'c-table': Table,
    'modal': Modal,
    Statistic,
    RadioButtonGroup,
    DateTimeRangePicker,
    TimeLine
  },

  data () {
    return {
      query: '',
      searching: false,
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      loadingData: false,
      showAddModal: false,
      // 已选的行业(过滤条件)
      selectedFilterIndustry: '',
      industrys: [
        '互联网',
        '信息安全',
        '空气净化',
        '游戏运营',
        '快消品',
        '通信电子'
      ],
      addModal: {
        // 名称
        name: '',
        // 联系人
        contacter: '',
        // 联系电话
        phone: '',
        // 邮箱
        email: '',
        // 行业
        industry: '',
        // 国家
        country: '',
        // 省份
        province: '',
        // 城市
        city: '',
        // 地址
        location: ''
      },
      majorSummary: {
        monthIncrease: {
          total: 38,
          change: 21,
          title: '月新增数',
          target: {
            title: '年目标',
            value: 39292,
            change: -245
          }
        },
        number: {
          total: 318,
          title: '年大客户数'
        },
        completion: {
          total: 54,
          unit: '%',
          change: 23,
          title: '年大客户目标完成率'
        },
        percent: {
          total: 38,
          unit: '%',
          change: 24,
          title: '大客户占比'
        }
      },
      trends: null,
      majorClients: [ // 下面的假数据不要删掉！！！！！！注释掉就行
        // {
        //   'id': 111,
        //   'name': 'Google',
        //   'email': '邮箱地址',
        //   'phone': '手机',
        //   'industry': '互联网',
        //   'location': '美国洛杉矶',
        //   'contacter': 'jon',
        //   'contact_way': '158023234',
        //   'status': 0,
        //   'create_time': '2015-10-09T08:15:40.843Z'
        // },
        // {
        //   'id': 222,
        //   'name': 'Google',
        //   'email': '邮箱地址',
        //   'phone': '手机',
        //   'industry': '互联网',
        //   'location': '美国洛杉矶',
        //   'contacter': 'jon',
        //   'contact_way': '158023234',
        //   'status': 0,
        //   'create_time': '2015-10-09T08:15:40.843Z'
        // }
      ],
      headers: [
        {
          key: 'name',
          title: '客户名称'
        },
        {
          key: 'device_sum',
          title: '设备数',
          sortType: -1
        },
        {
          key: 'industry',
          title: '行业',
          class: 'tac'
        },
        {
          key: 'contacter',
          title: '联系人'
        },
        {
          key: 'phone',
          title: '联系电话'
        },
        {
          key: 'create_time',
          title: '创建时间',
          sortType: -1
        }
      ],
      // 当前用于排序的字段
      sortKey: ''
    }
  },
  computed: {
    /**
     * 分页对象
     * @return {[type]} [description]
     */
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    /**
     * 表格内容对象
     * @return {[type]} [description]
     */
    tables () {
      var result = []
      this.majorClients.map((item) => {
        var majorClient = {
          name: '<a class="hl-red">' + item.name + '</a>',
          device_sum: item.device_sum,
          industry: item.industry,
          contacter: item.contacter,
          phone: item.phone,
          create_time: formatDate(item.create_time),
          prototype: item
        }
        result.push(majorClient)
      })
      return result
    },
    /**
     * 获取大客户列表的条件
     * @return {[type]} [description]
     */
    queryCondition () {
      var condition = {
        filter: [
          'id',
          'name',
          'email',
          'phone',
          'industry',
          'location',
          'contacter',
          'contact_way',
          'status',
          'create_time',
          'device_sum'
        ],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {}
      }
      /**
       * 搜索框搜索
       * @param  {[type]} this.query [description]
       * @return {[type]}            [description]
       */
      if (this.query) {
        condition.query['name'] = { $like: [this.query] }
      }
      // 下拉框筛选
      if (this.selectedFilterIndustry) {
        condition.query['industry'] = { $in: [this.selectedFilterIndustry] }
      }

      this.headers.map((item) => {
        if (item.sortType && (item.key === this.sortKey)) {
          condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return condition
    }
  },

  route: {
    data () {
      this.getMajorClient()
    }
  },
  ready () {
    this.trends = Mock.mock({
      'list|14': [{
        'date|+1': [
          new Date(2016, 7, 15),
          new Date(2016, 7, 16),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21)
        ],
        'count|+1': [6, 8, 9, 3, 9, 3, 9]
      }]
    }).list
  },
  methods: {
    /**
     * 获取大客户列表
     * @return {[type]} [description]
     */
    getMajorClient () {
      console.log('获取大客户列表')
      this.loadingData = true
      api.heavyBuyer.getHeavyBuyer(this.queryCondition).then((res) => {
        this.loadingData = false
        this.majorClients = res.data.list
        this.total = res.data.count
      }).catch((err) => {
        this.loadingData = false
        this.handleError(err)
      })
    },
    /**
     * 添加大客户函数
     */
    addMajorClient () {
      if (this.$majorClientValidation.valid) {
        var params = _.clone(this.addModal)
        api.heavyBuyer.addHeavyBuyer(params).then((res) => {
          console.log(res)
          this.showNotice({
            type: 'success',
            content: '添加成功'
          })
          this.onAddCancel()
          this.getMajorClient()
        }).catch((err) => {
          this.handleError(err)
        })
      }
    },
    /**
     * 关闭添加大客户浮层
     * @return {[type]} [description]
     */
    onAddCancel () {
      this.adding = false
      this.showAddModal = false
      this.$nextTick(() => {
        this.$resetValidation()
      })
    },
    /**
     * 显示添加大客户的浮层
     * @return {[type]} [description]
     */
    onShowAddModal () {
      var addModal = {
        // 名称
        name: '',
        // 联系人
        contacter: '',
        // 联系电话
        phone: '',
        // 邮箱
        email: '',
        // 行业
        industry: '互联网',
        // 国家
        country: '',
        // 省份
        province: '',
        // 城市
        city: '',
        // 地址
        location: ''
      }
      this.addModal = addModal
      this.showAddModal = true
    },
    /**
     * 进入详情页
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    goDetails (table) {
      this.$route.router.go('/operation/users/major-clients/' + table.prototype.id)
    },
    /**
     * 按某个属性排序
     * 国辉
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    sortBySomeKey (header, index) {
      this.sortKey = header.key
      if (header.sortType === 1) {
        header.sortType = -1
      } else {
        header.sortType = 1
      }
      this.headers.$set(index, header)
      this.getMajorClient()
    }
  }
}
</script>
<style lang='stylus'>
  @import '../../../assets/stylus/common'

  .major-clients
    .statistic-group
      border-top 1px solid #d9d9d9
    .panel
      border-bottom 0
    .mr5
      margin-right 5px
</style>
