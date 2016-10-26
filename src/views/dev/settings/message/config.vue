<template lang="html">
  <div class="main">
    <div class="panel">
      <div class="panel-bd">
        <div class="form">
          <form autocomplete="off" v-form name="validation">
            <div class="form-row row borbot">
              <label class="checkbox">
                <input type="checkbox" v-model="codeEnable"/>
                <span>同一个ip超过6次获取验证码，使用图形验证码验证</span>
              </label>
            </div>
            <div class="form-row row">
              <label class="radio">
                <input type="radio" v-model="selectType" :value=1 @change="" number/>使用云智易默认短信运营商
              </label>
            </div>
            <div class="form-row row">
              <label class="radio">
                <input type="radio" v-model="selectType" :value=2 @change="" number/>使用厂商自由短信运营商渠道
              </label>
              <div v-if="this.selectType===2" class="form">
                <div class="form-row row">
                  <label class="form-control col-3 col-offset-1">URL:</label>
                  <div class="controls col-15">
                    <div v-placeholder="'请输入URL'" class="input-text-wrap">
                      <input v-model="" type="text" placeholder="" name="url" custom-validator="noSpacesPrefixAndSuffix" required class="input-text"/>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-3 col-offset-1">Token:</label>
                  <div class="controls col-15">
                    <div v-placeholder="'请输入Token'" class="input-text-wrap">
                      <input v-model="" type="text" name="token" custom-validator="noSpacesPrefixAndSuffix" required class="input-text"/>
                    </div>
                  </div>
                  <div class="col-offset-20">
                    <button class="btn btn-primary btn-lg smallbtn">{{ '验证' }}</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-control col-7">
                <label class="radio">
                  <input type="radio" v-model="selectType" :value=3 @change="" number/>使用自定义短信运营商
                </label>
              </div>
              <div v-if="this.selectType===3" class="col-8">
                <x-select :label="selectedOperator.key">
                  <select v-model="selectedOperator" name="selectedOperator" custom-validator="checkTypeValid" @change="" number>
                    <option v-for="operator in operators" :value="operator">{{ operator.key }}</option>
                  </select>
                </x-select>
              </div>
            </div>
            <div class="form-actions">
              <button type="" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary btn-lg widbtn">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import api from 'api'
  import { globalMixins } from 'src/mixins'
  import Select from 'components/Select'

  export default {
    name: 'MessageSetting',

    mixins: [globalMixins],
    data () {
      return {
        validation: {},
        selectType: 1,
        codeEnable: false,
        operators: [
          {
            key: '运营商一',
            value: 1
          }, {
            key: '运营商二',
            value: 2
          }
        ],
        loadingData: false,
        selectedOperator: {
          key: '运营商一',
          value: 1
        }
      }
    },
    computed: {},
    ready () {},
    methods: {},
    components: {
      'x-select': Select
    }
  }
</script>

<style lang="stylus">
  .borbot
    padding-bottom 20px
    border-bottom 1px solid #d9d9d9
  .smallbtn
    height 32px
    line-height 32px
</style>
