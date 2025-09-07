// src/utils/logger.js
export const devLog = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV]', ...args);
  }
};
