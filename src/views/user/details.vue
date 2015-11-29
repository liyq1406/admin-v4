<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          h2
            a.fa.fa-arrow-circle-left(v-link="{path: '/users'}")
            | 用户详情
        .panel-bd
          ul.user-details
            li
              .label 用户名：
              .info samxlu
            li
              .label 昵称：
              .info 路路
            li
              .label 邮箱：
              .info samxlu@xlink.cn
            li
              .label 创建时间：
              .info 2015-11-12 19:33:22
            li
              .label 最后登录：
              .info 2015-11-12 19:33:22
            li
              .label 在线状态：
              .info
                span.hl-green 在线
            li
              .label 帐号状态：
              .info 等待验证
      .panel
        .panel-hd
          h2 绑定设备列表
        .panel-bd
          //- 绑定设备列表
          table.table.table-stripe.table-bordered
            thead
              tr
                th 产品名称
                th 设备mac
                th 设备状态
                th 身份
            tbody
              - for(var i=1; i<=10; i++)
                tr
                  td 德尔玛加湿器
                  td 00113322aabb
                  td
                    if i % 2 === 0
                      span.hl-gray 离线
                    else
                      span.hl-green 在线
                  td admin

      .panel
        .panel-bd
          button.btn.btn-primary.btn-lg.mt10.mb10 删除该用户
</template>
