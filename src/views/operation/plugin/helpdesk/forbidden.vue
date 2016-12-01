<template>
  <div class="main">
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t('operation.helpdesk.forbidden.helpdesk') }}</h2>
      </div>
      <div class="panel-bd">
        <alert :cols="7">
          <p>{{ $t('operation.helpdesk.forbidden.noPermit') }}</p>
        </alert>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Forbidden'
  }
</script>
