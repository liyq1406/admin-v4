<template>
  <div class="panel no-split-line creation-step2">
    <div class="panel-body">
      <div class="filter-bar mt20">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <button class="btn btn-ghost" @click="modal.show=true">导入数据模型</button>
          </div>
        </div>
        <h3>配置数据端点</h3>
      </div>
      <div class="data-table mb40">
        <table class="table">
          <thead>
            <tr>
              <th width="8%">索引</th>
              <th width="15%">端点 ID</th>
              <th width="20%">数据类型</th>
              <th width="15%">单位符号</th>
              <th width="27%">描述</th>
              <th width="15%" class="tac">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="datapoint in datapoints">
              <template v-if="datapoint.editing">
                <td>{{ $index }}</td>
                <td>
                  <div class="input-text-wrap">
                    <input type="text" class="input-text input-text-sm" v-model="datapoint.name">
                  </div>
                </td>
                <td>
                  <v-select :label="getLabelByKey(datapoint.type)" size="small">
                    <select v-model="datapoint.type" name="link_type">
                      <option v-for="type in locales.data.DATAPOINT_TYPES" :value="type.value">{{ type.label }}</option>
                    </select>
                  </v-select>
                </td>
                <td>
                  <div class="input-text-wrap">
                    <input type="text" class="input-text input-text-sm" v-model="datapoint.symbol">
                  </div>
                </td>
                <td>
                  <div class="input-text-wrap">
                    <input type="text" class="input-text input-text-sm" v-model="datapoint.description">
                  </div>
                </td>
                <td class="tac"><a href="#" class="hl-red mr10" @click.prevent="save(datapoint)">保存</a><a href="#" class="hl-red" @click.prevent="cancel(datapoint)">取消</a></td>
              </template>
              <template v-else>
                <td>{{ $index }}</td>
                <td>{{ datapoint.name }}</td>
                <td>{{ datapoint.type }}</td>
                <td>{{ datapoint.symbol }}</td>
                <td>{{ datapoint.description }}</td>
                <td class="tac"><a href="#" class="hl-red" @click.prevent="edit(datapoint)">编辑</a></td>
              </template>
            </tr>
            <tr>
              <td colspan="6">
                <a href="#" @click.prevent="add"><i class="fa fa-plus-circle"></i>添加数据端点</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <modal :show.sync="modal.show" width="720px">
      <h3 slot="header">导入数据模型</h3>
      <div slot="body" class="form">
        <div class="data-models">
          <div class="model-list">
            <ul>
              <li class="active">智能照明</li>
              <li>电工产品</li>
            </ul>
          </div>
          <div class="model-details">
            <div class="data-table">
              <table class="table">
                <thead>
                  <tr>
                    <th width="10%">索引</th>
                    <th width="20%">端点 ID</th>
                    <th width="20%">数据类型</th>
                    <th width="20%">单位符号</th>
                    <th width="30%">描述</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>0</td>
                    <td>asdf</td>
                    <td>asdf</td>
                    <td>asdf</td>
                    <td>asdf</td>
                  </tr>
                  <tr>
                    <td>0</td>
                    <td>asdf</td>
                    <td>asdf</td>
                    <td>asdf</td>
                    <td>asdf</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button @click.prevent.stop="onImportCancel" class="btn btn-default">取消</button>
          <button :disabled="importing" :class="{'disabled':importing}" class="btn btn-primary">导入</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import Select from 'components/Select'
import Modal from 'components/Modal'
import { globalMixins } from 'src/mixins'
import _ from 'lodash'

export default {
  name: 'Datapoints',

  mixins: [globalMixins],

  components: {
    'v-select': Select,
    Modal
  },

  data () {
    return {
      importing: false,
      datapoints: [{
        name: 'asdf',
        type: 1,
        symbol: 'aaaa',
        description: 'bbbb',
        editing: false
      }],
      modal: {
        show: false
      }
    }
  },

  methods: {
    /**
     * 根据 key 值获取 label
     */
    getLabelByKey (key) {
      return _.find(this.locales.data.DATAPOINT_TYPES, (item) => {
        return item.value === key
      }).label
    },

    /**
     * 添加数据端点
     * @author shengzhi
     */
    add () {
      let newItem = {
        name: '',
        type: 1,
        symbol: '',
        description: '',
        editing: true
      }
      this.datapoints.push(newItem)
    },

    edit (datapoint) {
      datapoint.editing = true
    },

    /**
     * 保存数据端点
     */
    save (datapoint) {
      datapoint.editing = false
    },

    /**
     * 移除数据端点
     */
    cancel (datapoint) {
      datapoint.editing = false
    },

    /**
     * 取消导入
     */
    onImportCancel () {
      this.modal.show = false
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

.creation-step2
  .filter-bar
    border-bottom 1px solid light-border-color

  .modal
    .modal-body
      padding 0 0 20px
      background #FFF

      .form
        max-width none

        .form-actions
          padding-right 20px

  .data-models
    margin-bottom 20px
    border-bottom 1px solid default-border-color
    clearfix()

    .model-list
      float left
      width 160px
      background #F2F2F2
      height 380px
      overflow-y auto

      li
        padding 10px 30px
        line-height 20px
        font-size 12px
        position relative
        cursor pointer

        &.active
          background red
          color #FFF

          &:after
            absolute right top 50%
            content ''
            triangle #FFF 10px left
            margin-top -5px

    .model-details
      margin-left 160px
      height 380px
      overflow-y auto

      .data-table
        padding 30px
</style>
