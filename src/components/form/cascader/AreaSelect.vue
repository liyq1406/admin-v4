<template>
  <div class="area-select">
    <div class="select-box">
      <x-select width="120px" :label="province.name" :placeholder="$t('components.area.select_province')" :size="selectSize">
        <span slot="label" v-if="label.length">{{ label }}</span>
        <select v-model="province" @change="handleProvinceChange">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in provinces" :value="option">{{ option.name }}</option>
        </select>
      </x-select>
    </div>
    <div class="select-box">
      <x-select v-show="cityOptions.length && province.name" width="120px" :label="city.name" :placeholder="$t('components.area.select_city')" :size="selectSize">
        <select v-model="city" @change="handleCityChange">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in cityOptions" :value="option">{{ option.name }}</option>
        </select>
      </x-select>
    </div>
    <div class="select-box" v-show="showDistrict">
      <x-select v-show="districtOptions.length && city.name" width="120px" :label="district.name" :placeholder="$t('components.area.select_district')" :size="selectSize">
        <select v-model="district" @change="handleDistrictChange">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in districtOptions" :value="option">{{ option.name }}</option>
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

    // 省
    province: {
      type: Object,
      required: true,
      twoWay: true,
      default () {
        return {}
      }
    },

    // 市
    city: {
      type: Object,
      required: true,
      twoWay: true,
      default () {
        return {}
      }
    },

    // 区
    district: {
      type: Object,
      required: false,
      twoWay: true,
      default () {
        return {}
      }
    },

    showDistrict: {
      type: Boolean,
      default: true
    },

    defaultValue: { // '广东省, 广州市, 海珠区'
      type: String,
      default: ''
    }
  },

  data () {
    return {
      provinces: [],
      cities: [],
      districts: [],
      cityOptions: [],
      districtOptions: [],
      defaultOption: {
        name: this.$t('common.any')
      }
    }
  },

  created () {
    const FILE_NAMES = ['provinces', 'cities', 'districts']

    // 从文件中导入地区数据
    for (let i = 0, len = FILE_NAMES.length; i < len; i++) {
      this.$http.get(`/static/data/areas/${FILE_NAMES[i]}.json`).then((res) => {
        this[FILE_NAMES[i]] = res.data
      })
    }
  },

  watch: {
    defaultValue () {
      this.setDefault()
    },
    provinces () {
      this.setDefault()
    },
    citys () {
      this.setDefault()
    },
    districts () {
      this.setDefault()
    }
  },

  methods: {
    setDefault () {
      if (!this.defaultValue || !this.provinces.length) {
        return
      }
      let areas = this.defaultValue.split(',')
      if (areas[0]) { // 省
        let province = areas[0].trim()
        let findProvince = _.find(this.provinces, (provinceItem) => {
          return provinceItem.name === province
        })
        if (findProvince) {
          this.province = findProvince
          this.handleProvinceChange()
          if (areas[1]) { // 市
            let city = areas[1].trim()
            let findCity = _.find(this.cityOptions, (cityItem) => {
              return cityItem.name === city
            })
            if (findCity) {
              this.city = findCity
              this.handleCityChange()
              if (areas[2]) {
                let district = areas[2].trim()
                let findDistrict = _.find(this.districtOptions, (districtItem) => {
                  return districtItem.name === district
                })
                if (findDistrict) {
                  this.district = findDistrict
                  this.handleDistrictChange()
                }
              }
            }
          }
        }
      }
    },
    /**
     * 处理切换省
     */
    handleProvinceChange () {
      this.districtOptions = []

      // 获取对应城市
      this.cityOptions = _.filter(this.cities, (item) => {
        return item.proID === this.province.proID
      })

      this.city = {}
      this.district = {}

      // 向父组件传递省份改变事件
      this.$emit('province-change')
    },

    /**
     * 处理切换市
     */
    handleCityChange () {
      // 获取对应区
      this.districtOptions = _.filter(this.districts, (item) => {
        return item.cityID === this.city.cityID
      })

      this.district = {}

      // 向父组件传递市改变事件
      this.$emit('city-change')
    },

    /**
     * 处理切换区
     */
    handleDistrictChange () {
      // 向父组件传递区改变事件
      this.$emit('district-change')
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
