<template>
  <div class="main">
    <div class="main-title">
      <h2>人群画像</h2>
    </div>
    <div class="panel">
      <!-- 性别 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>性别</h2>
      </div>
      <div class="panel-bd">
        <sex></sex>
      </div>

      <!-- 年龄 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>年龄分布</h2>
      </div>
      <div class="panel-bd">
        <age></age>
      </div>

      <!-- 语言 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>语言</h2>
      </div>
      <div class="panel-bd">
        <language></language>
      </div>

      <!-- 终端分布 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>终端分布</h2>
      </div>
      <div class="panel-bd">
        <terminal></terminal>
      </div>

      <!-- 机型 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>机型分布TOP10</h2>
      </div>
      <div class="panel-bd">
        <machine></machine>
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
import Machine from './components/Machine'

export default {
  name: 'Portrait',

  mixins: [globalMixins],

  components: {
    Age,
    Language,
    Machine,
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
