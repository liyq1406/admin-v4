<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          h2 统计分析
        .panel-bd
          nav.tab
            ul
              li: a(v-link="{ path: '/statistic/products' }") 产品统计
              li: a(v-link="{ path: '/statistic/users' }") 用户统计
      router-view(class="view", transition="view", transition-mode="out-in")
</template>
