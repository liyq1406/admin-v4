<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          h2 数据管理
        .panel-bd
          nav.tab
            ul
              li: a(v-link="{ path: '/data/list' }") 数据表
              li: a(v-link="{ path: '/data/api' }") API
      router-view(class="view", transition="view", transition-mode="out-in")
</template>