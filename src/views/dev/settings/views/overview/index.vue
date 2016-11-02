<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="form-row row">
        <div class="form-control col-4">
          <label>选择产品:</label>
        </div>
        <div class="controls col-20">
          <div v-for="i in 12" class="fl input-radio-wrap">
            <input v-model="" type="radio" :value="0" name="connect-type"/>
            <label>一个产品</label>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-control col-4">
          <label>数据指标配置:</label>
        </div>
        <div class="controls col-20">
          <div class="radio-button-wrap">
            <radio-button-group :items="periodsInfo" @select="periodSelect"></radio-button-group>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-control col-4">
          <label>功能模块:</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import api from 'api'
import RadioButtonGroup from 'components/RadioButtonGroup'
import { globalMixins } from 'src/mixins'

export default {
  name: 'custom-overview',

  mixins: [globalMixins],

  components: {
    RadioButtonGroup
  },

  data () {
    return {
    }
  },
  methods: {
    periodSelect () {}
  }
}
</script>

<style lang="stylus">
.input-radio-wrap
  position relative
  line-height 30px
  display inline-block
  input, label
    vertical-align middle
  label
    margin-right 20px
</style>
