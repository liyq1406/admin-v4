<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2 {{ $t("nav_aside.settings") }}
      .panel-bd
        tab(:nav="secondaryNav")
    router-view(class="view", transition="view", transition-mode="out-in")
</template>

<script>
  import Tab from '../../components/tab.vue';

  export default {
    name: 'Settings',

    components: {
      'tab': Tab
    },

    data () {
      return {
        secondaryNav: []
      };
    },

    route: {
      data: function () {
        return {
          secondaryNav: [{
            label: this.$t('sub_nav.settings.auth'),
            link: { path: '/settings/auth' }
          }, {
            label: this.$t('sub_nav.settings.members'),
            link: { path: '/settings/members' }
          }, {
            label: this.$t('sub_nav.settings.account'),
            link: { path: '/settings/account' }
          }, {
            label: this.$t('sub_nav.settings.mail_templates'),
            link: { path: '/settings/mail-templates' }
          }]
        };
      }
    }
  };
</script>
