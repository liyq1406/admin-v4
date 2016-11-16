<template>
  <div class="area-select">
    <div class="select-box">
      <x-select width="120px" :label="country.name" :placeholder="$t('components.area.select_country')" :size="selectSize">
        <span slot="label" v-if="label.length">{{ label }}</span>
        <select v-model="country" @change="handleCountryChange(country)">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in countryOptions" :value="option">{{ option.name }}</option>
        </select>
      </x-select>
    </div>
    <div class="select-box">
      <x-select v-show="countryOptions.length && country.name && !noState" width="120px" :label="state.name" :placeholder="$t('components.area.select_province')" :size="selectSize">
        <span slot="label" v-if="label.length">{{ label }}</span>
        <select v-model="state" @change="handlestateChange(state)">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in stateOptions" :value="option">{{ option.name }}</option>
        </select>
      </x-select>
    </div>
    <div class="select-box">
      <x-select v-show="cityOptions.length && (state.name || noState)" width="120px" :label="city.name" :placeholder="$t('components.area.select_city')" :size="selectSize">
        <select v-model="city" @change="handleCityChange(city)">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in cityOptions" :value="option">{{ option.name }}</option>
        </select>
      </x-select>
    </div>
    <div class="select-box" v-show="showregion">
      <x-select v-show="regionOptions.length && city.name" width="120px" :label="region.name" :placeholder="$t('components.area.select_region')" :size="selectSize">
        <select v-model="region" @change="handleregionChange(region)">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in regionOptions" :value="option">{{ option.name }}</option>
        </select>
      </x-select>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'AreaSelect',

  components: {
  },

  props: {
    // 尺寸
    selectSize: {
      type: String,
      default: 'normal'
    },

    // 标签
    label: {
      type: String,
      default: ''
    },

    defaultValue: { // 'code, code, code'
      type: String,
      default: ''
    }
  },

  data () {
    return {
      country: {},
      state: {},
      city: {},
      region: {},
      originState: [], // 保存当前国家原始数据
      curOriginState: {}, // 当前省原始数据
      curOriginCity: {}, // 当前市原始数据
      countryOptions: [],
      stateOptions: [],
      cityOptions: [],
      regionOptions: [],
      defaultOption: {
        name: this.$t('common.any')
      },
      noState: false
    }
  },

  created () {
    // 从文件中导入地区数据
    this.$http.get(`/static/data/areas/${this.lang}/countryList.json`).then((res) => {
      this.countryOptions = res.data
    })
  },

  methods: {
    handleCountryChange (country) {
      console.log(country)
      this.regionOptions = []
      this.cityOptions = []
      this.state = {}
      this.city = {}
      this.region = {}
      this.noState = false

      // 向父组件传递省份改变事件
      this.$emit('country-change', country)

      // 获取对应省份
      this.$http.get(`/static/data/areas/${this.lang}/${country.code}.json`).then((res) => {
        this.originState = res.data.states || []
        if (!this.originState.length) {
          this.noState = true
          this.stateOptions = []
          return
        }
        let stateOptions = []
        if (this.originState.length === 1) { // 某些国家没有省
          console.log(this.originState[0].code)
          if (!this.originState[0].code) {
            this.handlestateChange({})
            this.noState = true
            return
          } else {
            stateOptions.push({
              name: this.originState[0].name,
              code: this.originState[0].code
            })
          }
        }
        this.originState.forEach((item) => {
          stateOptions.push({
            name: item.name,
            code: item.code
          })
        })
        this.stateOptions = stateOptions
      })
    },
    /**
     * 处理切换省
     */
    handlestateChange (state) {
      this.regionOptions = []
      this.city = {}
      this.region = {}

      // 向父组件传递省份改变事件
      this.$emit('state-change', state)

      // 获取对应城市
      this.curOriginState = _.find(this.originState, (item) => {
        return (item.code || '') === (state.code || '')
      })

      console.log(this.curOriginState)

      let citys = this.curOriginState.citys || []
      if (!citys.length) {
        this.cityOptions = []
        return
      }
      let cityOptions = []
      citys.forEach((item) => {
        cityOptions.push({
          name: item.name || '',
          code: item.code || ''
        })
      })
      this.cityOptions = cityOptions
    },

    /**
     * 处理切换市
     */
    handleCityChange (city) {
      this.region = {}

      // 向父组件传递市改变事件
      this.$emit('city-change')

      this.curOriginCity = _.find(this.curOriginState.citys, (item) => {
        let itemCode = item.code || ''
        return city.code === itemCode
      })

      let regions = this.curOriginCity.regions || []
      if (!regions.length) {
        this.regionOptions = []
        return
      }
      let regionOptions = []
      regions.forEach((item) => {
        regionOptions.push({
          name: item.name || '',
          code: item.code || ''
        })
      })
      this.regionOptions = regionOptions
    },

    /**
     * 处理切换区
     */
    handleregionChange (region) {
      // 向父组件传递区改变事件
      this.$emit('region-change', region)
    }
  }
}
</script>

<style lang='stylus'>
.area-select
  font-size 0 !important

  .select-box
    display inline-block

  .x-select
    margin-right 5px !important
    font-size 14px !important
</style>
