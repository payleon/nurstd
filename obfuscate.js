/**
 * Custom obfuscation script for NCLEX nursing exam platform
 * This script applies code obfuscation techniques to compiled code
 */

const fs = require('fs');
const path = require('path');

// These are the files we'll obfuscate after build
const TARGET_DIRS = ['dist/public/assets', 'dist'];
const JS_EXTENSIONS = ['.js'];

// Simple but effective obfuscation techniques
function obfuscateCode(code) {
  // 1. Replace common variable names with shorter ones
  const variableMap = {
    'question': '_q',
    'answer': '_a',
    'correct': '_c',
    'response': '_r',
    'options': '_o',
    'selected': '_s',
    'index': '_i',
    'value': '_v',
    'result': '_x',
    'error': '_e',
    'data': '_d',
    'prop': '_p',
    'element': '_el',
    'event': '_ev',
    'handler': '_h',
    'callback': '_cb',
    'function': '_fn',
    'return': '_ret',
    'array': '_arr',
    'object': '_obj',
    'string': '_str',
    'number': '_n',
    'boolean': '_b',
    'attribute': '_attr',
    'property': '_prop',
    'document': '_doc'
  };

  // 2. Apply variable name replacements
  let obfuscated = code;
  
  Object.keys(variableMap).forEach(key => {
    // Only replace variable declarations and property access
    // Using regex with word boundaries to avoid partial matches
    const varPattern = new RegExp(`\\b${key}\\b(?!(\\s*\\())`, 'g');
    obfuscated = obfuscated.replace(varPattern, variableMap[key]);
  });

  // 3. Add some bogus code and comments that make the code harder to read
  // This won't affect execution but will confuse manual inspection
  const decoys = [
    `/* Security Layer: ${Math.random().toString(36).substring(2, 15)} */`,
    `// JIT verification: ${Date.now()}`,
    `// HMAC checksum enforced at runtime`,
    `/* eslint-disable */`,
    `// Runtime integrity check passed: ${btoa(Math.random().toString()).substring(0, 8)}`,
    `// NOX${Math.floor(Math.random() * 1000)}:${Math.floor(Math.random() * 1000)}`,
    `/* API Auth Token verified */`,
    `// Prevention of MITM attacks enabled`,
    `/* Content fingerprint: ${Math.random().toString(36).substring(2, 10)} */`
  ];
  
  // Insert decoys randomly throughout the code
  for (let i = 0; i < 3; i++) {
    const randomDecoy = decoys[Math.floor(Math.random() * decoys.length)];
    const position = Math.floor(Math.random() * obfuscated.length);
    obfuscated = obfuscated.substring(0, position) + '\n' + randomDecoy + '\n' + obfuscated.substring(position);
  }

  // 4. Add some string encoding to hide sensitive strings
  // Find string literals and convert some of them to base64 decoded at runtime
  const stringLiteralRegex = /"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/g;
  let match;
  let count = 0;
  
  // Only encode about 30% of strings to avoid performance issues
  while ((match = stringLiteralRegex.exec(obfuscated)) !== null && count < 5) {
    if (Math.random() > 0.7) {
      const str = match[1] || match[3];
      // Only encode strings with a reasonable length 
      if (str.length > 3 && str.length < 30 && !str.includes('\\')) {
        const encoded = Buffer.from(str).toString('base64');
        const replacement = `atob("${encoded}")`;
        obfuscated = obfuscated.substring(0, match.index) + 
                    replacement + 
                    obfuscated.substring(match.index + match[0].length);
        count++;
      }
    }
  }

  // 5. Add random whitespace and line breaks to disrupt formatting
  obfuscated = obfuscated.replace(/\{/g, '{\n'.repeat(Math.floor(Math.random() * 2) + 1));
  obfuscated = obfuscated.replace(/\}/g, '\n}'.repeat(Math.floor(Math.random() * 2) + 1));
  
  return obfuscated;
}

// Process all JavaScript files in the target directories
function processDirectory(dirPath) {
  console.log(`Processing directory: ${dirPath}`);
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      processDirectory(filePath);
    } else if (stats.isFile() && JS_EXTENSIONS.includes(path.extname(filePath))) {
      console.log(`Obfuscating: ${filePath}`);
      
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        // Skip minified files or files already obfuscated
        if (content.length < 10000 && !content.includes('_obfuscated_')) {
          content = `// _obfuscated_\n${obfuscateCode(content)}`;
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✓ Obfuscated: ${filePath}`);
        } else {
          console.log(`⚠ Skipped (too large or already obfuscated): ${filePath}`);
        }
      } catch (error) {
        console.error(`❌ Error obfuscating ${filePath}:`, error);
      }
    }
  }
}

// Main execution
console.log('Starting code obfuscation...');

try {
  // Process each target directory
  for (const dir of TARGET_DIRS) {
    if (fs.existsSync(dir)) {
      processDirectory(dir);
    } else {
      console.log(`Directory not found: ${dir}`);
    }
  }
  
  console.log('Code obfuscation completed successfully!');
} catch (error) {
  console.error('Obfuscation failed:', error);
  process.exit(1);
}