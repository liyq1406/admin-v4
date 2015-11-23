<template lang="jade">
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        .action-group
          button.btn.btn-default
            i.fa.fa-plus
            | 添加数据端点

      //- 数据端点列表
      table.table.table-stripe.table-bordered
        thead
          tr
            th mac
            th 是否激活
            th 激活时间
            th 最后一次登录
            th.tac 操作
        tbody
          - for(var i=1; i<=5; i++)
            tr
              td ACCF2356BF53
              td 是
              td 2015-10-15 22:30:12
              td 2015-10-15 22:30:12
              td.tac
                button.btn-link 编辑
            tr
              td ACCF2356BF53
              td 是
              td 2015-10-15 22:30:12
              td 2015-10-15 22:30:12
              td.tac
                button.btn-link 编辑
      .pager.tar
        button.pager-btn.pager-prev
          i.fa.fa-chevron-left
        input.pager-input(type="text")
        button.pager-btn.pager-next
          i.fa.fa-chevron-right
</template>