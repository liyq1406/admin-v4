<template>
  <div class="main">
    <div class="main-title">
      <h2>修改工单</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16 alert-max form">
            <form  v-form name="addValidation" @submit.prevent="onSubmit" hook="addFormHook">
              <div class="form-row row">
                <label class="form-control col-5 alert-label">设备SN:</label>
                <div class="controls col-19">
                  <div v-placeholder="'请输入设备序列号'" class="input-text-wrap">
                    <input v-model="addModal.sn" type="text" v-form-ctrl name="name" minlength="2" maxlength="32" lazy required class="input-text"/>
                  </div>
                  <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.name')}) }}</span></div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">设备类型:</label>
                <div class="controls col-19">
                  <x-select :label="'空气净化器'" :width="'120px'">
                    <select v-model="addModal.deviceType">
                      <option v-for="type in deviceTypes" :value="type">{{ type.label }}</option>
                    </select>
                  </x-select>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修类型:</label>
                <div class="controls col-19">
                  <x-select :label="'设备故障'" :width="'120px'">
                    <select v-model="addModal.deviceType">
                      <option v-for="type in deviceTypes" :value="type">{{ type.label }}</option>
                    </select>
                  </x-select>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修内容:</label>
                <div class="controls col-19">
                  <div v-placeholder="'请输入维修内容'" class="input-text-wrap">
                    <input v-lengthtip="{max: 32, model:addModal.content }" v-model="addModal.content" type="text" v-form-ctrl name="name" minlength="0" maxlength="32" lazy required class="input-text"/>
                  </div>
                  <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.name')}) }}</span></div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修说明:</label>
                <div class="controls col-19">
                  <div v-placeholder="'请输入维修说明'" class="input-text-wrap">
                    <textarea v-lengthtip="{max: 240, model:addModal.discription }" v-model="addModal.sn" type="text" v-form-ctrl name="name" minlength="2" maxlength="32" lazy required class="input-text"></textarea>
                  </div>
                  <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.name')}) }}</span></div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修照片:</label>
                <div class="controls col-19">
                  <image-uploader :images="images"></image-uploader>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">处理人员:</label>
                <div class="controls col-19">
                  <x-select :label="'陈翔'" :width="'120px'">
                    <select v-model="addModal.deviceType">
                      <option v-for="type in deviceTypes" :value="type">{{ type.label }}</option>
                    </select>
                  </x-select>
                </div>
              </div>

              <div class="form-actions mt20 border-top row">
                <div class="col-offset-5 col-19">
                  <button type="submit" :disabled="adding" :class="{'disabled':adding}"  class="btn btn-primary mt5 ml20 submit-btn">提交</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Breadcrumb from 'components/Breadcrumb'
  import Select from 'components/Select'
  import ImageUploader from 'components/ImageUploader'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'add-warranty',

    mixins: [globalMixins],

    components: {
      Breadcrumb,
      ImageUploader,
      'x-select': Select
    },

    data () {
      return {
        addValidation: {},
        breadcrumbNav: [{
          label: '全部',
          link: `/operation/plugins/warranty/${this.$route.params.app_id}/work-orders/repair`
        }, {
          label: '修改工单'
        }],
        addModal: {
        },
        deviceTypes: [
          {
            label: '空气净化器',
            value: 0
          }
        ],
        images: ['']
      }
    },
    methods: {
      addFormHook (form) {
        this.addModal.form = form
      },
      onSubmit () {}
    }
  }
</script>
<style lang='stylus' scoped>
.alert-label
  line-height 32px
  padding-left 20px
  box-sizing border-box
.alert-max
  max-width 700px
.border-top
  border-top 1px solid #DDDDDD
  padding-top 20px
  margin-left -20px
.submit-btn
  width 120px
</style>
