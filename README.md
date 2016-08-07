# electric-objects

A node.js API for updating the Electric Objects E01 frame, which works by scraping the current web UI. Currently it only exposes the [set_url](https://www.electricobjects.com/set_url) interface, which allows you to update the url of the web page displayed in the Chromium instance of all frames attached to your account.

## Usage

```javascript
let eo = require('electric-objects')
let client = eo('where@jed.is', '●●●●●●●●●')
let setUrl = client.setUrl('http://brooklynjs.com')

setUrl.then(() => console.log('Frame updated!'))
```

## API

```javascript
let eo = require('electric-objects')
```

This module exports a client constructor function.

```javascript
let client = eo(email, password)
```

The constructor takes your email/password credentials and returns a client instance.

```javascript
client.setUrl(url)
```

The client instance provides only one method, which takes a URL and returns a promise that resolves when the URL is submitted.
