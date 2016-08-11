<template>
  <div class="panel no-split-line">
    <div class="panel-body">
      <div class="filter-bar mt20">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <button class="btn btn-ghost">导入数据模型</button>
          </div>
        </div>
        <h3>配置数据端点</h3>
      </div>
      <div class="data-table mb40">
        <table class="table">
          <thead>
            <tr>
              <th>索引</th>
              <th>端点 ID</th>
              <th>数据类型</th>
              <th>单位符号</th>
              <th>描述</th>
              <th class="tac">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>pow</td>
              <td>布尔</td>
              <td>power</td>
              <td>电源开关</td>
              <td><a href="#">编辑</a></td>
            </tr>
            <tr>
              <td>0</td>
              <td>pow</td>
              <td>布尔</td>
              <td>power</td>
              <td>电源开关</td>
              <td><a href="#">编辑</a></td>
            </tr>
            <tr>
              <td>0</td>
              <td>pow</td>
              <td>布尔</td>
              <td>power</td>
              <td>电源开关</td>
              <td><a href="#">编辑</a></td>
            </tr>
            <tr>
              <td colspan="6">
                <a href="#"><i class="fa fa-plus-circle"></i>添加数据端点</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'

export default {
  name: 'Datapoints',

  mixins: [globalMixins],

  data () {
    return {
      datapoints: [{}]
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.filter-bar
  border-bottom 1px solid light-border-color
</style>
