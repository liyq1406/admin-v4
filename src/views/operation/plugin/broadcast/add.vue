<template>
  <div class="main">
    <div class="main-title">
      <h2>新建推送</h2>
    </div>
    <div class="container row">
      <div class="form-box col-16">
        <form v-form name="validation" @submit.prevent="onSubmit">
          <div class="panel">
            <div class="panel-hd">
              <h3><i class="number">1</i> 推送人群</h3>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="form-row row">
                  <div class="check-group-box tab-s2">
                    <radio-button-group :items="pushOption" color="red" :value.sync="scopeType">
                      <span slot="label" class="label col-5">请选择推送范围</span>
                    </radio-button-group>
                  </div>
                </div>
                <div v-show="scopeType===1">
                  <div class="tips">
                    <i class="fa fa-user"></i>
                      向所有应用内的注册用户推送消息，目前总注册用户：
                      <span>{{'8391'}}</span>
                  </div>
                </div>
                <div class="directional" v-show="scopeType===2">
                  <div class="form-row row">
                    <label class="form-control col-5">选择应用</label>
                    <div class="controls col-19">
                      <div class="radio-group">
                        <label class="checkbox mr20" v-for="app in apps">
                          <input type="checkbox" :value="app.id" v-model="selectedApps">{{app.name}}（{{app.plugin}}）
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">选择产品</label>
                    <div class="controls col-19">
                      <div class="radio-group">
                        <label class="checkbox mr20">
                          <input type="checkbox" @change="onSelectedAllProducts($event)" v-model="selectedAllProducts">全部产品
                        </label>
                        <label class="checkbox mr20" v-for="product in products">
                          <input type="checkbox" :value="product.id" v-model="selectedProducts">{{product.name}}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">推送人群</label>
                    <div class="controls col-19 row">
                      <div class="row">
                        <label class="radio">
                          <input type="radio" name="person" :value="true" v-model="group.unlimited"/>不限
                        </label>
                      </div>
                      <div class="row">
                        <label class="radio col-4">
                          <input type="radio" name="person" :value="false" v-model="group.unlimited"/>自定义
                        </label>
                        <div class="row col-19">
                          <div class="select-group fl">
                            <v-select :label="group.type===2?'沉睡用户':'活跃用户'" width="100px">
                              <select v-model="group.type" @change="group.unlimited=false">
                                <!-- <option v-for="opt in userTypeOptions" :value="opt">{{ opt.label }}</option> -->
                                <option :value="1">活跃用户</option>
                                <option :value="2">沉睡用户</option>
                              </select>
                            </v-select>
                            <v-select :label="selectedGroupText" width="140px" class="ml5">
                              <select v-model="group.time" @change="group.unlimited=false">
                                <option :value="7">7天{{group.type===2?'沉睡':'活跃'}}用户</option>
                                <option :value="30">30天{{group.type===2?'沉睡':'活跃'}}用户</option>
                              </select>
                            </v-select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">推送地域</label>
                    <div class="controls col-19 row">
                      <div class="row">
                        <label class="radio">
                          <input type="radio" :value="0" v-model="area.type"/>不限
                        </label>
                      </div>
                      <div class="row">
                        <label class="radio col-4">
                          <input type="radio" :value="1" v-model="area.type"/>自定义
                        </label>
                        <div class="row col-19">
                          <area-select :province.sync="selectedProvince" :city.sync="selectedCity" :show-district="false" @province-change="area.type=1"></area-select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row userTag">
                    <label class="form-control col-5">用户标签</label>
                    <div class="controls col-19">
                      <div class="radio-group fl">
                        <label class="radio">
                          <input type="radio" name="tag" :value="0" v-model="tag.type">不限
                        </label>
                        <label class="radio">
                          <input type="radio" name="tag" :value="1" v-model="tag.type">推送到标签用户
                        </label>
                        <label class="radio">
                          <input type="radio" name="tag" :value="2" v-model="tag.type">不推送标签用户
                        </label>
                      </div>
                      <div class="fl row mt10 mb10">
                        <tag-input :value.sync="tag.tag_list" :candidate="usersTags"></tag-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="single" v-show="scopeType===3">
                  <div class="form-row" v-for="u in user" track-by="$index">
                    <label class="form-control col-5">请输入用户ID</label>
                    <div class="controls col-19 clearfix">
                      <div class="input-text-wrap w200 fl">
                        <input type="text" class="input-text input-text-sm" v-model="u">
                      </div>
                      <div class="fl btn-box">
                        <button class="btn btn-sm btn-ghost" @click="user.push('')">
                          <i class="fa fa-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-ghost" v-if="user.length>1" @click="user.$remove(u)">
                          <i class="fa fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd">
              <h3><i class="number">2</i> 推送内容</h3>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-5">推送标题:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'不可超过20个字符,仅ios有效'" class="input-text-wrap">
                      <input v-model="title" type="text" name="title" class="input-text"/>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5">推送描述:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'不可超过200个字符'" class="input-text-wrap">
                      <input v-model="content" type="text" class="input-text"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd">
              <h3><i class="number">3</i> 推送时间</h3>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-5">推送时间:</label>
                  <div class="controls col-19 row">
                    <div class="broadcast-time">
                      <label class="radio">
                        <input type="radio" v-model="timeType" :value="1" number/>现在
                      </label>
                    </div>
                    <div class="broadcast-time row">
                      <label class="radio col-6">
                        <input type="radio" v-model="timeType" :value="2" number/>自定义
                      </label>
                      <div class="row col-14">
                        <date-picker @timechange="onTimeChange"></date-picker>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd">
              <h3><i class="number">4</i> 打开方式</h3>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-5 radio">
                    <input type="radio" v-model="actionType" name="openType" :value="1"/>打开指定页面
                  </label>
                  <div class="controls col-19">
                    <div class="input-text-wrap" v-placeholder="'请填写页面activity地址，例如：com.tencent.xlinkpushdemo.main'">
                      <input type="text" class="input-text" v-model="action.view" @change="actionType=1"/>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 radio">
                    <input type="radio" v-model="actionType" name="openType" :value="2" number/>打开指定网页
                  </label>
                  <div class="controls col-19">
                    <div class="input-text-wrap" v-placeholder="'请输入网页地址'">
                      <input type="text" name="openContent" class="input-text"  v-model="action.url" @change="actionType=2"/>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 radio">
                    <input type="radio" v-model="actionType" name="openType" :value="3" number/>自定义内容
                  </label>
                  <div class="controls col-19">
                    <div class="input-text-wrap" v-placeholder="'请输入内容'">
                      <textarea class="input-text textarea" v-model="action.command" @change="actionType=3"></textarea>
                    </div>
                    <span class="wordCount">{{action.command.length}}/240</span>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5 radio">
                    <input type="radio" v-model="actionType" name="openType" :value="4" number/>直接打开APP
                  </label>
                </div>
                <div class="form-actions row">
                  <div class="col-offset-5">
                    <button type="submit" class="btn btn-primary btn-lg">{{ $t("common.ok") }}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="preview col-8">
        <div class="preview-box">
          <div class="preview-container">
            这里面是预览的内容
          </div>
        </div>
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
  import store from 'store'

  export default {
    name: 'AddBroadcast',

    mixins: [globalMixins],

    store,

    vuex: {
      getters: {
        products: ({ products }) => products.all,
        plugins: ({ plugins }) => plugins.all
      }
    },

    components: {
      'v-select': Select,
      'date-picker': DatePicker,
      'area-select': AreaSelect,
      'tag-input': TagInput,
      RadioButtonGroup
    },

    data () {
      return {
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
        // 表单验证器
        validation: {},
        /* end**************************/

        /* 根据用户行为变化的变量 **********/
        // 消息标题
        title: '',
        // 消息内容
        content: '',
        // 推送时间
        time: '', // yyyy-MM-dd'T'HH:mm:ss.SS'Z'
        // 失效时间
        expire: '', // yyyy-MM-dd'T'HH:mm:ss.SS'Z'
        // 推送时间类型
        timeType: 1, // 1为现在，2为自定义时间
        // 推送类型
        scopeType: 1, // 1全部，2定向，3单个用户
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
          province: '', // 省份
          city: '' // 城市
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
        // 用户总数
        usersTotal: 2016,
        // 用户标签
        usersTags: ['大客户', '金牌客户', '银牌客户']
        /* end**************************/
      }
    },

    computed: {
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
    methods: {
      /**
       * 开始时间变化
       * @param  {[type]} time [description]
       * @return {[type]}      [description]
       */
      onTimeChange (time) {
        var delay = 30 // 30天后过期
        this.timeType = 2
        this.time = time
        this.expire = new Date(time - 0 + 1000 * 60 * 60 * 24 * delay)
      },
      /**
       * 用户标签内容变化事件
       * @param  {[type]} tags [description]
       * @return {[type]}      [description]
       */
      onTagsChange (tags) {
        console.log(tags)
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
      onSubmit () {
        console.log('表单提交')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'

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
  .panel
    border-bottom 0
  .select-group
    .v-select
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

</style>
