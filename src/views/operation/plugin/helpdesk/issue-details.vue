<template>
  <div class="issue-details">
    <info-card>
      <h3>{{ issue.user_name }}</h3>
      <div class="desc">
        <span>{{ issue.product_name }}</span>
      </div>
      <div class="issue-metas">
        <span v-if="issue.status === 0" class="issue-status pending"><i class="fa fa-check-square-o"></i>未处理</span>
        <span v-else class="issue-status handled"><i class="fa fa-check-square-o"></i>已处理</span>
        <span class="issue-id">ID:{{ issue.product_id }}</span>
      </div>
    </info-card>
    <div class="tab-s2 mt20 mb5">
      <ul>
        <li v-for="item in tabItems" @click="currIndex=$index" :class="{'active':currIndex===$index}">{{ item }}</li>
      </ul>
    </div>
    <div v-stretch="122">
      <info-list :info="userInfo" v-show="currIndex===0"></info-list>
      <info-list :info="deviceInfo" v-show="currIndex===1"></info-list>
      <info-list :info="appInfo" v-show="currIndex===2"></info-list>
    </div>
    <!-- Start: 反馈信息 -->
    <div class="panel-sub-hd bordered mt20">反馈信息</div>
    <div class="comment-list">
      <div class="comment-list-item">
        <div class="comment-metas">
          <span>{{ issue.create_time | formatDate }}</span>
        </div>
        <div class="comment-desc">{{ issue.content }}</div>
        <gallery :pics="pics" :curr="currPicIndex" :show="isShowGallery" @close="handleGalleryClose" @switch="handlePicSwitch">
          <div class="pic-grid">
            <div class="pic" v-for="pic in pics" track-by="$index">
              <img :src="pic" alt="" @click="handleImgClick($index)">
            </div>
          </div>
        </gallery>
        <div class="issue-reply">
          <div class="comment-metas">
            <span>客服_6120    2016-07-12 16:09:11</span>
          </div>
          <div class="comment-desc">您好，如果不能正常加热，请尝试断电10分钟后再重新上电，就可以恢复了。</div>
        </div>
      </div>
      <div class="comment-list-item">
        <div class="comment-metas">
          <span>2016-07-12 18:21:09</span>
        </div>
        <div class="comment-desc">烘烤模式还是不管用，是不是坏了</div>
        <!-- <gallery :pics="pics" :curr="currPicIndex" :show="isShowGallery" @close="handleGalleryClose" @switch="handlePicSwitch">
          <div class="pic-grid">
            <div class="pic" v-for="pic in pics" track-by="$index">
              <img :src="pic" alt="" @click="handleImgClick($index)">
            </div>
          </div>
        </gallery> -->
        <!-- <div class="issue-reply">
          <div class="comment-metas">
            <span>客服_6120    2016-02-12 16:09:11</span>
          </div>
          <div class="comment-desc">您好，如果不能正常加热，请尝试断电10分钟后再重新上电，就可以恢复了。</div>
        </div> -->
      </div>
    </div>
    <div class="reply-form mt20">
      <div class="panel-sub-hd">客服回复</div>
      <div class="form">
        <div class="input-text-wrap" v-placeholder="'请填写回复内容'">
          <textarea class="input-text" v-model="dealRecord"></textarea>
        </div>
        <div class="form-actions mt10">
          <button class="btn btn-primary" @click="submitRecord">提交</button>
        </div>
      </div>
    </div>
    <!-- End: 反馈详情 -->
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../mixins'
import InfoCard from 'components/InfoCard'
import InfoList from 'components/InfoList'
import Gallery from 'components/Gallery'
import api from 'api'
import { formatDate } from 'src/filters'
// import _ from 'lodash'

