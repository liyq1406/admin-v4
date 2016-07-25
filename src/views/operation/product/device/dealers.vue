<template>
  <div class="panel dealer">
    <div class="panel-bd">
      <div class="info-box">
        <div class="dealer-name-box">
          <span>{{dealer.name}}</span>
        </div>
        <div class="dealer-info-box">
          <div class="row">
            <div class="label col-5">销售时间 :</div>
            <div class="info col-5">{{dealer.time}}</div>
          </div>
          <div class="row">
            <div class="label col-5">联系人 :</div>
            <div class="info col-5">{{dealer.contacts}}</div>
          </div>
          <div class="row">
            <div class="label col-5">手机号 :</div>
            <div class="info col-5">{{dealer.phone}}</div>
          </div>
          <div class="row">
            <div class="label col-5">从属于 :</div>
            <div class="info col-5">{{dealer.from}}</div>
          </div>
          <div class="row">
            <div class="label col-5">负责区域 :</div>
            <div class="info col-5">{{dealer.area}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from 'components/SearchBox'
import AreaSelect from 'components/AreaSelect'
import Select from 'components/Select'

export default {
  name: 'Dealers',

  components: {
    'v-select': Select,
    'area-select': AreaSelect,
    'search-box': SearchBox
  },

  data () {
    return {
      dealer: {
        name: '广州海珠总代理',
        time: '2016-1-1 16:00:00',
        contacts: '阿怡',
        phone: '13800138000',
        from: '华南总代理',
        area: '华南地区'
      }
    }
  },
  ready () {
  },
  methods: {
  }
}
</script>
<style lang="stylus">
  @import '../../../../assets/stylus/common'

  .dealer
    .info-box
      padding 10px
      box-sizing border-box
      clearfix()
      .dealer-name-box
        font-size 16px
        text-align center
        float left
        color #333
        width 190px
      .dealer-info-box
        font-size 14px
        border-left 1px solid #ccc
        width 500px
        float left
        padding 0 10px
        line-height 30px
        .label
          text-align right
          padding-right 15px
          box-sizing border-box
          color #999
        .info
          color #666
          white-space nowrap
          height 20px
</style>
