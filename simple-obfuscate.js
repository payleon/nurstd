/**
 * Simple Code Obfuscation for NCLEX Nursing Platform
 * This is a more robust version that handles edge cases better
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

// Generate a unique identifier to use as a prefix for obfuscated names
const OBFUSCATION_PREFIX = '_' + crypto.randomBytes(2).toString('hex');

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
    }`
  ];
  
  // Add a decoy function
  const decoy = decoys[Math.floor(Math.random() * decoys.length)];
  const position = Math.floor(Math.random() * code.length);
  return code.substring(0, position) + '\n' + decoy + '\n' + code.substring(position);
}

// Main obfuscation function - simplified and more robust
function obfuscateCode(code) {
  // Skip existing obfuscated files
  if (code.includes('_obfuscated_')) {
    return code;
  }
  
  console.log(`  ➤ Adding code watermarks...`);
  let obfuscated = addCodeWatermark(code);
  
  console.log(`  ➤ Injecting decoy functions...`);
  try {
    obfuscated = injectDecoyFunctions(obfuscated);
  } catch (error) {
    console.log(`    ⚠ Skipping decoy functions due to error: ${error.message}`);
  }
  
  // Add bogus comments that make the code harder to read
  // This won't affect execution but will confuse manual inspection
  const decoys = [
    `/* Security Layer: ${Math.random().toString(36).substring(2, 15)} */`,
    `// JIT verification: ${Date.now()}`,
    `// HMAC checksum enforced at runtime`,
    `/* eslint-disable */`,
    `// Runtime integrity check passed: ${Buffer.from(Math.random().toString()).toString('base64').substring(0, 8)}`,
    `// NOX${Math.floor(Math.random() * 1000)}:${Math.floor(Math.random() * 1000)}`,
    `/* API Auth Token verified */`,
    `// Prevention of MITM attacks enabled`,
    `/* Content fingerprint: ${Math.random().toString(36).substring(2, 10)} */`
  ];
  
  // Insert decoys randomly throughout the code
  for (let i = 0; i < 5; i++) {
    try {
      const randomDecoy = decoys[Math.floor(Math.random() * decoys.length)];
      const position = Math.floor(Math.random() * obfuscated.length);
      obfuscated = obfuscated.substring(0, position) + '\n' + randomDecoy + '\n' + obfuscated.substring(position);
    } catch (error) {
      console.log(`    ⚠ Skipping a decoy comment due to error: ${error.message}`);
    }
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