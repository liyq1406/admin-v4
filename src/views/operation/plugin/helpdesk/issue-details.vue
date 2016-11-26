<template>
  <div class="issue-details">
    <info-card>
      <h3>{{ issue.user_name }} </h3>
      <div class="desc">
        <span>{{ issue.product_name }}</span>
      </div>
      <div class="issue-metas">
        <!-- <span v-if="issue.status === 0" class="issue-status pending"><i class="fa fa-check-square-o"></i>未处理</span> -->
        <button v-if="issue.status === 0" class="issue-status pending btn btn-primary" @click.prevent.stop="setDeal">未处理</button>
        <button v-else class="issue-status pending btn btn-success"  @click.prevent.stop="setUndeal">已处理</button>
        <!-- <span v-else class="issue-status handled"><i class="fa fa-check-square-o"></i>已处理</span> -->
        <span class="issue-id">ID:{{ issue.product_id }}</span>
      </div>
    </info-card>
    <div class="tab-s2 mt20 mb5">
      <ul>
        <li v-for="(index, item) in tabItems" class="tab-s2-item" @click="currIndex=index" :class="{'active':currIndex===index}">{{ item }}</li>
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
      <div v-for="item in recordList" class="comment-list-item">
        <!-- 客户回复 -->
        <div v-if="item.source === 1" class="pd710">
          <div class="comment-metas">
            <span>{{ item.create_time | formatDate }}</span>
          </div>
          <div class="comment-desc">{{ item.content }}</div>
          <gallery :pics="item.image" :curr="currPicIndex" :show="isShowGallery" @close="handleGalleryClose" @switch="handlePicSwitch">
            <div class="pic-grid">
              <div class="pic" v-for="(index, pic) in item.image" track-by="$index">
                <img :src="pic" alt="" @click="handleImgClick(index)">
              </div>
            </div>
          </gallery>
        </div>
        <!-- 客服回复 -->
        <div v-else class="issue-reply">
          <img src="../../../../assets/images/user.png" alt="" class="kefuicon">
          <div class="comment-metas ml50">
            <span>{{item.name}}    {{item.create_time | formatDate }}</span>
          </div>
          <div class="comment-desc ml50">{{ item.content }}</div>
        </div>

      </div>
    </div>
    <div class="reply-form mt20">
      <div class="panel-sub-hd">客服回复</div>
      <div class="form">
        <div v-if="false">
          暂时无法回复
        </div>
        <div v-else>
          <div class="input-text-wrap" v-placeholder="'请填写回复内容'">
            <textarea class="input-text" v-model="dealRecord"></textarea>
          </div>
          <div class="form-actions mt10">
            <button class="btn btn-primary" @click="submitRecord">提交</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End: 反馈详情 -->
  </div>
</template>

<script>
import { pluginMixins } from '../mixins'
import api from 'api'
import formatDate from 'filters/format-date'

