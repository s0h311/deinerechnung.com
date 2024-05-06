import pino from 'pino'

const p = pino({})

const logger = {
  debug: (message: string, source = 'Unknown Source') => {
    p.debug(`[${source}] ${message}`)
  },

  info: (message: string, source = 'Unknown Source') => {
    p.info(`[${source}] ${message}`)
  },

  warn: (message: string, source = 'Unknown Source') => {
    p.warn(`[${source}] ${message}`)
  },

  error: (message: string, source = 'Unknown Source', shouldThrow = false, data: Record<string, unknown> = {}) => {
    p.error(`[${source}] ${message}`)

    if (shouldThrow) {
      return createError({
        statusCode: 500,
        statusMessage: message,
        data,
      })
    }
  },
}

export default logger
