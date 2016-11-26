<template>
  <div class="panel recipe-form mt20 pdb30">
    <div class="panel-bd">
      <!-- 第一步骤 -->
      <validator name="validation">
        <div>
          <!-- <step-form1></step-form1> -->
          <div class="recipe-form">
            <div class="form with-loading pad0">
              <div class="icon-loading" v-show="loadingData">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
              <form autocomplete="off" novalidate @submit.prevent="onRecipeSubmit">
                <div class="panel mt30 mb30 bordered">
                  <div class="panel-bd">
                    <div class="form-row row">
                      <label class="form-control col-3"><i class="hl-red"></i> 菜谱类型:</label>
                      <div class="controls col-21">
                        <div class="input-text-wrap line32">
                          <span v-if="this.$route.params.type_value==='1'">普通菜谱</span>
                          <span v-if="this.$route.params.type_value==='2'">智能菜谱</span>
                          <span v-if="this.$route.params.type_value==='3'">本地菜谱</span>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3"><i class="hl-red">*</i> {{ $t("ui.recipe.fields.name") }}:</label>
                      <div class="controls col-21">
                        <div v-placeholder="'请填写菜谱名称'" class="input-text-wrap">
                          <input v-model="name" type="text" name="name" v-validate:name="{required: true, maxlength: 20, format: 'trim'}" lazy class="input-text"/>
                        </div>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.ingredient.fields.name')}) }}</span>
                          <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.ingredient.fields.name'), 20]) }}</span>
                          <span v-if="$validation.name.touched && $validation.name.format">菜谱名称不允许前后带空格</span>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3"><i class="hl-red">*</i> {{ $t("ui.ingredient.fields.images") }}:</label>
                      <div class="controls col-21">
                        <div class="thumb-info">
                          <div class="thumb">
                            <image-uploader :images="images" @modified="onModifiedImages(images)"></image-uploader>
                            <!-- <div class="form-tips">建议上传640像素*480像素成品图，最多不超过3张</div> -->
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3"><i class="hl-red">*</i> 介绍:</label>
                      <div class="controls col-21">
                        <div class="thumb-info">
                          <div class="">
                            <div class="input-text-wrap" style="height:100%">
                              <textarea v-model="instructions" style="height:100%" type="text" lazy placeholder="说说这道菜的介绍吧" v-validate:instructions="{required: true, maxlength: 60}" class="input-text"></textarea>
                            </div>
                            <div class="form-tips form-tips-error">
                              <span v-if="$validation.instructions.touched && $validation.instructions.required">{{ $t('ui.validation.required', {field: '介绍'}) }}</span>
                              <span v-if="$validation.instructions.modified && $validation.instructions.maxlength">{{ $t('ui.validation.maxlength', ['介绍', 60]) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3">时长:</label>
                      <div class="controls col-21">
                        <div class="select-group">
                          <div class="select">
                            <x-select width="160px" placeholder="请选择时间" :label="properties.cooking_time">
                              <select v-model="properties.cooking_time" name="properties.cooking_time">
                                <option v-for="opt in cookingtimes" :value="opt" :selected="cookingtimes===opt">{{ opt }}</option>
                              </select>
                            </x-select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3">难度:</label>
                      <div class="controls col-21">
                        <div class="select-group">
                          <div class="select">
                            <x-select width="160px" placeholder="请选择难度" :label="properties.difficulty">
                              <select v-model="properties.difficulty" name="properties.difficulty">
                                <option v-for="opt in difficulties" :value="opt" :selected="properties.difficulty===opt">{{ opt }}</option>
                              </select>
                            </x-select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3">{{ $t("ui.ingredient.fields.classification") }}:</label>
                      <div class="controls col-21">
                        <div class="select-group1" v-for="category in classification">
                          <div class="select">
                            <x-select width="160px" class="dis" placeholder="请选择父类别" :label="category.main.name">
                              <select v-model="category.main" @change="getSubCategories(category, true)">
                                <option v-for="opt in mainCategories" :value="opt.main">{{ opt.main.name }}</option>
                              </select>
                            </x-select>
                            <x-select v-show="category.subOptions.length" width="160px" class="dis" placeholder="请选择子类别" :label="category.sub.name">
                              <select v-model="category.sub">
                                <option v-for="opt in category.subOptions" :value="opt.sub">{{ opt.sub.name }}</option>
                              </select>
                            </x-select>
                            <span @click="removeObj(category, classification)" class="fa fa-times ml10"></span>
                          </div>
                        </div>
                        <button @click.prevent="addCategory" class="btn btn-primary"><i class="fa fa-plus"></i>添加类别</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="panel mb20 bordered">
                  <div class="panel-bd">
                    <div class="form-row row">
                      <label class="form-control col-3">主料:</label>
                      <div class="col-20 row">
                        <div class="col-12 mb10" v-for="(index, major) in major_ingredients">
                          <div class="row">
                            <div class="col-12">
                              <div class="input-text-wrap">
                                <input placeholder="请填写材料" v-model="major.name" type="text" name="major.name" lazy class="input-text" :field="'majorname' + index" v-validate="{required: true, maxlength: 20}"/>
                              </div>
                              <div class="form-tips form-tips-error">
                                <span v-if="$validation['majorname' + index].touched && $validation['majorname' + index].required">主料名称不能为空</span>
                                <span v-if="$validation['majorname' + index].modified && $validation['majorname' + index].maxlength">{{ $t('ui.validation.maxlength', ['主料名称', 20]) }}</span>
                              </div>
                            </div>
                            <div class="col-8 col-offset-1">
                              <div class="input-text-wrap">
                                <input placeholder="用量" v-model="major.unit" type="text" name="major.unit" lazy class="input-text" :field="'majorunit' + index" v-validate="{required: true, maxlength: 10}"/>
                              </div>
                              <div class="form-tips form-tips-error">
                                <span v-if="$validation['majorunit' + index].touched && $validation['majorunit' + index].required">主料用量不能为空</span>
                                <span v-if="$validation['majorunit' + index].modified && $validation['majorunit' + index].maxlength">{{ $t('ui.validation.maxlength', ['主料用量', 10]) }}</span>
                              </div>
                            </div>
                            <div class="col-3">
                              <span v-if="major_ingredients.length > 1" @click="removeObj(major, major_ingredients)" class="fa fa-times m10"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="operations col-offset-3">
                        <button @click.prevent="addMajor" class="btn btn-primary" :class="{'disabled': major_ingredients.length === 20}" :disabled="major_ingredients.length === 20"><i class="fa fa-plus"></i>添加主料</button>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3">辅料:</label>
                      <div class="col-20 row">
                        <div class="col-12 mb10" v-for="(index, minor) in minor_ingredients">
                          <div class="row">
                            <div class="col-12">
                              <div class="input-text-wrap">
                                <input placeholder="请填写材料" v-model="minor.name" type="text" name="minor.name" lazy class="input-text" :field="'minorname' + index" v-validate="{required: true, maxlength: 20}"/>
                              </div>
                              <div class="form-tips form-tips-error">
                                <span v-if="$validation['minorname' + index].touched && $validation['minorname' + index].required">辅料名称不能为空</span>
                                <span v-if="$validation['minorname' + index].modified && $validation['minorname' + index].maxlength">{{ $t('ui.validation.maxlength', ['辅料名称', 20]) }}</span>
                              </div>
                            </div>
                            <div class="col-8 col-offset-1">
                              <div class="input-text-wrap">
                                <input placeholder="用量" v-model="minor.unit" type="text" name="minor.unit" lazy class="input-text" :field="'minorunit' + index" v-validate="{required: true, maxlength: 10}"/>
                              </div>
                              <div class="form-tips form-tips-error">
                                <span v-if="$validation['minorunit' + index].touched && $validation['minorunit' + index].required">辅料用量不能为空</span>
                                <span v-if="$validation['minorunit' + index].modified && $validation['minorunit' + index].maxlength">{{ $t('ui.validation.maxlength', ['辅料用量', 10]) }}</span>
                              </div>
                            </div>
                            <div class="col-3">
                              <span v-if="minor_ingredients.length > 1" @click="removeObj(minor, minor_ingredients)" class="fa fa-times m10"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="operations col-offset-3">
                        <button @click.prevent="addMinor" class="btn btn-primary" :class="{'disabled': minor_ingredients.length === 20}" :disabled="minor_ingredients.length === 20"><i class="fa fa-plus"></i>添加辅料</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="panel mb20">
                  <div class="panel-bd">
                    <div class="form-row row">
                      <label class="form-control col-3"><i class="hl-red">*</i> 烹饪技巧:</label>
                      <div class="controls col-21">
                        <div v-placeholder="$t('ui.recipe.placeholders.skill')" class="input-text-wrap">
                          <textarea v-model="tips" type="text" name="tips" v-validate:tips="{required: true, maxlength: 100}" lazy class="input-text"></textarea>
                        </div>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.tips.touched && $validation.tips.required">{{ $t('ui.validation.required', {field: '烹饪技巧'}) }}</span>
                          <span v-if="$validation.tips.modified && $validation.tips.maxlength">{{ $t('ui.validation.maxlength', ['烹饪技巧', 100]) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3">标签:</label>
                      <div class="controls col-21">
                        <tag-input :value.sync="tag" :limit=20 :candidate="candidateTags" :editing.sync="editingTag" @adding-tag="show = true" :input-disabled="true"></tag-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="panel mb20">
                  <div class="panel-bd">
                    <div class="form-row row">
                      <label class="form-control col-3">状态:</label>
                      <div class="controls col-21">
                        <div class="radio-group">
                          <label class="radio">
                            <input type="radio" v-model="status" name="is_enable" :value="1"/>已发布
                          </label>
                          <label class="radio">
                            <input type="radio" v-model="status" name="is_enable" :value="0"/>待审核
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-actions mb40 row">
                  <div class="col-offset-4">
                    <button type="submit" :disabled="editing" :class="{'disabled': editing}" class="btn btn-primary btn-lg">{{ $t("common.save") }}</button>
                    <button @click.prevent.stop="showPreview=true" class="btn btn-ghost btn-lg">预览</button>
                    <button @click.prevent="deleteRecipe" class="btn btn-ghost btn-lg" v-if="type==='edit'">{{ $t('ui.recipe.del') }}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- 第一步骤END -->
      <!-- <div v-show="isShowPreview" transition="modal" class="mask">
        <div class="preview-wrapper">
          <div :style="dialogStyle" class="preview-dialog">
            <div class="preview-header">
              <h3>预览</h3>
            </div>
            <div class="preview-body">
              <div class="app-header">{{ name }}</div>
              <div class="preview-thumb">
                <img :src="images[0]">
              </div>
              <div class="preview-panel">
                <div class="preview-panel-hd">
                  <h3>{{name}}</h3>
                </div>
                <div class="preview-panel-bd">
                  <p class="introduce">{{ instructions }}</p>
                  <div class="metas">
                    <div class="meta"><i class="fa fa-hand-pointer-o"></i> {{properties.difficulty}}</div>
                    <div class="meta"><i class="fa fa-clock-o"></i> {{properties.cooking_time}}</div>
                  </div>
                </div>
              </div>
              <div class="preview-panel">
                <div class="preview-panel-hd">
                  <div class="preview-panel-hd-actions"><span>添加到我的菜篮</span></div>
                  <h3>用料：</h3>
                </div>
                <div class="preview-panel-bd">
                  <table>
                    <tbody>
                      <tr v-for="ingredient in major_ingredients">
                        <td>{{ ingredient.name }}</td>
                        <td>{{ ingredient.unit }}</td>
                      </tr>
                      <tr v-for="ingredient in minor_ingredients">
                        <td>{{ ingredient.name }}</td>
                        <td>{{ ingredient.unit }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="preview-panel">
                <div class="preview-panel-hd">
                  <h3>步骤：</h3>
                </div>
                <div class="preview-panel-bd">
                  <p v-for="(index, step) in cooking_steps">
                    <span class="previewstep">第{{index+1}}/{{cooking_steps.length}}步</span>
                    <span>{{step.description}}</span>
                    <image class="previewpic" :src="step.images[0]"></image>
                  </p>
                </div>
              </div>
            </div>
            <span @click="dismiss" class="fa fa-times-circle"></span>
          </div>
        </div>
      </div>
    </div> -->

    <!-- 预览浮层 Start -->
    <modal :show="showPreview" width="320px" @close="onPreviewModalClose">
      <h3 slot="header">预览</h3>
      <preview-panel slot="body">
        <div class="recipe-content">
          <!-- 菜谱图片 -->
          <div class="img-box" v-if="images.length">
            <img :src="images[0]" alt="" width="100%">
          </div>

          <!-- 菜谱标题 -->
          <div class="block mian-title-box">
            <span class="title">{{name}}</span>
          </div>

          <!-- 菜谱介绍 -->
          <template v-if="instructions">
            <div class="block description-box">
              <div class="content">
                <div class="icon icon-before">“</div>
                <span>
                  {{instructions}}
                </span>
                <div class="icon icon-after">”</div>
              </div>
            </div>
          </template>

          <!-- 标签 -->
          <template v-if="tag">
            <div class="block line-box">
              <div class="line"></div>
            </div>
            <div class="block modal-title-box">
              <span>菜谱标签</span>
            </div>
            <div class="block recipe-tag-list">
              <span v-for="tag in tagList" class="recipe-tag-list-item">{{ tag }}</span>
            </div>
          </template>

          <!-- 菜谱属性 -->
          <div class="block line-box">
            <div class="line"></div>
          </div>
          <div class="block">
            <div class="attribute-box">
              <div class="attribute">
                <i class="icon difficulty"></i>
                <span class="text">难度{{properties.difficulty}}</span>
              </div>
              <div class="attribute">
                <i class="icon time"></i>
                <span class="text">{{properties.cooking_time}}</span>
              </div>
            </div>
          </div>

          <!-- 菜谱用料 -->
          <template v-if="major_ingredients.length || minor_ingredients.length">
            <div class="block line-box">
              <div class="line" type="2"></div>
            </div>

            <div class="block modal-title-box">
              <span>用料</span>
            </div>

            <div class="block line-box">
              <div class="line"></div>
            </div>

            <div class="block material-box">
              <div class="material" v-for="major_ingredient in major_ingredients">
                <div class="name">
                  <span>{{major_ingredient.name}}</span>
                </div>
                <div class="amount">
                  <span>{{major_ingredient.unit}}</span>
                </div>
              </div>
              <div class="material" v-for="minor_ingredients in minor_ingredients">
                <div class="name">
                  <span>{{minor_ingredients.name}}</span>
                </div>
                <div class="amount">
                  <span>{{minor_ingredients.unit}}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 菜谱步骤 -->
          <template v-if="filteredSteps.length">
            <div class="block line-box">
              <div class="line" type="2"></div>
            </div>

            <template v-for="(index, step) in filteredSteps">

              <div class="block modal-title-box">
                <span>步骤 {{index + 1}}/{{filteredSteps.length}}</span>
              </div>

              <div class="block step-box">
                <div class="img">
                  <img :src="step.images[0]" alt="" width="100%">
                </div>
                <div class="text">
                  <span>{{step.description}}</span>
                </div>
              </div>

              <div class="block line-box" v-if="index !== filteredSteps.length - 1">
                <div class="line"></div>
              </div>

            </template>
          </template>


          <!-- 结尾 -->
          <div class="block line-box">
            <div class="line" type="2"></div>
          </div>

          <div class="block footer-box">
          </div>
        </div>
      </preview-panel>
    </modal>
    <!-- 预览浮层 End -->
  </div>
</template>

<script>
import api from 'api'
import PreviewPanel from 'components/other/preview/PreviewPanel'
import { pluginMixins } from '../../../mixins'
export default {
  name: 'EditRecipe',

  layout: 'admin',

  mixins: [pluginMixins],

  components: {
    PreviewPanel
  },

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember,
      products: ({ products }) => products.released
    }
  },
  props: {
    type: {
      type: String,
      default: 'edit'
    }
  },

  data () {
    return {
      name: '',
      images: [''], // 成品图
      difficulty: '不限',
      instructions: '',
      cooking_steps: [{
        description: '',
        time: '',
        images: ['']
      }],
      properties: {
        user_cooking_time: '',
        cooking_time: '5分钟',
        difficulty: '不限',
        label: ''
      },
      mainCategories: [],
      classification: [],
      tips: '',
      tag: '',
      editingTag: false,
      show: false,
      difficulties: ['不限', '新手', '初级', '中级', '高级', '厨神'],
      cookingtimes: ['5分钟', '10分钟', '15分钟', '30分钟', '60分钟', '90分钟', '2小时', '数小时', '1天', '数天'],
      major_ingredients: [],
      minor_ingredients: [],
      devices: [],
      // allDevices: DEVICES,
      allDevices: '',
      // candidateTags: locales[Vue.config.lang].data.RULE_CANDIDATE_TAGS,
      candidateTags: [],
      adding: false,
      status: 1,
      showPreview: false,
      maxStepCount: 15,
      recipe: {
        name: '',
        devices: []
      },
      modal: {
        show: false,
        type: 'add'
      },
      isShowModal: false,
      selectedProduct: {},
      originModel: {
        id: '',
        name: '',
        autoexec: ''
      },
      model: {},
      submitting: false,
      delChecked: false,
      loadingData: true,
      breadcrumbNav: [{
        label: '运营商列表',
        link: '/dev/settings/message/custom-carrier'
      }, {
        label: '添加运营商'
      }],
      currPage: 1,
      // 页码在数组里的索引位置
      arrNum: 0,
      pages: [],
      lastAble: false,
      nextAble: true,
      cookTips: [
        {
          content: ''
        }
      ],
      cookTipShow: false,
      setTipModel: {
        content: ''
      }
    }
  },
  computed: {
    // 用于预览展示的标签列表
    tagList () {
      let result = []

      if (this.tag) {
        result = this.tag.split(',')
      }

      return result
    },

    // 过滤空的步骤
    filteredSteps () {
      return _.filter(this.cooking_steps, (item) => {
        return item.discription || _.compact(item.images).length
      })
    },

    productOptions () {
      return _.differenceBy(this.products, this.recipe.devices, 'id')
    },
    // 判断当前是否第一页
    mixPage () {
      var result = true
      if (this.currPage === 1) {
        result = false
      } else {
        result = true
      }
      return result
    },
    // 判断当前是否最后一页
    maxPage () {
      var result = true
      if (this.currPage === this.pages[this.pages.length - 1]) {
        // 如果跟页码数组最后一项相同，说明为最后一页
        result = false
      } else {
        result = true
      }
      return result
    }
  },

  ready () {
    // this.getRecipes()
    // this.whichPage()
    let appId = this.$route.params.app_id
    // 从 localStorage 中获取app token
    let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
    var condition = {
      filter: [],
      limit: 1,
      offset: 0,
      query: {
        _id: this.$route.params.id
      }
    }
    api.recipes.getRecipes(appId, token, condition).then((res) => {
      if (res.status === 200) {
        var data = res.data.list[0] ? res.data.list[0] : null

        this.name = data.name
        this.instructions = data.instructions
        this.properties.cooking_time = data.properties.cooking_time
        this.properties.difficulty = data.properties.difficulty
        this.tag = data.properties.label ? data.properties.label.join(',') : ''
        this.major_ingredients = data.major_ingredients
        this.minor_ingredients = data.minor_ingredients
        this.cooking_steps = data.cooking_steps
        this.tips = data.tips
        this.devices = data.devices
        this.status = data.status
        var images = ['']
        data.images.forEach((item, index) => {
          images[index] = item
        })
        this.images = images

        // TODO
        _.forEach(data.classification, (item) => {
          this.getSubCategories(item)
          this.classification.push(item)
        })
      }
    })

    // 获取所有菜谱分类
    this.getMainCategories()
    // 获取所有标签
    this.getTags()
  },

  methods: {
    /**
     * 处理预览浮层关闭
     * @author shengzhi
     */
    onPreviewModalClose () {
      this.showPreview = false
    },

    /**
     * 处理图片上传
     * @param  {Array} images 图片路径数组
     */
    onModifiedImages (images, data) {
      images = data
    },

    /**
     * 获取菜谱分类
     * @author shengzhi
     */
    getCategories (id, limit) {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      let condition = {
        limit: limit,
        query: {
          parent_id: id
        }
      }

      this.loadingData = true
      return api.recipes.getCategories(appId, token, condition)
    },

    /**
     * 获取父级分类
     * @author shengzhi
     */
    getMainCategories () {
      this.getCategories(0, 50).then((res) => {
        if (res.status !== 200) {
          this.loadingData = false
          return
        }
        this.mainCategories = res.data.list.map((item) => {
          return {
            main: {
              id: item._id,
              name: item.name
            }
          }
        })
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 获取子级分类
     * @author shengzhi
     * @param {Object} parent 父级
     */
    getSubCategories (parent, trigger) {
      if (trigger) {
        parent.sub = {id: '', name: ''}
      }
      parent.subOptions = []
      this.getCategories(parent.main.id, 500).then((res) => {
        if (res.status !== 200) {
          this.loadingData = false
          return
        }
        this.loadingData = false
        parent.subOptions = res.data.list.map((item) => {
          return {
            sub: {
              id: item._id,
              name: item.name
            }
          }
        })
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 获取标签
     */
    getTags () {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      let condition = {
        limit: 200,
        query: {}
      }

      this.loadingData = true
      api.recipes.getTags(appId, token, condition).then((res) => {
        if (res.status === 200) {
          this.candidateTags = res.data.list.map((item) => {
            return item.label
          })
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 添加菜谱类别
     */
    addCategory () {
      this.classification.push({
        main: {id: '', name: ''},
        sub: {id: '', name: ''},
        subOptions: []
      })
    },

    /**
     * 添加主料
     */
    addMajor () {
      var newMajor = {}
      newMajor.name = ''
      newMajor.unit = ''
      this.major_ingredients.push(newMajor)
    },

    /**
     * 添加辅料
     */
    addMinor () {
      var newMinor = {}
      newMinor.name = ''
      newMinor.unit = ''
      this.minor_ingredients.push(newMinor)
    },

    /**
     * 通用删除事件
     * @param  {Object} obj 要删除的对象
     * @param  {Array}  arr 要删除的对象的父数组
     */
    removeObj (obj, arr) {
      if (arr.length <= 1) {
        this.showNotice({
          type: 'error',
          content: '默认项不允许删除'
        })
        return
      }
      arr.$remove(obj)
    },

    // 关闭预览
    dismiss () {
      this.isShowPreview = false
    },

    /**
     * 菜谱表单提交
     */
    onRecipeSubmit () {
      if (this.editing) return

      if (this.$validation.invalid) {
        this.$validate(true)
        this.showNotice({
          type: 'error',
          content: '请确认填写是否正确！'
        })
        return
      }
      if (this.major_ingredients.length === 1 && !this.major_ingredients[0].name) {
        alert('请填写主料！')
        return
      }

      if (this.minor_ingredients.length === 1 && !this.minor_ingredients[0].name) {
        alert('请填写辅料！')
        return
      }

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      this.editing = true
      let images = _.compact(_.clone(this.images))
      let major = this.major_ingredients.filter((item) => {
        return Object.keys(item).length > 0
      })
      let minor = this.minor_ingredients.filter((item) => {
        return Object.keys(item).length > 0
      })
      let classification = []
      _.forEach(this.classification, (item) => {
        if (!item.main.id) return
        classification.push({
          main: item.main,
          sub: item.sub
        })
      })
      let params = {
        name: this.name,
        images: images,
        instructions: this.instructions,
        properties: {
          cooking_time: this.properties.cooking_time,
          difficulty: this.properties.difficulty,
          label: _.compact(this.tag.split(','))
        },
        classification: classification,
        major_ingredients: major,
        minor_ingredients: minor,
        cooking_steps: this.cooking_steps,
        tips: this.tips,
        status: this.status,
        creator: this.currentMember.name,
        // type: this.devices.length ? 2 : 1
        type: this.$route.params.type_value
      }

      let process
      let noticeCont = ({
        add: '菜谱添加成功！',
        edit: '菜谱修改成功！'
      })[this.type]

      process = api.recipes.editRecipes(appId, this.$route.params.id, token, params)

      process.then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: noticeCont
          })
          this.$route.router.go({path: '/operation/plugins/recipes/' + this.$route.params.app_id + '/recipes'})
        }
      }).catch((res) => {
        this.handleError(res)
        this.editing = false
      })
    },

    /**
     * 删除菜谱
     */
    deleteRecipe () {
      if (!window.confirm('确定要删除该菜谱吗？')) return

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      api.recipes.delRecipes(appId, this.$route.params.id, token).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '菜谱删除成功'
          })
          this.$route.router.go({path: `/operation/plugins/recipes/${this.$route.params.app_id}/recipes`})
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    setCookTip (item) {
      this.cookTipShow = true
      this.setTipModel = item
    },
    addTips () {
      this.cookTips.push({content: ''})
    }
  }
}
</script>

<style lang="stylus">
  @import '../../../../../../assets/stylus/common'
  .recipe-form
    .modal
      .modal-body
        padding 0
        max-height none

    .recipe-content {
      .block {
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
        /*margin-top: 0.5rem;*/
      }

      /*图片模块*/
      .img-box {
        width: 100%;
        height: auto;
      }

      /*标题模块*/
      .mian-title-box {
        width: 100%;
        height: 48px;
        line-height: 48px;
        font-size: 20px;
        text-align: center;
      }

      /*简介模块*/
      .description-box .content{
        position: relative;
        padding: 20px 30px;
        font-size: 14px;
        line-height: 20px;
        color: #666;
      }

      .description-box .content .icon {
        position: absolute;
        top: 0;
        width: 40px;
        height: 20px;
        line-height: 20px;
        /*text-align: center;*/
        font-size: 20px;
        display: block;

      }
      .description-box .content .icon-before {
        left: 0;
        top: 20px;
      }
      .description-box .content .icon-after {
        right: -10px;
        top: auto;
        bottom: 0
      }

      /*分隔线*/
      .line-box {
        position: relative;
      }
      .line-box .line{
        width: 100%;
        height: 0;
        border-bottom: 1px solid #e5e5e5;
        margin: 10px 0;
      }
      .line-box .line[type="2"]{
        width: 100%;
        height: 0;
        border-bottom: 1px dashed #c6c6c6;
        /*border-bottom: 1px dashed #f00;*/
        margin: 10px 0 30px;
      }
      .line-box .line[type="2"]:before, .line-box .line[type="2"]:after {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        background: #c6c6c6;
        border-radius: 50%;
        position: absolute;
        top: -5px;
      }
      .line-box .line[type="2"]:before {
        left: -5px;
      }
      .line-box .line[type="2"]:after {
        right: -5px;
      }

      /*标签模块*/
      .recipe-tag-list {
        clearfix()
        .recipe-tag-list-item {
          float: left;
          border: 1px solid light-border-color;
          padding: 0 10px;
          border-radius: 20px;
          margin: 5px 0 0 5px;
        }
      }

      /*属性模块*/
      .attribute-box {
        box-sizing: border-box;
        padding: 0 24px;
        font-size: 0;
      }
      .attribute-box .attribute {
        font-size: 12px;
        width: 50%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        display: inline-block;
        overflow: hidden;
        padding: 0;
        margin: 0;
        color: #666;
      }
      .attribute-box .attribute .icon {
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        background-size: 100% auto;
        background-position: center top;
        position: relative;
        top: -2px;
      }
      .attribute-box .attribute .icon.difficulty {
        background-image: url(../assets/images/icon_level@2x.png);
      }
      .attribute-box .attribute .icon.time {
        background-image: url(../assets/images/icon_time@2x.png);
      }

      /*模块标题*/
      .modal-title-box {
        margin-top: 12px;
        font-size: 16px;
      }
      .modal-title-box span {
        display: inline-block;
        line-height: 20px;
        padding-left: 5px;
        border-left: 2px solid #ff7900;
      }

      /*用料*/
      .material-box {
        margin: 8px 0 14px;
      }
      .material-box .material {
        height: 24px;
        line-height: 24px;
        overflow: hidden;
        font-size: 12px;
        color: #999;
        position: relative;
      }

      .material-box .material .name {
        position: absolute;
        left: 4px;
      }
      .material-box .material .amount {
        position: absolute;
        right: 4px;
      }

      /*步骤*/
      .step-box {

      }
      .step-box .img {
        margin: 10px 0;
      }

      .step-box .text {
        font-size: 12px;
        color: #999;
        line-height: 14px;
      }

      /*页尾*/
      .footer-box {
        margin-bottom: 20px;
      }
      .footer-box .text {
        text-align: center;
        line-height: 20px;
        font-size: 12px;
      }
      .footer-box .qr-code {
        width: 80%;
        margin: 20px auto;
      }
      .footer-box .text2 {
        color: #876247;
      }
    }
    .previewstep
      display block
      font-size 16px
    .previewpic
      width 280px
      height 210px
      display block
      margin-left auto
      margin-right auto
    .line32
      line-height 32px
      height 32px
    .mrb10
      margin-bottom 10px
    .cooktipp
      width 100%
      border 1px solid #ddd
      box-sizing border-box
      margin 0
      height 32px
      line-height 32px
    .addCookTip
      margin-top 10px
    .bortop
      border-top 1px solid #ddd
      /*padding-top 20px*/
    .action
      border-top 1px solid #ddd
      padding-top 20px
    .mlr10
      margin 0 10px 0 10px
    .pdb30
      padding-bottom 30px!important
    .panel-bd.form
      padding 0!important
    .pad0
      padding 0!important

    // 图文
    .thumb-info
      width 100%
      position relative
      clearfix()
      label.form-control
        float left
        text-align right
        /*width 70px*/
        line-height 120px
        /*padding-right 20px*/
        box-sizing border-box
      .controls-image
        float left
        width 182px
        min-width 182px
        overflow hidden

        .image-uploader-item
          margin-bottom 0
      .thumb
        float left
        width 170px

        .image-uploader-item
          margin-bottom 0
      .info-text
        margin-left 170px
        box-sizing border-box
        height 120px
        position relative
        .input-text-wrap
        .input-text
          height 100%
      .button-list
        absolute right -30px top
        height 120px
        opacity 0
        /*transition opacity ease 0.3s*/
        .control-button
          height 25px
          width 25px
          line-height 25px
          margin-bottom 6px
          background #999
          text-align center
          cursor pointer
          &:hover
            background red
          i.icon
            color #fff
      &:hover
        .button-list
          opacity 1

    .panel
      padding-bottom 5px
    .previewForm
      display table-cell
      vertical-align middle
    .dis
      display inline-block
    .m10
      margin 10px
    .childinblock div
      display inline-block
      margin-top 5px
      margin-left 5px
    .recipe-form
      .form
        max-width 800px
        .form-row
          max-height 5000px
          .fa-times
            cursor pointer
          .controls
            .select-group1
              position relative
              width 400px
              margin 0 10px 10px 0
              padding-right 30px
            .input-text-wrap
              input.input-text-time
                border 1px solid default-border-color
                display inline-block
                width 120px
                box-sizing border-box
                font-size 14px
                height 32px
                line-height 32px
                padding 6px 20px
                margin-right 10px
              span.text-time
                margin-right 10px

        // 设备列表
        .device-list
          .device-list-item
            position relative
            font-size 12px

            .device-name
              font-size 14px
              font-weight bold
              line-height 26px

            .cooking-time
              line-height 26px

              .input-text-wrap
                display inline-block

                .input-text
                  font-size 12px
                  size 90px 26px
                  line-height 24px
                  padding 0 5px

            .fa-times
              font-size 14px
              size 24px
              line-height 24px
              background rgba(255, 0, 0, .5)
              color #FFF
              text-align center
              z-index 100

          .step-list-item
            margin 20px 0
            border 1px solid default-border-color
            padding 0 0 10px 10px

            .step-num
              text-align center

              span
                position relative
                display inline-block
                line-height 24px
                padding 0 20px
                border 1px solid default-border-color
                border-radius 20px
                font-weight bold
                background #FFF
                top -13px
    // 浮窗
    .modal
      .modal-body
        clearfix()
        .status-bar
          padding 0
          border 0
          .x-select
            float left
            display inline-block
            padding-left 10px
          .search-box
            float right

      .to-select-list
        width 65%
        float left

      .pager
        margin-top 10px

      .selected-list
        width 33%
        float right
        border 1px solid light-border-color
        box-sizing border-box
        background #FFF

        h3
          font-size 14px
          padding 0 20px
          line-height 35px
          margin 0
          border-bottom 1px solid #e4e4e4

        ul
          margin 0
          max-height 310px
          list-style none
          overflow auto

        li
          border-bottom 1px solid #e4e4e4
          font-size 12px
          position relative
          line-height 30px
          padding 0 20px

          .fa
            height 100%
            top 0
            line-height 30px

          &:nth-child(2n-1)
            background #F9F9F9

          &:last-child
            border-bottom none

      .button-box
        width 100%
        box-sizing border-box
        text-align right
        .btn
          margin-left 10px
</style>
