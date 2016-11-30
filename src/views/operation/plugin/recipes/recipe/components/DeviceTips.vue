<template>
  <div>
    <validator name="validation">
      <form autocomplete="off" novalidate>
        <div class="mt20">
          <button class="btn btn-ghost" v-if="!showReady" @click.prevent.stop="addTips"><i class="fa fa-plus"></i>添加过程提示</button>
          <div v-if="showReady">
            <div class="bordered mt10 clearfix">
              <span class="line39">过程提示</span>
              <button @click.prevent.stop="deleteReady" class="btn btn-primary mb10 fr"><i class="fa fa-times"></i>删除过程提示</button>
            </div>
            <div class="form">
              <div class="form-row row">
                <label class="form-control col-3">提示内容:</label>
                <div class="controls col-21">
                  <div class="input-text-wrap">
                    <input v-model="tip.prompts.prompt_text" placeholder="请填写文字标题，如加入酱料" @change="changeTip" type="text" name="name" lazy class="input-text"/>
                  </div>
                </div>
              </div>
              <div  v-for="(index, readycontent) in tip.prompts.prompt_content" class="form-row row">
                <label class="form-control col-3">名称:</label>
                <div class="col-20 row">
                  <div class="col-24 mb10">
                    <div class="row">
                      <div class="col-10">
                        <div class="input-text-wrap">
                          <input placeholder="请填写标题,如'生抽'" v-model="readycontent.name" @change="changeTip" type="text" name="readycontent.name" lazy class="input-text" :field="'readycontentname' + index" v-validate="{required: true, maxlength: 20}"/>
                        </div>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation['readycontentname' + index].touched && $validation['readycontentname' + index].required">名称不能为空</span>
                          <span v-if="$validation['readycontentname' + index].modified && $validation['readycontentname' + index].maxlength">{{ $t('ui.validation.maxlength', ['名称', 20]) }}</span>
                        </div>
                      </div>
                      <div class="ml10 form-control col-2">描述:</div>
                      <div class="col-8 col-offset-1">
                        <div class="input-text-wrap">
                          <input placeholder="请填写描述,如'20克'" v-model="readycontent.value" @change="changeTip" type="text" name="readycontent.value" lazy class="input-text" :field="'readycontentvalue' + index" v-validate="{required: true, maxlength: 10}"/>
                        </div>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation['readycontentvalue' + index].touched && $validation['readycontentvalue' + index].required">描述不能为空</span>
                          <span v-if="$validation['readycontentvalue' + index].modified && $validation['readycontentvalue' + index].maxlength">{{ $t('ui.validation.maxlength', ['描述', 10]) }}</span>
                        </div>
                      </div>
                      <div class="col-2 deleteicon">
                        <!-- <span v-if="tip.prompts.prompt_content.length > 1" @click="removeObj(readycontent, tip.prompts.prompt_content)" class="fa fa-times m10"></span> -->
                        <span @click="removeObj(readycontent, tip.prompts.prompt_content)" class="fa fa-times ml10"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-3"> </label>
                <div class="controls col-offset-3">
                  <button class="btn btn-ghost" @click.prevent.stop="addReadycontent(tip)"><i class="fa fa-plus"></i>添加自定义内容</button>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-3">图片:</label>
                <div class="controls col-21">
                  <div class="thumb-info">
                    <div class="thumb">
                      <image-uploader :images="tip.prompts.images" @modified="onModifiedImages(tip.prompts.images)"></image-uploader>
                      <!-- <div class="form-tips">建议上传640像素*480像素成品图，最多不超过3张</div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 烹饪点提示 -->
          <div>
            <div class="bordered mt10 clearfix">
              <span class="line39">烹饪点提示</span>
            </div>
            <!-- <pre>{{$validation |json}}</pre> -->
            <div class="bordered">
              <div class="form">
                <div class="form-row row">
                  <label class="form-control col-3">提示内容:</label>
                  <div class="controls col-21">
                    <div class="input-text-wrap">
                      <input v-model="tip.process.process_text" placeholder="请填写文字标题，如加入酱料" @change="changeTip" type="text" name="name" v-validate:processtext="{required: true, maxlength: 30}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.processtext.touched && $validation.processtext.required">提示内容不能为空</span>
                      <span v-if="$validation.processtext.modified && $validation.processtext.maxlength">{{ $t('ui.validation.maxlength', ['提示内容', 30]) }}</span>
                    </div>
                  </div>
                </div>
                <div  v-for="(index, content) in tip.process.process_content" class="form-row row">
                  <label class="form-control col-3">名称:</label>
                  <div class="col-20 row">
                    <div class="col-24 mb10">
                      <div class="row">
                        <div class="col-10">
                          <div class="input-text-wrap">
                            <input placeholder="请填写标题,如'生抽'" v-model="content.name" @change="changeTip" type="text" name="content.name" lazy class="input-text" :field="'contentname' + index" v-validate="{required: true, maxlength: 20}"/>
                          </div>
                          <div class="form-tips form-tips-error">
                            <span v-if="$validation['contentname' + index].touched && $validation['contentname' + index].required">名称不能为空</span>
                            <span v-if="$validation['contentname' + index].modified && $validation['contentname' + index].maxlength">{{ $t('ui.validation.maxlength', ['名称', 20]) }}</span>
                          </div>
                        </div>
                        <div class="ml10 form-control col-2">描述:</div>
                        <div class="col-8 col-offset-1">
                          <div class="input-text-wrap">
                            <input placeholder="请填写描述,如'20克'" v-model="content.value" @change="changeTip" type="text" name="content.value" lazy class="input-text" :field="'contentvalue' + index" v-validate="{required: true, maxlength: 10}"/>
                          </div>
                          <div class="form-tips form-tips-error">
                            <span v-if="$validation['contentvalue' + index].touched && $validation['contentvalue' + index].required">描述不能为空</span>
                            <span v-if="$validation['contentvalue' + index].modified && $validation['contentvalue' + index].maxlength">{{ $t('ui.validation.maxlength', ['描述', 10]) }}</span>
                          </div>
                        </div>
                        <div class="col-2 deleteicon">
                          <!-- <span v-if="tip.prompts.prompt_content.length > 1" @click="removeObj(readycontent, tip.prompts.prompt_content)" class="fa fa-times m10"></span> -->
                          <span @click="removeObj(content, tip.process.process_content)" class="fa fa-times ml10"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-3"> </label>
                  <div class="controls col-offset-3">
                    <button class="btn btn-ghost" @click.prevent.stop="addcontent(tip)"><i class="fa fa-plus"></i>添加自定义内容</button>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-3">图片:</label>
                  <div class="controls col-21">
                    <div class="thumb-info">
                      <div class="thumb">
                        <image-uploader :images="tip.process.images" @modified="onModifiedImages(tip.process.images)"></image-uploader>
                        <!-- <div class="form-tips">建议上传640像素*480像素成品图，最多不超过3张</div> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 删除步骤 -->
          <div>
            <button class="mt20 btn btn-primary" @click.prevent.stop="deleteTip"><i class="fa fa-times"></i>删除烹饪提示</button>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import { pluginMixins } from '../../../mixins'
