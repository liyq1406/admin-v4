<template>
  <li class="mrb15 itemli">
    <div class="line32">
      <a class="mr10" @click.prevent.stop="handleEditMenu(menu)" @mouseover="showOpera = true" @mouseout="leaveMouse"><i v-if="menu.name" class=" mr10 fa fa-cutlery"></i>{{menu.type}}</a>
      <div class="btn-area" v-if="showOpera" @mouseover="inMouse" @mouseout="leaveMouse">
        <button v-if="!menu.name && !menu.param" class="btn btn-ghost mr10" @click.prevent.stop="handleAddMenu(menu)"><i class="fa fa-plus"></i>添加子菜单</button>
        <button v-if="!menu.name && !menu.param" class="btn btn-ghost mr10" @click.prevent.stop="handleAddCode(menu)"><i class="fa fa-plus"></i>添加烹饪参数</button>
        <button v-if="menu.name && !menu.param" class="btn btn-ghost mr10" @click.prevent.stop="handleEditCode(menu)"><i class="fa fa-plus"></i>编辑烹饪参数</button>
      </div>
    </div>
    <ul class="deepul" v-if="menu.param && menu.param.length > 0">
      <tree-item v-for="item in menu.param" :menu="item" @add-menu="handleAddMenu" @edit-menu="handleEditMenu" @add-code="handleAddCode" @edit-code="handleEditCode"></tree-item>
    </ul>
  </li>
</template>

<script>
  export default {
    name: 'TreeItem',

    props: {
      menu: {
        type: Object,
        default () {
          return {}
        }
      }
    },

    data () {
      return {
        showOpera: false
      }
    },
    methods: {
      leaveMouse () {
        this.tId = window.setTimeout(() => {
          this.showOpera = false
        }, 50)
      },
      inMouse () {
        window.clearTimeout(this.tId)
      },
      handleAddMenu (menu) {
        // 向父组件传递增加菜单事件
        this.$emit('add-menu', menu)
      },
      handleAddCode (menu) {
        // 向父组件传递增加烹饪参数事件
        this.$emit('add-code', menu)
      },
      handleEditMenu (menu) {
        // 向父组件传递编辑菜单名字事件
        this.$emit('edit-menu', menu)
      },
      handleEditCode (menu) {
        // 向父组件传递编辑烹饪参数事件
        this.$emit('edit-code', menu)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'
  .mr10
    margin-right 10px
  .mrb15
    margin-bottom 20px
  .line32
    line-height 32px
    height 32px
  .btn-area
    display inline-block
  .deepul
    margin-left 20px
    padding-left 20px
    border-left 2px dotted #ddd
  </style>
