<template lang="jade">
.main-content
  .row
    .col-20
      // Start: 管理台
      .panel
        .panel-hd
          h2 管理台
        .panel-bd
          | xxx
      // Start: 管理台

  .row
    .col-9
      // Start: 快速指南
      .panel
        .panel-hd
          h2 快速指南
        .panel-bd
          post-list(:posts="guides")
      // End: 快速指南

    .col-5
      // Start: 文档
      .panel
        .panel-hd
          h2 文档
        .panel-bd
          | xxx
      // End: 文档

    .col-6
      // Start: 通知
      .panel
        .panel-hd
          h2 通知
        .panel-bd
          post-list(:posts="notifications")
      // End: 通知
</template>

<script>
var Promise = require('promise');
var PostList = require('../components/post-list.vue');
var pageStore = require('../stores/page');

module.exports = {
  components: {
    'post-list': PostList
  },

  data: function () {
    return {
      notifications: [],
      guides: []
    };
  },

  ready: function () {
    pageStore.setTitle('概览');
  },

  route: {
    data: function (transition) {
      return {
        guides: this.fetchGuides(),
        notifications: this.fetchNotifications()
      };
    }
  },

  methods: {
    fetchGuides: function () {
      var apiUrl = apiRoot + 'guides';
      var self = this;

      return new Promise(function (resolve, reject) {
        return self.$http.get(apiUrl, function (data, status, request) {
          resolve(data);
        }).error(function (data, status, request) {
          reject(data);
        });
      });
    },

    fetchNotifications: function () {
      var apiUrl = apiRoot + 'notifications';
      var self = this;

      return new Promise(function (resolve, reject) {
        return self.$http.get(apiUrl, function (data, status, request) {
          resolve(data);
        }).error(function (data, status, request) {
          reject(data);
        });
      });

      /*
      return Promise.resolve(
        $.ajax({type: "POST",
          crossDomain : true,
          url: apiUrl,
          dataType: "jsonp",
          jsonp: "jsonp",
          jsonpCallback: "myJsonMethod"
        });
      );
      */
    }
  }
}
</script>