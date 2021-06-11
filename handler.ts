import type { Handler } from 'vite-plugin-mix'
import fetch from 'node-fetch'

function isUrl(string: string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string')
  }

  string = string.trim()
  if (string.includes(' ')) {
    return false
  }

  try {
    new URL(string) // eslint-disable-line no-new
    return true
  } catch {
    return false
  }
}

const handleError = (handler: Handler): Handler => async (req, res, next) => {
  try {
    await handler(req, res, next)
  } catch (error) {
    res.statusCode = 500
    res.end(error.message)
  }
}

export const handler: Handler = handleError(async (req, res, next) => {
  if (req.path === '/proxy') {
    const url = req.query.url as string | undefined
    if (!url || !isUrl(url)) {
      res.statusCode = 500
      res.end('invalid url')
      return
    }
    const result = await fetch(url)
    const type = result.headers.get('content-type')
    if (type) {
      res.setHeader('content-type', type)
    }
    result.body.pipe(res)
    return
  }
  next()
})
