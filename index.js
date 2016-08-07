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

// module.exports = function(email, password) {
//   let token
//   let cookie

//   function setUrl(url, options) {
//     return getDevices().then(devices => {
//       let ops = devices.map(device => device.setUrl(url))
//       return Promise.all(ops)
//     })
//   }

//   function signIn() {

//   }

//   function request(method, path, query) {

//   }

//   function device(id) {

//   }
// }

// // let eo = require('electric-objects')
// // let client = eo(email, password)

// // client.getDevices().then(devices => devices[0].setUrl(XXX))

// class Session {
//   constructor(email, password) {
//     this.email = email
//     this.password = password
//     this.token = undefined
//     this.cookie = undefined
//   }

//   request(method, path, data) {

//   }

//   signIn() {

//   }

//   getDevices() {
//     return this.signIn().then(() => {
//       return this.request('GET', 'settings').

//     })
//   }
// }

// class Device {
//   constructor(session, id) {
//     this.session = session
//     this.id = id
//   }

//   setUrl(url) {

//   }
// }

// module.exports = function(email, password) {
//   let host = 'www.electricobjects.com'
//   let token = undefined
//   let headers = {}

//   return {refresh}

//   function refresh() {
//     return request('/sign_in')
//       .then($ => request('/sign_in', {
//         'user[email]': email,
//         'user[password]': password,
//         'authenticity_token': token
//       }))
//       .then($ => request('/set_url'))
//       .then($ => request('/set_url', {
//         custom_url: `https://s3.amazonaws.com/${config.bucketName}/index.html`,
//         authenticity_token: token,
//         device_id: $('#device_id option').attr('value')
//       }))
//   }

//   function request(path, data) {
//     return new Promise((resolve, reject) => {
//       let method = data ? 'POST' : 'GET'
//       let opts = {method, host, path, headers}
//       let req = https.request(opts)

//       req.on('response', res => {
//         headers.cookie = res.headers['set-cookie']
//           .map(cookie => cookie.match(/[^;]+;/)[0])
//           .join(' ')

//         let html = ''

//         res.setEncoding('utf8')
//         res.on('data', data => html += data)
//         res.on('end', ok => {
//           let $ = cheerio.load(html)
//           token = $('meta[name="csrf-token"]').attr('content')
//           resolve($)
//         })
//       })

//       req.on('error', reject)

//       if (data) req.write(qs.stringify(data))

//       req.end()
//     })
//   }
// }
