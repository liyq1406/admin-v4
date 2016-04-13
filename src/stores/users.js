module.exports = {
  state: {
    users: []
  },

  addUser (user) {
    this.state.users.unshift(user)
  },

  deleteUser (user) {
    this.state.users.$remove(user)
  }
}
