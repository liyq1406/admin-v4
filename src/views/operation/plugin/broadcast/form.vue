<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>{{pageType==='add'?'新建推送':'编辑推送'}}</h2>
    </div>
    <div class="container row">
      <div class="form-box col-16">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onSubmit">
            <div class="panel mt20">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-4">选择应用</label>
                  <div class="controls col-20">
                    <div class="radio-group">
                      <label class="checkbox mr20" v-for="app in apps">
                        <input type="checkbox" :value="app.id" v-model="selectedApps">{{app.name}}（{{app.plugin}}）
                      </label>
                      <div class="form-tips form-tips-error">
                        <span v-if="selectedApps.length === 0 && needVerification">至少选择一个应用</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-4">消息标题:</label>
                  <div class="controls col-20">
                    <div v-placeholder="'不可超过20个字符,仅ios有效'" class="input-text-wrap">
                      <input v-model="title" type="text" name="title" v-validate:title="{required: true, maxlength: 20}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.title.touched && $validation.title.required">请输入标题</span>
                      <span v-if="$validation.title.modified && $validation.title.maxlength">不可超过20个字符</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-4">描述:</label>
                  <div class="controls col-20">
                    <div v-placeholder="'不可超过200个字符'" class="input-text-wrap">
                      <input v-model="content" name="content" type="text" v-validate:content="{required: true, maxlength: 200}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.content.touched && $validation.content.required">请输入内容</span>
                      <span v-if="$validation.content.modified && $validation.content.maxlength">不可超过200个字符</span>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-4 radio">打开消息</label>
                  <div class="controls col-20">
                    <div class="row">
                      <label class="form-control col-6 radio">
                        <input type="radio" v-model="actionType" name="openType" :value="2" number/>打开指定网页
                      </label>
                      <div class="controls col-18">
                        <div class="input-text-wrap" v-placeholder="'请输入网页地址'">
                          <input type="text" name="action.url" class="input-text"  v-model="action.url" v-validate:url="{isrequired: (actionType===2)}" @input="actionType=2"/>
                        </div>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.url.touched && $validation.url.isrequired">请输入网页地址</span>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                        <label class="form-control col-5 radio">
                          <input type="radio" v-model="actionType" name="openType" :value="4" number/>直接打开APP
                        </label>
                    </div>
                  </div>
                </div>
                <div class="form-actions mt20 row">
                  <div class="col-4" v-if="pageType!=='add'">
                    <label class="del-check">
                      <input type="checkbox" name="del" v-model="delChecked"/>删除
                    </label>
                  </div>
                  <div class="col-20" :class="{'col-offset-4':pageType==='add'}">
                    <button type="submit" class="btn btn-primary btn-lg">{{ $t("common.ok") }}</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </validator>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import Select from 'components/Select'
  import DatePicker from 'components/DateTimeSinglePicker'
  import AreaSelect from 'components/AreaSelect'
  import RadioButtonGroup from 'components/RadioButtonGroup'
  import TagInput from 'components/TagInput'
  import api from 'api'
  import { createDayRange } from 'utils'
  import _ from 'lodash'

  export default {
    name: 'AddBroadcast',

    mixins: [globalMixins],

    vuex: {
      getters: {
        products: ({ products }) => products.released,
        plugins: ({ plugins }) => plugins.all
      }
    },

    components: {
      DatePicker,
      AreaSelect,
      TagInput,
      RadioButtonGroup,
      'x-select': Select
    },

    data () {
      return {
        delChecked: false,
        /* 交互用写死的变量 **********/
        // 推送范围选项
        pushOption: [
          {
            label: '所有用户',
            value: 1
          },
          {
            label: '定向推送',
            value: 2
          },
          {
            label: '单个用户',
            value: 3
          }
        ],
        /* end**************************/

        /* 根据用户行为变化的变量 **********/
        // 当前用户id是否需要验证
        needVerificationUsers: false,
        // 当前页面除了用户id以外的各个字段是否需要验证
        needVerification: false,
        // 消息标题
        title: '',
        // 消息内容
        content: '',
        // 推送时间
        time: new Date(), // 时间对象
        // 失效时间
        expire: new Date(+new Date() + 30 * 1000 * 60 * 60 * 24), // 时间对象 默认是开始时间加30天
        // 推送时间类型
        timeType: 1, // 1为现在，2为自定义时间
        // 推送类型
        scopeType: 2, // 1全部，2定向，3单个用户
        // 已选择的推送应用
        selectedApps: [],
        // 已选择的推送产品
        selectedProducts: [],
        // 推送人群
        group: {
          unlimited: true, // 是否不限的标志位
          type: 0, // 0不限，1活跃用户，2沉睡用户
          time: 7 // 活跃/沉睡天数
        },
        // 推送地域
        area: {
          type: 0, // 0不限，1自定义
          province: {}, // 省份
          city: {} // 城市
        },
        // 用户标签
        tag: {
          type: 0, // 0不限，1推送，2不推送
          tag_list: '' // 用户标签
        },
        // 用户id
        user: [''],
        // 动作类型
        actionType: 1, // 1为打开指定页面，2为打开指定网页，3自定义内容，4直接打开app
        action: {
          'view': '', // 指定页面
          'url': '', // 指定网页
          'command': '' // 自定义内容
        },
        /* end**************************/

        /* 接口获取的数据 **********/
        userIdType: {},
        // 用户总数
        usersTotal: 0,
        // 用户标签
        usersTags: ['大客户', '金牌客户', '银牌客户']
        /* end**************************/

        // 表单验证器
        // validation: {}
      }
    },

    computed: {
      /**
       * 计算属性-当前推送的id
       * @return {[type]} [description]
       */
      id () {
        return this.$route.params.id
      },
      /**
       * 计算属性-计算当前页面是编辑还是添加
       * @return {[type]} [description]
       */
      pageType () {
        // var result = 'edit'
        // if (/add/.test(this.$route.path)) {
        //   result = 'add'
        // }
        return this.id ? 'edit' : 'add'
      },
      /**
       * 计算属性 用于发送给服务器的参数
       * @return {[type]} [description]
       */
      task () {
        var result = {}
        result.title = this.title
        result.content = this.content
        result.time = this.time || new Date()
        result.expire = this.expire
        result.action = {}
        if (this.actionType === 2) {
          result.action.type = 1
        } else {
          result.action.type = 2
        }
        result.action.command = this.action.command
        result.action.url = this.action.url
        result.scope = {}
        result.scope.type = this.scopeType
        var users = []
        this.user.map((u) => {
          users.push(u - 0)
        })
        result.scope.user = users
        result.scope.app_list = this.selectedApps
        result.scope.product_list = this.selectedProducts
        result.scope.group = {}
        if (this.group.unlimited) {
          result.scope.group.type = 0
        } else {
          result.scope.group.type = this.group.type
        }
        result.scope.group.start_day = new Date(createDayRange(0, this.group.time).start)
        result.scope.group.end_day = new Date(createDayRange(0, this.group.time).end)
        result.scope.area = {}
        result.scope.area.type = this.area.type
        result.scope.area.province = this.area.province.name
        result.scope.area.city = this.area.city.name
        result.scope.tag = {}
        result.scope.tag.type = this.tag.type
        result.scope.tag.tag_list = this.tag.tag_list.split(',')
        return result
      },
      /**
       * 全选app标志位
       * @return {[type]} [description]
       */
      selectedAllProducts () {
        var result = false
        if (this.selectedProducts.length === this.products.length) {
          result = true
        }
        return result
      },
      /**
       * 计算属性-返回当前ios和安卓的应用
       * @return {[type]} [description]
       */
      apps () {
        var result = []
        this.plugins.map((item) => {
          if (item.plugin === 'ios' || item.plugin === 'android') {
            result.push(item)
          }
        })
        return result
      },
      /**
       * 推送人群下拉框提示文案
       * @return {[type]} [description]
       */
      selectedGroupText () {
        var type = this.group.type === 2 ? '沉睡' : '活跃'
        var time = this.group.time
        var result = `${time}天${type}用户`
        return result
      }
    },

    route: {
      data () {
        // 如果当前是添加页面 则初始化内容 不然在编辑页面切换回来的时候会保留原来编辑页的数据
        if (this.pageType === 'add') {
          console.log('这里是添加页面  需要清空数据')
          this.init()
        }
        this.getUsersTotal() // 获取总注册用户数
        if (this.$route.params.id) {
          this.getDetails()
        }
      }
    },
    methods: {
      init () {
        var data = {
          // 消息标题
          title: '',
          // 消息内容
          content: '',
          // 推送时间
          time: new Date(), // 时间对象
          // 失效时间
          expire: new Date(+new Date() + 30 * 1000 * 60 * 60 * 24), // 时间对象 默认是开始时间加30天
          // 推送时间类型
          timeType: 1, // 1为现在，2为自定义时间
          // 推送类型
          scopeType: 2, // 1全部，2定向，3单个用户
          // 已选择的推送应用
          selectedApps: [],
          // 已选择的推送产品
          selectedProducts: [],
          // 推送人群
          group: {
            unlimited: true, // 是否不限的标志位
            type: 0, // 0不限，1活跃用户，2沉睡用户
            time: 7 // 活跃/沉睡天数
          },
          // 推送地域
          area: {
            type: 0, // 0不限，1自定义
            province: {}, // 省份
            city: {} // 城市
          },
          // 用户标签
          tag: {
            type: 0, // 0不限，1推送，2不推送
            tag_list: '' // 用户标签
          },
          // 用户id
          user: [''],
          // 动作类型
          actionType: 2, // 1为打开指定页面，2为打开指定网页，3自定义内容，4直接打开app
          action: {
            'view': '', // 指定页面
            'url': '', // 指定网页
            'command': '' // 自定义内容
          }
        }
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            this[key] = data[key]
          }
        }
      },
      removeUser (u) {
        this.user.$remove(u)
      },
      /**
       * 获取详细推送的详情
       * @return {[type]} [description]
       */
      getDetails () {
        api.broadcast.getTask(this.id).then((res) => {
          var details = res.data
          this.title = details.title
          this.content = details.content
          this.timeType = 2
          this.time = new Date(+new Date((details.time)) - 8 * 60 * 60 * 1000)
          this.expire = new Date(+new Date(details.expire) - 8 * 60 * 60 * 1000)
          // this.action
          switch (details.action.type) {
            case 0:
              this.actionType = 1
              break
            case 1:
              this.actionType = 2
              break
            case 2:
              this.actionType = 3
              break
            default:
              this.actionType = 4
          }
          this.action.view = ''
          this.action.url = details.action.url || ''
          this.action.command = details.action.command || ''
          this.scopeType = details.scope.type
          this.user = details.scope.user || ['']
          if (details.scope.app_list && details.scope.app_list.length) {
            this.selectedApps = details.scope.app_list || []
          }
          if (details.scope.product_list && details.scope.product_list.length) {
            this.selectedProducts = details.scope.product_list
          }
          this.group.unlimited = (details.scope.group && details.scope.group.type) === 0
          if (details.group && details.group.type) {
            this.group.type = details.group.type
          }
          if (details.group && details.group.end_day) {
            this.group.time = Math.round((+new Date(details.group.end_day) - +new Date(details.group.start_day)) / 1000 / 60 / 60 / 24)
          }
          if (details.area && details.area.type) {
            this.area.type = details.area.type
          }
          // 具体地区暂不处理
          if (details.tag && details.tag.type) {
            this.tag.type = details.tag.type
          }
          if (details.tag && details.tag.tag_list) {
            this.tag.tag_list = details.tag.tag_list.join()
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      /**
       * 获取总注册用户数
       * @return {[type]} [description]
       */
      getUsersTotal () {
        api.statistics.getSummary().then((res) => {
          this.usersTotal = res.data.user.user
        }).catch((res) => {
          this.usersTotal = '查询失败'
          this.handleError(res)
        })
      },
      /**
       * 检测当前id是否合法
       * @param  {[type]} userId [description]
       * @return {[type]}        [description]
       */
      checkUser (userId) {
        this.userIdType[userId] = true
        setTimeout(() => {
          this.userIdType[userId] = false
        }, 1000)
      },
      /**
       * 开始时间变化
       * @param  {[type]} time [description]
       * @return {[type]}      [description]
       */
      onTimeChange (time) {
        // var delay = 30 // 30天后过期
        this.timeType = 2
        this.time = time
        // this.expire = new Date(time - 0 + 1000 * 60 * 60 * 24 * delay)
      },
      /**
       * 过期时间变化
       * @return {[type]} [description]
       */
      onExpireTimeChange (expire) {
        this.expire = expire
      },
      /**
       * 产品的全选按钮被点击
       * @param  {[type]} ev [description]
       * @return {[type]}    [description]
       */
      onSelectedAllProducts (ev) {
        var checked = ev.target.checked
        var allApps = []
        if (checked) {
          this.products.map((item) => {
            allApps.push(item.id)
          })
        }
        this.selectedProducts = allApps
      },
      /**
       * 表单提交 创建消息推送
       * @return {[type]} [description]
       */
      onSubmit () {
        if (this.scopeType === 2) {
          if (this.selectedApps.length === 0) {
            this.showNotice({
              type: 'error',
              content: '请选择应用'
            })
            return
          }
          // if (this.selectedProducts.length === 0) {
          //   this.showNotice({
          //     type: 'error',
          //     content: '请选择产品'
          //   })
          //   return
          // }
        }
        if (this.expire - this.time <= 0) {
          this.showNotice({
            type: 'error',
            content: '过期时间必须大于推送时间！'
          })
          return
        }
        if (this.$validation.invalid) {
          this.$validate(true)
          return
        }
        if (this.$validation.valid) {
          if (this.pageType === 'add') {
            this.add()
          } else {
            if (this.delChecked) {
              this.deleteBreakcast()
            } else {
              this.edit()
            }
          }
        } else {
          this.showNotice({
            type: 'error',
            content: '请检查填写的内容'
          })
        }
      },
      add () {
        var task = _.clone(this.task)
        task.time = this.formatTime(task.time)
        task.expire = this.formatTime(task.expire)
        api.broadcast.addTask(task).then((res) => {
          this.showNotice({
            type: 'success',
            content: '创建成功'
          })
          this.$route.router.go(`/operation/plugins/broadcast/${this.$route.params.app_id}/list`)
        }).catch((res) => {
          this.handleError(res)
        })
      },
      edit () {
        var task = _.clone(this.task)
        task.time = this.formatTime(task.time)
        task.expire = this.formatTime(task.expire)
        api.broadcast.updateTask(this.$route.params.id, task).then((res) => {
          this.showNotice({
            type: 'success',
            content: '修改成功'
          })
          this.$route.router.go(`/operation/plugins/broadcast/${this.$route.params.app_id}/list`)
        }).catch((res) => {
          this.handleError(res)
        })
      },
      deleteBreakcast () {
        api.broadcast.deleteTask(this.$route.params.id).then((res) => {
          this.showNotice({
            type: 'success',
            content: '删除成功'
          })
          this.$route.router.go(`/operation/plugins/broadcast/${this.$route.params.app_id}/list`)
        }).catch((res) => {
          this.handleError(res)
        })
      },
      formatTime (time) {
        var result = +new Date(time) + 8 * 60 * 60 * 1000 + 2 * 60 * 1000
        return new Date(result)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'
  .panel
    .panel-hd
      h3
        margin 10px 0
  .number
    display inline-block
    width 20px
    height 20px
    line-height 20px
    border-radius 50%
    text-align center
    background #2389c5
    color #fff
    font-size 12px
    position relative
    bottom 2px
  .form
    max-width 640px
    padding-top 10px
    padding-left 30px
    box-sizing border-box
    .directional .form-row.userTag
      height auto
    .tips
      height 50px
      line-height 50px
      border-bottom 1px dashed #ccc
      color #666
      .fa
        font-size 18px
        margin 0 5px
    .textarea
      height 150px
    .directional
    .single
      .form-row
        padding-top 5px
        padding-bottom 10px
        height auto
        /*line-height 40px*/
        border-bottom 1px dashed #ccc

    .check-group-box
      padding-bottom 5px
      .label
        line-height 26px
  .select-group
    .x-select
      display inline-block
  .preview-box
    width 300px
    height 630px
    background url('../../../../assets/images/Apple-iPhone-5S.png') no-repeat left top / 100% auto
    box-sizing border-box
    padding 90px 18px 86px 22px
    .preview-container
      background #fff
      width 100%
      height 100%
      overflow-x hidden
      overflow-y auto
  .bordered-top
    border-top 1px solid #e5e5e5
</style>
