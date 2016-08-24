<template>
  <div class="upgrade-panel">
    <!-- <validator name="autoValidation">
      <form novalidate @submit.prevent="">
        <div class="panel no-split-line">
          <div class="panel-hd mt30">
            <h2 class="title">26度佳</h2>
          </div>
          <div class="panel-bd">
            <div class="form-row row mt30">
              <label class="form-control col-5 ml20 dealer-label">当前版本:</label>
              <div class="controls col-16">
                <span>v1.0</span>
              </div>
            </div>
            <div class="form-row row mt30">
              <label class="form-control col-5 ml20 dealer-label">升级版本号:</label>
              <div class="controls col-16">
                <div class="input-text-wrap">
                  <input v-model="" type="email" name="username" placeholder="请输入升级版本号" minlength="2" maxlength="32" v-validate:username="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$autoValidation.username.touched && $autoValidation.username.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row mt30">
              <label class="form-control col-5 ml20 dealer-label">下载地址:</label>
              <div class="controls col-16">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="password" placeholder="请输入下载地址" minlength="6" maxlength="16" v-validate:password="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$autoValidation.password.touched && $autoValidation.password.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.password')}) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row mt30">
              <label class="form-control col-5 ml20 dealer-label">HASH值:</label>
              <div class="controls col-16">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="password" placeholder="请输入HASH值" minlength="6" maxlength="16" v-validate:password="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$autoValidation.password.touched && $autoValidation.password.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.password')}) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row mt30">
              <label class="form-control col-5 ml20 dealer-label">更新日志:</label>
              <div class="controls col-16">
                <div class="input-text-wrap">
                  <textarea v-model="" type="text" name="password" placeholder="请输入更新日志" maxlength="200" class="text-area"></textarea>
                </div>
              </div>
            </div>
            <div class="form-actions mt20">
            </div>
          </div>
        </div>
      </form>
    </validator> -->
    <div class="filter-bar">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <span class="records-title">历史升级记录</span>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <button class="btn btn-primary" :disabled="tips" :class="{'disabled': tips}" @click="showModal = true"><i class="fa fa-plus"></i>添加升级任务</button>
        </div>
      </div>
    </div>
    <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" :simple-page="true" :bordered="false">
    </x-table>

    <modal :show.sync="showModal" @close="" width="600px">
      <h3 slot="header">添加升级任务</h3>
      <div slot="body" class="form upgrade-modal-wrap">
        <validator name="autoValidation">
          <form novalidate @submit.prevent="">
            <div class="form-row row">
              <label class="form-control col-6">当前信息:</label>
              <div class="controls col-18">
                <span>Xlink APP v1.0</span>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">升级版本号:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="" type="email" name="username" placeholder="请输入升级版本号" minlength="2" maxlength="32" v-validate:username="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$autoValidation.username.touched && $autoValidation.username.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.username')}) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">下载地址:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="password" placeholder="请输入下载地址" minlength="6" maxlength="16" v-validate:password="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$autoValidation.password.touched && $autoValidation.password.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.password')}) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">HASH值:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="" type="text" name="password" placeholder="请输入HASH值" minlength="6" maxlength="16" v-validate:password="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$autoValidation.password.touched && $autoValidation.password.required">{{ $t('ui.validation.required', {field: $t('ui.dealer.fields.password')}) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">更新日志:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <textarea v-model="" type="text" name="password" placeholder="请输入更新日志" maxlength="200" class="text-area"></textarea>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">立即升级</button>
              <button type="submit" class="btn btn-default">取消</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
  </div>
</template>

<script>
  import Table from 'components/Table'
  import { globalMixins } from 'src/mixins'
  import Modal from 'components/Modal'

  export default {
    name: 'upgrade-record',

    mixins: [globalMixins],

    components: {
      'x-table': Table,
      Modal
    },
    data () {
      return {
        showModal: false,
        headers: [
          {
            key: 'sn',
            title: '序号'
          },
          {
            key: 'start',
            title: '起始版本号'
          },
          {
            key: 'destination',
            title: '目标版本号'
          },
          {
            key: 'time',
            title: '升级时间'
          },
          {
            key: 'description',
            title: '更新说明'
          },
          {
            key: 'link',
            title: '下载链接'
          }
        ],
        total: 0,
        currentPage: 1,
        countPerPage: 10,
        records: []
      }
    },
    computed: {
      page () {
        var result = {
          total: this.total,
          currentPage: this.currentPage,
          countPerPage: this.countPerPage
        }
        return result
      },
      tables () {
        var result = []
        return result
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'
.upgrade-panel
  border 1px solid #E8E8E8
  padding 20px
  min-height 400px
  .title
    font-size 28px
    margin 35px 0 0 20px
    font-weight 200
  .text-area
    width 100%
    height 120px
    border 1px solid #d9d9d9
    padding 0 10px
    box-sizing border-box
  .upgrade-add-submit
    margin-left 20px
  .upgrade-cancel
    margin-left 20px

.records-title
  font-size 14px
.upgrade-modal-wrap
  padding 15px !important
</style>
