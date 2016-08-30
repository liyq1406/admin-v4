<template>
  <div class="wrap">
    <div class="filter-device">
      <div class="arrow"></div>
      <div class="row item">
        <div class="col-8 label">设备导入时间段:</div>
        <div class="col-16">
          <div class="ml10">
            <date-time-range-picker></date-time-range-picker>
          </div>
        </div>
      </div>
      <div class="row item">
        <div class="col-8 label">产品序列号SN范围:</div>
        <div class="col-16">
          <div class="row ml10">
            <div class="col-10">
              <x-select width="160px" size="small" :label="'SN92892892839'">
                <select v-model="startSN" @change="">
                  <option v-for="option in SNList" :value="option">{{ option }}</option>
                </select>
              </x-select>
            </div>
            <div class="col-2">
              <span class="sn-range-label">至</span>
            </div>
            <div class="col-10">
              <x-select width="160px" size="small" :label="'SN92892892839'">
                <select v-model="endSN" @change="">
                  <option v-for="option in SNList" :value="option">{{ option }}</option>
                </select>
              </x-select>
            </div>
          </div>
        </div>
      </div>
      <div class="row item">
        <div class="col-8 label">设备ID:</div>
        <div class="col-16">
          <div class="row ml10">
            <div class="col-10">
              <x-select width="160px" size="small" :label="'SN92892892839'">
                <select v-model="startSN" @change="">
                  <option v-for="option in SNList" :value="option">{{ option }}</option>
                </select>
              </x-select>
            </div>
            <div class="col-2">
              <span class="sn-range-label">至</span>
            </div>
            <div class="col-10">
              <x-select width="160px" size="small" :label="'SN92892892839'">
                <select v-model="endSN" @change="">
                  <option v-for="option in SNList" :value="option">{{ option }}</option>
                </select>
              </x-select>
            </div>
          </div>
        </div>
        </div>
    </div>
    <div class="tips-wrap">
      <span class="tips fr mr10">*任选一项进行筛选</span>
    </div>
    <div class="fr mr10">
      <button class="btn btn-primary btn-lg">下一步</button>
    </div>
  </div>
</template>

<script>
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import Select from 'components/Select'
export default {
  components: {
    DateTimeRangePicker,
    'x-select': Select
  },
  data () {
    return {
      startSN: '',
      endSN: '',
      SNList: ['xxxxxxxx']
    }
  },
  computed: {},
  ready () {},
  methods: {}
}
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'
.wrap
  position relative
  .filter-device
    background-color #F2F2F2
    margin 20px -30px
    padding 20px 30px
    font-size 15px
    .arrow
      width 20px
      height 20px
      background-color #F2F2F2
      position absolute
      top -10px
      left 128px
      transform rotate(45deg)
    .item
      margin-top 30px
      margin-bottom 20px
      .label
        text-align right
        padding-right 20px
        box-sizing border-box
        color #1E1E1E
        line-height 26px
      .sn-range-label
        line-height 28px
  .tips-wrap
     width 100%
     &:after
       content ''
       clear both
       display block
    .tips
      color red
      margin-bottom 5px
      width 120px
      text-align center
</style>
