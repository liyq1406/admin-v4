<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>系统信息</h2>
    </div>
    <div class="panel">
      <div class="titlemargin">{{dealer.name}}</div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-14">
            <!-- <div class="btnarea clearfix">
              <button @click.prevent.stop="toggle">
                <span v-if="status===0">已停用</span>
                <span v-else>已启用</span>
              </button>
            </div> -->
            <div class="listmargin">
              <info-list :info="dealerInfo"></info-list>
            </div>
          </div>
          <div class="col-10">
            <div class="row status">
              <div class="col-12">
                <div class="status-item textcenter">
                  <em>{{ dealer.sale_goal || '200w' }}</em>
                  <span>年销售目标</span>
                </div>
              </div>
              <div class="col-12">
                <div class="status-item textcenter">
                  <em>{{ dealer.saled_amount || '13k' }}</em>
                  <span>已销售数量</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import locales from 'consts/locales/index'
  import api from 'api'
  // import { pluginMixins } from '../mixins'
  import locParser from 'utils/location-parser'

  export default {
    name: 'TableDetails',

    // mixins: [pluginMixins],

    data () {
      return {
        text: {
          import_devices: '导入设备'
        },
        dealer: {
          _id: '123',
          username: '12345',
          password: '1115465',
          name: '广州分部',
          linkman: '小明',
          phone: '13800138000',
          area: '广州总部',
          belong_to: '海珠'
        },
        status: '',
        dealerInfo: {
          linkman: {
            label: '联系人',
            value: '大张工'
          },
          phone: {
            label: '手机号',
            value: '13800138000'
          },
          password: {
            label: '密码',
            value: '102810821'
          },
          id: {
            label: '帐号',
            value: '0912232221'
          },
          area: {
            label: '负责区域',
            value: '华南区域'
          },
          belong: {
            label: '从属于',
            value: '中国大区'
          },
          target: {
            label: '年销售目标',
            value: '200w'
          },
          sale: {
            label: '已售数量',
            value: '13k'
          }
        },
        // sales: [{
        //   _id: 2222,
        //   create_time: '2016-5-31 16:18',
        //   version: '3.0',
        //   code: '123456789',
        //   name: '张小明',
        //   phone: '13800138000'
        // }],
        sales: [],
        query: '',
        loadingData: false,
        editModal: {
          show: false,
          form: {},
          editingTag: false,
          model: {}
        },
        delChecked: false,
        originEditModel: {},
        editValidation: {},
        queryTypeOptions: [
          { label: '产品型号', value: 'product_mod' },
          { label: '客户名称', value: 'name' },
          { label: '手机号', value: 'phone' },
          { label: '序列号', value: 'sn' }
        ],
        queryType: {
          label: '客户名称',
          value: 'name'
        },
        belongs: [
          { label: '广州分部', value: '广州分部' }
        ],
        belongType: {
          label: '广州分部',
          value: '广州分部'
        },
        countPerPage: 10,
        currentPage: 1,
        total: 0,
        editing: false,
        secondaryNav: []
      }
    },

    computed: {
      // 分页信息
      page () {
        var result = {
          total: this.total,
          currentPage: this.currentPage,
          countPerPage: this.countPerPage
        }
        return result
      },
      queryCondition () {
        var condition = {
          filter: ['name', 'id', 'email', 'phone', 'client_type', 'province', 'city', 'address', 'sn', 'sale_time', 'product_mod', 'mac', 'product_id', 'device_id', 'product_mod'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {}
        }
        if (this.query.length > 0) {
          condition.query[this.queryType.value] = {$in: [this.query]}
        }
        return condition
      }
    },

    route: {
      data () {
      }
    },

    ready () {
      // this.getDealer()
      // this.getSales()

      this.secondaryNav = [{
        label: '独立入口配置',
        link: { path: '/operation/heavy-buyer-settings/entrance' }
      }]
    },
    methods: {
      // 获取经销商信息
      getDealer () {
        this.loadingData = true
        api.dealer.get(this.$route.params.dealer_id).then((res) => {
          this.dealer = res.data
          this.dealerInfo.linkman.value = this.dealer.contacter || '--'
          this.dealerInfo.phone.value = this.dealer.phone || '--'
          this.dealerInfo.id.value = this.dealer.email || '--'
          this.dealerInfo.belong.value = this.dealer.upper_dealer_code || '--'
          this.status = this.dealer.status
          // 获取上级经销商名字
          if (this.dealer.upper_dealer_code) {
            this.getUpper(this.dealerInfo.belong.value)
          }
          // todo字段缺失
          this.dealerInfo.area.value = this.dealer.region || '--'
          this.dealerInfo.target.value = this.dealer.sale_goal || '--'
          this.dealerInfo.sale.value = this.dealer.saled_amount || '--'
          locParser.parse(this.dealer.country || '', this.dealer.province || '', this.dealer.city || '', '', this.lang).then((res) => {
            if (res) {
              let loc = res.country
              if (res.state) {
                loc += ' ' + res.state
              }
              if (res.city) {
                loc += ' ' + res.city
              }
              this.dealerInfo.loc.value = loc
            }
          })
          this.loadingData = false
        }).catch((err) => {
          this.handleError(err)
          this.loadingData = false
        })
      },
      getUpper (id) {
        api.dealer.get(id).then((res) => {
          this.dealerInfo.belong.value = res.data.name
        }).catch((err) => {
          this.handleError(err)
        })
      },
      // 获取经销商对应销售信息列表
      // getSales () {
      //   if (typeof querying !== 'undefined') {
      //     this.currentPage = 1
      //   }
      //   this.loadingData = true
      //   api.dealer.getSales(this.$route.params.dealer_id, this.queryCondition).then((res) => {
      //     this.sales = res.data.list
      //     this.total = res.data.count
      //     this.loadingData = false
      //   }).catch((err) => {
      //     this.handleError(err)
      //     this.loadingData = false
      //   })
      // },
      /**
       * 每页显示的数量改变
       * @author shengzhi
       * @param  {Number} count 数量
       */
      // onPageCountUpdate (count) {
      //   this.countPerPage = count
      //   this.getSales()
      // },
      // 切换经销商状态
      // toggle () {
      //   api.dealer.toggle(this.$route.params.dealer_id, (!this.status) - 0).then((res) => {
      //     if ((!this.status) - 0 === 1) {
      //       this.showNotice({
      //         type: 'success',
      //         content: '启用成功！'
      //       })
      //     } else {
      //       this.showNotice({
      //         type: 'error',
      //         content: '帐号已停用'
      //       })
      //     }
      //     this.getDealer()
      //   }).catch((err) => {
      //     this.handleError(err)
      //   })
      // },
      // 初始化编辑表单
      editDealer (dealer) {
        this.editModal.show = true
        this.editModal.model = this.dealer
        this.editModal.model = _.clone(dealer)
        this.originEditModel = _.clone(dealer)
      },
      // 关闭编辑浮层并净化编辑表单
      resetEdit () {
        this.editing = false
        this.delChecked = false
        this.editModal.show = false
        this.editModal.model = this.originEditModel
      },
      // 切换搜索
      toggleSearching () {
        this.searching = !this.searching
      },
      // 搜索
      handleSearch () {
        if (this.query.length === 0) {
          this.getSales()
        }
      },
      importDevices () {
        this.$route.router.go(this.$route.params.dealer_id + '/import_devices')
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'
.textcenter
  text-align center
.btnarea
  button
    border 1px solid #bcbcbc
    outline none
    background-color #fafafa
    color #323232
    height 24px
    float right
    margin-right 20px
.titlemargin
  font-size 20px
  margin-top 20px
  margin-left 10px
.listmargin
  margin 10px 0
.fa
  margin-left 5px
.status
  clearfix()
  text-align right
  margin-top 50px

  .status-item
    border-left 1px solid #E4E4E4
    box-sizing border-box
    margin-left 10px

    em
    span
      display block

    em
      font-style normal
      font-size 32px
      color red

  :first-child
    .status-item
      border none
      margin-left 0

</style>
