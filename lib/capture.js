import { sendRequestLog } from './sender.js'
import { NextRequest } from 'next/server'

export function createCapture(config) {
  return async function (req) {
    try {
      const headers = {}
      req.headers.forEach((value, key) => {
        headers[key] = value
      })

      const payload = {
        method: req.method,
        url: req.url,
        headers: sanitizeHeaders(headers),
        body: null,
        provider: config.provider,
        projectName: config.projectName,
        contentType: req.headers.get('content-type'),
        rawBody: null,
        query: Object.fromEntries(new URL(req.url).searchParams),
      }

      sendRequestLog(payload).catch(() => {})
    } catch (error) {
      console.error('Capture error:', error)
    }
  }
}

function sanitizeHeaders(headers) {
  const h = { ...headers }
  delete h.authorization
  delete h.cookie
  return h
}