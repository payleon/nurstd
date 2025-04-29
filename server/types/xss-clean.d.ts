declare module 'xss-clean' {
  import { RequestHandler } from 'express';
  
  /**
   * Middleware for Express.js that sanitizes user input coming from 
   * POST body, GET queries, and url params to prevent XSS attacks
   */
  function xssClean(): RequestHandler;
  
  export default xssClean;
}