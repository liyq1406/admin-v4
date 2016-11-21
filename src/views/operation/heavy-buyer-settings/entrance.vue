<template>
  <div class="panel">
    <div class="panel-sub-hd bordered">界面UI配置</div>
    <div class="form ml10 mt20">
      <div class="form-row row">
        <label class="form-control col-4">登录页文案</label>
        <div class="controls col-12">
          <div class="input-text-wrap">
            <input type="text" v-model="title" name="title" class="input-text"/>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-4">企业logo</label>
        <div class="controls col-18">
          <img :src="logo" width="200">
          <a href="#" class="hl-red" @click.prevent="upload">重新上传</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Entrance',

  data () {
    return {
      title: '托邦云管理台',
      logo: '/static/images/topband_logo.png'
    }
  },

  methods: {
    /**
     * 上传 Logo
     */
    upload () {
    }
  }
}
</script>

<style lang="stylus">
</style>
