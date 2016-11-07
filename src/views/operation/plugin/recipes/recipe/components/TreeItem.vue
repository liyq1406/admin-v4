<template>
  <li class="mrb15 itemli">
    <div class="line32 mrb15">
      <!-- <span class="bg"></span> -->
      <a class="mr10 pagelink linearea box" @mouseover="showOpera = true" @mouseout="leaveMouse"><i v-if="menu && menu.hasOwnProperty('name') && !menu.hasOwnProperty('type')" class=" mr10 cookingIcon"></i><span  @click.prevent.stop="handleMenu('edit', menu)" v-if="menu && menu.hasOwnProperty('type') && !menu.hasOwnProperty('name')">{{ menu.type }}</span><span @click.prevent.stop="handleCode('edit',menu)" v-if="menu && menu.hasOwnProperty('name')">{{ menu.name }}</span></a>
      <div class="btn-area" v-if="showOpera" @mouseover="inMouse" @mouseout="leaveMouse">
        <button v-if="!menu.name" class="btn btn-ghost mr10" @click.prevent.stop="handleMenu('add', menu)"><i class="fa fa-plus"></i>添加子菜单</button>
        <button v-if="!menu.name" class="btn btn-ghost mr10" @click.prevent.stop="handleCode('add', menu)"><i class="fa fa-plus"></i>添加烹饪参数</button>
        <!-- <button v-if="menu.name && !menu.param" class="btn btn-ghost mr10" @click.prevent.stop="handleCode('edit',menu)"><i class="fa fa-plus"></i>编辑烹饪参数</button> -->
      </div>
    </div>
    <ul class="deepul" v-if="menu && menu.param && menu.param.length > 0">
      <tree-item v-for="item in menu.param" :menu="item" :index="$index" @add-menu="handleAddMenu" @edit-menu="handleEditMenu" @add-code="handleAddCode" @edit-code="handleEditCode" @push-data="test" @push-code-data="setCode" @delete-menu="deleteMenu" @delete-code="deleteCode"></tree-item>
    </ul>
  </li>
  <!-- 餐单添加编辑 -->
  <modal :show.sync="MenuShow" width="480px">
    <h3 slot="header"><span v-if="type==='add'">添加</span><span v-if="type==='edit'">编辑</span>菜单</h3>
    <div slot="body" class="form">
      <menu-form v-if="MenuShow" :type="type" :menu="menuClone" @submit="pushMenu" @close="closeMenu" @delete="deleteMenu"></menu-form>
    </div>
  </modal>
  <!-- 烹饪参数添加编辑 -->
  <modal :show.sync="CodeShow" width="480px">
    <h3 slot="header"><span v-if="type==='add'">添加</span><span v-if="type==='edit'">编辑</span>烹饪参数</h3>
    <div slot="body" class="form">
      <code-form v-if="CodeShow" :type="type" :menu="codeClone" @submit="pushCode" @close="closeCode" @delete="deleteCode"></code-form>
    </div>
  </modal>
