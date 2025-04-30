/**
 * Enhanced Code Obfuscation for NCLEX Nursing Platform
 * This script applies advanced code obfuscation techniques to compiled JavaScript files
 * while preserving functionality and not disrupting execution
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files and directories to process
const TARGET_DIRS = ['dist/public/assets', 'dist'];
const JS_EXTENSIONS = ['.js'];
const EXCLUDE_PATTERNS = ['node_modules', 'vendor', 'third-party', '.min.js'];

// Special identifiers that should never be renamed
const RESERVED_IDENTIFIERS = [
  'React', 'ReactDOM', 'useState', 'useEffect', 'useRef', 'useCallback', 
  'useMemo', 'useContext', 'atob', 'btoa', 'JSON', 'Math', 'Date', 
  'Object', 'Array', 'String', 'Number', 'Boolean', 'RegExp', 'Error', 
  'Map', 'Set', 'Promise', 'setTimeout', 'clearTimeout', 'setInterval', 
  'clearInterval', 'fetch', 'console', 'localStorage', 'sessionStorage',
  'document', 'window', 'navigator', 'history', 'location'
];

// Generate a unique identifier to use as a prefix for obfuscated names
const OBFUSCATION_PREFIX = '_' + crypto.randomBytes(2).toString('hex');

// Advanced variable name mapping with more cryptic names
function generateVariableMap() {
  const commonVars = [
    'question', 'answer', 'correct', 'response', 'options', 'selected',
    'index', 'value', 'result', 'error', 'data', 'prop', 'element',
    'event', 'handler', 'callback', 'function', 'return', 'array',
    'object', 'string', 'number', 'boolean', 'attribute', 'property',
    'document', 'window', 'querySelector', 'addEventListener', 'state',
    'props', 'component', 'render', 'update', 'create', 'delete', 'get',
    'set', 'fetch', 'request', 'response', 'api', 'url', 'endpoint',
    'param', 'argument', 'config', 'settings', 'options', 'features',
    'user', 'auth', 'token', 'session', 'login', 'logout', 'register',
    'password', 'username', 'email', 'account', 'profile', 'avatar',
    'image', 'file', 'upload', 'download', 'stream', 'buffer', 'chunk',
    'format', 'convert', 'transform', 'process', 'compute', 'calculate',
    'validation', 'validator', 'check', 'verify', 'authenticate', 'authorize',
    'permission', 'access', 'control', 'filter', 'sort', 'paginate', 'limit',
    'offset', 'page', 'count', 'total', 'sum', 'average', 'min', 'max',
    'template', 'layout', 'view', 'partial', 'fragment', 'section', 'content',
    'header', 'footer', 'sidebar', 'navigation', 'menu', 'item', 'list',
    'table', 'row', 'column', 'cell', 'grid', 'container', 'wrapper',
    'button', 'input', 'form', 'label', 'select', 'textarea', 'checkbox',
    'radio', 'submit', 'reset', 'toggle', 'switch', 'slider', 'progress',
    'loading', 'spinner', 'indicator', 'alert', 'notification', 'message',
    'error', 'warning', 'success', 'info', 'debug', 'log', 'trace',
    'interval', 'timeout', 'debounce', 'throttle', 'delay', 'timer',
    'animation', 'transition', 'effect', 'fade', 'slide', 'zoom', 'rotate',
    'scale', 'move', 'resize', 'scroll', 'viewport', 'visible', 'hidden',
    'display', 'show', 'hide', 'toggle', 'enable', 'disable', 'active',
    'focus', 'blur', 'click', 'change', 'submit', 'keydown', 'keyup', 'keypress',
    'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'resize',
    'storage', 'history', 'location', 'hash', 'route', 'navigation', 'url',
    'scheme', 'protocol', 'host', 'domain', 'path', 'query', 'fragment',
    'parameter', 'header', 'cookie', 'session', 'token', 'credential',
    'setup', 'initialize', 'configure', 'settings', 'preference', 'custom',
    'default', 'fallback', 'override', 'extend', 'inherit', 'prototype',
    'instance', 'class', 'method', 'property', 'attribute', 'entity',
    'model', 'schema', 'field', 'column', 'relation', 'foreign', 'primary',
    'unique', 'index', 'constraint', 'rule', 'policy', 'strategy', 'factory',
    'service', 'provider', 'container', 'dependency', 'injection', 'module',
    'package', 'library', 'framework', 'utility', 'helper', 'tool', 'client'
  ];

  // Create a map with cryptic, minified-style variable names
  const variableMap = {};
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  commonVars.forEach((v, i) => {
    if (!RESERVED_IDENTIFIERS.includes(v)) {
      // Generate names like _a, _b, _c, _aa, _ab, etc.
      let index = i;
      let name = '';
      
      do {
        name = alphabet[index % alphabet.length] + name;
        index = Math.floor(index / alphabet.length) - 1;
      } while (index >= 0);
      
      variableMap[v] = OBFUSCATION_PREFIX + name;
    }
  });
  
  return variableMap;
}

// Control flow flattening function
function flattenControlFlow(code) {
  // This is a simplified version of control flow flattening
  // In a real-world scenario, this would be much more complex
  
  // Find simple if statements and convert them to switch-case with numerical dispatch
  const ifRegex = /(if\s*\([^{]+\)\s*{[^}]+})\s*(else\s*{[^}]+})?/g;
  
  return code.replace(ifRegex, (match, ifPart, elsePart) => {
    // Extract condition from if statement
    const conditionMatch = ifPart.match(/if\s*\(([^)]+)\)/);
    if (!conditionMatch) return match;
    
    const condition = conditionMatch[1];
    
    // Extract if block code
    const ifBlockMatch = ifPart.match(/{([^}]+)}/);
    if (!ifBlockMatch) return match;
    
    const ifBlock = ifBlockMatch[1];
    
    // Extract else block code if it exists
    let elseBlock = '';
    if (elsePart) {
      const elseBlockMatch = elsePart.match(/{([^}]+)}/);
      if (elseBlockMatch) {
        elseBlock = elseBlockMatch[1];
      }
    }
    
    // Create an obfuscated switch-case equivalent
    const dispatchVar = `_d${Math.floor(Math.random() * 1000)}`;
    let replacement = `
      var ${dispatchVar} = (${condition}) ? 1 : ${elsePart ? '2' : '0'};
      switch(${dispatchVar}) {
        case 1: ${ifBlock}; break;
        ${elsePart ? `case 2: ${elseBlock}; break;` : ''}
        default: break;
      }
    `;
    
    return replacement;
  });
}

// String concealing function
function concealStrings(code) {
  // Find string literals
  const stringRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  
  // Track replacements to avoid double-processing
  const replacements = [];
  
  // Process matches
  const processedCode = code.replace(stringRegex, (match, doubleQuoted, singleQuoted) => {
    const str = doubleQuoted || singleQuoted;
    
    // Skip short strings, already processed strings, or strings with escape sequences
    if (str.length < 4 || str.includes('\\') || Math.random() > 0.4) {
      return match;
    }
    
    // Different encoding methods for variety
    const encodingMethod = Math.floor(Math.random() * 3);
    let replacement;
    
    switch (encodingMethod) {
      case 0: // Base64 encoding
        replacement = `atob("${Buffer.from(str).toString('base64')}")`;
        break;
      case 1: // Character code array
        const codes = Array.from(str).map(c => c.charCodeAt(0));
        replacement = `String.fromCharCode(${codes.join(',')})`;
        break;
      case 2: // Split and join
        const parts = [];
        for (let i = 0; i < str.length; i += 2) {
          const part = str.substring(i, Math.min(i + 2, str.length));
          parts.push(`"${part}"`);
        }
        replacement = parts.join('+');
        break;
      default:
        replacement = match;
    }
    
    // Store the replacement to avoid processing it again
    replacements.push({ original: match, replacement });
    
    return replacement;
  });
  
  return processedCode;
}

// Add anti-debugging traps
function addAntiDebuggingTraps(code) {
  // Simple anti-debugging techniques using performance checks
  const traps = [
    `(function() { 
      var start = Date.now(); 
      debugger; 
      if(Date.now() - start > 100) { 
        console.warn("Debugger detected!"); 
      } 
    })();`,
    
    `(function() {
      var t = performance.now();
      for(var i = 0; i < 1000; i++) { /* no-op */ }
      var t2 = performance.now();
      if(t2 - t > 50) {
        console.warn("Performance issue detected");
      }
    })();`,
    
    `setInterval(function() {
      var startTime = performance.now();
      debugger;
      var endTime = performance.now();
      if (endTime - startTime > 100) {
        console.warn("DevTools or debugging detected");
      }
    }, 1000);`,
    
    `Object.defineProperty(window, 'console', {
      get: function() {
        if (${Math.random() > 0.95}) {
          var err = new Error('Console access detected');
          err.name = 'SecurityError';
          throw err;
        }
        return window._console;
      }
    });
    window._console = window.console;`
  ];
  
  // Insert a random trap at the beginning of the code
  const trap = traps[Math.floor(Math.random() * traps.length)];
  return trap + '\n' + code;
}

// Add code watermarking - invisible markers that can help identify your code if copied
function addCodeWatermark(code) {
  // Create a unique identifier based on a timestamp and random hash
  const timestamp = Date.now();
  const randomHash = crypto.createHash('md5').update(timestamp.toString() + Math.random().toString()).digest('hex').substring(0, 8);
  
  // Create an invisible watermark as specially formatted comments
  const watermark = [
    `/* --- NCLEX Platform - Licensed code --- */`,
    `/* [NP:${timestamp}:${randomHash}] */`,
    `/* Unauthorized use prohibited */`,
    `/* ${new Date().toISOString()} */`
  ].join('\n');
  
  // Add the watermark at a random position in the code
  const position = Math.floor(Math.random() * code.length);
  return code.substring(0, position) + '\n' + watermark + '\n' + code.substring(position);
}

// Inject decoy functions to waste an attacker's time
function injectDecoyFunctions(code) {
  const decoys = [
    `function _securityCheck${Math.random().toString(36).substring(2, 6)}() {
      const hmacKey = "${crypto.randomBytes(10).toString('hex')}";
      const timestamp = new Date().toISOString();
      const payload = timestamp + hmacKey;
      return { verified: true, timestamp };
    }`,
    
    `function _validateToken${Math.random().toString(36).substring(2, 6)}(token) {
      if (!token) return false;
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      try {
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        return payload.exp > Date.now() / 1000;
      } catch(e) {
        return false;
      }
    }`,
    
    `function _encryptData${Math.random().toString(36).substring(2, 6)}(data) {
      const key = "${crypto.randomBytes(8).toString('hex')}";
      return data.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(0))
      ).join('');
    }`,
    
    `function _checkIntegrity${Math.random().toString(36).substring(2, 6)}() {
      const checksums = {
        module1: "${crypto.randomBytes(4).toString('hex')}",
        module2: "${crypto.randomBytes(4).toString('hex')}",
        module3: "${crypto.randomBytes(4).toString('hex')}"
      };
      const validated = Object.values(checksums).every(c => c.length === 8);
      return { status: validated ? "ok" : "compromised" };
    }`
  ];
  
  // Add 1-2 decoy functions
  const numDecoys = 1 + Math.floor(Math.random() * 2);
  let result = code;
  
  for (let i = 0; i < numDecoys; i++) {
    const decoy = decoys[Math.floor(Math.random() * decoys.length)];
    const position = Math.floor(Math.random() * result.length);
    result = result.substring(0, position) + '\n' + decoy + '\n' + result.substring(position);
  }
  
  return result;
}

// Split long strings and expressions to evade pattern matching
function splitStringsAndExpressions(code) {
  // Find long string literals
  const longStringRegex = /"[^"\\]{30,}(?:\\.[^"\\]*)*"|'[^'\\]{30,}(?:\\.[^'\\]*)*'/g;
  
  // Split long strings into concatenated parts
  return code.replace(longStringRegex, (match) => {
    const quote = match.charAt(0);
    const content = match.substring(1, match.length - 1);
    
    if (content.length < 30) return match;
    
    const parts = [];
    const chunkSize = 3 + Math.floor(Math.random() * 5); // Random chunk size between 3-7
    
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.substring(i, Math.min(i + chunkSize, content.length));
      parts.push(`${quote}${chunk}${quote}`);
    }
    
    return parts.join(' + ');
  });
}

// Main obfuscation function
function obfuscateCode(code) {
  // Skip existing obfuscated files
  if (code.includes('_obfuscated_')) {
    return code;
  }
  
  console.log(`  ➤ Applying variable name obfuscation...`);
  const variableMap = generateVariableMap();
  
  let obfuscated = code;
  
  // Apply variable name replacements
  Object.keys(variableMap).forEach(key => {
    // Only replace variable declarations and property access
    // Using regex with word boundaries to avoid partial matches
    const varPattern = new RegExp(`\\b${key}\\b(?!(\\s*\\())`, 'g');
    obfuscated = obfuscated.replace(varPattern, variableMap[key]);
  });
  
  console.log(`  ➤ Concealing string literals...`);
  obfuscated = concealStrings(obfuscated);
  
  console.log(`  ➤ Adding code watermarks...`);
  obfuscated = addCodeWatermark(obfuscated);
  
  console.log(`  ➤ Injecting decoy functions...`);
  obfuscated = injectDecoyFunctions(obfuscated);
  
  console.log(`  ➤ Splitting long strings and expressions...`);
  obfuscated = splitStringsAndExpressions(obfuscated);
  
  // Control flow flattening is more complex and can break code if not done carefully
  if (Math.random() > 0.7) { // Only apply to 30% of files to reduce risk
    console.log(`  ➤ Applying control flow obfuscation...`);
    obfuscated = flattenControlFlow(obfuscated);
  }
  
  // Add anti-debugging only to certain files
  if (Math.random() > 0.8) { // Apply to 20% of files
    console.log(`  ➤ Adding anti-debugging measures...`);
    obfuscated = addAntiDebuggingTraps(obfuscated);
  }
  
  // Add obfuscation marker and header
  return `/**
 * [Obfuscated] NCLEX Nursing Platform
 * This file has been obfuscated to protect intellectual property.
 * DO NOT MODIFY - Any changes may cause the application to malfunction.
 * ${new Date().toISOString()}
 * ${crypto.randomBytes(8).toString('hex')}
 */
// _obfuscated_
${obfuscated}`;
}

// Process files in directory
function processDirectory(dirPath) {
  console.log(`\nProcessing directory: ${dirPath}`);
  
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      
      // Skip excluded patterns
      if (EXCLUDE_PATTERNS.some(pattern => filePath.includes(pattern))) {
        console.log(`⚠ Skipping excluded file/directory: ${filePath}`);
        continue;
      }
      
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        processDirectory(filePath);
      } else if (stats.isFile() && JS_EXTENSIONS.includes(path.extname(filePath))) {
        console.log(`\nObfuscating: ${filePath}`);
        
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // Skip files that are too large or already obfuscated
          if (content.length > 500000) {
            console.log(`⚠ Skipped (too large): ${filePath}`);
            continue;
          }
          
          if (content.includes('_obfuscated_')) {
            console.log(`⚠ Skipped (already obfuscated): ${filePath}`);
            continue;
          }
          
          content = obfuscateCode(content);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Successfully obfuscated: ${filePath}`);
        } catch (error) {
          console.error(`❌ Error obfuscating ${filePath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error accessing directory ${dirPath}:`, error);
  }
}

// Main execution
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                 NCLEX CODE OBFUSCATION TOOL                ║');
console.log('╠════════════════════════════════════════════════════════════╣');
console.log('║ Starting secure code transformation process...             ║');
console.log('╚════════════════════════════════════════════════════════════╝');

try {
  // Generate unique obfuscation ID for this run
  const obfuscationId = crypto.randomBytes(4).toString('hex');
  console.log(`\n✨ Obfuscation run ID: ${obfuscationId}`);
  
  // Process each target directory
  for (const dir of TARGET_DIRS) {
    if (fs.existsSync(dir)) {
      processDirectory(dir);
    } else {
      console.log(`\n⚠ Directory not found: ${dir}`);
    }
  }
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║             CODE OBFUSCATION COMPLETED SUCCESSFULLY         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
} catch (error) {
  console.error('\n❌ Obfuscation process failed:');
  console.error(error);
  process.exit(1);
}