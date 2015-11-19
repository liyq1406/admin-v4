module.exports = {
  state: {
    users: []
  },

  addUser: function (user) {
    this.state.users.unshift(user);
  },

  deleteUser: function (user) {
    this.state.users.$remove(user);
  }
};