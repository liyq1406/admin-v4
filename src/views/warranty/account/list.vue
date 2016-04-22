<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <search-box :key.sync="query" :active="searching" :placeholder="$t('account_manage.search_condi')" style="float:right">
          <button slot="search-button" @click="getBranchList(true)" class="btn btn-primary">{{ $t('common.search') }}</button>
        </search-box>
        <div class="action-group">
          <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>添加网点</button>
        </div>
      </div>
      <div class="status-bar">
        <div class="status">{{{ $t('common.total_results', {count:total}) }}}</div>
        <area-select :province.sync="selectedProvince" :city.sync="selectedCity" :district.sync="selectedDistrict" @province-change="getProvince" @city-change="getCity" @district-change="getDistrict" label="所在地区：" select-size="small"></area-select>
      </div>

      <table class="table table-stripe table-bordered wrongcodetable">
        <thead>
          <tr>
            <th>序号</th>
            <th>网点名称</th>
            <th>负责人</th>
            <th>联系方式</th>
            <th>创建日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in accounts| limitBy pageCount (currentPage-1)*pageCount">
            <td>{{ $index + 1 }}</td>
            <td>{{ account.name }}</td>
            <td>{{ account.director }}</td>
            <td>{{ account.phone }}</td>
            <td>{{ account.create_time }}</td>
            <td>
              <a v-link="{path: '/warranty/accounts/'+account._id}" class="hl-red">查看详情</a>
            </td>
          </tr>
          <tr v-if="accounts.length === 0">
            <td colspan="6" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
              <div v-else class="tips-null">{{ $t("common.no_records") }}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <pager v-if="!loadingAccount && accounts.length > pageCount" :total="accounts.length" :current.sync="currentPage" :page-count="pageCount"></pager>

      <!-- 添加增加网点浮层-->
      <modal :show.sync="showAddModal" width="600px">
        <h3 slot="header">添加网点</h3>
        <div slot="body" class="form">
          <form v-form name="addValidation" @submit.prevent="onAddSubmit">
            <div class="form-row">
              <label class="form-control">网点:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="addBranch.name" type="text" v-form-ctrl name="branch" lazy required class="input-text"/>
                </div>
                <div v-if="addValidation.$submitted && addValidation.branch.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.branch.$error.required">*必须</span></div>
                <div v-if="addValidation.branch.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.branch.$error.required">*必须</span></div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">负责人:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="addBranch.director" type="text" v-form-ctrl name="charge" required lazy class="input-text"/>
                </div>
                <div v-if="addValidation.$submitted && addValidation.director.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.director.$error.required">*必须</span></div>
                <div v-if="addValidation.director.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.director.$error.required">*必须</span></div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">联系号码:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="addBranch.phone" type="text" pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" v-form-ctrl name="tel" required lazy class="input-text"/>
                </div>
                <div v-if="addValidation.$submitted && addValidation.phone.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.phone.$error.required">*必须</span></div>
                <div v-if="addValidation.phone.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.phone.$error.required">*必须</span></div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">邮箱地址:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="addBranch.email" type="email" v-form-ctrl name="email" required lazy class="input-text"/>
                </div>
                  <div v-if="addValidation.$submitted && addValidation.email.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.email.$error.required">*必须</span></div>
                  <div v-if="addValidation.email.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.email.$error.required">*必须</span></div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">所在地区:</label>
              <div class="controls">
                <area-select :province.sync="selectedProvince" :city.sync="selectedCity" :district.sync="selectedDistrict" @province-change="getProvince" @city-change="getCity" @district-change="getDistrict"></area-select>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">详细地址:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="addBranch.addr" type="text" v-form-ctrl name="addr" required lazy class="input-text"/>
                </div>
                <div v-if="addValidation.$submitted && addValidation.addr.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.addr.$error.required">*必须</span></div>
                <div v-if="addValidation.addr.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.addr.$error.required">*必须</span></div>
              </div>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from '../../../mixins'
  import SearchBox from '../../../components/SearchBox'
  import Pager from '../../../components/Pager'
  import Select from '../../../components/Select'
  import Modal from '../../../components/Modal'
  import AreaSelect from '../../../components/AreaSelect'
  import api from '../../../api'
  import _ from 'lodash'

  export default {
    // name: 'AccountList',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'area-select': AreaSelect,
      'modal': Modal,
      'search-box': SearchBox,
      'pager': Pager
    },

    data () {
      return {
        loadingAccount: false,
        currentPage: 1,
        pageCount: 10,
        accounts: [
          // {
          //   num: 1,
          //   name: '网点名称',
          //   people: '小明',
          //   phone: '123123',
          //   date: '2016-4-18'
          // }
        ],
        showAddModal: false,
        addModel: {},
        addValidation: {},
        originAddModel: {},
        adding: false,
        selectedProvince: {},
        selectedCity: {},
        selectedDistrict: {},
        addBranch: {
          name: '',
          charge: '',
          tel: '',
          email: '',
          area: {},
          addr: ''
        },
        search: {}
      }
    },

    ready () {
      this.getBranchList()
    },

    methods: {
      // 获取网点列表
      getBranchList () {
        // if (typeof querying !== 'undefined') {
        //   this.currentPage = 1
        // }
        this.loadingData = true
        api.warranty.getBranchList(this.search).then((res) => {
          this.accounts = res.data.list
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      getCity () {

      },

      getDistrict () {

      },

      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.addModel = _.clone(this.originAddModel)
      },
      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },
      // 添加操作
      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
          api.warranty.getBranchAdd(this.addBranch).then((res) => {
            this.adding = false
            this.showAddModal = false
            this.getBranchList()
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
          console.log('ready to send post')
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'
</style>
