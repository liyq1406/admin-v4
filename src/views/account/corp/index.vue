<template>
  <div class="main">
    <div class="account-info">
      <h2>{{ corp.company }}</h2>
      <div class="details row">
        <div class="col-24">
          <div v-stretch="182">
            <info-list :info="corpInfo"></info-list>
          </div>
        </div>
        <!-- <div class="col-8">
          <div class="logo-info">
            <div class="mb5">企业Logo</div>
            <div class="thumbnail">
              <img :src="logo">
            </div>
            <div class="fr mt5">
              <a href="#" class="hl-red">重新上传</a>
            </div>
            <div class="hl-gray mt5">图片规格：200*55</div>
          </div>
        </div> -->
      </div>
    </div>

  </div>
</template>

<script>
import { editPasswordMixin } from '../mixins'
import formatDate from 'filters/format-date'
// import api from 'api'
import { isEmpty } from 'src/utils'
import defaultLogo from 'assets/images/logo.png'
import blankImg from 'assets/images/blank.png'

export default {
  name: 'Info',

  // editPasswordMixin提供编辑密码的逻辑
  mixins: [editPasswordMixin],

  vuex: {
    getters: {
      corp: ({ system }) => system.corp,
      currentMember: ({ system }) => system.currentMember
    }
  },

  components: {
  },

  data () {
    return {
    }
  },

  computed: {
    // 企业信息
    corpInfo () {
      let result = {
        id: {
          label: this.$t('account.corp.corp_id'),
          value: ''
        },
        type: {
          label: this.$t('account.corp.app_type'),
          value: ''
        },
        contact: {
          label: this.$t('account.corp.contact'),
          value: ''
        },
        createTime: {
          label: this.$t('account.corp.create_time'),
          value: ''
        },
        phone: {
          label: this.$t('account.corp.phone'),
          value: ''
        },
        email: {
          label: this.$t('account.corp.email'),
          value: ''
        }
      }

      if (!isEmpty(this.corp)) {
        result.id.value = this.corp.id || '-'
        result.type.value = _.find(this.locales.data.ACCOUNT_TYPES, (item) => {
          return item.value === this.corp.type
        }).label || '-'
        result.createTime.value = formatDate(this.corp.create_time) || '-'
        if (this.corp.member) {
          result.contact.value = this.corp.member.name || '-'
          result.phone.value = this.corp.member.phone || '-'
          result.email.value = this.corp.member.email || '-'
        }
      }

      return result
    },

    logo () {
      let result = blankImg
      if (!isEmpty(this.corp)) {
        result = this.corp.logo || defaultLogo
      }
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../account-info'

.logo-info
  width 200px
  margin 0 auto
  font-size 12px
</style>
