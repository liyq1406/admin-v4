<template>
  <div v-show="total > countPerPage" class="v-pager">
    <!-- <button :class="{'disabled': current === 1}" :disabled="current === 1" @click="current = current - 1" class="v-pager-btn v-pager-prev"><i class="fa fa-chevron-left"></i></button>
    <template v-if="!simple">
      <div v-if="pages < 10" class="v-pager-container">
        <div v-for="page in pages" :class="{'current': current === page + 1}" @click="current = page + 1" class="v-pager-item"><span>{{ page + 1 }}</span></div>
      </div>
      <div v-if="pages >= 10 && ( current <= 3 || current >= pages - 2)" class="v-pager-container">
        <div v-for="page in 3" :class="{'current': current === page + 1}" @click="current = page + 1" class="v-pager-item"><span>{{ page + 1 }}</span></div>
        <div class="v-pager-more">
          <span @click="toggleInput($event)">...</span>
          <div v-show="showInput" class="v-pager-input">
            <input type="number" max="{{ pages }}" @change="onInput"/>
          </div>
        </div>
        <div v-for="offset in 3" :class="{'current': current === pages - 2 + offset}" @click="current = pages - 2 + offset" class="v-pager-item"><span>{{ pages - 2 + offset }}</span></div>
      </div>
      <div v-if="pages >= 10 && current > 3 && current < pages - 2" class="v-pager-container">
        <div :class="{'current': current === 1}" @click="current = 1" class="v-pager-item"><span>1</span></div>
        <div class="v-pager-more">
          <span @click="toggleInput1($event)">...</span>
          <div v-show="showInput1" class="v-pager-input">
            <input type="number" max="{{ pages }}" @change="onInput"/>
          </div>
        </div>
        <div v-for="offset in 3" :class="{'current': current === current - 1 + offset}" @click="current = current - 1 + offset" class="v-pager-item"><span>{{ current - 1 + offset }}</span></div>
        <div class="v-pager-more">
          <span @click="toggleInput2($event)">...</span>
          <div v-show="showInput2" class="v-pager-input">
            <input type="number" max="{{ pages }}" @change="onInput"/>
          </div>
        </div>
        <div :class="{'current': current === pages}" @click="current = pages" class="v-pager-item"><span>{{ pages }}</span></div>
      </div>
    </template>
    <div v-else class="v-pager-container">
      <div class="v-pager-more">
        <span @click="toggleInput($event)">{{ current }}/{{ pages }}页</span>
        <div v-show="showInput" class="v-pager-input">
          <input type="number" max="{{ pages }}" @change="onInput"/>
        </div>
      </div>
    </div> -->

    <div class="fr">
      <div class="v-pager-control">
        <v-select width="100px" label="asdasf" size="small">
          <span slot="label">显示行数：</span>
          <select>
            <option value="">11111</option>
          </select>
        </v-select>
      </div>
      <div class="v-pager-control">
        <span>转到</span>
        <div class="input-text-wrap">
          <input type="text" class="input-text input-text-sm">
        </div>
        <span>页</span>
      </div>
      <div class="v-pager-control">
        <span>第 1-10 项，共1321项</span>
      </div>
      <div class="v-pager-control">
        <button :class="{'disabled': current === 1}" :disabled="current === 1" @click="current = current - 1" class="v-pager-btn v-pager-prev"><i class="fa fa-chevron-left"></i></button><button :class="{'disabled': current === pages}" :disabled="current === pages" @click="current = current + 1" class="v-pager-btn v-pager-next"><i class="fa fa-chevron-right"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
import { COUNT_PER_PAGE } from 'consts/config'
import { globalMixins } from '../mixins'
import Select from 'components/Select'
import EventListener from './utils/EventListener'

export default {
  name: 'Pager',

  mixins: [globalMixins],

  components: {
    'v-select': Select
  },

  props: {
    // 每页数量
    countPerPage: {
      type: Number,
      default: COUNT_PER_PAGE
    },

    // 总数
    total: {
      type: Number
    },

    // 当前页
    current: {
      type: Number,
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
      this.$emit('page-update', this.current)
    }
  },

  computed: {
    pages () {
      return Math.ceil(this.total / this.countPerPage)
    }
  },

  beforeDestroy () {
    if (this._closeEvent) {
      this._closeEvent.remove()
    }
  },

  ready () {
    this.$emit('pager-created', this)
    this._closeEvent = EventListener.listen(window, 'click', (e) => {
      // console.log(e)
      if (!this.$el.contains(e.target)) {
        this.hideInputs()
      }
    })
  },

  methods: {
    hideInputs () {
      this.showInput = false
      this.showInput1 = false
      this.showInput2 = false
    },

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
        this.hideInputs()
        this.current = page
        evt.target.value = ''
      } else {
        evt.target.value = ''
        this.showNotice({
          type: 'danger',
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
.v-pager
  font-size 0
  margin-bottom 15px
  clearfix()

  .v-pager-control
    font-size 12px
    display inline-block
    margin-left 20px
    vertical-align middle

    .input-text-wrap
      display inline-block
      width 40px

      .input-text
        text-align center

  .v-pager-btn
    display inline-block
    vertical-align middle
    box-sizing border-box
    background linear-gradient(top, #fafafa, #dadada)
    border 1px solid default-border-color
    font-size 8px
    padding 0 8px
    height 24px
    line-height 24px
    transition border-color .3s, color .3s
    outline none
    cursor pointer

    &:hover
      border-color #CCC
      color #666

    &.disabled
    &.disabled:hover
      border-color light-border-color
      color #C3C3C3
      cursor not-allowed

  /*.v-pager-btn
  .v-pager-item
  .v-pager-more
    display inline-block
    vertical-align middle
    box-sizing border-box

  .v-pager-btn
    background #FFF
    border 1px solid light-border-color
    font-size 8px
    padding 0 8px
    height 24px
    line-height 24px
    transition border-color .3s, color .3s
    outline none
    cursor pointer

    &:hover
      border-color #CCC
      color #666

    &.disabled
    &.disabled:hover
      border-color light-border-color
      color #C3C3C3
      cursor not-allowed

  .v-pager-container
    display inline-block
    vertical-align middle

  .v-pager-item
  .v-pager-more
    position relative
    font-size 12px
    background #FFF
    transition background .3s, color .3s, border-color .3s

    span
      display inline-block
      padding 0 7px
      border 1px solid light-border-color
      height 22px
      line-height 22px

      &:hover
        border-color #CCC
        color #666
        cursor pointer

  .v-pager-item
    &.current
      span
        border-color #E9E9E9
        background #E9E9E9
        color #000
        font-weight bold

  .v-pager-input
    absolute left 50% top -40px
    margin-left -22px

    input
      width 44px
      text-align center
      border 1px solid light-border-color
      padding 0
      font-size 12px
      height 26px
      line-height 24px

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
    .v-pager-btn
    .v-pager-item
    .v-pager-more
      margin-right 5px

  &.tar
  &.tac
    .v-pager-btn
    .v-pager-item
    .v-pager-more
      margin-left 5px*/
</style>
