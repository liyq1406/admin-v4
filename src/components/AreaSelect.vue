<template>
  <div class="area-select">
    <v-select width="120px" :label="province.name" placeholder="请选择省">
      <span slot="label">所在地区：</span>
      <select v-model="province" @change="handleProvinceChange">
        <option v-for="option in provinces" :value="option">{{ option.name }}</option>
      </select>
    </v-select>
    <v-select v-show="cityOptions.length" width="120px" :label="city.name" placeholder="请选择市">
      <select v-model="city" @change="handleCityChange">
        <option v-for="option in cityOptions" :value="option">{{ option.name }}</option>
      </select>
    </v-select>
    <v-select v-show="districtOptions.length" width="120px" :label="district.name" placeholder="请选择区">
      <select v-model="district" @change="handleDistrictChange">
        <option v-for="option in districtOptions" :value="option">{{ option.name }}</option>
      </select>
    </v-select>
  </div>
</template>

<script>
  import provinces from '../consts/areas/provinces'
  import cities from '../consts/areas/cities'
  import districts from '../consts/areas/districts'
  import Select from '../components/Select'
  import _ from 'lodash'

  export default {
    name: 'AreaSelect',

    components: {
      'v-select': Select
    },

    props: {
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
        districtOptions: []
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
