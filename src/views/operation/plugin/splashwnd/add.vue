<template>
  <div class="main pdb20">
    <div class="main-title">
      <h2>APP启动闪屏</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="container row">
      <div class="form-box col-16 mt10">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onAddSubmit">
            <div class="form">
              <div class="form-row row">
                <label class="form-control col-5">应用名称:</label>
                <div class="controls col-19">
                  <div class="input-text-wrap line32">{{selectedPlugin[0] && selectedPlugin[0].name}}</div>
                  <!-- <div class="form-tips form-tips-error">
                    <span v-if="$validation.name.touched && $validation.name.required">请输入任务名称</span>
                    <span v-if="$validation.name.modified && $validation.name.maxlength">不可超过20个字符</span>
                  </div> -->
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-5">图片描述:</label>
                <div class="controls col-19">
                  <div v-placeholder="'不可超过200个字符'" class="input-text-wrap">
                    <input v-model="description" name="description" type="text" v-validate:description="{required: true, maxlength: 200}" lazy class="input-text"/>
                  </div>
                  <!-- <div class="form-tips form-tips-error">
                    <span v-if="$validation.description.touched && $validation.description.required">请输入任务描述</span>
                    <span v-if="$validation.description.modified && $validation.description.maxlength">不可超过200个字符</span>
                  </div> -->
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-5">上传图片:</label>
                <div class="controls col-19">
                  <div class="input-text-wrap">
                    <!-- <input v-model="" name="description" type="file" class="input-text"/> -->
                    <image-uploader-splash-wnd :images="model.images" @modified="onModifiedImages"></image-uploader-splash-wnd>
                  </div>
                  <!-- <div class="form-tips form-tips-error">
                    <span v-if="$validation.description.touched && $validation.description.required">请输入任务描述</span>
                    <span v-if="$validation.description.modified && $validation.description.maxlength">不可超过200个字符</span>
                  </div> -->
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" :disabled="adding" :class="{'disabled':adding}" class="btn btn-primary widbtn">提交</button>
                <!-- <button @click.prevent.stop="" class="btn btn-default widbtn">取消</button> -->
                <!-- <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary">{{ $t("common.cancel") }}</button> -->
              </div>
            </div>
          </form>
        </validator>
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api'

  export default {
    name: 'AddBroadcast',
    vuex: {
      getters: {
        products: ({ products }) => products.all,
        plugins: ({ plugins }) => plugins.all
      }
    },

    data () {
      return {
        images: {},
        model: {
          images: [{}]
        },
        description: '',
        breadcrumbNav: [{
          label: '图片列表',
          link: '/operation/plugins/splashwnd/' + this.$route.params.app_id + '/list/'
        }, {
          label: '详情'
        }],
        emptyArr: [],
        needVerificationUsers: false,
        needVerification: false,
        title: '',
        content: '',
        timeType: 1,
        type: 1,
        selectProduct: {},
        taskModelType: { label: 'WIFI', value: 1 },
        addmodel: {
        },
        firmwares: [],
        adding: false
      }
    },

    computed: {
      selectedPlugin () {
        var result = []
        if (this.plugins) {
          result = this.plugins.filter((item) => {
            if (item.id === this.$route.params.selected_id) {
              return item
            }
          })
        }
        return result
      }
    },

    filters: {
    },
    route: {
      data () {
        // this.getFirmwares()
      }
    },
    methods: {
      /**
       * 处理图片上传
       * @param  {Array} images 图片路径数组
       */
      onModifiedImages (images) {
        this.images = images
      },
      // 提交添加闪屏图片
      onAddSubmit () {
        var params = {
          app_id: this.$route.params.selected_id,
          picture_description: this.description,
          picture_id: this.images[0].picture_id,
          create_time: this.images[0].create_time,
          picture_url: this.images[0].picture_url,
          picture_size: this.images[0].picture_size
        }
        api.plugin.addSplashWnd(params).then((res) => {
          if (res.status === 200) {
            this.$route.router.go({path: '/operation/plugins/splashwnd/' + this.$route.params.app_id + '/list/'})
          }
          this.showNotice({
            type: 'info',
            content: '成功创建图片！'
          })
        }).catch((res) => {
          this.handleError(res)
          this.adding = false
        })
      },
      checkTypeValid (value) {
        return Number(value) >= 0
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'
  .pdb20
    padding-bottom 20px
  .line32
    line-height 32px
  .widbtn
    width 100px
    margin-right 10px
  .inb
    display inline-block
  .inbradio
    margin-right 10px
  .number
    display inline-block
    width 20px
    height 20px
    line-height 20px
    border-radius 50%
    text-align center
    background #2389c5
    color #fff
    font-size 12px
    position relative
    bottom 2px
  .form
    max-width 640px
    padding-left 30px
    box-sizing border-box
    .directional .form-row.userTag
      height auto
    .tips
      height 50px
      line-height 50px
      border-bottom 1px dashed #ccc
      color #666
      .fa
        font-size 18px
        margin 0 5px
    .textarea
      height 150px
    .directional
    .single
      .form-row
        padding-top 5px
        padding-bottom 10px
        height auto
        /*line-height 40px*/
        border-bottom 1px dashed #ccc

    .check-group-box
      padding-bottom 5px
      .label
        line-height 26px
  .panel
    border-bottom 0
    .panel-hd
      h3
        margin-bottom 0
        margin-top 0
        padding-bottom 10px
        border-bottom 1px solid #d9d9d9
  .select-group
    .x-select
      display inline-block

</style>
