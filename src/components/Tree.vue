<template>
    <div class="menu">
      <div v-for="menu in menus">
        <tree-item :menu="menu"></tree-item>
      </div>
    </div>
</template>

<script>
  import TreeItem from 'components/TreeItem'

  export default {
    name: 'Tree',

    props: {
      menus: {
        type: Array,
        default () {
          return [
            {
              name: '10克',
              type: '大小',
              param_id: 0
            }, {
              name: '10克',
              type: '大小',
              param_id: 0,
              param: [
                {
                  name: '5克',
                  type: '小',
                  param_id: 0,
                  param: [
                    {
                      name: '5克',
                      type: '小',
                      param_id: 0,
                      param: [
                        {
                          name: '5克',
                          type: '小',
                          param_id: 0
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    },
    components: {
      'tree-item': TreeItem
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'
</style>
