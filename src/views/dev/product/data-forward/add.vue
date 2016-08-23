<template>
  <div class="main">
    <div class="main-title">
      <h2>添加数据转发规则</h2> 
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd bt">
        <div class="form ml30">
          <form v-form name="addValidation" @submit.prevent="onAddSubmit">
            <div class="form-row row">
              <label class="form-control col-7">{{ '数据的类型' }}:</label>
              <div class="controls col-17">
                <div class="checkbox-group">
                  <label v-for="type in dataForwardType" class="checkbox">
                    <input type="checkbox" v-model="addModel.data_type" :value="$index+1"/>{{ type }}
                  </label>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-7">{{ '分发类型' }}:</label>
              <div class="controls col-17">
                <div class="select">
                  <v-select :label="dataDestination[addModel.destination.type-1]">
                    <select v-model="addModel.destination.type" name="type" number>
                      <option v-for="type in dataDestination" :value="$index+1" :selected="$index===0">{{ type }}</option>
                    </select>
                  </v-select>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-7">{{ '数据分发目的地' }}:</label>
              <div class="controls col-17">
                <div v-placeholder="'请输入URL'" class="input-text-wrap">
                  <input v-model="addModel.destination.url" type="text" name="url" required minlength="2" maxlength="250" lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-7">{{ 'token' }}:</label>
              <div class="controls col-17">
                <div v-placeholder="'请输入token'" class="input-text-wrap">
                  <input v-model="addModel.destination.token" type="text" name="token" required minlength="2" maxlength="250" lazy class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <!-- <button type="reset" @click.prevent.stop="onAddCancel" class="btn btn-default">{{ '取消' }}</button> -->
              <!-- <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button> -->
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary ml175">提交</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import api from 'api'
  import * as config from 'consts/config'
  import locales from 'consts/locales/index'
  import Modal from 'components/Modal'
  import Pager from 'components/Pager'
  import Select from 'components/Select'
  // import _ from 'lodash'
  import { globalMixins } from 'src/mixins'
  import SearchBox from 'components/SearchBox'
  import Breadcrumb from 'components/Breadcrumb'

  export default {
    name: 'DataForward',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'pager': Pager,
      'v-select': Select,
      Breadcrumb,
      'search-box': SearchBox
    },

    data () {
      return {
        rules: [],            // 规则列表
        key: '',
        datapoints: [],
        dataForwardType: locales[Vue.config.lang].data.DATA_FORWARD_TYPES,
        dataDestination: locales[Vue.config.lang].data.DATA_DESTINATIONS,
        data_type: [],
        notify_type: [],
        countPerPage: config.COUNT_PER_PAGE,
        currentPage: 1,
        total: 0,
        showAddModal: false,
        showEditModal: false,
        addModel: {
          data_type: [],
          destination: {
            type: '',
            url: '',
            token: ''
          }
        },
        editModel: {
          data_type: [],
          destination: {
            type: '',
            url: '',
            token: ''
          }
        },
        editingDatapoint: {},
        addValidation: {},
        editValidation: {},
        delChecked: false,
        adding: false,
        editing: false,
        addForm: {},
        editForm: {},
        originAddModel: {},
        originEditModel: {},
        loadingData: false,
        breadcrumbNav: [{
          label: '数据接口',
          link: '/dev/products/' + this.$route.params.id + '/data-forward'
        }, {
          label: '当前'
        }]
      }
    },

    route: {
      data () {
      }
    },

    ready () {
    },

    methods: {
      // 添加操作
      onAddSubmit () {
        this.adding = true
        api.dataForward.addRule(this.$route.params.id, this.addModel).then((res) => {
          if (res.status === 200) {
            // this.rules.push(res.data)
            this.$route.router.go('/dev/products/' + this.$route.params.id + '/data-forward')
          }
        }).catch((res) => {
          this.handleError(res)
          // this.adding = false
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .bt
    border-top 1px solid #d9d9d9
  .ml30
    margin-left 30px
  .ml175
    margin-left 175px
</style>
