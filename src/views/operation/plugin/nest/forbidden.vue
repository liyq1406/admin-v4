<template>
  <div class="main">
    <div class="panel">
      <div class="panel-hd">
        <h2>Google nest互联</h2>
      </div>
      <div class="panel-bd">
        <x-alert :cols="7">
          <p>未获得使用该插件的权限</p>
        </x-alert>
      </div>
    </div>
  </div>
</template>

<script>
  import Alert from 'components/Alert'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Forbidden',

    mixins: [globalMixins],

    components: {
      'x-alert': Alert
    }
  }
</script>
