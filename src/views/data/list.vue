<template lang="jade">
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        .action-group
          button.btn.btn-default
            i.fa.fa-plus
            | 添加规则

      //- 数据
      table.table.table-stripe.table-bordered
        thead
          tr
            th 规则名称
            th 等级
            th 内容
            th 状态
            th.tac 操作
        tbody
          - for(var i=1; i<=10; i++)
            tr
              td 设备上线
              td 轻微
              td 设备上线了
              td 启用
              td.tac
                button.btn.btn-link.btn-sm 编辑

      .pager.tar
        button.pager-btn.pager-prev
          i.fa.fa-chevron-left
        input.pager-input(type="text")
        button.pager-btn.pager-next
          i.fa.fa-chevron-right
</template>
