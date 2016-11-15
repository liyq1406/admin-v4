<template>
  <div class="panel">
    <div class="organization-box">
      <div class="tree-box">
        <div class="btn-group-box">
          <button class="btn btn-ghost btn-sm">
            <!-- <i class="fa fa-share"></i> -->1
          </button>
          <button class="btn btn-ghost btn-sm">
            <!-- <i class="fa fa-share"></i> -->2
          </button>
          <button class="btn btn-ghost btn-sm">
            <i class="fa fa-trash-o"></i>
          </button>
          <button class="btn btn-ghost btn-sm">
            <i class="fa fa-long-arrow-up"></i>
          </button>
          <button class="btn btn-ghost btn-sm">
            <i class="fa fa-long-arrow-down"></i>
          </button>
          <button class="btn btn-ghost btn-sm">
            <i class="fa fa-edit"></i>
          </button>
        </div>
        <tree1 :data="organizationTree" :change="change"></tree1>
      </div>
      <div class="detail-box">222</div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'

export default {
  name: 'organization',

  mixins: [globalMixins],

  components: {
  },

  data () {
    return {
    }
  },

  computed: {
    organizationTree () {
      var result = [
        {
          label: '0',
          treeIndex: '0-0',
          open: false,
          selected: false
        },
        {
          label: '0-1',
          treeIndex: '0-1',
          open: false,
          selected: false
        },
        {
          label: '1',
          treeIndex: '1',
          open: false,
          selected: false
        }
      ]
      return result
    }
  },

  route: {
    data () {
    }
  },

  ready () {
  },

  methods: {
    change (data) {
      console.log(data)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
  .organization-box
    width 100%
    height 400px
    overflow hidden
    position relative
    padding-left 210px
    box-sizing border-box
    border 1px solid default-border-color
    .tree-box
      width 211px
      height 100%
      position absolute
      left 0
      top 0
      overflow auto
      box-sizing border-box
      border-right 1px solid default-border-color
      .btn-group-box
        font-size 0
        .btn
          font-size 13px
          border-top 0
          border-left 0
          width 35px
          height 32px
          box-sizing border-box
          &:last-child
            border-right 0
    .detail-box
      width 100%
      height 100%
      overflow auto
      box-sizing border-box
      padding 15px
</style>
