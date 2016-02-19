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
                    span.fa.fa-times
            .form-row
              label.form-control {{ $t("food.fields.classification") }}:
              .controls
                .select-group
                  .select.clear(v-for="selectedclassification in toAddrecipeObj.classifications")
                    select(@change="selectclassEvent(selectedclassification,$event)",v-form-ctrl, name="classification")
                      option(v-for="classification in classifications", :value="", :selected="$index===0") {{classification}}
                    span.fa.fa-times(@click="removeObj(selectedclassification,toAddrecipeObj.classifications)")
                button.btn.btn-success(@click.prevent="addClassification")
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
                .select-group(v-for="n in 3")
                  .select.inline
                    select(v-form-ctrl, name="classification")
                      option(v-for="classification in classifications", :value="", :selected="$index===0") {{classification}}
                  .input-text-wrap.inline
                    input.input-text-time(type="text")
                    span.text-time 分钟
                  .delete-input.inline
                    span.fa.fa-times
                  .input-text-wrap.block.margin10(v-placeholder="'请输入设备烹饪指令'")
                    textarea.input-text(v-model="toAddrecipeObj.instructions", type="text",lazy)

                button.btn.btn-success
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
              v-select(:options="categoryOptions", :value.sync="category", @select="selectClass")
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
        classifications: [{main: '湘菜', sub: ''}, {main: '粤菜', sub: ''}],
        difficulties: [],
        images: ['', '', ''],
        instructions: ''
      },
      difficulties: ['不限', '新手', '初级', '中极', '高级', '厨神'],
      classifications: ['测试菜', '粤菜', '湘菜', '东北菜', '养生'],
      category: '全部',
      categoryOptions: [
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
      toSelectFoodList: [
        {
          name: '123',
          selected: false
        }
      ],
      selectedFoodList: [
      ],
      cookingSteps: [
        {
          index: 0,
          description: '',
          time: 30,
          images: ''
        },
        {
          index: 0,
          description: '',
          time: 30,
          images: ''
        },
        {
          index: 1,
          description: '',
          time: 30,
          images: ''
        }
      ]
    };
  },

  ready () {
    var self = this;
    self.updateToSelectedList();
  },

  methods: {
    selectclassEvent (obj, event) {
      console.log(event.target.value);
      obj.main = event.target.value;
    },
    addClassification () {
      var self = this;
      var noRepeatName = function () {
        for (var i = 0; i < self.classifications.length; i++) {
          console.log(self.toAddrecipeObj.classifications[0]);
          for (var j = 0; j < self.toAddrecipeObj.classifications.length; i++) {
            if (self.toAddrecipeObj.classifications[j].main !== self.classifications[i]) {

              return self.classifications[i];
            }
          }
        }
      };
      console.log(noRepeatName());
      var newclass = {
        main: noRepeatName(),
        sub: ''
      };
      self.toAddrecipeObj.classifications.push(newclass);
    },
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
    removeObj (obj, arr) {
      console.log(123);
      arr.$remove(obj);
    },
    addFood (food) {
      var self = this;
      self.selectedFoodList.push(food);
      self.updateToSelectedList();
    },
    deleteFood (food) {
      var self = this;
      self.selectedFoodList.$remove(food);
      self.updateToSelectedList();
    },
    selectClass () {
      var self = this;
      console.log(self);
    },
    searchFoods () {

    },
    updateToSelectedList () {
      var self = this;
      var retArr = self.foodList;
      // for (var i = 0; i < retArr.length; i++) {
      //   retArr[i].selected = false;
      // }
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
              margin-bottom 20px
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
