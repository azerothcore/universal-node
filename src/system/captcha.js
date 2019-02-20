const https = require('https')
import config from "@this/conf/conf.js"

export function verify(clientKey) {
  const data = JSON.stringify({
    secret: config.captchaKey, //The shared key between your site and reCAPTCHA.
    response: clientKey, //The user response token provided by the reCAPTCHA client-side integration on your site.
  })

  const options = {
    hostname: 'www.google.com',
    port: 443,
    path: '/recaptcha/api/siteverify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = https.request(options, (res) => {
    res.on('data', (j) => {
      return JSON.parse(j).success;
    });
  })

  req.on('error', (error) => {
    console.error(error)
  })

  req.write(data)
  req.end();
}