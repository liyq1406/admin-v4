<template>
  <section class="main-wrap">
    <div class="main broadcast-details">
      <div class="breadcrumb"><a v-link="{path: '/plugins/broadcast/history'}"><i class="fa fa-arrow-circle-left"></i>消息推送</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>编辑消息推送</h2>
        </div>
        <div class="panel-bd">
          <form autocomplete="off" v-form name="validation" @submit.prevent="onSubmit">
            <div class="form">
              <div class="form-row row">
                <label class="form-control col-6">推送渠道:</label>
                <div class="controls col-18">
                  <x-select :label="channel.label" width="200px">
                    <select v-model="channel" v-form-ctrl name="channel">
                      <option v-for="opt in channelOptions" :value="opt">{{ opt.label }}</option>
                    </select>
                  </x-select>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">推送类型:</label>
                <div class="controls col-18">
                  <div class="radio-group">
                    <label v-for="(index, type) in types" class="radio">
                      <input type="radio" v-model="model.type" name="type" :value="index+1" number/>{{ type }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-row row" v-show="model.type>1">
                <label class="form-control col-6">推送范围:</label>
                <div class="controls col-18">
                  <div class="row mb10">
                    <div class="col-4 control-text">用户类型</div>
                    <div class="col-20 select-group">
                      <x-select :label="userType.label" width="100px">
                        <select v-model="userType" v-form-ctrl name="userType">
                          <option v-for="opt in userTypeOptions" :value="opt">{{ opt.label }}</option>
                        </select>
                      </x-select>
                      <x-select :label="userTypeRange.label" width="140px" class="ml5">
                        <select v-model="userTypeRange" v-form-ctrl name="userTypeRange">
                          <option v-for="opt in userTypeRangeOptions" :value="opt">{{ opt.label }}</option>
                        </select>
                      </x-select>
                    </div>
                  </div>
                  <div class="row mb10">
                    <div class="col-4 control-text">地域</div>
                    <div class="col-20">
                      <area-select
                        :province="selectedProvince"
                        :city="selectedCity"
                        :district="selectedDistrict"
                        @province-change="onProvinceChange"
                        @city-change="onCityChange"
                        @district-change="onDistrictChange"
                      ></area-select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-4 control-text">标签</div>
                    <div class="col-20">
                      <div class="checkbox-group">
                        <label v-for="(index, type) in tags" class="checkbox">
                          <input type="checkbox" v-model="model.tags" name="tags" :value="index+1" number/>{{ type }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">推送时间:</label>
                <div class="controls col-18">
                  <div class="radio-group">
                    <label v-for="(index, type) in startTypes" class="radio">
                      <input type="radio" v-model="model.startType" name="startType" :value="index+1" number/>{{ type }}
                    </label>
                  </div>
                  <div class="row mt10" v-show="model.startType>1">
                    <date-picker :value="startDate" @select-day="onStartDateSelect"></date-picker>
                    <time-picker :value.sync="startTime" @select-time="onStartTimeSelect"></time-picker>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">过期时间:</label>
                <div class="controls col-18">
                  <date-picker :value="endDate" @select-day="onEndDateSelect"></date-picker>
                  <time-picker :value.sync="endTime" @select-time="onEndTimeSelect"></time-picker>
                </div>
              </div>
            </div>
            <div class="form">
              <div class="row mb10">
                <div class="col-18 col-offset-6 hl-gray">iOS平台填写标题即可</div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">推送标题:</label>
                <div class="controls col-18">
                  <div v-placeholder="'不可超过20个字符'" class="input-text-wrap">
                    <input v-model="model.title" type="text" v-form-ctrl name="title" maxlength="20" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">推送描述:</label>
                <div class="controls col-18">
                  <div v-placeholder="'不可超过30个字符'" class="input-text-wrap">
                    <input v-model="model.desc" type="text" v-form-ctrl name="desc" maxlength="30" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">打开消息:</label>
                <div class="controls col-18">
                  <div class="row mb10">
                    <div class="col-7">
                      <label class="radio">
                        <input type="radio" v-model="model.openType" name="openType" :value="1" number/> 打开指定页面
                      </label>
                    </div>
                    <div class="col-17">
                      <div class="input-text-wrap">
                        <input type="text" class="input-text"/>
                      </div>
                    </div>
                  </div>
                  <div class="row mb10">
                    <div class="col-7">
                      <label class="radio">
                        <input type="radio" v-model="model.openType" name="openType" :value="2" number/> 打开指定网页
                      </label>
                    </div>
                    <div class="col-17">
                      <div class="input-text-wrap">
                        <input type="text" class="input-text"/>
                      </div>
                    </div>
                  </div>
                  <div class="row mb10">
                    <div class="col-7">
                      <label class="radio">
                        <input type="radio" v-model="model.openType" name="openType" :value="3" number/> 打开指定网页
                      </label>
                    </div>
                    <div class="col-17">
                      <div class="input-text-wrap">
                        <textarea type="text" class="input-text"></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-7">
                      <label class="radio">
                        <input type="radio" v-model="model.openType" name="openType" :value="4" number/> 直接打开APP
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-actions row">
                <div class="col-offset-6">
                  <button type="submit" class="btn btn-primary btn-xlg">{{ $t("common.ok") }}</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'AddBroadcast',
    components: {
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
        types: ['广播', '组播', '单播'],
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
        model: {
          channel: '', // 推送渠道
          type: 1, // 推送类型
          title: '', // 标题
          desc: '', // 描述
          tags: [], // 标签
          startType: 1 // 推送时间类型
        }
      }
    },

    methods: {
      /**
       * 处理开始日期改变
       */
      onStartDateSelect (val) {
        this.startDate = val
      },

      /**
       * 处理结束日期改变
       */
      onEndDateSelect (val) {
        this.endDate = val
      },

      /**
       * 处理开始日期改变
       */
      onStartTimeSelect (val) {
        this.startTime = val
      },

      /**
       * 处理结束日期改变
       */
      onEndTimeSelect (val) {
        this.endTime = val
      },

      /**
       * 处理省改变
       */
      onProvinceChange (val) {
        this.selectedProvince = val
      },

      /**
       * 处理市改变
       */
      onCityChange (val) {
        this.selectedCity = val
      },

      /**
       * 处理区改变
       */
      onDistrictChange (val) {
        this.selectedDistrict = val
      },

      onSubmit () {
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'

  .select-group
    .x-select
      display inline-block
</style>