</template>
<script>
  import MenuForm from './MenuForm'
  import CodeForm from './CodeForm'
  import Modal from 'components/Modal'
  import _ from 'lodash'
  export default {
    name: 'TreeItem',

    props: {
      menu: {
        type: Object,
        default () {
          return {}
        }
      },
      index: {
        type: Number
      }
    },

    components: {
      MenuForm,
      CodeForm,
      Modal
    },

    data () {
      return {
        showOpera: false,
        MenuShow: false,
        CodeShow: false,
        type: 'add',
        menuClone: {},
        codeClone: {}
      }
    },
    computed: {
      showIcon () {
        var result = false
        // console.log(this.menu.name)
        if (this.menu) {
          if (this.menu.hasOwnProperty('name') || this.menu.hasOwnProperty('param_id') || this.menu.hasOwnProperty('desc')) {
            result = true
          } else {
            result = false
          }
        }
        return result
      }
    },
    methods: {
      setCode (val, index) {
        // this.menu.$set(val)
        console.log('%c2321323', 'color:red')
        console.log(JSON.stringify(val))
        this.menu.param.$set(index, val)
        console.log(JSON.stringify(this.menu))
        this.$emit('push-code-data', this.menu, this.index)
      },
      test (val, index) {
        // console.log(val)
        // console.log(index)
        this.menu.param.$set(index, val)
        this.$emit('push-data', this.menu, this.index)
      },
      leaveMouse () {
        this.tId = window.setTimeout(() => {
          this.showOpera = false
        }, 50)
      },
      inMouse () {
        window.clearTimeout(this.tId)
      },
      // 菜单弹窗事件
      handleMenu (type, menu) {
        this.type = type
        if (this.type === 'edit') {
          this.menuClone = this.menu
        } else if (this.type === 'add') {
          this.menuClone = {}
        }
        this.MenuShow = true
        // this.$emit('add-menu', menu)
      },
      // 烹饪参数弹窗事件
      handleCode (type, menu) {
        this.type = type
        if (this.type === 'edit') {
          this.codeClone = this.menu
        } else if (this.type === 'add') {
          this.codeClone = {}
        }
        this.CodeShow = true
        // this.$emit('add-menu', menu)
      },
      // 菜单
      pushMenu (model) {
        // alert(JSON.stringify(model))
        if (this.type === 'add') {
          // 如果是添加
          if (this.menu.param && this.menu.param.length > 0) {
            // 如果本身有其他子菜单，则push进去
            this.menu.param.push(model)
          } else {
            // 不存在param，则新建一个
            // this.$set(this.menu, 'param', model)
            this.menu = _.extend({}, this.menu, {param: [model]})
            // let b = [a]
            // this.$set(this.menu, 'param', b)
          }
          this.MenuShow = false
        } else if (this.type === 'edit') {
          // 如果是编辑
          if (this.menu) {
            this.menu.type = model.type
          }
          this.MenuShow = false
        }
        this.$emit('push-data', this.menu, this.index)
      },
      // 烹饪参数
      pushCode (model) {
        // alert(JSON.stringify(model))
        if (this.type === 'add') {
          // 如果是添加
          // this.menu = _.extend({}, this.menu, {name: model.name})
          // this.menu = _.extend({}, this.menu, {desc: model.desc})
          // this.menu = _.extend({}, this.menu, {param_id: model.param_id})
          if (this.menu.param && this.menu.param.length > 0) {
            // 如果本身有其他子菜单，则push进去
            this.menu.param.push(model)
          } else {
            // 不存在param，则新建一个
            // this.$set(this.menu, 'param', model)
            this.menu = _.extend({}, this.menu, {param: [model]})
            // let b = [a]
            // this.$set(this.menu, 'param', b)
          }
          console.log(model)
          this.CodeShow = false
        } else if (this.type === 'edit') {
          // 如果是编辑
          console.log(model)
          this.menu.name = model.name
          this.menu.desc = model.desc
          this.menu.param_id = model.param_id
          this.CodeShow = false
        }
        console.log(1231231233)
        this.$emit('push-code-data', this.menu, this.index)
      },
      closeMenu () {
        this.MenuShow = false
        // this.$resetValidation()
      },
      closeCode () {
        this.CodeShow = false
      },
      deleteMenu (menu, index, deleted) {
        if (index >= 0 && !deleted) {
          deleted = true
          this.menu.param.splice(index, 1)
          this.MenuShow = false
        }
        this.$emit('delete-menu', this.menu, this.index, deleted)
      },
      deleteCode (menu, index, codeDeleted) {
        // delete this.menu.name
        // delete this.menu.param_id
        // delete this.menu.desc
        if (index >= 0 && !codeDeleted) {
          codeDeleted = true
          // var deleteKey = ['name', 'param_id', 'desc']
          // var obj = {}
          // for (var key in this.menu.param[index]) {
          //   if (menu.hasOwnProperty(key)) {
          //     if (deleteKey.indexOf(key) === -1) {
          //       obj[key] = menu[key]
          //     }
          //   }
          // }
          this.menu.param.splice(index, 1)
          this.CodeShow = false
          // this.menu.param[index] = obj
          // console.log(obj)
        }
        this.type = 'add'
        this.CodeShow = false
        this.$emit('delete-code', this.menu, this.index, codeDeleted)
      }
      // handleAddCode (menu) {
      //   // 向父组件传递增加烹饪参数事件
      //   this.$emit('add-code', menu)
      // },
      // handleEditMenu (menu) {
      //   // 向父组件传递编辑菜单名字事件
      //   this.$emit('edit-menu', menu)
      // },
      // handleEditCode (menu) {
      //   // 向父组件传递编辑烹饪参数事件
      //   this.$emit('edit-code', menu)
      // }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../../../assets/stylus/common'
  .itemli
    position relative
  .linearea
    position relative
    padding-left 35px
    top 16px
  li li .box
    /*padding-left 35px*/
    &:after
      position absolute
      top 5px
      left 0
      content ""
      width 28px
      height 1px
      border-bottom 2px dotted #ddd
  .cookingIcon
    background url('../../../../../../assets/images/weibo.png') no-repeat center top
    display inline-block
    width 23px
    height 17px
    margin-bottom -2px
  .bg
    background url('../../../../../../assets/images/lastitem.png') no-repeat center top
    display inline-block
    width 38px
    height 32px
  .pagelink
    color #c0252e
  .mr10
    margin-right 10px
  .mrb15
    margin-bottom 20px
  .line32
    line-height 32px
    height 32px
  .btn-area
    display inline-block
    position relative
    top 16px
  .deepul
    margin-left 40px
    /*padding-left 20px*/
    border-left 2px dotted #ddd
  </style>
