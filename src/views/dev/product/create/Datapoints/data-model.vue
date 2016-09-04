<template lang="html">
  <div class="">
    <modal :show.sync="show" width="720px">
      <h3 slot="header">导入数据模型</h3>
      <div slot="body" class="form">
        <div class="data-models">
          <div class="model-list">
            <ul>
              <li class="active">智能照明</li>
              <li>电工产品</li>
              <li>厨房电器</li>
              <li>空气清洁</li>
              <li>安防产品</li>
              <li>健康空戴</li>
              <li>社区产品</li>
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
          <button :disabled="importing" :class="{'disabled':importing}" class="btn btn-primary">导入</button>
          <button @click.prevent.stop="onImportCancel" class="btn btn-default">取消</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import Modal from 'components/Modal'
import { globalMixins } from 'src/mixins'

export default {
  name: 'import-datapoints-model',

  mixins: [globalMixins],

  components: {
    Modal
  },

  props: {
    show: {
      type: Boolean,
      default: false,
      twoway: true
    }
  },
  data () {
    return {
      importing: false
    }
  },
  computed: {},
  ready () {},
  methods: {
    onImportCancel () {
      this.show = false
    }
  }
}
</script>

<style lang="stylus">
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
