export var warrantyMixins = {
  methods: {
    showNoTokenError () {
      this.showNotice({
        type: 'error',
        content: '您尚未获得此应用的使用权限'
      })
    }
  }
}
