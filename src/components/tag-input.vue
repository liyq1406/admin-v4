<template lang="jade">
  .tag-input
    .tag-input-container#tagContainer(@click="editTag($event)")
      template(v-if="value.length")
        .tag(v-for="tag in tags", track-by="$index")
          span.label {{tag}}
          i.fa.fa-times(@click.stop="deleteTag(tag)")
      input.text-input(type="text", v-model="newTag", @keyup.enter.prevent="addTag($event)", @input="setInputWidth($event)")
      .temp-text#tempText(v-text="newTag")
    .candidate#candidate(:style="styleCandidate", v-show="filteredTags.length && editing")
      .tag(v-for="tag in filteredTags", @click.stop="selectTag(tag)")
        span.label() {{tag}}
</template>

<script>
  var EventListener = require('./utils/EventListener');

  module.exports = {
    props: {
      value: {
        type: String,
        twoWay: true,
        default: ''
      },
      candidate: {
        type: Array,
        default: []
      },
      editing: {
        type: Boolean,
        twoWay: true,
        default: false
      }
    },

    data: function () {
      return {
        tags: [],
        newTag: '',
        styleCandidate: {
          top: '38px'
        }
      };
    },

    ready: function () {
      var self = this;
      this.$dispatch('tag-input-created', this);
      this.tags = this.value.length ? this.value.split(',') : [];
      this._closeEvent = EventListener.listen(window, 'click', function (e) {
        if (!self.$el.contains(e.target)) {
          self.editing = false;
        }
      });
    },

    beforeDestroy() {
      if (this._closeEvent){
        this._closeEvent.remove();
      }
    },

    computed: {
      filteredTags: function () {
        var self = this;
        return this.candidate.filter(function (item) {
          var ret = true;
          self.tags.forEach(function (tag) {
            if (item === tag) {
              ret = false;
            }
          });
          return ret;
        });
      }
    },

    watch: {
      tags: function () {
        this.value = this.tags.join(',');
        this.$nextTick(function () {
          this.setCandidateTop();
        });
      }
    },

    methods: {
      deleteTag: function (tag) {
        this.tags.$remove(tag);
      },

      selectTag: function (tag) {
        this.tags.push(tag);
      },

      addTag: function (evt) {
        var input = evt.target;
        this.$dispatch('adding-tag');

        if (this.newTag.length > 0) {
          this.tags.push(this.newTag);
          this.newTag = '';
          this.setInputWidth(evt);
          input.focus();
        }
      },

      editTag: function (evt) {
        var input = evt.target.getElementsByTagName('input')[0];
        this.editing = true;
        if (input !== undefined) {
          input.focus();
          this.$nextTick(function () {
            this.setCandidateTop();
          });
        }
      },

      setCandidateTop: function () {
        document.getElementById('candidate').style.top = document.getElementById('tagContainer').clientHeight + 3 + 'px';
      },

      setInputWidth: function (evt) {
        var input = evt.target;
        input.style.width = this.newTag.length ? document.getElementById('tempText').clientWidth + 'px' : '5px';
      }
    }
  };
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
      height 24px
      line-height 24px
      margin 0 5px 5px 0
      padding 0 8px
      white-space nowrap
      z-index 1

      span
        display inline-block

      i
        display inline-block
        size 24px
        line-height 24px
        margin-left 5px
        text-align center
        color red
        cursor pointer

        &:hover
          background #DDD

  .tag-input-container
    position relative
    font-size 0
    min-height 29px
    border 1px solid #D3D3D3
    padding 5px 20px 0

    .tag
      padding-right 0

    .text-input
      border none
      font-size 12px
      height 24px
      line-height 24px
      width 5px

    .temp-text
      absolute left top
      background blue
      font-size 12px
      height 20px
      padding-right 5px
      opacity 0

  .candidate
    absolute left top
    width 100%
    border 1px solid #D3D3D3
    padding 5px 20px 0
    box-sizing border-box
    background #FFF
    z-index 1000

    .tag
      cursor pointer


</style>