export default {
  name: 'IssueDetails',

  mixins: [globalMixins, pluginMixins],

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  data () {
    return {
      userInfo: {
        nickname: {
          label: '昵称',
          value: 'xiaobai_123'
        },
        create_time: {
          label: '提交时间',
          value: '2016-07-12  16:09:11'
        },
        email: {
          label: '邮箱',
          value: 'sherly@163.com'
        },
        phone: {
          label: '手机',
          value: '13800138000'
        }
      },
      deviceInfo: {
        mac: {
          label: 'MAC',
          value: '1122eebb0088'
        },
        onlineLong: {
          label: '累计在线时长',
          value: '1.6小时'
        },
        sn: {
          label: '序列号',
          value: 'SN918208271983'
        },
        model: {
          label: '型号',
          value: 'wifi-强力烤箱'
        }
      },
      appInfo: {
        device: {
          label: '设备信息',
          value: 'iPhone 6S'
        },
        os: {
          label: '系统版本',
          value: 'iOS 10.1'
        },
        lang: {
          label: '语言',
          value: '简体中文'
        },
        resolution: {
          label: '分辨率',
          value: '1080_1024'
        }
      },
      tabItems: ['用户信息', '设备信息', 'APP信息'],
      currIndex: 0,
      pics: [],
      currPicIndex: 0,
      isShowGallery: false,
      issue: {},
      dealRecord: '',
      recordList: [],
      outOfLimit: false,
      isRecordEmpty: false
    }
  },

  components: {
    Gallery,
    InfoCard,
    InfoList
  },

  ready () {
  },

  route: {
    data () {
      this.getIssue()
      this.getFeedbackRecord()
    }
  },

  methods: {
    getIssue () {
      var condition = {
        query: {
          _id: this.$route.params.id
        }
      }
      api.helpdesk.getFeedbackList(this.$route.params.app_id, condition).then((res) => {
        if (res.status === 200 && res.data.list.length === 1) {
          this.total = res.data.count
          this.issue = res.data.list[0]
          // 用户信息
          this.userInfo.nickname.value = this.issue.user_name
          this.userInfo.create_time.value = formatDate(this.issue.create_time)
          this.userInfo.email.value = this.issue.email
          this.userInfo.phone.value = this.issue.phone
          // APP信息
          this.appInfo.device.value = this.issue.device_info
          this.appInfo.os.value = this.issue.system_version
          this.appInfo.lang.value = this.issue.system_language
          this.appInfo.resolution.value = this.issue.distinguishability
          this.pics = this.issue.image || []
          // 设备信息
          this.getDeviceInfo()
        }
      }).catch((err) => {
        this.handleError(err)
      })
    },

    // 获取设备信息
    getDeviceInfo () {
      api.device.getInfo(this.issue.product_id, this.issue.device_id).then((res) => {
        if (res.status === 200) {
          // 设备信息
          this.deviceInfo.mac.value = this.res.mac
          this.deviceInfo.sn.value = this.res.sn
          this.deviceInfo.model.value = this.res.mcu_mod
        }
      }).catch((err) => {
        this.handleError(err)
      })
    },

    getFeedbackRecord () {
      var condition = {
        limit: 100,
        query: {
          feedback_id: this.$route.params.id
        }
      }
      api.helpdesk.getFeedbackRecordList(this.$route.params.app_id, condition).then((res) => {
        if (res.status === 200 && res.data.list.length > 0) {
          console.log(res.data.list)
          this.recordList = res.data.list
        } else {
          this.recordList = []
        }
      }).catch((err) => {
        this.handleErroe(err)
      })
    },
    /**
     * 处理图片点击
     * @params {Number} index 图片索引
     */
    handleImgClick (index) {
      this.currPicIndex = index
      this.isShowGallery = true
    },

    /**
     * 处理画廊关闭
     * @param  {Boolean} visible 是否可见
     */
    handleGalleryClose (visible) {
      this.isShowGallery = visible
    },

    /**
     * 处理图片切换
     * @param  {Number} index 图片索引
     */
    handlePicSwitch (index) {
      this.currPicIndex = index
    },

    resetSumit () {
      this.dealRecord = ''
    },

    submitRecord () {
      if (this.dealRecord.length > 200) {
        this.outOfLimit = true
      } else if (this.dealRecord.length === 0) {
        this.isRecordEmpty = true
      } else {
        this.isRecordEmpty = false
        this.outOfLimit = false
        var self = this
        var argvs = arguments
        var fn = self.getIssues
        var params = {
          feedback_id: this.$route.params.id,
          name: this.currentMember.name,
          content: this.dealRecord,
          create_time: new Date(),
          type: 0
        }
        this.getAppToKen(this.$route.params.app_id, 'helpdesk').then((token) => {
          api.helpdesk.saveFeedbackRecord(this.$route.params.app_id, token, params).then((res) => {
            if (res.status === 200) {
              this.resetSumit()
              this.getFeedbackRecord()
            }
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'helpdesk'
            }
            self.handlePluginError(err, env)
          })
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.issue-details
  margin 10px 0 40px 0
  border 1px solid default-border-color
  border-right none
  padding 10px 15px

.x-info-card
  position relative

  .issue-metas
    absolute right 15px top 15px

    span
      display block
      text-align right
      line-height 22px

    .issue-status
      .fa
        font-size 16px
        margin-right 4px

      &.handled
        color gray-light

    .issue-id
      color gray-light
      font-size 12px

// tab
.tab-s2
  border-bottom 1px solid #CCC
  clearfix()

  li
    float left
    padding 10px 10px 7px
    cursor pointer
    position relative
    margin-bottom -1px

    &.active
      color red
      border-bottom 3px solid red

// 反馈信息
.comment-list
  .comment-list-item
    padding 15px 10px
    font-size 12px
    line-height 22px
    border-bottom 1px solid default-border-color

    .comment-metas
      color gray-light

    .issue-reply
      margin-top 10px
      border 1px solid default-border-color
      background-color #F2F2F2
      padding 7px 10px

.form
  max-width none

  .label
    text-indent 10px

// 图片列表
.pic-grid
  clearfix()
  margin-top 10px

  .pic
    float left
    size 120px 80px
    margin-right 5px
    cursor pointer

    img
      display block
      size 100%

// 客服回复
.reply-form
  .form
    background-color #F2F2F2
    border 1px solid default-border-color
    padding 10px

    .btn
      width 120px
      text-align center
</style>
