// import Promise from 'promise';

var defaults = {};

/**
 * 构造HTTP请求
 * @param  {String}   url     请求地址
 * @param  {Object}   options 参数选项
 * @return {XMLHttpRequest}
 */
function request (url, options) {
  var req = new XMLHttpRequest();

  // console.log(options);
  var method = options.method || 'GET';
  var data = options.data;
  if (method === 'GET' && data) {
    url += '?' + Object.keys(data).filter(
      k => k && data[k]
    ).map(
      k => k + '=' + data[k]
    ).join('&');
    data = null;
  }
  req.url = url;
  req.open(method, url);

  if (options.onload) {
    req.onload = options.onload.bind(this);
  }

  if (options.onerror) {
    req.onerror = options.onerror.bind(this);
  }

  if (options.onprogress) {
    req.upload.onprogress = options.onprogress.bind(this);
  }

  var startTime = new Date().getTime();
  var headers = {
    'Content-Type': 'application/json'
  };

  if (window.FormData && data instanceof FormData) {
    delete headers['Content-Type'];
  } else if (data) {
    data = JSON.stringify(data);
  }

  if (options.headers) {
    Object.keys(options.headers).forEach(key => {
      headers[key] = options.headers[key];
    });
  }

  Object.keys(headers).forEach(key => {
    req.setRequestHeader(key, headers[key]);
  });

  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      var duration = new Date().getTime() - startTime;
      req.data = parseResponse(req.responseText);
      if (options.afterRequest) {
        options.afterRequest(req, duration);
      }
      var type = req.status / 100 | 0;
      if (type === 2) {
        options.success && options.success(req.data, req);
      } else {
        options.error && options.error(req.data, req);
      }
    }
  };

  if (data) {
    req.send(data);
    // @TODO
  } else {
    req.send();
  }

  return req;
}

function parseResponse (text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

/**
 * 从一个对象中拷贝缺失属性到目标对象中
 * @param  {Object} a 目标对象
 * @param  {Object} b 源对象
 * @return {Object}
 */
function extend (target, source) {
  Object.keys(source).forEach(key => {
    if (!target[key]) {
      target[key] = source[key];
    }
  });
  return target;
}

/**
 * 解析请求参数
 * @param  {String}           method  请求方法名 [GET|POST|DELETE|PUT]
 * @param  {Object|Function}  data    数据对象|回调函数
 * @param  {Function|Object}  success 回调函数|参数选项
 * @param  {Object|Null}      options 参数选项|null
 * @return {Object}
 */
function parseParams (method, data, success, options) {
  // 允许不传递数据对象，此时第二个参数为回调函数，第三个参数为参数选项
  if (typeof data === 'function') {
    options = success;
    success = data;
    data = null;
  }
  options = extend({method: method, data: data, success: success}, options || {});
  return extend(options, defaults);
}

/**
 * GET 请求
 * @param  {String}   url     请求地址
 * @param  {Object}   data    数据对象
 * @param  {Function} success 回调函数
 * @param  {Object}   options 参数选项
 * @return {XMLHttpRequest}
 */
function get (url, data, success, options) {
  return request(url, parseParams('GET', data, success, options));
};

/**
 * POST 请求
 * @param  {String}   url     请求地址
 * @param  {Object}   data    数据对象
 * @param  {Function} success 回调函数
 * @param  {Object}   options 参数选项
 * @return {XMLHttpRequest}
 */
function post (url, data, success, options) {
  return request(url, parseParams('POST', data, success, options));
};

/**
 * DELETE 请求
 * @param  {String}   url     请求地址
 * @param  {Object}   data    数据对象
 * @param  {Function} success 回调函数
 * @param  {Object}   options 参数选项
 * @return {XMLHttpRequest}
 */
function del (url, data, success, options) {
  return request(url, parseParams('DELETE', data, success, options));
};

/**
 * PUT 请求
 * @param  {String}   url     请求地址
 * @param  {Object}   data    数据对象
 * @param  {Function} success 回调函数
 * @param  {Object}   options 参数选项
 * @return {XMLHttpRequest}
 */
function put (url, data, success, options) {
  return request(url, parseParams('PUT', data, success, options));
};

export {
  defaults,
  get,
  post,
  del,
  put
};
