<template lang="jade">
section.main-wrap.diet
  .main
    .breadcrumb
      a(v-link="{path: '/diet/recipe'}")
        i.fa.fa-arrow-circle-left
        | 菜谱管理
    .panel
      .panel-hd
        h2 添加菜谱
      .panel-bd
        .form
          form(v-form, name="validation")
            .form-row
              label.form-control {{ $t("food.fields.name") }}:
              .controls
                .input-text-wrap(v-placeholder="'请填写菜谱名称'")
                  input.input-text(v-model="toAddrecipeObj.name",type="text", v-form-ctrl, name="name", maxlength="250", required, lazy)
                .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                  span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('food.fields.name')}) }}
                .form-tips.form-tips-error(v-if="validation.name.$dirty")
                  span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('food.fields.name')}) }}
                  span(v-if="validation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('food.fields.name'), 250]) }}
                  span(v-if="validation.name.$error.customValidator") {{ $t('validation.format', {field: $t('food.fields.name')}) }}
            .form-row
              label.form-control {{ $t("food.fields.images") }}:
              .controls.controls-image
                .image-uploader
                  image-uploader(v-for="n in toAddrecipeObj.images.length", :image.sync="toAddrecipeObj.images[n]")
                .form-tips 建议上传640像素*480像素成品图，最多不超过3张
            .form-row
              label.form-control 难度:
              .controls
                .select-group
                  .select
                    select(v-model="toAddrecipeObj.difficulties", v-form-ctrl, name="classification")
                      option(v-for="difficulty in difficulties", :value="", :selected="$index===0") {{difficulty}}
                    //- span.fa.fa-times

            //- .form-row
            //-   label.form-control {{ $t("food.fields.classification") }}:
            //-   .controls
            //-     .select-group
            //-       .select.clear(v-for="selectedclassification in toAddrecipeObj.classifications")
            //-         select(v-model="selectedclassification.main")
            //-           option(v-for="classification in classifications | dropSlected toAddrecipeObj.classifications selectedclassification", :selected="classification===selectedclassification.main") {{classification}}
            //-         span.fa.fa-times(@click="removeObj(selectedclassification,toAddrecipeObj.classifications)")
            //-     button.btn.btn-success()
            //-       i.fa.fa-plus
            //-       | 添加类别
            .form-row
              label.form-control {{ $t("food.fields.classification") }}:
              .controls
                .select-group
                  .select(v-for="category in toAddrecipeObj.classifications")
                    select(v-model="category.main")
                      option(v-for="opt in categories | dropSlected toAddrecipeObj.classifications category", :value="opt.main", :selected="opt.main===category.main") {{opt.main}}
                    span.fa.fa-times(@click="removeObj(category,toAddrecipeObj.classifications)")
                button.btn.btn-success(@click.prevent="AddCategory", :disabled="toAddrecipeObj.classifications.length === categories.length", :class="{'disabled': toAddrecipeObj.classifications.length === categories.length}")
                  i.fa.fa-plus
                  | 添加类别
            .form-row
              label.form-control {{ $t("food.fields.instructions") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('food.placeholders.instructions')")
                  textarea.input-text(v-model="toAddrecipeObj.instructions", type="text", v-form-ctrl, name="instructions", maxlength="250", lazy)
                .form-tips.form-tips-error(v-if="validation.instructions.$dirty")
                  span(v-if="validation.instructions.$error.maxlength")  {{ $t('validation.maxlength', [ $t('food.fields.instructions'), 250]) }}
            .form-row
              label.form-control 食材:
              .controls
                button.btn.btn-success(@click.prevent="showSelectFoods=true")
                  i.fa.fa-plus
                  | 添加食材
            .form-row
              label.form-control 烹饪设备:
              .controls
                .select-group(v-for="cookingDevice in cookingDevices")
                  .select.inline
                    select(v-model="cookingDevice.device")
                      option(v-for="opt in cookingDevicesList", :value="opt", :selected="$index===0") {{opt}}
                  .input-text-wrap.inline
                    input.input-text-time(type="text",v-model="cookingDevice.time")
                    span.text-time 分钟
                  .delete-input.inline
                    span.fa.fa-times.pointer(@click="removeObj(cookingDevice,cookingDevices)")
                  .input-text-wrap.block.margin10
                    textarea.input-text(placeholder="请输入设备烹饪指令",v-model="cookingDevice.code", type="text")

                button.btn.btn-success(@click.prevent="AddCookingDevice")
                  i.fa.fa-plus
                  | 添加烹饪设备
            .form-row
              label.form-control 步骤:
              .controls
                .prompt-box
                  |小提示：
                  br
                  |1、步骤图宽度在150像素至150像素；
                  br
                  |2、每个步骤用一段话描述，如果不需要可将内容留空；

                .step-box(v-for="cookingstep in cookingSteps")
                  label.form-control 第{{$index+1}}步:
                  .controls.controls-image
                    .image-uploader
                      image-uploader(:image.sync="cookingstep.images")
                  .input-text-wrap.step-text
                    textarea.input-text(v-model="cookingstep.description",type="text",lazy,placeholder="请填写步骤的描述")
                  .button-list
                    .controlButton.button-up(v-show="cookingSteps.length>1&&$index>0",@click="stepEvent(cookingstep,$index,'up')")
                      i.icon.fa.fa-long-arrow-up
                    .controlButton.button-down(v-show="cookingSteps.length>1&&$index<(cookingSteps.length-1)",@click="stepEvent(cookingstep,$index,'down')")
                      i.icon.fa.fa-long-arrow-down
                    .controlButton.button-add(@click="stepEvent(cookingstep,$index,'add')")
                      i.icon.fa.fa-plus
                    .controlButton.button-del(v-show="cookingSteps.length>1",@click="stepEvent(cookingstep,$index,'del')")
                      i.icon.fa.fa-times
            .form-actions
              button.btn.btn-primary.btn-lg(type="submit") {{ $t("common.save") }}
        modal(:show.sync="showSelectFoods",:width="800")
          h3(slot="header") 选择食材
          .food-box(slot="body")
            .status-bar
              v-select(:options="foodCategoryOptions", :value.sync="category", @select="selectClass")
                span 类别：
              search-box
                button.btn.btn-primary(slot="search-button", @click="searchFoods") {{ $t('common.search') }}
            .food-list
              .toSelectList
                table.table.table-stripe.table-bordered
                  thead
                    tr
                      th
                        | 标题
                      th.tac {{ $t('common.action') }}
                  tbody
                    tr(v-for="toSelectFood in toSelectFoodList",track-by = "$index")
                      td
                        span {{toSelectFood.name}}
                      td.tac.w70
                        a.btn-link(v-show="!toSelectFood.selected",@click.stop="addFood(toSelectFood)") 添加
                        span(v-show="toSelectFood.selected") 已添加
                pager(:page-count="1",:total="15",:current.sync="1")
              .selectedList
                table.table.table-stripe.table-bordered
                  thead
                    tr
                      th
                        | 已选择
                  tbody
                    tr(v-for="selectedFood in selectedFoodList")
                      td
                        span {{selectedFood.name}}
                        i.fa.fa-times-circle(@click="deleteFood(selectedFood)")
            .button-box
              .form-actions
                button.btn.btn-default(@click.prevent.stop="showSelectFoods=false") {{ $t("common.cancel") }}
                button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? $t('common.handling') : $t('common.ok')")
</template>

<script>
import api from '../../../api';
import Modal from '../../../components/modal.vue';
import Pager from '../../../components/pager.vue';
import Select from '../../../components/select.vue';
import SearchBox from '../../../components/search-box.vue';
import ImageUploader from '../../../components/image-uploader.vue';

export default {
  name: 'AddForm',

  components: {
    'v-select': Select,
    'search-box': SearchBox,
    'pager': Pager,
    'modal': Modal,
    'image-uploader': ImageUploader
  },
  data () {
    return {
      validation: {},
      adding: false,
      showSelectFoods: false,
      toAddrecipeObj: {
        name: '',
        classifications: [],
        difficulties: [],
        images: ['', '', ''],
        instructions: ''
      },
      difficulties: ['不限', '新手', '初级', '中极', '高级', '厨神'],
      cookingDevicesList: ['云炖锅', '隔水炖', '电饭煲', '某某煲'],
      category: '全部',
      foodCategoryOptions: [
        {label: '全部', value: '全部'},
        {label: '蔬菜', value: '蔬菜'},
        {label: '水果', value: '水果'}
      ],
      foodList: [
        {
          name: '小草肉456',
          selected: false
        },
        {
          name: '小草肉123',
          selected: false
        },
        {
          name: '小草肉1223',
          selected: false
        },
        {
          name: '小草肉13323',
          selected: false
        },
        {
          name: '小草肉234',
          selected: false
        }
      ],
      toSelectFoodList: [],
      selectedFoodList: [],
      cookingDevices: [],
      cookingSteps: [
        {
          index: 0,
          description: '',
          images: ''
        }
      ],
      categories: []
    };
  },

  route: {
    data () {
      this.getCategories();
    }
  },

  ready () {
    var self = this;
    self.updateToSelectedList();
  },

  computed: {
    categoryOptions () {
      console.log(this.categories);
      return this.categories.filter((cate) => {
        var flag = true;
        this.toAddrecipeObj.classifications.forEach(function (item) {
          if (cate.main === item.main) {
            flag = false;
          }
        });
        return flag;
      });
    }
  },

  methods: {
    /**
     * 添加烹饪设备
     */
    AddCookingDevice () {
      var self = this;
      var newDevice = {
        device: '',
        code: '',
        time: ''
      };
      self.cookingDevices.push(newDevice);
    },
    /**
     * 获取分类
     */
    getCategories () {
      // this.categories = [{main: '蔬菜', sub: ['叶菜', '块茎']}, {main: '水果', sub: []}];
      api.diet.listCategory('recipe_Ingredients').then((data) => {
        if (data.value !== undefined) {
          this.categories = data.value;
        } else {
          this.categories = [];
        }
      }).catch((error) => {
        this.handleError(error);
      });
    },

    /**
     * 添加类别
     */
    AddCategory () {
      var newCate = {sub: []};
      newCate.main = this.categoryOptions[0].main;
      this.toAddrecipeObj.classifications.push(newCate);
    },
    /**
     * 菜谱步骤右边四个小操作按钮的事件
     * @param  {[type]} step      当前操作的步骤对象
     * @param  {[type]} index     当前操作的步骤index
     * @param  {[type]} eventType 事件类型，用来区分四个按钮的四个事件
     * @return {[type]}           无返回
     */
    stepEvent (step, index, eventType) {
      var self = this;
      var newstep = {
        index: 0,
        description: '',
        time: 0,
        images: ''
      };
      if (eventType === 'up') {
        console.log('up');
        self.cookingSteps.splice(index, 1);
        self.cookingSteps.splice(index - 1, 0, step);
      }else if (eventType === 'down') {
        console.log('down');
        self.cookingSteps.splice(index, 1);
        self.cookingSteps.splice(index + 1, 0, step);
      }else if (eventType === 'add') {
        self.cookingSteps.splice(index + 1, 0, newstep);
      }else if (eventType === 'del') {
        self.cookingSteps.$remove(step);
      }
    },
    /**
     * 通用删除事件
     * @param  {[type]} obj 要删除的对象
     * @param  {[type]} arr 要删除的对象的父数组
     */
    removeObj (obj, arr) {
      arr.$remove(obj);
    },
    /**
     * 添加食材弹出浮层的添加事件
     * @param {[type]} food [description]
     */
    addFood (food) {
      var self = this;
      self.selectedFoodList.push(food);
      self.updateToSelectedList();
    },
    /**
     * 添加食材弹出浮层的删除事件
     * @param {[type]} food [description]
     */
    deleteFood (food) {
      var self = this;
      self.selectedFoodList.$remove(food);
      self.updateToSelectedList();
    },
    /**
     * 添加食材弹出浮层的类别选择事件
     * @param {[type]} food [description]
     */
    selectClass () {
      var self = this;
      console.log(self);
    },
    /**
     * 添加食材弹出浮层的搜索事件
     * @param {[type]} food [description]
     */
    searchFoods () {
      console.log('添加食材弹出浮层的搜索事件被调用');
    },
    /**
     * 添加食材弹出浮层的左边被选择列表更新事件，根据已选择的食材给每个食材添加已选择或者未选择属性
     * @param {[type]} food [description]
     */
    updateToSelectedList () {
      var self = this;
      var retArr = self.foodList;
      retArr.map(function (food) {
        food.selected = false;
        for (let i = 0;i < self.selectedFoodList.length;i++) {
          if (food.name === self.selectedFoodList[i].name) {
            food.selected = true;
          }
        };
      });
      self.toSelectFoodList = [].concat(retArr);

    }
  }
};
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .inline
    display inline-block
  .block
    display block
  .clear
    clear both
  .pointer
    cursor pointer
  .diet
    .panel
      .panel-bd
        .form-row
          max-height 5000px
          .prompt-box
            width 100%
            height auto
            margin 0 auto 10px
            border 1px solid #ccc
            box-sizing border-box
            padding 10px
          .step-box
            margin-bottom 20px
            width 100%
            position relative
            clearfix()
            label.form-control
              float left
              text-align right
              width 70px
              line-height 120px
              padding-right 20px
              box-sizing border-box
            .controls-image
              float left
              width 182px
              min-width 182px
              overflow hidden
            .step-text
              float left
              width 50%
              box-sizing border-box
              height 120px
              .input-text
                height 100%
            .button-list
              position absolute
              left 100.5%
              height 120px
              opacity 0
              /*transition opacity ease 0.3s*/
              .controlButton
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
          .controls
            width 70%
            .select-group
              position relative
              .margin10
                margin-top 10px
                margin-bottom 10px
              .input-text-wrap
                input.input-text-time
                  border 1px solid #d9d9d9
                  display inline-block
                  width 60px
                  box-sizing border-box
                  font-size 14px
                  height 38px
                  line-height 38px
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
      .modal
        .modal-body
          clearfix()
          .status-bar
            padding 0
            border 0
            .v-select
              float left
              display inline-block
              padding-left 10px
              .btn-group
                margin-left 15px
            .search-box
              float right
          .food-list
            clearfix()
            .toSelectList
              width 68%
              float left
              .pager
                margin-top 10px
            .selectedList
              width 30%
              float right
              min-height 192px
              border 1px solid #e4e4e4
              box-sizing border-box
              .table
                tbody
                  tr
                    td
                      position relative
                      i.fa
                        height 100%
                        top 0
                        line-height 30px
          .button-box
            width 100%
            box-sizing border-box
            text-align right
            .btn
              margin-left 10px

</style>
