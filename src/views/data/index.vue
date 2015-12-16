<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          h2 数据管理
        .panel-bd
          nav.tab
            ul
              li: a(v-link="{ path: '/data/tables' }") 数据表
              //- li: a(v-link="{ path: '/data/api' }") API
              li: a(href="http://support.xlink.cn/hc/", target="_blank") API
      router-view(class="view", transition="view", transition-mode="out-in", keep-alive)
</template>
