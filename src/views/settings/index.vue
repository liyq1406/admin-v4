<template lang="jade">
.main-content
  .panel
    .panel-hd
      h2 系统设置
    .panel-bd
      nav.tab
        ul
          li: a(v-link="{ path: '/settings/auth' }") 授权管理
          li: a(v-link="{ path: '/settings/members' }") 成员管理
          li: a(v-link="{ path: '/settings/account' }") 账户信息
  router-view(class="view", transition="view", transition-mode="out-in")
</template>