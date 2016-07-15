<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>Google nest互联</h2>
        </div>
        <div class="panel-bd">
          <v-alert :cols="7">
            <p>未获得使用该插件的权限</p>
          </v-alert>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Alert from 'components/Alert'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Forbidden',

    mixins: [globalMixins],

    components: {
      'v-alert': Alert
    }
  }
</script>
