<template>
  <div class="tag-input">
    <div @click="editTag($event)" class="tag-input-container">
      <template v-if="value.length">
        <div v-for="tag in tags" track-by="$index" class="tag">
          <span class="label">{{ tag }}</span>
          <i @click.stop="deleteTag(tag)" class="fa fa-times"></i>
        </div>
      </template>
      <input type="text" v-model="newTag" @keydown.enter.prevent="addTag($event)" @keyup.8="deleteLastTag" @input="setInputWidth($event)" class="text-input"/>
      <div v-text="newTag" class="temp-text"></div>
    </div>
    <div :style="styleCandidate" v-show="filteredTags.length && editing" class="candidate">
      <div v-for="tag in filteredTags" @click.stop="selectTag(tag)" class="tag">
        <span class="label">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import EventListener from './utils/EventListener'

  export default {
    props: {
      value: {
        type: String,
        twoWay: true,
        default: ''
      },
      candidate: {
        type: Array,
        default () {
          return []
        }
      },
      editing: {
        type: Boolean,
        twoWay: true,
        default: false
      }
    },

    data () {
      return {
        tags: [],
        newTag: '',
        styleCandidate: {
          top: '33px'
        }
      }
    },

    ready () {
      this.$dispatch('tag-input-created', this)
      // this.tags = this.value.length ? this.value.split(',') : []
      this._closeEvent = EventListener.listen(window, 'click', (e) => {
        if (!this.$el.contains(e.target)) {
          this.editing = false
        }
      })
    },

    beforeDestroy () {
      if (this._closeEvent) {
        this._closeEvent.remove()
      }
    },

    computed: {
      filteredTags () {
        return this.candidate.filter((item) => {
          var ret = true
          this.tags.forEach((tag) => {
            if (item === tag) {
              ret = false
            }
          })
          return ret
        })
      }
    },

    watch: {
      tags () {
        this.value = this.tags.join(',')
        this.$nextTick(() => {
          // this.setCandidateTop()
        })
      },

      value () {
        this.tags = this.value.length ? this.value.split(',') : []
      }
    },

    methods: {
      deleteTag (tag) {
        this.tags.$remove(tag)
      },

      deleteLastTag () {
        if (this.newTag.length === 0 && this.tags.length > 0) {
          this.tags.pop()
        }
      },

      selectTag (tag) {
        this.tags.push(tag)
      },

      addTag (evt) {
        var input = evt.target
        this.$dispatch('adding-tag')
        // evt.stopPropagation()
        // evt.preventDefault()

        if (this.newTag.length > 0) {
          this.tags.push(this.newTag)
          this.newTag = ''
          this.setInputWidth(evt)
          input.focus()
        }
      },

      editTag (evt) {
        var input = evt.target.getElementsByTagName('input')[0]
        this.editing = true
        if (input !== undefined) {
          input.focus()
          this.$nextTick(() => {
            this.setCandidateTop()
          })
        }
      },

      setCandidateTop () {
        this.$el.getElementsByClassName('candidate')[0].style.top = this.$el.getElementsByClassName('tag-input-container')[0].clientHeight + 3 + 'px'
      },

      setInputWidth (evt) {
        var input = evt.target
        input.style.width = this.newTag.length ? this.$el.getElementsByClassName('temp-text')[0].clientWidth + 10 + 'px' : '1px'
        this.$nextTick(() => {
          this.setCandidateTop()
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .tag-input
    background #FFF
    position relative
    cursor text

    .tag
      position relative
      display inline-block
      font-size 12px
      background #EEE
      height 22px
      line-height 22px
      margin 0 3px 3px 0
      padding 0 8px
      white-space nowrap
      z-index 1

      span
        display inline-block
        line-height 23px
        height 23px

      i
        absolute right top
        size 23px
        line-height 23px
        text-align center
        color red
        cursor pointer

        &:hover
          background #DDD

  .tag-input-container
    position relative
    font-size 0
    min-height 26px
    border 1px solid default-border-color
    padding 4px 10px 0

    .tag
      padding-right 25px

    .text-input
      border none
      font-size 12px
      height 21px
      line-height 22px
      width 1px

    .temp-text
      absolute left top
      background blue
      font-size 12px
      height 20px
      padding-right 1px
      opacity 0

  .candidate
    absolute left top
    width 100%
    border 1px solid #D3D3D3
    padding 3px 10px 0
    box-sizing border-box
    background #FFF
    z-index 1000

    .tag
      cursor pointer


</style>
