<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.user.portrait.main_title') }}</h2>
    </div>
    <div class="panel">
      <!-- 性别 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>{{ $t('operation.user.portrait.sex.title') }}</h2>
      </div>
      <div class="panel-bd">
        <sex></sex>
      </div>

      <!-- 年龄 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>{{ $t('operation.user.portrait.age.title') }}</h2>
      </div>
      <div class="panel-bd">
        <age></age>
      </div>

      <!-- 语言 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>{{ $t('operation.user.portrait.lang.title') }}</h2>
      </div>
      <div class="panel-bd">
        <language></language>
      </div>

      <!-- 终端分布 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>{{ $t('operation.user.portrait.terminal.title') }}</h2>
      </div>
      <div class="panel-bd">
        <terminal></terminal>
      </div>

      <!-- 机型 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>{{ $t('operation.user.portrait.device.title') }}</h2>
      </div>
      <div class="panel-bd">
        <devices></devices>
      </div>

    </div>
  </div>
</template>

<script>
// import api from 'api'
import { globalMixins } from 'src/mixins'
import Sex from './components/Sex'
import Age from './components/Age'
import Language from './components/Language'
import Terminal from './components/Terminal'
import Devices from './components/Devices'

export default {
  name: 'Portrait',

  mixins: [globalMixins],

  components: {
    Age,
    Language,
    Devices,
    Terminal,
    Sex
  },

  data () {
    return {
      // 性别占比
      sex: {
        options: {},
        data: []
      },
      // 年龄占比
      age: {
        options: {},
        data: []
      },
      trends: null
    }
  }
}
</script>
