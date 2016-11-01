<template>
  <div class="panel">
    <div class="panel-hd">
      <div class="actions">
        <button class="btn btn-primary" :disabled="tips" :class="{'disabled': tips}" @click="onAddBtnClick"><i class="fa fa-plus"></i>添加告警规则</button>
      </div>
      <h2>规则列表</h2>
    </div>
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <x-select width="90px" :label="curLevel.label" size="small">
                <span slot="label">告警等级:</span>
                <select v-model="curLevel" name="product">
                  <option v-for="level in warningLevels" :value="level">{{ level.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="key">
                <button slot="search-button" @click="" class="btn"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>{{ $t("ui.rule.fields.name") }}</th>
              <th>{{ $t("ui.rule.fields.content") }}</th>
              <th>{{ $t("ui.rule.fields.type") }}</th>
              <th>告警等级</th>
              <th class="tac">状态</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="rules.length > 0">
              <tr v-for="rule in rulesFilter">
                <td><a class="hl-red" v-link="'/dev/products/' +$route.params.id + '/alert/edit/' + rule.id">{{* rule.name }}</a></td>
                <td>
                  <span class="limit-width">{{rule.content }}</span></td>
                <td>{{* rule.type | ruleLabel }}</td>
                <td>
                  <span class="text-label" :class="tagStyle(rule.tag)">{{rule.tag}}</span>
                  <!-- <span class="text-label text-label-warning level-style">{{rule.tag}}</span> -->
                </td>
                <td><span v-if="rule.is_enable" class="hl-green">{{ $t("common.enable") }}</span><span v-else class="hl-gray">{{ $t("common.disabled") }}</span></td>
                <!-- <td class="tac">
                  <button @click="editRule(rule)" class="btn btn-link btn-mini">{{ $t("common.edit") }}</button>
                </td> -->
              </tr>
            </template>
            <tr v-if="rules.length === 0 && !loadingData">
              <td colspan="5" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页-->
      <!-- <pager v-if="true" :total="rules.length" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="onCurrPageChage" @count-update="onPageCountUpdate"></pager> -->
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from 'src/api'
  import Select from 'components/Select'
  import SearchBox from 'components/SearchBox'
  import locales from 'consts/locales/index'
  import Pager from 'components/Pager'
  import { globalMixins } from 'src/mixins'
  import _ from 'lodash'

  export default {
    name: 'Alert',

    mixins: [globalMixins],

    props: {
      productID: {
        type: String,
        default: ''
      }
    },

    components: {
      'x-select': Select,
      SearchBox,
      Pager
    },

    data () {
      return {
        ruleTypes: locales[Vue.config.lang].data.RULE_TYPES,
        rules: [], // 规则列表
        key: '',
        curLevel: {
          value: 0,
          label: '全部'
        },
        warningLevels: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: locales[Vue.config.lang].data.ALERT_LEVELS.orange
          },
          {
            value: 2,
            label: locales[Vue.config.lang].data.ALERT_LEVELS.blue
          },
          {
            value: 3,
            label: locales[Vue.config.lang].data.ALERT_LEVELS.red
          }
        ],
        loadingData: false,
        currentPage: 1,
        countPerPage: 10
      }
    },
    filters: {
      ruleLabel (value) {
        return this.ruleTypes[value - 1]
      }
    },
    ready () {
      this.getRules()
    },
    computed: {
      rulesFilter () {
        var temp = _.clone(this.rules)
        temp = temp.filter((item) => {
          let key = item.content.indexOf(this.key)
          let name = item.name.indexOf(this.key)

          let tag = true
          if (this.curLevel.value !== 0) {
            tag = item.tag === this.curLevel.label
          }
          return (key !== -1 || name !== -1) && tag
        })

        return temp
      }
    },
    watch: {
      productID () {
        if (this.productID !== '') {
          this.getRules()
        }
      }
    },
    methods: {
      /**
       * 处理添加按钮点击
       * @author shengzhi
       */
      onAddBtnClick () {
        this.$route.router.go({path: 'add', append: true})
      },

      getRules () {
        this.loadingData = true
        api.alert.getRules(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.rules = res.data
          }
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      /**
       * 当前页码改变
       * @author weijie
       * @param  {Number} number 页码
       */
      onCurrPageChage (number) {
        this.currentPage = number
        this.getRules()
      },

      /**
       * 每页显示的数量改变
       * @author weijie
       * @param  {Number} count 数量
       */
      onPageCountUpdate (count) {
        this.countPerPage = count
        this.getRules(true)
      },
      tagStyle (tag) {
        switch (tag) {
          case locales[Vue.config.lang].data.ALERT_LEVELS.orange:
            return 'text-label-warning'
          case locales[Vue.config.lang].data.ALERT_LEVELS.red:
            return 'text-label-danger'
          default:
            break
        }
        return ''
      }
    }
  }
</script>
<style lang='stylus' scoped>
@import '../../../../assets/stylus/common'
.limit-width
  display inline-block
  width 400px
  overflow hidden
</style>
