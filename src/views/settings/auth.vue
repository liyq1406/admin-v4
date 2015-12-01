<template lang="jade">
  .panel
    .panel-hd
      p 授权管理
    .panel-bd
          //- 用户列表
          table.table.table-stripe.table-bordered
            thead
              tr
                th 名称
                th Access Key ID
                th Access Key Secret
                th.tac 操作
            tbody
              - for(var i=1; i<=3; i++)
                tr
                  td 德尔玛加湿器
                  td 22d562243a66424485c51d75d420cb3a
                  td 
                    a.hl-key 查看密钥
                  td.tac
                    if i % 2 === 0
                      a.hl-gray 禁用
                    else
                      a.hl-green 启用
          .pager.tar
            button.pager-btn.pager-prev
              i.fa.fa-chevron-left
            input.pager-input(type="text")
            button.pager-btn.pager-next
              i.fa.fa-chevron-right
</template>