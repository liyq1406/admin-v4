<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>产品信息</h2>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16">
            <!-- <div class="sale-details-head">智能烤箱<i class="fa fa-edit"></i></div> -->
            <div>
              <info-card>
                <div class="product-name">
                  智能烤箱<i class="fa fa-edit"></i>
                </div>
                <div class="product-createtime">
                  <span class="product-date">2016-7-18</span>
                  <span class="product-hour">19:56:01</span>
                </div>
              </info-card>
            </div>
            <div v-stretch="192">
              <info-list :info="productInfo"></info-list>
            </div>
          </div>
          <div class="col-8">
            <annulus :data="annulusInfo"></annulus>
            <div class="buy-access">
              <button class="btn btn-primary">购买授权</button>
            </div>
            <div class="buy-record">
              <span>购买记录</span>
            </div>
          </div>
        </div>

        <div class="mt10 mb40">
          <div class="filter-bar">
            <div class="filter-group fl">
              <h3>设备添加纪录</h3>
            </div>
            <div class="filter-group fl">
              <div class="filter-group-item ml10">
                <button class="btn btn-primary"><i class="fa fa-plus"></i>导入设备</button>
              </div>
              <div class="filter-group-item">
                <button class="btn btn-ghost"><i class="fa fa-plus"></i>添加设备</button>
              </div>
            </div>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page" :loading="loadingData">
          </c-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import InfoList from 'components/InfoList'
  import InfoCard from 'components/InfoCard'
  import Annulus from 'components/g2-charts/Annulus'
  import Table from 'components/Table'

  export default {
    name: 'ProductInfo',

    mixins: [globalMixins],

    components: {
      'c-table': Table,
      InfoCard,
      InfoList,
      Annulus
    },

    data () {
      return {
        page: {
          total: 20, // 数据总数
          currentPage: 1, // 当前页
          countPerPage: 10 // 每页数量
        },
        tables: [
          {
            time: '<a class="hl-red">2016-03-18 08:10:19</a>',
            count: 2000,
            user: '12@qq.com'
          }, {
            time: '<a class="hl-red">2016-04-18 08:10:19</a>',
            count: 4000,
            user: '113@163.com'
          }, {
            time: '<a class="hl-red">2016-05-18 08:10:19</a>',
            count: 6000,
            user: 'djfds@gmail.com'
          }
        ],
        headers: [
          {
            key: 'time',
            title: '操作时间',
            class: 'tac'
          },
          {
            key: 'count',
            title: '导入设备数',
            class: 'tac'
          },
          {
            key: 'user',
            title: '操作人',
            class: 'tac'
          }
        ],
        annulusInfo: [
          {name: '授权设备', val: 10000},
          {name: '剩余份额', val: 20000}
        ],
        productInfo: {
          linkman: {
            label: '产品型号',
            value: 'X01'
          },
          phone: {
            label: '产品类型',
            value: '厨房电器'
          },
          id: {
            label: '连接类型',
            value: 'WIFI'
          },
          area: {
            label: '产品二维码',
            value: '点击查看'
          },
          belong: {
            label: '产品描述',
            value: '2016智能设备套件'
          },
          target: {
            label: '产品状态',
            value: '产品开发'
          }
        }
      }
    },
    ready () {
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
.product-name
  margin 0px 10px 5px 0px
  font-size 18px
  i
    margin-left 5px

.buy-access
  text-align center
  margin-top -10px
  button
    width 140px
    border-radius 3px
.buy-record
  text-align center
  margin-top 3px
  color #999999
</style>
