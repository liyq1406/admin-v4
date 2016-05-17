<template>
  <div v-if="total > 0" class="pager tar">
    <button :class="{'disabled': current === 1}" :disabled="current === 1" @click="current = current - 1" class="pager-btn pager-prev"><i class="fa fa-chevron-left"></i></button>
    <template v-if="!simple">
      <div v-if="pages < 10" class="pager-container">
        <div v-for="page in pages" :class="{'current': current === page + 1}" @click="current = page + 1" class="pager-item"><span>{{ page + 1 }}</span></div>
      </div>
      <div v-if="pages >= 10 && ( current <= 3 || current >= pages - 2)" class="pager-container">
        <div v-for="page in 3" :class="{'current': current === page + 1}" @click="current = page + 1" class="pager-item"><span>{{ page + 1 }}</span></div>
        <div class="pager-more">
          <span @click="toggleInput($event)">...</span>
          <div v-show="showInput" class="pager-input">
            <input type="number" max="{{ pages }}" @change="onInput"/>
          </div>
        </div>
        <div v-for="offset in 3" :class="{'current': current === pages - 2 + offset}" @click="current = pages - 2 + offset" class="pager-item"><span>{{ pages - 2 + offset }}</span></div>
      </div>
      <div v-if="pages >= 10 && current > 3 && current < pages - 2" class="pager-container">
        <div :class="{'current': current === 1}" @click="current = 1" class="pager-item"><span>1</span></div>
        <div class="pager-more">
          <span @click="toggleInput1($event)">...</span>
          <div v-show="showInput1" class="pager-input">
            <input type="number" max="{{ pages }}" @change="onInput"/>
          </div>
        </div>
        <div v-for="offset in 3" :class="{'current': current === current - 1 + offset}" @click="current = current - 1 + offset" class="pager-item"><span>{{ current - 1 + offset }}</span></div>
        <div class="pager-more">
          <span @click="toggleInput2($event)">...</span>
          <div v-show="showInput2" class="pager-input">
            <input type="number" max="{{ pages }}" @change="onInput"/>
          </div>
        </div>
        <div :class="{'current': current === pages}" @click="current = pages" class="pager-item"><span>{{ pages }}</span></div>
      </div>
    </template>
    <div v-else class="pager-container">
      <div class="pager-more">
        <span @click="toggleInput($event)">{{ current }}/{{ total }}页</span>
        <div v-show="showInput" class="pager-input">
          <input type="number" max="{{ pages }}" @change="onInput"/>
        </div>
      </div>
    </div>
    <button :class="{'disabled': current === pages}" :disabled="current === pages" @click="current = current + 1" class="pager-btn pager-next"><i class="fa fa-chevron-right"></i></button>
  </div>
</template>

<script>
  import config from '../consts/config'
  import { globalMixins } from '../mixins'

  export default {
    name: 'Pager',

    mixins: [globalMixins],

    props: {
      // 每页数量
      pageCount: {
        type: Number,
        default: config.pageCount
      },

      // 总数
      total: {
        type: Number
      },

      // 当前页
      current: {
        type: Number,
        twoWay: true,
        default: 1
      },

      // 是否简单分页
      simple: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        showInput: false,
        showInput1: false,
        showInput2: false
      }
    },

    watch: {
      current () {
        this.$dispatch('page-update')
      }
    },

    computed: {
      pages () {
        return Math.ceil(this.total / this.pageCount)
      }
    },

    methods: {
      toggleInput (evt) {
        this.showInput = !this.showInput
        this.$nextTick(() => {
          if (this.showInput) {
            evt.target.parentNode.getElementsByTagName('input')[0].focus()
          }
        })
      },

      toggleInput1 (evt) {
        this.showInput1 = !this.showInput1
        this.showInput2 = false
        this.$nextTick(() => {
          if (this.showInput1) {
            evt.target.parentNode.getElementsByTagName('input')[0].focus()
          }
        })
      },

      toggleInput2 (evt) {
        this.showInput1 = false
        this.showInput2 = !this.showInput2
        this.$nextTick(() => {
          if (this.showInput2) {
            evt.target.parentNode.getElementsByTagName('input')[0].focus()
          }
        })
      },

      onInput (evt) {
        var page = Number(evt.target.value)

        if (typeof page === 'number' && page >= 1 && page <= this.pages) {
          page = Math.floor(page)
          this.showInput = false
          this.showInput1 = false
          this.showInput2 = false
          this.current = page
          evt.target.value = ''
        } else {
          this.showNotice({
            type: 'error',
            content: '请输入合法数字'
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  // 分页
  .pager
    font-size 0
    margin-bottom 40px

    .pager-btn
    .pager-item
    .pager-more
      display inline-block
      vertical-align middle
      box-sizing border-box

    .pager-btn
      background #E5E5E5
      border none
      font-size 8px
      color #A8A8A8
      padding 0 10px
      height 26px
      line-height 28px
      transition background .3s, color .3s
      outline none
      cursor pointer

      &:hover
        background red
        color #FFF

      &.disabled
      &.disabled:hover
        background #F3F3F3
        color #C3C3C3
        cursor not-allowed

    .pager-container
      display inline-block
      vertical-align middle

    .pager-item
    .pager-more
      position relative
      font-size 12px
      background #FFF
      transition background .3s, color .3s, border-color .3s

      span
        display inline-block
        padding 0 8px
        border 1px solid #E5E5E5
        height 24px
        line-height 24px

        &:hover
          border-color red
          background red
          color #FFF
          cursor pointer

    .pager-item
      &.current
        span
          border-color red
          background #FFF
          color red

    .pager-input
      absolute left 50% top -40px
      margin-left -22px

      input
        width 44px
        text-align center
        border 1px solid #E5E5E5
        padding 0
        font-size 12px
        height 26px
        line-height 26px

      &:before
        absolute left 50% bottom -10px
        margin-left -5px
        content ""
        triangle #DDD 10px down

      &:after
        absolute left 50% bottom -9px
        margin-left -5px
        content ""
        triangle #FFF 10px down

    &.tal
      .pager-btn
      .pager-item
      .pager-more
        margin-right 5px

    &.tar
    &.tac
      .pager-btn
      .pager-item
      .pager-more
        margin-left 5px

</style>
