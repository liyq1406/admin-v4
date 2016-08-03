<template>
  <div class="area-select">
    <div class="select-box">
      <v-select width="120px" :label="province.name" placeholder="请选择省" :size="selectSize">
        <span slot="label" v-if="label.length">{{ label }}</span>
        <select v-model="province" @change="handleProvinceChange">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in provinces" :value="option">{{ option.name }}</option>
        </select>
      </v-select>
    </div>
    <div class="select-box">
      <v-select v-show="cityOptions.length && province.name" width="120px" :label="city.name" placeholder="请选择市" :size="selectSize">
        <select v-model="city" @change="handleCityChange">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in cityOptions" :value="option">{{ option.name }}</option>
        </select>
      </v-select>
    </div>
    <div class="select-box">
      <v-select v-show="districtOptions.length && city.name" width="120px" :label="district.name" placeholder="请选择区" :size="selectSize">
        <select v-model="district" @change="handleDistrictChange">
          <option :value="defaultOption">{{ defaultOption.name }}</option>
          <option v-for="option in districtOptions" :value="option">{{ option.name }}</option>
        </select>
      </v-select>
    </div>
  </div>
</template>

<script>
  import provinces from 'consts/areas/provinces'
  import cities from 'consts/areas/cities'
  import districts from 'consts/areas/districts'
  import Select from '../components/Select'
  import _ from 'lodash'

  export default {
    name: 'AreaSelect',

    components: {
      'v-select': Select
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
        required: true,
        twoWay: true,
        default () {
          return {}
        }
      }
    },

    data () {
      return {
        provinces: provinces,
        cities: cities,
        districts: districts,
        cityOptions: [],
        districtOptions: [],
        defaultOption: {
          name: this.$t('common.any')
        }
      }
    },

    methods: {
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
        this.$dispatch('province-change')
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
        this.$dispatch('city-change')
      },

      /**
       * 处理切换区
       */
      handleDistrictChange () {
        // 向父组件传递区改变事件
        this.$dispatch('district-change')
      }
    }
  }
</script>

<style lang='stylus'>
  .area-select
    font-size 0 !important

    .select-box
      display inline-block
      margin-bottom 5px
    .v-select
      margin-right 5px !important
      font-size 14px !important
</style>