export default {
  name: 'DeviceForm',

  layout: 'admin',

  mixins: [pluginMixins],

  components: {

  },
  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  props: {
    expend: {},
    tip: {
      type: Object,
      default () {
        return {
          prompts: {
            // images: [],
            // prompt_text: '',
            // prompt_content: [{
            //   name: '水',
            //   value: '20克'
            // }]
          },
          process: {
            images: [''],
            process_text: '',
            process_content: []
          }
        }
      }
    }
  },

  data () {
    return {
    }
  },
  computed: {
    showReady () {
      if (this.tip.prompts) {
        return this.tip.prompts.hasOwnProperty('prompt_text')
      } else {
        return false
      }
    },
    invalid () {
      return this.$validation.invalid
    }
  },

  ready () {
    this.$resetValidation()
    this.changeTip()
  },
  watch: {
    // tip: {
    //   handler (val, oldVal) {
    //     if (JSON.stringify(val) === JSON.stringify(oldVal)) return
    //     this.$emit('changed', this.tip, this.expend)
    //   },
    //   deep: true
    // }
  },

  methods: {
    changeTip () {
      // console.log(1111)
      if (this.$validation.invalid) {
        // this.$validate(true)
      }
      // console.log(this.$validation.invalid)
      this.$emit('changed', this.tip, this.expend, !this.$validation.invalid)
    },

    // 添加提示
    addTips () {
      var prompts = {
        images: [''],
        prompt_text: '',
        prompt_content: [{
          name: '',
          value: ''
        }]
      }
      this.$set('tip.prompts', prompts)
      this.changeTip()
      // this.tip.prompts = prompts
    },
    /**
     * 添加准备自定义内容
     */
    addReadycontent (tip) {
      var newReadycontent = {}
      newReadycontent.name = ''
      newReadycontent.value = ''
      this.tip.prompts.prompt_content.push(newReadycontent)
      this.changeTip()
    },
    /**
     * 添加自定义内容
     */
    addcontent (tip) {
      var newcontent = {}
      newcontent.name = ''
      newcontent.value = ''
      this.tip.process.process_content.push(newcontent)
      this.changeTip()
    },
    /**
     * 通用删除事件
     * @param  {Object} obj 要删除的对象
     * @param  {Array}  arr 要删除的对象的父数组
     */
    removeObj (obj, arr) {
      // if (arr.length <= 1) {
      //   this.showNotice({
      //     type: 'error',
      //     content: '默认项不允许删除'
      //   })
      //   return
      // }
      arr.splice(arr.indexOf(obj), 1)
      this.changeTip()
    },
    deleteReady () {
      this.$set('tip.prompts', {})
      this.changeTip()
    },
    /**
     * 处理图片上传
     * @param  {Array} images 图片路径数组
     */
    onModifiedImages (images, data) {
      images = data
      this.changeTip()
    },
    // 删除提示
    deleteTip () {
      if (window.confirm('确认删除烹饪过程提示？')) {
        this.$emit('delete')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../../../../../assets/stylus/common'
  .deleteicon
    height 32px
    line-height 32px
  .fa-times
    cursor pointer
  .line39
    display inline-block
    line-height 39px
  .bordered
    border-bottom 1px solid #d9d9d9
  .bggray
    background-color #f9f9f9!important
</style>
