'use strict'

process.on('unhandledRejection', error => { throw error })

// remember to set these in your environment for testing
let EMAIL = process.env.ELECTRICOBJECTS_EMAIL
let PASSWORD = process.env.ELECTRICOBJECTS_PASSWORD

let eo = require('./')
let client = eo(EMAIL, PASSWORD)

client.setUrl('https://github.com/jed/electric-objects')
