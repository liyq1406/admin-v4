<template>
  <div class="main">
    <div class="main-title">
      <h2>echo</h2>
    </div>
    <div class="panel">
      <div class="row mt20 mb20">
        <div class="col-16">
          <pic-txt :pic-width="139">
            <img slot="pic" src="../../../assets/images/amazon.png" alt="amazon echo">
            <p>提示：amazon echo是亚马逊智能家庭网关中心，如可以响应用户的语音命令、播放音乐、阅读有声书籍、提供天气预报、发出烹饪和起床警报等。</p>
          </pic-txt>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="linkage-list">
        <linkage-item name="amazon echo">
          <img slot="thumb" src="../../../assets/images/amazon-echo.png"/>
          <div class="hl-gray">Coming soon...</div>
        </linkage-item>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import PicTxt from 'components/PicTxt'
  import LinkageItem from './components/LinkageItem'

  export default {
    name: 'Echo',

    components: {
      'pic-txt': PicTxt,
      'linkage-item': LinkageItem
    },

    mixins: [globalMixins]
  }
</script>
