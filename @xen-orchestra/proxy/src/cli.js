#!/usr/bin/env node

import hrp from 'http-request-plus'
import { format } from 'json-rpc-protocol'

const required = param => {
  throw new Error(`missing ${param} parameter`)
}

const main = async args => {
  if (args.length === 0 || args.includes('-h')) {
    return console.log(
      '%s',
      `
Usage: xo-proxy-cli <XO proxy URL> <method> [<param>=<value>]...
`
    )
  }

  const [url = required('url'), method = required('method')] = args

  const params = {}
  for (let i = 2, n = args.length; i < n; ++i) {
    const param = args[i]
    const j = param.indexOf('=')
    if (j === -1) {
      throw new Error(`invalid param format: ${param}`)
    }
    let value = param.slice(j + 1)
    if (value.startsWith('json:')) {
      value = JSON.parse(value.slice(5))
    }
    params[param.slice(0, j)] = value
  }

  return hrp.post(url, {
    body: format.request(0, method, params),
    headers: {
      'content-type': 'application/json',
    },
    pathname: '/api',
  })
}
main(process.argv.slice(2)).then(
  () => {
    process.exit(0)
  },
  error => {
    console.error('exception in main', error)

    process.exit(1)
  }
)
