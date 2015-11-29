<template lang="jade">
  .row
    .panel
      .panel-hd
        .actions
          button.btn.btn-success
            i.fa.fa-plus
            | 添加固件版本
        h2 版本列表
      .panel-bd
        //- 版本列表
        table.table.table-stripe.table-bordered
          thead
            tr
              th 版本号
              th 版本说明
              th 添加日期
              th 文件大小(byte)
              th.tac 操作
          tbody
            - for(var i=5; i>=1; i--)
              tr
                td= i
                td 修正版本3的bug，版本3一定要升级
                td 2015-06-03 17:53:01
                td 58,977
                td.tac
                  button.btn.btn-link.btn-sm 编辑

    .panel
      .panel-hd
        .actions
          button.btn.btn-success
            i.fa.fa-refresh
            | 升级任务列表
        h2 升级任务列表
      .panel-bd
        //- 版本列表
        table.table.table-stripe.table-bordered
          thead
            tr
              th 版本号
              th 任务名称
              th 起始版本
              th 目标版本
              th 启动时间
              th 终止时间
              th 已升级设备
              th.tac 操作
          tbody
            - for(var i=5; i>=1; i--)
              tr
                td= i
                td 修正版本3的bug，版本3一定要升级
                td 3
                td 4
                td 2015-06-03 17:53:01
                td 2015-06-03 17:53:01
                td 58,977
                td.tac
                  if i % 2 == 0
                    button.btn.btn-success.btn-sm
                      i.fa.fa-play
                      | 启动
                  else
                    button.btn.btn-primary.btn-sm
                      i.fa.fa-stop
                      | 停止
</template>
