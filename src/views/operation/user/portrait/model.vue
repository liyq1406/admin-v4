<template>
  <div class="row">
    <div class="col-12">
      <pie :data="warningLevel"></pie>
    </div>
    <div class="col-11 col-offset-1 data-table-wrap">
      <div class="data-table">
        <table class="table">
          <thead>
            <tr>
              <th>系统</th>
              <th>数量</th>
              <th>占比</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>android</td>
              <td>289</td>
              <td>14%</td>
            </tr>
            <tr>
              <td>ios</td>
              <td>1769</td>
              <td>86%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Pie from 'components/g2-charts/Pie'

export default {
  name: 'portrait-model',

  components: {
    Pie
  },

  data () {
    return {
      warningLevel: [
        {
          name: 'android',
          value: 50
        },
        {
          name: 'ios',
          value: 30
        }
      ]
    }
  },

  ready () {
  },

  methods: {
  }
}
</script>