export default {
  name: 'IssueDetails',

  mixins: [pluginMixins],

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  data () {
    return {
      // 客服第一个回复
      firstReply: {},
      // inputAble: false,
      // 客户与客服剩下的反馈数组
      // otherArr: [{
      //   user: {},
      //   service: {}
      // }],
      userInfo: {
        nickname: {
          label: '昵称',
          value: ' '
        },
        create_time: {
          label: '提交时间',
          value: ' '
        },
        email: {
          label: '邮箱',
          value: ' '
        },
        phone: {
          label: '手机',
          value: ' '
        }
      },
      deviceInfo: {
        mac: {
          label: 'MAC',
          value: '-'
        },
        onlineLong: {
          label: '累计在线时长',
          value: '-'
        },
        sn: {
          label: '序列号',
          value: '-'
        },
        model: {
          label: '型号',
          value: '-'
        }
      },
      appInfo: {
        device: {
          label: '设备信息',
          value: ' '
        },
        os: {
          label: '系统版本',
          value: ' '
        },
        lang: {
          label: '语言',
          value: ' '
        },
        resolution: {
          label: '分辨率',
          value: ' '
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
  },

  ready () {
  },

  route: {
    data () {
      this.getIssue()
      this.getFeedbackRecord()
    }
  },
  computed: {
    // 处理反馈记录
    dealList () {
      var otherArr = []
      var newobj = {
        user: {},
        service: {}
      }
      this.recordList.map((item) => {
        // 获取偶数元素(客户回复)
        if (this.recordList.indexOf(item) % 2 === 0) {
          // var evenNo = this.recordList.indexOf(item) / 2
          // this.otherArr[evenNo].user.push(item)
          newobj.user = item
          // 如果这是数组最后一个元素，则直接返回
          if (this.recordList.indexOf(item) + 1 === this.recordList.length) {
            newobj.service = {}
            otherArr.push(newobj)
          }
        } else {
          // 获取奇数元素(客服回复)
          // var oddNo = (this.recordList.indexOf(item) - 1) / 2
          // this.otherArr[oddNo].service = item
          newobj.service = item
          // 如果这不是最后一个元素，继续循环
          if (this.recordList.indexOf(item) + 1 < this.recordList.length) {
            otherArr.push(newobj)
            newobj = {
              user: {},
              service: {}
            }
          } else {
            // 如果是最后一个元素
            otherArr.push(newobj)
          }
        }
      })
      return otherArr
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
      if (this.issue.device_id) {
        api.device.getInfo(this.issue.product_id, this.issue.device_id).then((res) => {
          if (res.status === 200) {
            // 设备信息
            this.deviceInfo.mac.value = res.data.mac
            this.deviceInfo.sn.value = res.data.sn
            this.deviceInfo.firmware_mod.value = res.data.mcu_mod
          }
        }).catch((err) => {
          this.handleError(err)
        })
        api.product.getVDevice(this.issue.product_id, this.issue.device_id).then((res) => {
          if (res.status === 200) {
            // 设备信息
            this.deviceInfo.onlineLong.value = res.data.online_count
          }
        }).catch((err) => {
          this.handleError(err)
        })
      }
    },

    getFeedbackRecord () {
      var condition = {
        limit: 100,
        query: {
          feedback_id: this.$route.params.id
        },
        // 按创建时间升序获取
        order: {
          create_time: 1
        }
      }
      api.helpdesk.getFeedbackRecordList(this.$route.params.app_id, condition).then((res) => {
        if (res.status === 200) {
          // this.firstReply = res.data.list[0]
          this.recordList = res.data.list
          // 去除第一个客服回复
          // this.recordList.map((item) => {
          //   if (this.recordList.indexOf(item) === 0) {
          //     this.recordList.$remove(item)
          //   }
          // })
          // 如果最后一个回复的是客户，打开输入框
          // if (this.recordList.length % 2 === 0) {
          //   this.inputAble = true
          // } else {
          //   this.inputAble = false
          // }
          // this.recordList = [
          //   {_id: '记录ID',
          //   user_id: '1223',
          //   feedback_id: '123456',
          //   reply_id: '12345678',
          //   name: '客服',
          //   content: '请致电售后',
          //   image: ['2.jpg'],
          //   creator: '小明',
          //   create_time: '2016-05-17T01:03:27.453Z'},
          //   {_id: '记录ID',
          //   user_id: '1223',
          //   feedback_id: '123456',
          //   reply_id: '12345678',
          //   name: '客服',
          //   content: '请致电售后',
          //   image: ['2.jpg'],
          //   creator: '小明',
          //   create_time: '2016-05-17T01:03:27.453Z'},
          //   {_id: '记录ID',
          //   user_id: '1223',
          //   feedback_id: '123456',
          //   reply_id: '12345678',
          //   name: '客服',
          //   content: '请致电售后',
          //   image: ['2.jpg'],
          //   creator: '小明',
          //   create_time: '2016-05-17T01:03:27.453Z'}
          // ]
          // this.dealList(this.recordList)
        } else {
          this.recordList = []
        }
      }).catch((err) => {
        this.handleError(err)
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
        var i = this.recordList.length - 1
        var params = {
          feedback_id: this.$route.params.id,
          name: '客服',
          content: this.dealRecord,
          create_time: new Date(),
          reply_id: this.recordList[i]._id
        }
        api.helpdesk.saveFeedbackRecord(this.$route.params.app_id, params).then((res) => {
          if (res.status === 200) {
            this.resetSumit()
            // 客服提交成功后将状态设置为已处理
            var status = {
              treated_time: new Date(),
              status: 1
            }
            this.changeStatus(status)
            // this.getFeedbackRecord()
          }
        }).catch((err) => {
          this.handleError(err)
        })
      }
    },
    // 设置为已处理
    setDeal () {
      var params = {
        treated_time: new Date(),
        status: 1
      }
      this.changeStatus(params)
    },
    // 设置为未处理
    setUndeal () {
      var params = {
        treated_time: new Date(),
        status: 0
      }
      this.changeStatus(params)
    },
    // 更新处理状态
    changeStatus (params) {
      api.helpdesk.updateFeedbackList(this.$route.params.app_id, this.issue._id, params).then((res) => {
        if (res.status === 200) {
          if (params.status === 0) {
            this.showNotice({
              type: 'success',
              content: '已设置为未处理！'
            })
          } else {
            this.showNotice({
              type: 'success',
              content: '已设置为已处理！'
            })
          }
          this.getIssue()
          this.getFeedbackRecord()
        }
      }).catch((err) => {
        this.handleError(err)
      })
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

  .tab-s2-item
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
    /*padding 7px 10px*/
    font-size 12px
    line-height 22px
    border-bottom 1px solid default-border-color
    /*border-top 1px solid default-border-color*/

    .comment-metas
      color gray-light

    .issue-reply
      margin-top 10px
      margin-bottom 10px
      clearfix()
      /*border-top 1px solid default-border-color*/
      /*border-bottom 1px solid default-border-color*/
      /*background-color #F2F2F2*/
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
.kefuicon
  float left
  height 40px
  width 40px
  margin-right 10px
.ml50
  margin-left 50px
.pd710
  padding 7px 10px
</style>
