<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <v-select label="全部" width='110px' size="small">
                <span slot="label">显示</span>
              </v-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <dropdown></dropdown>
            </div>
            <div class="filter-group-item">
              <search-box :key.sync="query" :active="searching" @cancel="getUsers" :placeholder="$t('ui.user.fields.account')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getUsers">
                <button slot="search-button" @click="getUsers" class="btn btn-primary"><i class="fa fa-search"></i></button>
                <label>{{ $t('ui.user.search_user') }}</label>
              </search-box>
            </div>
          </div>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>MAC</th>
              <th>设备ID</th>
              <th>是否激活</th>
              <th>激活时间</th>
              <th>在线状态</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="users.length > 0">
              <tr v-for="user in users">
                <td><a v-link="{path: '/operation/users/'+user.id + '/device'}" class="hl-red">{{ user.id }}</a></td>
                <td>{{ user.nickname }}</td>
                <td>{{ user.account }}</td>
                <td>{{ user.create_date | formatDate }}</td>
                <td><span v-if="user.source===1">Web</span><span v-if="user.source===2">Android</span><span v-if="user.source===3">iOS</span><span v-if="user.source===4">{{ $('common.wechat') }}</span></td>
                <td><span>{{ user.phone_valid || user.email_valid ? $t('ui.user.status.activate') :  $t('ui.user.status.deactivate') }}</span></td>
              </tr>
            </template>
            <tr v-if="total === 0 && !loadingData">
              <td colspan="6" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getUsers"></pager>
    </div>
  </div>
</template>

<script>
  // import api from 'api'
  import { globalMixins } from 'src/mixins'
  import SearchBox from 'components/SearchBox'
  import Dropdown from 'components/Dropdown'
  import Select from 'components/Select'
  import Pager from 'components/Pager'

  export default {
    name: 'device-list',

    mixins: [globalMixins],

    components: {
      SearchBox,
      Dropdown,
      'v-select': Select,
      Pager
    }
  }
</script>
