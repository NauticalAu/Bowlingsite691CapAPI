

const logger = {
    info:  (...args) => console.log('[INFO] ',  ...args),
    warn:  (...args) => console.warn('[WARN] ',  ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    stream: {
      write: (msg) => console.log('[HTTP] ', msg.trim())
    }
  };
  
  module.exports = logger;
  