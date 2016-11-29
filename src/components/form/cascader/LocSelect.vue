<template>
  <div class="area-select">
    <div class="select-box">
      <x-select width="120px" :label="country.name" :placeholder="$t('components.area.select_country')" :size="selectSize">
        <span slot="label" v-if="label.length">{{ label }}</span>
        <select v-model="country" @change="handleCountryChange(country.code)">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in countryOptions" :value="option">{{ option.name }}</option>
        </select>
      </x-select>
    </div>
    <div class="select-box">
      <x-select v-show="countryOptions.length && country.code && !noState" width="120px" :label="state.name" :placeholder="$t('components.area.select_province')" :size="selectSize">
        <span slot="label" v-if="label.length">{{ label }}</span>
        <select v-model="state" @change="handlestateChange(state.code)">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in stateOptions" :value="option">{{ option.name }}</option>
        </select>
      </x-select>
    </div>
    <div class="select-box">
      <x-select v-show="cityOptions.length && (state.code || noState)" width="120px" :label="city.name" :placeholder="$t('components.area.select_city')" :size="selectSize">
        <select v-model="city" @change="handleCityChange(city.code)">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in cityOptions" :value="option">{{ option.name }}</option>
        </select>
      </x-select>
    </div>
    <div class="select-box" v-show="showregion">
      <x-select v-show="regionOptions.length && city.code" width="120px" :label="region.name" :placeholder="$t('components.area.select_district')" :size="selectSize">
        <select v-model="region" @change="handleregionChange(region.code)">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in regionOptions" :value="option">{{ option.name }}</option>
        </select>
      </x-select>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import locParser from 'utils/location-parser'

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

    showregion: {
      type: Boolean,
      default: true
    },

    defaultCountryCode: {
      type: String,
      default: ''
    },

    defaultStateCode: {
      type: String,
      default: ''
    },

    defaultCityCode: {
      type: String,
      default: ''
    },

    defaultRegionCode: {
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

  watch: {
    defaultCountryCode () {
      this.setDefaultCountry()
    },
    countryOptions () {
      this.setDefaultCountry()
    },
    stateOptions () {
      this.setDefaultState()
    },
    cityOptions () {
      this.setDefaultCity()
    },
    regionOptions () {
      this.setDefaultRegion()
    }
  },

  methods: {
    setDefaultCity () {
      if (!this.defaultCityCode || !this.cityOptions.length) {
        return
      }
      let findCity = _.find(this.cityOptions, (city) => {
        return this.defaultCityCode === city.code
      })
      if (findCity) {
        this.city = findCity
        this.handleCityChange(findCity.code, true)
      }
    },
    setDefaultRegion () {
      if (!this.defaultRegionCode || !this.regionOptions.length) {
        return
      }
      let findRegion = _.find(this.regionOptions, (region) => {
        return this.defaultRegionCode === region.code
      })
      if (findRegion) {
        this.region = findRegion
        this.handleRegionChange(findRegion.code, true)
      }
    },
    setDefaultState () {
      if (!this.defaultStateCode || !this.stateOptions.length) {
        return
      }
      let findState = _.find(this.stateOptions, (state) => {
        return this.defaultStateCode === state.code
      })
      if (findState) {
        this.state = findState
        this.handlestateChange(findState.code, true)
      }
    },
    setDefaultCountry () {
      if (!this.defaultCountryCode || !this.countryOptions.length) {
        return
      }
      let findCountry = _.find(this.countryOptions, (country) => {
        return this.defaultCountryCode === country.code
      })
      if (findCountry) {
        this.country = findCountry
        this.handleCountryChange(findCountry.code, true)
      }
    },
    handleCountryChange (countryCode, init = false) {
      this.stateOptions = []
      this.regionOptions = []
      this.cityOptions = []
      this.state = {}
      this.city = {}
      this.region = {}
      this.noState = false

      // 向父组件传递省份改变事件
      if (!init) {
        this.$emit('country-change', countryCode || '')
      }

      if (!countryCode) {
        return
      }

      // 获取对应省份
      locParser.getLocByCountryCode(countryCode, this.lang).then((res) => {
        this.originState = res.data.states || []
        if (!this.originState.length) {
          this.noState = true
          this.stateOptions = []
          return
        }
        let stateOptions = []
        if (this.originState.length === 1) { // 某些国家没有省, 直接显示市
          if (!this.originState[0].code) {
            this.handlestateChange(-1)
            this.noState = true
            return
          } else {
            stateOptions.push({
              name: this.originState[0].name,
              code: this.originState[0].code
            })
            return
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
    handlestateChange (stateCode, init = false) {
      this.cityOptions = []
      this.regionOptions = []
      this.city = {}
      this.region = {}

      // 向父组件传递省份改变事件
      if (stateCode !== -1 && !init) {
        this.$emit('state-change', stateCode || '')
      }

      if (!stateCode) {
        return
      }

      if (stateCode === -1) { // 表示那些没有省只有市的情况
        stateCode = ''
      }

      // 获取对应省份
      this.curOriginState = _.find(this.originState, (item) => {
        return (item.code || '') === stateCode
      })

      let citys = this.curOriginState.citys || []
      if (!citys.length) {
        this.cityOptions = []
        return
      }
      let cityOptions = []
      citys.forEach((item) => {
        cityOptions.push({
          name: item.name,
          code: item.code
        })
      })
      this.cityOptions = cityOptions
    },

    /**
     * 处理切换市
     */
    handleCityChange (cityCode, init = false) {
      this.region = {}
      this.regionOptions = []

      // 向父组件传递市改变事件
      if (!init) {
        this.$emit('city-change', cityCode || '')
      }

      if (!cityCode) {
        return
      }

      this.curOriginCity = _.find(this.curOriginState.citys, (item) => {
        return cityCode === item.code
      })

      let regions = this.curOriginCity.regions || []
      if (!regions.length) {
        this.regionOptions = []
        return
      }
      let regionOptions = []
      regions.forEach((item) => {
        regionOptions.push({
          name: item.name,
          code: item.code
        })
      })
      this.regionOptions = regionOptions
    },

    /**
     * 处理切换区
     */
    handleregionChange (regionCode, init = false) {
      // 向父组件传递区改变事件
      if (!init) {
        this.$emit('region-change', regionCode || '')
      }
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
