<template>
  <div class="upgrade-panel">
    <validator name="autoValidation">
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
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary upgrade-add-submit">立即升级</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-default upgrade-cancel">取消</button>
            </div>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'
.upgrade-panel
  border 1px solid #E8E8E8
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
</style>
