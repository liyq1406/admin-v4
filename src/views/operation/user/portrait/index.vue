<template>
  <div class="main">
    <div class="main-title">
      <h2>人群画像</h2>
    </div>
    <div class="panel no-split-line">
      <div class="panel-hd panel-hd-full bordered">
        <h2>性别</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-12">
            <interval :data="sex.data" :options="sex.options"></interval>
          </div>
          <div class="col-11 col-offset-1 data-table-wrap" style="min-height: 250px">
            <div class="data-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>性别</th>
                    <th>数量</th>
                    <th>占比</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>男</td>
                    <td>289</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>女</td>
                    <td>1769</td>
                    <td>86%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 年龄 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>年龄</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-12">
            <interval :data="age.data" :options="age.options"></interval>
          </div>
          <div class="col-11 col-offset-1 data-table-wrap" style="min-height: 300px">
            <div class="data-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>年龄</th>
                    <th>数量</th>
                    <th>占比</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>18岁以下</td>
                    <td>289</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>20-29岁</td>
                    <td>1769</td>
                    <td>26%</td>
                  </tr>
                  <tr>
                    <td>30-39岁</td>
                    <td>289</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>40-49岁</td>
                    <td>1769</td>
                    <td>26%</td>
                  </tr>
                  <tr>
                    <td>50岁以上</td>
                    <td>1769</td>
                    <td>26%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 语言 -->
      <div class="panel-hd panel-hd-full bordered">
        <h2>语言</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-12">
            <interval :data="age.data" :options="age.options"></interval>
          </div>
          <div class="col-11 col-offset-1 data-table-wrap" style="min-height: 300px">
            <div class="data-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>语言</th>
                    <th>数量</th>
                    <th>占比</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>简体中文</td>
                    <td>289</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>繁体中文</td>
                    <td>1769</td>
                    <td>26%</td>
                  </tr>
                  <tr>
                    <td>日文</td>
                    <td>289</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>韩文</td>
                    <td>1769</td>
                    <td>26%</td>
                  </tr>
                  <tr>
                    <td>意大利文</td>
                    <td>1769</td>
                    <td>26%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
// import api from 'api'
import { globalMixins } from 'src/mixins'
import DateTimeSinglePicker from 'components/DateTimeSinglePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Interval from 'components/g2-charts/Interval'
import Mock from 'mockjs'
import Tab from 'components/Tab'

export default {
  name: 'Portrait',

  mixins: [globalMixins],

  components: {
    TimeLine,
    DateTimeSinglePicker,
    Interval,
    Tab
  },

  data () {
    return {
      secondaryNav: [],
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
  },

  route: {
    data (transition) {
      return this.sonRoute(transition)
    }
  },

  ready () {
    // TODO: 所有相关功能没对接口 #guohui
    this.simulationData()
  },

  methods: {
    sonRoute (transition) {
      var deviceDetailRoot = '/operation/users/portrait'

      return {
        secondaryNav: [{
          label: '终端系统',
          link: { path: `${deviceDetailRoot}/os` }
        }, {
          label: '终端机型',
          link: { path: `${deviceDetailRoot}/model` }
        }]
      }
    },
    /**
     * 模拟数据
     * @return {[type]} [description]
     */
    simulationData () {
      // 年龄段
      const AGE_TYPES = ['19岁以下', '20-29岁', '30-39岁', '40-49岁', '50岁以上']
      // 性别占比 -----------------------------------------------------
      var sexOptions = {
        horizontal: true,
        stack: true,
        props: {
          height: 300,
          plotCfg: {
            margin: [40, 20, 80, 60]
          }
        },
        defs: {
          'sex': {
            type: 'cat',
            alias: '性别'
          },
          'count': {
            alias: '数量',
            min: 0
          }
        },
        position: 'sex*count',
        color: 'sex'
      }
      this.sex.data = Mock.mock({
        'list|2': [{
          'sex|+1': ['女性', '男性'],
          'count|1600-2200': 10
        }]
      }).list
      this.sex.options = sexOptions

      // 年龄占比 -----------------------------------------------------
      var ageOptions = {
        props: {
          height: 300,
          plotCfg: {
            margin: [40, 0, 50, 50]
          }
        },
        defs: {
          'age': {
            type: 'cat',
            alias: '年龄'
          },
          'count': {
            alias: '数量',
            min: 0
          }
        },
        position: window.G2.Stat.summary.percent('age*count')
      }
      this.age.data = Mock.mock({
        'list|5': [{
          'age|+1': AGE_TYPES,
          'count|+1': [120, 703, 635, 88, 7]
        }]
      }).list
      this.age.options = ageOptions

      this.trends = Mock.mock({
        'list|14': [{
          'date|+1': [
            new Date(2016, 7, 15),
            new Date(2016, 7, 16),
            new Date(2016, 7, 17),
            new Date(2016, 7, 18),
            new Date(2016, 7, 19),
            new Date(2016, 7, 20),
            new Date(2016, 7, 21),
            new Date(2016, 7, 15),
            new Date(2016, 7, 16),
            new Date(2016, 7, 17),
            new Date(2016, 7, 18),
            new Date(2016, 7, 19),
            new Date(2016, 7, 20),
            new Date(2016, 7, 21)
          ],
          'count|+1': [6, 8, 9, 3, 9, 3, 9, 6, 38, 19, 33, 29, 33, 29],
          '产品|+1': ['电饭锅1', '电饭锅1', '电饭锅1', '电饭锅1', '电饭锅1', '电饭锅1', '电饭锅1', '电饭锅2', '电饭锅2', '电饭锅2', '电饭锅2', '电饭锅2', '电饭锅2', '电饭锅2']
        }]
      }).list
    }
  }
}
</script>
