<template>
  <div class="row">
    <div class="col-12">
      <pie :data="warningLevel" :height="400"></pie>
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
              <td>iphone 5</td>
              <td>289</td>
              <td>14%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
              <td>1769</td>
              <td>86%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
              <td>289</td>
              <td>14%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
              <td>1769</td>
              <td>86%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
              <td>289</td>
              <td>14%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
              <td>1769</td>
              <td>86%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
              <td>289</td>
              <td>14%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
              <td>1769</td>
              <td>86%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
              <td>289</td>
              <td>14%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
              <td>1769</td>
              <td>86%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
              <td>289</td>
              <td>14%</td>
            </tr>
            <tr>
              <td>iphone 5</td>
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
          name: 'iphone 5',
          value: 50
        },
        {
          name: 'iphone 6',
          value: 30
        },
        {
          name: 'iphone 7',
          value: 30
        },
        {
          name: 'iphone 8',
          value: 30
        },
        {
          name: '小米 1',
          value: 30
        },
        {
          name: '小米 2',
          value: 30
        },
        {
          name: '小米 3',
          value: 30
        },
        {
          name: '小米 4',
          value: 30
        },
        {
          name: '小米 5',
          value: 30
        },
        {
          name: '小米 6',
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
