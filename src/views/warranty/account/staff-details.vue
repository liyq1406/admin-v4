<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb">
        <a v-link="{path: '/warranty/accounts/' + $route.params.account_id}">
          <i class="fa fa-arrow-circle-left"></i>网点详情
        </a>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <h2>客服详情</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">创建日期:</div>
              <div class="info"></div>
            </li>
          </ul>
        </div>

        <!-- start: 客服信息 -->
        <div class="panel-hd">
          <div class="actions">
            <button @click="editModal = true" class="btn btn-ghost"><i class="fa fa-edit"></i>编辑客服</button>
          </div>
          <h2>客服信息</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">姓名:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">邮箱地址:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">联系电话:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">登陆密码:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">状态:</div>
              <div class="info"></div>
            </li>
          </ul>
        </div>
        <!-- end: 客服信息-->
      </div>

      <modal :show="editModal" width="600px">
        <h3 slot="header">编辑客服</h3>
        <div slot="body" class="form">
          <form v-form name="editValidation" @submit.prevent="onAddSubmit">
            <div class="form-row row">
              <label class="form-control col-6">姓名:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="editStaff.name" type="text" v-form-ctrl name="staff" required lazy class="input-text"/>
                </div>
                <div v-if="editValidation.$submitted && editValidation.staff.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.staff.$error.required">*必须</span></div>
                <div v-if="editValidation.staff.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.staff.$error.required">*必须</span></div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">邮箱地址:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="editStaff.email" type="email" v-form-ctrl name="email" required lazy class="input-text"/>
                </div>
                <div v-if="editValidation.$submitted && editValidation.email.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.email.$error.required">*必须</span></div>
                <div v-if="editValidation.email.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.email.$error.required">*必须</span></div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">联系号码:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="editStaff.tel" type="text" pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" v-form-ctrl name="tel" required lazy class="input-text"/>
                </div>
                <div v-if="editValidation.$submitted && editValidation.tel.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.tel.$error.required">*必须</span></div>
                <div v-if="editValidation.tel.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.tel.$error.required">*必须</span></div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">登陆密码:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="editStaff.passwd" type="text" v-form-ctrl name="passwd" required lazy class="input-text"/>
                </div>
                <div v-if="editValidation.$submitted && editValidation.passwd.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.passwd.$error.required">*必须</span></div>
                <div v-if="editValidation.passwd.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.passwd.$error.required">*必须</span></div>
              </div>
            </div>
            <div class="form-row row">
              <v-select :label="editCustomOptions[editStaff.status.value].label" width="120px">
                <label slot="label">状态</label>
                <select v-model="editStaff.status">
                  <option v-for="customOption in editCustomOptions" :value="customOption">{{customOption.label}}</option>
                </select>
              </v-select>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </modal>

    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../../mixins'
  import Modal from '../../../components/Modal'
  import Select from '../../../components/Select'

  export default {
    name: 'OrderDetails',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {
        editModal: false,
        editValidation: '',
        editCustomOptions: [{
          label: '启用',
          value: 0
        }, {
          label: '停用',
          value: 1}
        ],
        editStaff: {
          name: '',
          passwd: '',
          tel: '',
          email: '',
          status: {
            label: '启用',
            value: 0
          }
        },
        delChecked: false
      }
    },

    components: {
      'modal': Modal,
      'v-select': Select
    },

    methods: {
      onAddSubmit () {

      },
      onAddCancel () {
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'
</style>
