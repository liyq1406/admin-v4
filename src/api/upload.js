import * as http from '../http'
import { API_SERVER } from '../consts/config'

export default {
  /**
   * 产品固件上传
   * @param  {String} productId  产品 ID
   * @param  {File} file        文件流数据
   * @return {Promise}
    {
      "url":"固件文件资源地址",
      "md5":"文件MD5值",
      "size":"文件大小"
    }
   */
  firmware (productId, file) {
    return http.upload(
      `${API_SERVER.default}/v2/upload/product/${productId}/firmware`, file
    )
  },

  /**
   * APN密钥文件上传
   * @param  {File} file 文件流数据
   * @return {Promise}
    {
      "url":"apn密钥文件下载地址"
    }
   */
  apn (file) {
    return http.upload(
      `${API_SERVER.default}/v2/upload/app/apn_license`, file
    )
  },

  /**
   * 图片文件上传
   * @param  {File} file 文件流数据
   * @return {Promise}
    {
      "url":"图片文件地址"
    }
   */
  image (file) {
    return http.upload(
      `${API_SERVER.default}/v2/upload/image`, file
    )
  }
}
