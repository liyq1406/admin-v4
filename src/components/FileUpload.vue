<template>
  <div class="x-file-upload">
    <slot></slot>
    <modal :show.sync="showModal" @close="reset" width="540px">
      <h3 slot="header">上传固件</h3>
      <div slot="body">
        <div class="mt10 mb30">
          <div class="upload-status mb5">
            <div class="uploading" v-show="status==='uploading' || status==='upload-error'">
              <div class="upload-pregress fr">{{ loaded | prettyBytes }}/{{ total | prettyBytes }}</div>
              <div class="upload-desc">固件正在上传，请勿离开此页面</div>
            </div>
            <div class="tips-success" v-show="status==='upload-success'"><i class="fa fa-check-circle"></i>固件上传成功</div>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="progressStyles"></div>
          </div>
          <div class="hl-red mt10" v-show="status==='upload-error'">*网络出错上传失败，请检查网络设置</div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import Modal from './Modal'
import { globalMixins } from 'src/mixins'
import { MAX_UPLOAD_FILE_SIZE } from 'consts/config'

export default {
  name: 'FileUpload',

  mixins: [globalMixins],

  props: {
    // DOM
    input: {
      required: true
    },

    inputValue: {
      required: true,
      default: ''
    },

    // API 地址
    apiUrl: {
      type: String,
      required: true
    },

    // 类型
    type: {
      type: String,
      default: 'file'
    },

    // 最大
    maxSize: {
      type: Number
    }
  },

  components: {
    Modal
  },

  data () {
    return {
      showModal: false,
      status: '',
      loaded: 0,
      total: 0,
      xhr: null
    }
  },

  computed: {
    // 文件大小
    size () {
      if (!MAX_UPLOAD_FILE_SIZE.hasOwnProperty(this.type)) {
        this.type = 'file'
      }
      return this.maxSize ? this.maxSize : MAX_UPLOAD_FILE_SIZE[this.type]
    },

    // 进度条样式
    progressStyles () {
      let percentage = 0

      if (this.total) {
        percentage = this.loaded / this.total * 100
      }

      return {
        width: `${percentage}%`
      }
    }
  },

  created () {
    this.$emit('created')
  },

  watch: {
    inputValue (val, oldVal) {
      if (val && val !== oldVal) {
        this.upload()
      }
    }
  },

  methods: {
    /**
     * 恢复初始状态
     * @author shengzhi
     */
    reset () {
      if (this.xhr) {
        this.xhr.abort()
        this.xhr = null
      }
      this.status = ''
      this.loaded = 0
      this.total = 0
      this.$emit('reset', this.input)
    },

    /**
     * 文件上传
     * @author shengzhi
     */
    upload () {
      let file = this.input.files[0]

      // 文件大小不合法
      if (file && file.size > this.size * 1024 * 1024) {
        let err = this.$t('common.upload.file_size_msg', {max: this.size})
        this.showError(err)
        return
      }

      // 上传开始
      this.status = 'uploading'
      this.showModal = true
      this.xhr = new window.XMLHttpRequest()

      // 监听上传状态
      this.xhr.onreadystatechange = (evt) => {
        // 上传成功
        if (this.xhr.readyState === 4 && this.xhr.status === 200) {
          this.status = 'upload-success'
          // 将服务器的返回内容抛给父组件处理
          let timer = setTimeout(() => {
            let responseData = JSON.parse(this.xhr.responseText)
            this.$emit('upload-success', responseData)
            this.showModal = false
            this.reset()
            clearTimeout(timer)
          }, 1000)
        }
      }

      // 监听上传进度
      this.xhr.upload.onprogress = (evt) => {
        this.loaded = evt.loaded
        this.total = evt.total
      }

      window.addEventListener('offline', (e) => {
        this.status = 'upload-error'
        this.xhr.abort()
        this.xhr = null
      })

      // this.xhr.onerror = (evt) => {
      //   this.status = 'upload-error'
      // }

      // 发送请求
      let formData = new window.FormData()
      formData.append(this.input.name, file)
      this.xhr.open('post', this.apiUrl)
      this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      this.xhr.setRequestHeader('Access-Token', window.localStorage.getItem('accessToken'))
      this.xhr.send(formData)
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.x-file-upload
  .progress-bar
    background #DDD
    height 16px

  .progress
    background green
    height 16px
    width 20px
    transform width .1s ease-in-out

  .upload-status
    height 24px
    line-height 24px

  .upload-pregress
    font-size 12px

  .tips-success
    text-align center
    font-size 14px

    .fa
      font-size 16px
      margin-right 5px
      color green
</style>
