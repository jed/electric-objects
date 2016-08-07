'use strict'

let https = require('https')
let url = require('url')
let qs = require('querystring')

module.exports = function(email, password) {
  let host = 'www.electricobjects.com'
  let headers = {}
  let authenticity_token
  let credentials = {
    'user[email]': email,
    'user[password]': password,
  }

  return {setUrl}

  function setUrl(custom_url) {
    return signIn()
      .then(res => request('/set_url'))
      .then(res => {
        let ids = []
        let re = /<option value="([^"]+)"/g
        for (let m; m = re.exec(res.html);) ids.push(m[1])
        let ops = ids.map(device_id => {
          return request('/set_url', {custom_url, device_id})
        })

        return Promise.all(ops)
      })
  }

  function signIn() {
    if (headers.cookie) return Promise.resolve()

    return request('/sign_in').then(() => {
      return request('/sign_in', credentials).then(response => {
        if (response.statusCode !== 302) {
          throw new Error('Invalid email/password')
        }
      })
    })
  }

  function request(path, query) {
    return new Promise((resolve, reject) => {
      let method = 'GET'

      if (query) {
        method = 'POST'
        query = Object.assign({authenticity_token}, query)
      }

      let opts = {method, host, path, headers}
      let req = https.request(opts)

      req.on('response', response => {
        headers.cookie = response.headers['set-cookie']
          .map(cookie => cookie.match(/[^;]+;/)[0])
          .join(' ')

        response.html = ''

        response.setEncoding('utf8')
        response.on('data', data => response.html += data)
        response.on('end', ok => {
          let match = response.html.match(/name="csrf-token" content="([^"]+)"/)
          authenticity_token = match && match[1]
          resolve(response)
        })
      })

      req.on('error', reject)

      if (query) req.write(qs.stringify(query))

      req.end()
    })
  }
}
