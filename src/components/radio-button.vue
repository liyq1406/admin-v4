<template lang="jade">
label.btn.btn-default(:class="{'active': active}")
  input(type="radio", autocomplete="off", checked="{{checked}}", @click="handleClick")
  slot
</template>

<script>
module.exports = {
  props: {
    value: {
      type: String
    },
    checked: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    active: function () {
      return this.value === this.$parent.value;
    }
  },

  created: function () {
    if (this.checked) {
      this.$dispatch('check', this.value);
    }
  },

  methods: {
    handleClick: function () {
      this.$dispatch('check', this.value);
    }
  }
};
</script>