<template>
  <div class="main">
    <div class="panel">
      <div class="panel-hd">
        <h2>经销商管理</h2>
      </div>
      <div class="panel-bd">
        <alert :cols="7">
          <p>未获得使用该插件的权限</p>
        </alert>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Forbidden',

    mixins: [globalMixins]
  }
</script>
