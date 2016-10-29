<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>{{ $t('operation.user.details.warranty.id') }}</th>
              <th>{{ $t('operation.user.details.warranty.create_time') }}</th>
              <th>{{ $t('operation.user.details.warranty.handle_time') }}</th>
              <th>{{ $t('operation.user.details.warranty.type') }}</th>
              <th>{{ $t('operation.user.details.warranty.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="workOrders.length > 0">
              <tr v-for="order in workOrders">
                <td><a v-link="{path: '/plugins/warranty/' + $route.params.app_id + '/work-orders/extended-warranties/' + order._id}" class="hl-red">{{order._id}}</a></td>
                <td>{{order.create_time}}</td>
                <td>{{order.handle_time}}</td>
                <td>{{typeText(order.type)}}</td>
                <td>{{statusText(order.status)}}</td>
              </tr>
            </template>
            <tr v-if="workOrders.length === 0 && !loadingData">
              <td colspan="7" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// import api from 'api'

export default {
  data () {
    return {
      key: '',
      status: {
        label: this.$t('common.all'),
        value: 0
      },
      statusOptions: [
        {
          label: this.$t('common.all'),
          value: 0
        }, {
          label: this.$t('operation.user.details.not_timeout'),
          value: 1
        }, {
          label: this.$t('operation.user.details.timeout'),
          value: 2}
      ],
      loadingData: false,
      workOrders: [
        // {
        //   _id: '45a6dsa5sd46a',
        //   create_time: '2016-1-1 19:21:32',
        //   handle_time: '2016-1-1 19:21:32',
        //   type: 0,
        //   status: 0
        // },
        // {
        //   _id: '45a6dsa5sd46a',
        //   create_time: '2016-1-1 19:21:32',
        //   handle_time: '2016-1-1 19:21:32',
        //   type: 0,
        //   status: 0
        // }
      ]
    }
  },

  ready () {
    // this.getIssues()
  },

  methods: {
    typeText (index) {
      return ([this.$t('operation.user.details.warranty.order1'), this.$t('operation.user.details.warranty.order2')])[index]
    },

    statusText (index) {
      return ([this.$t('operation.user.details.warranty.status1'), this.$t('operation.user.details.warranty.status2'), this.$t('operation.user.details.warranty.status3')])[index]
    }

  }
}
</script>
