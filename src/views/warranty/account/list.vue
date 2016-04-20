<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <search-box :key.sync="query" :active="searching" :placeholder="$t('account_manage.search_condi')" style="float:right">
          <button slot="search-button" @click="getDevices(true)" class="btn btn-primary">{{ $t('common.search') }}</button>
        </search-box>
        <div class="action-group">
          <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>添加网点</button>
        </div>
      </div>
      <div class="status-bar">
        <div class="status">{{{ $t('common.total_results', {count:total}) }}}</div>
        <area-select :province.sync="selectedProvince" :city.sync="selectedCity" :district.sync="selectedDistrict" @province-change="getAccounts" @city-change="getAccounts" @district-change="getAccounts" label="所在地区：" select-size="small"></area-select>
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
            <td>{{ account.num }}</td>
            <td>{{ account.name }}</td>
            <td>{{ account.people }}</td>
            <td>{{ account.phone }}</td>
            <td>{{ account.date }}</td>
            <td>
              <a v-link="{path: '/warranty/' + $route.params.appid + '/accounts/1'}" class="hl-red">查看详情</a>
            </td>
          </tr>
          <tr v-if="accounts.length === 0">
            <td colspan="6" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
              <div v-else="v-else" class="tips-null">{{ $t("common.no_records") }}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <pager v-if="!loadingAccount && accounts.length > pageCount" :total="accounts.length" :current.sync="currentPage" :page-count="pageCount"></pager>

      <!-- 添加设备浮层-->
      <modal :show.sync="showAddModal" width="600px">
        <h3 slot="header">添加网点</h3>
        <div slot="body" class="form">
          <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
            <div class="form-row">
              <label class="form-control">网点:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="mac" required lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">负责人:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="mac" required lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">联系号码:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="mac" required lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">邮箱地址:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="mac" required lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">所在地区:</label>
              <div class="controls">
                <area-select :province.sync="selectedProvince" :city.sync="selectedCity" :district.sync="selectedDistrict" @province-change="getAccounts" @city-change="getAccounts" @district-change="getAccounts"></area-select>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">详细地址:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="mac" required lazy class="input-text"/>
                </div>
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
          {
            num: 1,
            name: '网点名称',
            people: '小明',
            phone: '123123',
            date: '2016-4-18'
          }
        ],
        showAddModal: false,
        addModel: {},
        addValidation: {},
        originAddModel: {},
        adding: false,
        selectedProvince: {},
        selectedCity: {},
        selectedDistrict: {}
      }
    },

    methods: {
      getAccounts () {
        // TODO
        console.log(111111)
      },

      // 添加表单钩子
      addFormHook (form) {
        this.addForm = form
      },
      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.addModel = _.clone(this.originAddModel)
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },
      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },
      // 添加操作
      onAddSubmit () {}
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'
</style>
