<template>
  <div class="recipe-form">
    <div class="form">
      <validator name="validation">
        <form novalidate @submit.prevent="onRecipeSubmit">
          <div class="form-row row">
            <label class="form-control col-4">{{ $t("ui.recipe.fields.name") }}:</label>
            <div class="controls col-20">
              <div v-placeholder="'请填写菜谱名称'" class="input-text-wrap">
                <input v-model="name" type="text" name="name" v-validate:name="{required: true, maxlength: 250}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.ingredient.fields.name')}) }}</span>
                <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.ingredient.fields.name'), 250]) }}</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4">{{ $t("ui.ingredient.fields.images") }}:</label>
            <div class="controls col-20 controls-image">
              <image-uploader :images="images" @modified="onModifiedImages(images)"></image-uploader>
              <div class="form-tips">建议上传640像素*480像素成品图，最多不超过3张</div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4">难度:</label>
            <div class="controls col-20">
              <div class="select-group">
                <div class="select">
                  <x-select width="160px" placeholder="请选择难度" :label="difficulty">
                    <select v-model="difficulty" name="difficulty">
                      <option v-for="opt in difficulties" :value="opt" :selected="difficulty===opt">{{ opt }}</option>
                    </select>
                  </x-select>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4">{{ $t("ui.ingredient.fields.classification") }}:</label>
            <div class="controls col-20">
              <div class="select-group">
                <div v-for="category in classification" class="select">
                  <x-select width="160px" placeholder="请选择类别" :label="category.main">
                    <select v-model="category.main">
                      <option v-for="opt in categories | dropSlected classification category 'main'" :value="opt.main" :selected="opt.main===category.main">{{ opt.main }}</option>
                    </select>
                  </x-select>
                  <span @click="removeObj(category, classification)" class="fa fa-times"></span>
                </div>
              </div>
              <button @click.prevent="addCategory" :disabled="classification.length === categories.length" :class="{'disabled': classification.length === categories.length}" class="btn btn-success"><i class="fa fa-plus"></i>添加类别</button>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4">{{ $t("ui.recipe.fields.instructions") }}:</label>
            <div class="controls col-20">
              <div v-placeholder="$t('ui.recipe.placeholders.instructions')" class="input-text-wrap">
                <textarea v-model="instructions" type="text" name="instructions" lazy class="input-text textarea-lg"></textarea>
              </div>
            </div>
          </div>
          <div class="form-row row ingredient-row">
            <label class="form-control col-4">食材:</label>
            <div class="controls col-20">
              <table v-if="major_ingredients.length">
                <tbody>
                  <tr v-for="ingredient in major_ingredients">
                    <td><span class="ingredient-name">{{ ingredient.name }}</span></td>
                    <td>
                      <div class="input-text-wrap inline">
                        <input type="text" placeholder="请填写用量" v-model="ingredient.unit" class="input-text-time"/>
                      </div><span @click="removeObj(ingredient, major_ingredients)" class="fa fa-times"></span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button @click.prevent="ingredientSelectModal.show=true" class="btn btn-success"><i class="fa fa-plus"></i>添加食材</button>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4">烹饪设备:</label>
            <div class="controls col-20">
              <div class="device-list">
                <div class="device-list-item" v-for="(deviceIndex, device) in devices">
                  <pre>{{autoexecs[deviceIndex]|json}}</pre>
                  <div class="row">
                    <div class="col-6 device-name">{{ device.name }}</div>
                    <div class="col-9">
                      <x-select width="70px" :label="device.count.toString()" size="small">
                        <span slot="label">烹饪步骤数量：</span>
                        <select v-model="device.count" name="count" @change="setSteps(device)">
                          <option v-for="n in device.max" :value="n+1">{{ n+1 }}</option>
                        </select>
                      </x-select>
                    </div>
                    <div class="col-7 cooking-time">
                      <span>时长：</span>
                      <div class="input-text-wrap">
                        <input v-model="device.time" type="text" name="device.time" lazy class="input-text" />
                      </div>
                    </div>
                    <div class="col-2 tar">
                      <span @click="removeDevice(device, devices)" class="fa fa-times pointer"></span>
                    </div>
                  </div>
                  <div class="step-list">
                    <div class="step-list-item" v-for="(stepIndex, step) in device.steps" track-by="$index">
                      <div class="step-num">
                        <span>第{{ stepIndex+1 }}步骤</span>
                      </div>
                      <div class="row">
                        <div class="col-6 mt10" v-for="(byteIndex, byte) in step.bytes">
                          <div class="mr10">
                            <div class="byte-name">{{ byte.label }}</div>
                            <x-select width="100%" :label="byte.value.toString()+(byte.unit || '')" size="small" :disabled="byte.max === byte.min" @change="setRange(step.bytes, byte)">
                              <select v-model="byte.value" :disabled="byte.max === byte.min">
                                <option v-for="n in (byte.max - byte.min + 1)" :value="n+byte.min">{{ (n+byte.min)+(byte.unit || '') }}</option>
                              </select>
                            </x-select>
                          </div>
                        </div>
                      </div>
                      <div class="row mt10">
                        <div class="mr10">
                          <div class="input-text-wrap">
                            <textarea v-model="step.tips" name="step.tips" lazy class="input-text" placeholder="备注说明"></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button @click.prevent="isShowDeviceSelectModal=true" :disabled="devices.length === allDevices.length" :class="{'disabled': devices.length === allDevices.length}" class="btn btn-success"><i class="fa fa-plus"></i>添加烹饪设备</button>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4">步骤:</label>
            <div class="controls col-20">
              <div class="alert-text">小提示：<br/>1、步骤图宽度在150像素至150像素；<br/>2、每个步骤用一段话描述，如果不需要可将内容留空；</div>
              <div v-for="cooking_step in cooking_steps" class="step-box row">
                <div class="col-3">第{{ $index+1 }}步:</div>
                <div class="col-8">
                  <image-uploader :images="cooking_step.images" @modified="onModifiedImages(cooking_step.images)" class="mb0"></image-uploader>
                </div>
                <div class="col-13 step-text">
                  <div class="input-text-wrap">
                    <textarea v-model="cooking_step.description" type="text" lazy placeholder="请填写步骤的描述" class="input-text"></textarea>
                  </div>
                </div>
                <div class="button-list">
                  <div v-show="cooking_steps.length>1&&$index>0" @click="handleStepEvent('MOVE_UP', cooking_step, $index)" class="control-button button-up"><i class="icon fa fa-long-arrow-up"></i></div>
                  <div v-show="cooking_steps.length>1&&$index<(cooking_steps.length-1)" @click="handleStepEvent('MOVE_DOWN', cooking_step, $index)" class="control-button button-down"><i class="icon fa fa-long-arrow-down"></i></div>
                  <div @click="handleStepEvent('ADD', cooking_step, $index)" class="control-button button-add"><i class="icon fa fa-plus"></i></div>
                  <div v-show="cooking_steps.length>1" @click="handleStepEvent('DEL', cooking_step, $index)" class="control-button button-del"><i class="icon fa fa-times"></i></div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4">{{ $t('ui.recipe.fields.tips') }}:</label>
            <div class="controls col-20">
              <div v-placeholder="$t('ui.recipe.placeholders.tips')" class="input-text-wrap">
                <textarea v-model="tips" type="text" name="tips" lazy class="input-text textarea-lg"></textarea>
              </div>
            </div>
          </div>
          <div class="form-actions row">
            <div class="col-offset-4">
              <button type="submit" :disabled="editing" :class="{'disabled': editing}" class="btn btn-primary btn-lg">{{ $t("common.save") }}</button>
            </div>
          </div>
        </form>
      </validator>
    </div>

    <!-- Start: 设备选择浮窗 -->
    <modal :show.sync="isShowDeviceSelectModal" @close="onDeviceSelectCancel">
      <h3 slot="header">选择设备</h3>
      <div slot="body" class="form">
        <div class="form-row">
          <div class="radio-group">
            <label v-for="device in deviceOptions" class="radio">
              <input type="radio" v-model="selectedDevice" name="selectedDevice" :value="device"/>
              <span>{{ device.name }}</span>
            </label>
          </div>
        </div>
        <div class="form-actions">
          <button @click.prevent.stop="onDeviceSelectCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          <button @click.prevent.stop="addCookingDevice" class="btn btn-primary">{{ $t('common.ok') }}</button>
        </div>
      </div>
    </modal>
    <!-- End: 设备选择浮窗 -->

    <!-- Start: 食材选择浮层 -->
    <modal :show.sync="ingredientSelectModal.show" width="800px">
      <h3 slot="header">选择食材</h3>
      <div slot="body" class="ingredient-box">
        <div class="status-bar">
          <x-select size="small" width="120px" :label="ingredientSelectModal.category.label">
            <span slot="label">类别：</span>
            <select v-model="ingredientSelectModal.category" @change="getIngredients">
              <option v-for="option in ingredientCategoryOptions" :value="option">{{ option.label }}</option>
            </select>
          </x-select>
          <search-box :key.sync="ingredientSelectModal.query" :active="ingredientSelectModal.searching" :placeholder="$t('ui.recipe.placeholders.search_condi')" @cancel="getIngredients" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getIngredients">
            <button slot="search-button" @click="getIngredients" class="btn btn-primary"><i class="fa fa-search"></i></button>
          </search-box>
        </div>
        <div class="ingredient-list clearfix mb20">
          <div class="to-select-list">
            <div class="data-table with-loading">
              <div class="icon-loading" v-show="loadingData">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
              <table class="table table-stripe table-bordered">
                <thead>
                  <tr>
                    <th>标题</th>
                    <th class="tac">{{ $t('common.action') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="filteredIngredientList.length > 0">
                    <tr v-for="ingredient in filteredIngredientList">
                      <td><span>{{ ingredient.name }}</span></td>
                      <td class="tac w70"><a v-show="!ingredient.selected" @click.stop="addIngredient(ingredient)" class="btn-link">添加</a><span v-show="ingredient.selected">已添加</span></td>
                    </tr>
                  </template>
                  <tr v-if="filteredIngredientList.length === 0 && !ingredientSelectModal.loadingData">
                    <td colspan="2" class="tac">
                      <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pager v-if="ingredientSelectModal.total > ingredientSelectModal.countPerPage" :total="ingredientSelectModal.total" :current.sync="ingredientSelectModal.currentPage" :count-per-page="ingredientSelectModal.countPerPage" @page-update="getIngredients"></pager>
          </div>
          <div class="selected-list">
            <h3>已选择</h3>
            <ul>
              <li v-for="selectedIngredient in ingredientSelectModal.selectedIngredientList"><span>{{ selectedIngredient.name }}</span><i @click="deleteIngredient(selectedIngredient)" class="fa fa-times-circle"></i></li>
            </ul>
          </div>
        </div>
        <div class="button-box">
          <div class="form-actions">
            <button @click.prevent.stop="ingredientSelectModal.show=false" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="ingredientSelectModal.adding" :class="{'disabled':ingredientSelectModal.adding}" v-text="ingredientSelectModal.adding ? $t('common.handling') : $t('common.ok')" @click.prevent.stop="confirmSelected" class="btn btn-primary"></button>
          </div>
        </div>
      </div>
    </modal>
    <!-- End: 食材选择浮层 -->
  </div>
</template>

<script>
  import api from 'api'
  import * as config from 'consts/config'
  import Modal from 'components/Modal'
  import Pager from 'components/Pager'
  import Select from 'components/Select'
  import SearchBox from 'components/SearchBox'
  import ImageUploader from 'components/ImageUploader'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../../../mixins'
  import { DEVICES } from '../../config'
  import store from 'src/store'

  export default {
    name: 'AddForm',

    mixins: [globalMixins, pluginMixins],

    components: {
      'x-select': Select,
      'search-box': SearchBox,
      'pager': Pager,
      'modal': Modal,
      'image-uploader': ImageUploader
    },

    store,

    vuex: {
      getters: {
        currentMember: ({ system }) => system.currentMember
      }
    },

    props: {
      type: {
        type: String,
        default: 'add'
      }
    },

    data () {
      return {
        name: '',
        images: ['', '', ''], // 成品图
        difficulty: '不限',
        classification: [],
        instructions: '',
        major_ingredients: [],
        cooking_steps: [{
          description: '',
          time: '',
          images: ['']
        }],
        tips: '',
        devices: [],
        isShowDeviceSelectModal: false,
        selectedDevice: {},
        deviceTips: [],
        difficulties: ['不限', '新手', '初级', '中级', '高级', '厨神'],
        allDevices: DEVICES,
        ingredientSelectModal: {
          show: false,
          adding: false,
          searching: false,
          category: {
            label: '全部',
            value: 'all'
          },
          countPerPage: config.COUNT_PER_PAGE,
          currentPage: 1,
          total: 0,
          loadingData: false,
          query: '',
          ingredientList: [],
          selectedIngredientList: []
        },
        categories: [],
        ingredientCategories: [],
        adding: false
      }
    },

    computed: {
      autoexecs () {
        var result = []
        // console.log(this.decToHex(0))
        this.devices.forEach((item) => {
          var execArr = [this.decToHex(item.count)]
          item.steps.forEach((step) => {
            step.bytes.forEach((byte) => {
              execArr.push(this.decToHex(byte.value))
            })
          })
          for (var i = 99, len = execArr.length; i >= len; i--) {
            execArr[i] = this.decToHex(0)
          }
          result.push(execArr.join(' '))
        })
        return result
      },

      categoryOptions () {
        return _.differenceBy(this.categories, this.classification, 'main')
      },

      deviceOptions () {
        return _.differenceBy(this.allDevices, this.devices, 'name')
      },

      /**
       * 构建食材分类选项
       * @return {Array} 分类选项
       */
      ingredientCategoryOptions () {
        var arr = [{label: '全部', value: 'all'}]
        this.ingredientCategories.map((item) => {
          let obj = {}
          obj.label = item.main
          obj.value = item.main
          arr.push(obj)
        })
        return arr
      },

      /**
       * 食材查询条件
       * @return {Object} 查询条件
       */
      queryCondition () {
        var condition = {
          filter: ['_id', 'name', 'classification'],
          limit: this.ingredientSelectModal.countPerPage,
          offset: (this.ingredientSelectModal.currentPage - 1) * this.ingredientSelectModal.countPerPage,
          query: {},
          order: {
            created_at: -1
          }
        }

        if (this.ingredientSelectModal.query.length > 0) {
          // condition.query['name'] = { $like: this.ingredientSelectModal.query }
          condition.query['name'] = { $regex: this.ingredientSelectModal.query, $options: 'i' }
        }

        if (this.ingredientSelectModal.category.value === 'all') {
          delete condition.query['classification.main']
        } else {
          condition.query['classification.main'] = { $in: [this.ingredientSelectModal.category.value] }
        }
        return condition
      },

      filteredIngredientList () {
        var list = this.ingredientSelectModal.ingredientList.map((item) => {
          var flag = false
          this.major_ingredients.map((ingredient) => {
            if (ingredient.name === item.name) {
              flag = true
            }
          })
          this.ingredientSelectModal.selectedIngredientList.map((ingredient) => {
            if (ingredient.name === item.name) {
              flag = true
            }
          })
          item.selected = flag
          return item
        })
        return list
      }
    },

    ready () {
      // 如果是编辑表单
      if (this.type === 'edit') {
        var condition = {
          filter: [],
          limit: 1,
          offset: 0,
          query: {
            _id: this.$route.params.id
          }
        }
        this.getAppToKen(this.$route.params.app_id, 'recipe').then((token) => {
          api.diet.listRecipe(this.$route.params.app_id, token, condition).then((res) => {
            if (res.status === 200) {
              var data = res.data.list[0] ? res.data.list[0] : null
              this.name = data.name
              this.difficulty = data.properties.difficulty
              this.classification = data.classification
              this.instructions = data.instructions
              this.major_ingredients = data.major_ingredients
              this.cooking_steps = data.cooking_steps
              this.tips = data.tips
              this.creator = data.creator

              var images = ['', '', '']
              data.images.forEach((item, index) => {
                images[index] = item
              })
              this.images = images

              var deviceArr = []
              data.devices.forEach((item, index) => {
                var device = _.cloneDeep(this.allDevices[item.id])
                var arr = item.autoexec.split(' ').map((n) => {
                  return parseInt(n, 16)
                })
                device.count = arr.shift()
                device.time = item.time

                for (var i = 0; i < device.count; i++) {
                  device.steps[i] = _.cloneDeep(device.template)
                  device.steps[i].tips = item.tips ? item.tips[i] : ''
                  for (var j = 0, len = device.template.bytes.length; j < len; j++) {
                    var _byte = device.steps[i].bytes[j]
                    _byte.value = arr[i * len + j]
                    if (_byte.refs) {
                      _byte.refs.forEach((ref) => {
                        if (ref.condition === _byte.value) {
                          var refByte = device.steps[i].bytes[ref.index]
                          ref.origin = {
                            value: refByte.value,
                            unit: refByte.unit,
                            min: refByte.min,
                            max: refByte.max
                          }
                          refByte.min = ref.min
                          refByte.max = ref.max
                          refByte.unit = ref.unit
                        }
                      })
                    }
                  }
                }
                deviceArr.push(device)
              })
              this.devices = deviceArr
            }
          })
        })
      }

      // 获取所有菜谱分类
      this.getCategories()
      // 获取所有食材分类
      this.getIngredientCategories()
      // 获取所有食材
      this.getIngredients()
    },

    methods: {
      /**
       * 十进制转换为十六进制
       * @param  {Number} n 目标数字
       * @return {String}   十六进制字符串
       */
      decToHex (n) {
        var str = n.toString(16)
        return str.length === 1 ? `0${str}` : str
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
       */
      getCategories () {
        // this.categories = [{main: '蔬菜', sub: ['叶菜', '块茎']}, {main: '水果', sub: []}]
        var self = this
        var argvs = arguments
        var fn = self.getCategories
        this.loadingData = true
        var condition = {
          query: {
            key: 'recipe_classification'
          }
        }
        this.getAppToKen(this.$route.params.app_id, 'recipe').then((token) => {
          api.diet.listCategory(this.$route.params.app_id, token, condition).then((res) => {
            if (res.data.list.length > 0) {
              this.categories = res.data.list[0].value
            } else {
              this.categories = []
            }
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'recipe'
            }
            self.handlePluginError(err, env)
          })
        })
      },

      /**
       * 获取食材分类
       */
      getIngredientCategories () {
        var self = this
        var argvs = arguments
        var fn = self.getIngredientCategories
        var condition = {
          query: {
            key: 'ingredients_classification'
          }
        }
        this.getAppToKen(this.$route.params.app_id, 'recipe').then((token) => {
          api.diet.listCategory(this.$route.params.app_id, token, condition).then((res) => {
            console.log(res)
            if (res.data.count > 0) {
              this.ingredientCategories = res.data.list[0].value
            } else {
              this.ingredientCategories = []
            }
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'recipe'
            }
            self.handlePluginError(err, env)
          })
        })
      },

      /**
       * 获取食材列表
       */
      getIngredients () {
        var self = this
        var argvs = arguments
        var fn = self.getIngredients
        this.ingredientSelectModal.loadingData = true
        this.getAppToKen(this.$route.params.app_id, 'recipe').then((token) => {
          api.diet.listIngredient(this.$route.params.app_id, token, this.queryCondition).then((res) => {
            // 食材列表
            this.ingredientSelectModal.ingredientList = res.data.list.map((item) => {
              item.selected = false
              return item
            })
            this.ingredientSelectModal.total = res.data.total
            this.ingredientSelectModal.loadingData = false
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'recipe'
            }
            self.handlePluginError(err, env)
            this.ingredientSelectModal.loadingData = false
          })
        })
      },

      /**
       * 添加菜谱类别
       */
      addCategory () {
        var newCate = {sub: []}
        newCate.main = this.categoryOptions[0].main
        this.classification.push(newCate)
      },

      /**
       * 取消设备选择
       */
      onDeviceSelectCancel () {
        this.isShowDeviceSelectModal = false
        this.selectedDevice = {}
      },

      /**
       * 添加烹饪设备
       */
      addCookingDevice () {
        this.selectedDevice.steps = [_.cloneDeep(this.selectedDevice.template)]
        this.devices.push(_.cloneDeep(this.selectedDevice))
        this.selectedDevice = {}
        this.isShowDeviceSelectModal = false
      },

      setRange (bytes, byte) {
        if (byte.refs) {
          byte.refs.forEach((ref) => {
            if (Object.keys(ref.origin).length === 0) {
              ref.origin = {
                value: bytes[ref.index].value,
                unit: bytes[ref.index].unit,
                min: bytes[ref.index].min,
                max: bytes[ref.index].max
              }
            }
            if (ref.condition === byte.value) {
              bytes[ref.index].value = ref.value
              bytes[ref.index].min = ref.min
              bytes[ref.index].max = ref.max
              bytes[ref.index].unit = ref.unit
            } else {
              bytes[ref.index].value = ref.origin.value
              bytes[ref.index].min = ref.origin.min
              bytes[ref.index].max = ref.origin.max
              bytes[ref.index].unit = ref.origin.unit
            }
          })
        }
      },

      /**
       * 设置步骤
       * @param {Objcet} device 设备
       */
      setSteps (device) {
        var arr = []
        for (var i = 0, len = device.count; i < len; i++) {
          if (i < device.steps.length) {
            arr[i] = _.cloneDeep(device.steps[i])
          } else {
            arr[i] = _.cloneDeep(this.allDevices[device.id].template)
          }
        }
        device.steps = arr
      },

      /**
       * 菜谱步骤右边四个小操作按钮的事件
       * @param  {[type]} step      当前操作的步骤对象
       * @param  {[type]} index     当前操作的步骤index
       * @param  {[type]} eventType 事件类型，用来区分四个按钮的四个事件
       * @return {[type]}           无返回
       */
      handleStepEvent (eventType, step, index) {
        var newstep = {
          description: '',
          time: 0,
          images: ['']
        }
        switch (eventType) {
          case 'MOVE_UP':
            this.cooking_steps.splice(index, 1)
            this.cooking_steps.splice(index - 1, 0, step)
            break
          case 'MOVE_DOWN':
            this.cooking_steps.splice(index, 1)
            this.cooking_steps.splice(index + 1, 0, step)
            break
          case 'ADD':
            this.cooking_steps.splice(index + 1, 0, newstep)
            break
          case 'DEL':
            this.cooking_steps.$remove(step)
            break
          default:
            break
        }
      },

      /**
       * 移除设备
       * @param  {Object} device  要删除的设备
       * @param  {Array}  devices 设备列表
       */
      removeDevice (device, devices) {
        if (window.confirm('你确定要移除该设备信息？')) {
          devices.$remove(device)
        }
      },

      /**
       * 通用删除事件
       * @param  {Object} obj 要删除的对象
       * @param  {Array}  arr 要删除的对象的父数组
       */
      removeObj (obj, arr) {
        arr.$remove(obj)
      },

      /**
       * 确定已选食材
       */
      confirmSelected () {
        this.ingredientSelectModal.adding = true
        this.ingredientSelectModal.selectedIngredientList.map((item) => {
          var newIngredient = {}
          newIngredient._id = item._id
          newIngredient.classification = item.classification
          newIngredient.name = item.name
          this.major_ingredients.push(newIngredient)
        })
        this.ingredientSelectModal.selectedIngredientList = []
        this.ingredientSelectModal.show = false
        this.ingredientSelectModal.adding = false
      },

      /**
       * 添加食材操作
       * @param {Object} ingredient 食材
       */
      addIngredient (ingredient) {
        this.ingredientSelectModal.selectedIngredientList.push(ingredient)
      },

      /**
       * 添加食材弹出浮层的删除事件
       * @param {Object} ingredient 食材
       */
      deleteIngredient (ingredient) {
        this.ingredientSelectModal.selectedIngredientList.$remove(ingredient)
      },

      // 搜索
      handleSearch () {
        if (this.ingredientSelectModal.query.length === 0) {
          this.getIngredients()
        }
      },

      // 切换搜索
      toggleSearching () {
        this.ingredientSelectModal.searching = !this.ingredientSelectModal.searching
      },

      // 取消搜索
      cancelSearching () {
        this.getIngredients()
      },

      /**
       * 菜谱表单提交
       */
      onRecipeSubmit () {
        var self = this
        var argvs = arguments
        var fn = self.onRecipeSubmit
        if (this.$validation.valid && !this.editing) {
          this.editing = true
          this.images = _.compact(this.images)
          var devices = []
          this.devices.forEach((item, index) => {
            var tips = []
            item.steps.forEach((step) => {
              tips.push(step.tips)
            })
            devices.push({
              id: item.id,
              name: item.name,
              autoexec: this.autoexecs[index],
              tips: tips,
              time: item.time
            })
          })
          var params = {
            name: this.name,
            classification: this.classification,
            major_ingredients: this.major_ingredients,
            minor_ingredients: [],
            cooking_steps: this.cooking_steps,
            properties: {
              difficulty: this.difficulty
            },
            devices: devices,
            tags: '',
            images: this.images,
            instructions: this.instructions,
            tips: this.tips,
            creator: this.type === 'edit' ? this.creator : this.currentMember.email
          }
          this.getAppToKen(this.$route.params.app_id, 'recipe').then((token) => {
            if (this.type === 'edit') {
              this.getAppToKen(this.$route.params.app_id, 'recipe').then((token) => {
                api.diet.updateRecipe(this.$route.params.app_id, token, this.$route.params.id, params).then((res) => {
                  if (res.status === 200) {
                    this.showNotice({
                      type: 'success',
                      content: '菜谱修改成功！'
                    })
                    this.$route.router.go({path: '/plugins/recipe/' + this.$route.params.app_id})
                  }
                }).catch((err) => {
                  var env = {
                    'fn': fn,
                    'argvs': argvs,
                    'context': self,
                    'plugin': 'recipe'
                  }
                  self.handlePluginError(err, env)
                  this.ingredientSelectModal.loadingData = false
                  this.editing = false
                })
              })
            } else {
              api.diet.addRecipe(this.$route.params.app_id, token, params).then((res) => {
                if (res.status === 200) {
                  this.showNotice({
                    type: 'success',
                    content: '菜谱添加成功！'
                  })
                  this.$route.router.go({path: '/plugins/recipe/' + this.$route.params.app_id + '/list'})
                }
              }).catch((err) => {
                var env = {
                  'fn': fn,
                  'argvs': argvs,
                  'context': self,
                  'plugin': 'recipe'
                }
                self.handlePluginError(err, env)
                this.ingredientSelectModal.loadingData = false
                this.editing = false
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../../../assets/stylus/common'

  .recipe-form
    .form
      .form-row
        max-height 5000px

        .controls
          .select-group
            position relative
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

          .delete-input
            position absolute
            right 5px
            top 5px
            span.fa
              color #c0252e

      // 步骤
      .step-box
        margin-top 20px
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
        .step-text
          box-sizing border-box
          height 120px
          .input-text-wrap
          .input-text
            height 100%
        .button-list
          position absolute
          left 100.5%
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

      .ingredient-row
        table
          margin-top 0

          td
            padding 5px 0

        .ingredient-name
          margin-right 20px

        .fa-times
          color #c0252e

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
