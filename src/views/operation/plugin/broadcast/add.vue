<template>
  <form v-form name="validation" @submit.prevent="onSubmit">
    <div class="panel">
      <div class="panel-bd">
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-5">推送渠道:</label>
            <div class="controls col-19">
              <v-select :label="channel.label" width="200px">
                <select v-model="channel" v-form-ctrl name="channel">
                  <option v-for="opt in channelOptions" :value="opt">{{ opt.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">推送类型:</label>
            <div class="controls col-19">
              <div class="radio-group">
                <label v-for="type in types" class="radio">
                  <input type="radio" v-model="model.type" name="type" :value="$index+1" number/>{{ type }}
                </label>
              </div>
              <div v-show="model.type===3" class="input-text-wrap mt5">
                <textarea v-model="model.userList" name="userList" class="input-text"></textarea>
              </div>
            </div>
          </div>
          <div class="form-row row" v-show="model.type===2">
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
          </div>
          <div class="form-row row">
            <label class="form-control col-5">推送时间:</label>
            <div class="controls col-19">
              <div class="radio-group">
                <label v-for="type in startTypes" class="radio">
                  <input type="radio" v-model="model.startType" name="startType" :value="$index+1" number/>{{ type }}
                </label>
              </div>
              <div class="row mt10" v-show="model.startType>1">
                <date-picker :value.sync="startDate"></date-picker>
                <time-picker :value.sync="startTime"></time-picker>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">过期时间:</label>
            <div class="controls col-19">
              <date-picker :value.sync="endDate"></date-picker>
              <time-picker :value.sync="endTime"></time-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
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
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import Select from 'components/Select'
  import DatePicker from 'components/DatePicker'
  import TimePicker from 'components/TimePicker'
  import AreaSelect from 'components/AreaSelect'
  import Editor from 'components/Editor'

  export default {
    name: 'AddBroadcast',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'editor': Editor,
      'v-select': Select,
      'date-picker': DatePicker,
      'time-picker': TimePicker,
      'area-select': AreaSelect
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
        types: ['所有用户', '按分组', '指定用户'],
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

  .select-group
    .v-select
      display inline-block
</style>
