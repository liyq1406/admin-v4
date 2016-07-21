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
              <h3>1 推送人群</h3>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-5">推送类型</label>
                  <div class="controls col-19">
                    <radio-button-group :items="types" :value.sync="model.type"></radio-button-group>
                  </div>
                </div>
                <div v-show="model.type===2">
                  <div class="form-row row">
                    <label class="form-control col-5">选择应用</label>
                    <div class="controls col-19">
                      <div class="radio-group">
                        <label class="radio">
                          <input type="radio">26度家(IOS)
                        </label>
                        <label class="radio">
                          <input type="radio">26度家(Android)
                        </label>
                        <label class="radio">
                          <input type="radio">懒生活(IOS)
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">选择产品</label>
                    <div class="controls col-19">
                      <div class="radio-group">
                        <label class="radio">
                          <input type="radio">电饭锅
                        </label>
                        <label class="radio">
                          <input type="radio">热水器
                        </label>
                        <label class="radio">
                          <input type="radio">煲汤机
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">推送人群</label>
                    <div class="controls col-19 clearfix">
                      <div class="radio-group w150 fl">
                        <label class="radio">
                          <input type="radio">不限
                        </label>
                        <label class="radio">
                          <input type="radio">自定义
                        </label>
                      </div>
                      <div class="select-group fl">
                        <v-select :label="userType.label" width="100px">
                          <select v-model="userType" v-form-ctrl name="userType">
                            <option v-for="opt in userTypeOptions" :value="opt">{{ opt.label }}</option>
                          </select>
                        </v-select>
                        <v-select :label="userTypeRange.label" width="140px" class="ml5">
                          <select v-model="userTypeRange" v-form-ctrl name="userTypeRange">
                            <option v-for="opt in userTypeRangeOptions" :value="opt">{{ opt.label }}</option>
                          </select>
                        </v-select>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-5">推送地域</label>
                    <div class="controls col-19 clearfix">
                      <div class="radio-group w150 fl">
                        <label class="radio">
                          <input type="radio">不限
                        </label>
                        <label class="radio">
                          <input type="radio">自定义
                        </label>
                      </div>
                      <div class="select-group fl">
                        <area-select :province.sync="selectedProvince" :city.sync="selectedCity" :district.sync="selectedDistrict"></area-select>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="form-row row">
                    <label class="form-control col-5">推送范围:</label>
                    <div class="controls col-19">
                      <div class="row mb10">
                        <div class="col-4 control-text">用户类型</div>
                        <div class="col-20 select-group">
                          <v-select :label="userType.label" width="100px">
                            <select v-model="userType" v-form-ctrl name="userType">
                              <option v-for="opt in userTypeOptions" :value="opt">{{ opt.label }}</option>
                            </select>
                          </v-select>
                          <v-select :label="userTypeRange.label" width="140px" class="ml5">
                            <select v-model="userTypeRange" v-form-ctrl name="userTypeRange">
                              <option v-for="opt in userTypeRangeOptions" :value="opt">{{ opt.label }}</option>
                            </select>
                          </v-select>
                        </div>
                      </div>
                      <div class="row mb10">
                        <div class="col-4 control-text">地域</div>
                        <div class="col-20">
                          <area-select :province.sync="selectedProvince" :city.sync="selectedCity" :district.sync="selectedDistrict"></area-select>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4 control-text">标签</div>
                        <div class="col-20">
                          <div class="checkbox-group">
                            <label v-for="type in tags" class="checkbox">
                              <input type="checkbox" v-model="model.tags" name="tags" :value="$index+1" number/>{{ type }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> -->
                </div>
                <div v-show="model.type===3">
                  <template v-for="n in 2">
                    <div class="col-offset-5 mt10 clearfix">
                      <div class="input-text-wrap w200 fl">
                        <input type="text" class="input-text input-text-sm" placeholder="请输入用户ID">
                      </div>
                      <div class="fl btn-box">
                        <button class="btn btn-sm btn-ghost">
                          <i class="fa fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd">
              <h3>2 推送内容</h3>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="row mb10">
                  <div class="col-19 col-offset-5 hl-gray">iOS平台填写标题即可</div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5">推送标题:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'不可超过20个字符'" class="input-text-wrap">
                      <input v-model="model.title" type="text" v-form-ctrl name="title" maxlength="20" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-5">推送描述:</label>
                  <div class="controls col-19">
                    <div v-placeholder="'不可超过200个字符'" class="input-text-wrap">
                      <input v-model="model.desc" type="text" v-form-ctrl name="desc" maxlength="30" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd">
              <h3>3 推送时间</h3>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-5">推送时间:</label>
                  <div class="controls col-19 row">
                    <div class="radio-group col-8">
                      <label v-for="type in startTypes" class="radio">
                        <input type="radio" v-model="model.startType" name="startType" :value="$index+1" number/>{{ type }}
                      </label>
                    </div>
                    <div class="row col-14" v-show="model.startType>1">
                      <date-picker></date-picker>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-hd">
              <h3>4 打开方式</h3>
            </div>
            <div class="panel-bd">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-5">打开消息:</label>
                  <div class="controls col-19">
                    <div class="radio-group mb10">
                      <label v-for="type in openTypes" class="radio">
                        <input type="radio" v-model="openType" name="openType" :value="$index+1" number/>{{ type }}
                      </label>
                    </div>
                    <div v-show="openType===1" class="input-text-wrap">
                      <input v-model="model.openContent" type="text" name="openContent" class="input-text"/>
                    </div>
                    <div v-show="openType===2" class="input-text-wrap">
                      <input v-model="model.openContent" type="text" name="openContent" class="input-text"/>
                    </div>
                    <div v-show="openType===3" class="input-text-wrap">
                      <editor :value="model.openContent"></editor>
                    </div>
                  </div>
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
  import TimePicker from 'components/TimePicker'
  import AreaSelect from 'components/AreaSelect'
  import RadioButtonGroup from 'components/RadioButtonGroup'
  import Editor from 'components/Editor'

  export default {
    name: 'AddBroadcast',

    mixins: [globalMixins],

    components: {
      'editor': Editor,
      'v-select': Select,
      'date-picker': DatePicker,
      'time-picker': TimePicker,
      'area-select': AreaSelect,
      RadioButtonGroup
    },

    data () {
      return {
        validation: {},
        channelOptions: [{
          label: 'APP1',
          value: 'APP1'
        }, {
          label: 'APP2',
          value: 'APP2'
        }],
        channel: {
          label: 'APP1',
          value: 'APP1'
        },
        types: [
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
        tags: ['大客户', '金牌客户', '银牌客户'],
        startTypes: ['现在', '自定义'],
        startDate: '2016-05-13',
        startTime: '00:00',
        endDate: '2016-05-13',
        endTime: '00:00',
        selectedProvince: {},
        selectedCity: {},
        selectedDistrict: {},
        userTypeOptions: [{
          label: '活跃用户',
          value: 1
        }, {
          label: '沉睡用户',
          value: 2
        }],
        userType: {
          label: '活跃用户',
          value: 1
        },
        userTypeRangeOptions: [{
          label: '7天活跃用户',
          value: 1
        }, {
          label: '30天活跃用户',
          value: 2
        }],
        userTypeRange: {
          label: '7天活跃用户',
          value: 1
        },
        openTypes: ['打开指定页面', '打开指定网页', '自定义内容', '直接打开APP'],
        model: {
          channel: '', // 推送渠道
          type: 1, // 推送类型
          title: '', // 标题
          desc: '', // 描述
          tags: [], // 标签
          startType: 1, // 推送时间类型
          openContent: ''
        },
        openType: 1 // 打开消息类型
      }
    },

    methods: {
      onSubmit () {
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'

  .form
    max-width 640px
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
