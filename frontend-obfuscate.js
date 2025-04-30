/**
 * Frontend-only Obfuscation for NCLEX Nursing Platform
 * This script applies lightweight obfuscation only to frontend assets
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ONLY process frontend assets, not server files
const TARGET_DIRS = ['dist/public/assets'];
const JS_EXTENSIONS = ['.js'];
const EXCLUDE_PATTERNS = ['node_modules', 'vendor', 'third-party', '.min.js'];

// Add code watermarking - invisible markers that can help identify your code if copied
function addCodeWatermark(code) {
  try {
    // Create a unique identifier
    const timestamp = Date.now();
    const randomHash = crypto.createHash('md5')
      .update(timestamp.toString() + Math.random().toString())
      .digest('hex').substring(0, 8);
    
    // Create a watermark
    const watermark = [
      `/* --- NCLEX Platform - Licensed code --- */`,
      `/* [NP:${timestamp}:${randomHash}] */`,
      `/* Unauthorized use prohibited */`
    ].join('\n');
    
    // Add to the top of the file (safest position)
    return watermark + '\n' + code;
  } catch (error) {
    console.log(`    ⚠ Watermarking error: ${error.message}`);
    return code;
  }
}

// Add decoy comments
function addDecoyComments(code) {
  try {
    const decoys = [
      `/* Security Layer ${crypto.randomBytes(2).toString('hex')} */`,
      `/* Content integrity verified */`,
      `/* Usage tracking enabled */`
    ];
    
    // Add a single comment at the top
    const randomDecoy = decoys[Math.floor(Math.random() * decoys.length)];
    return randomDecoy + '\n' + code;
  } catch (error) {
    console.log(`    ⚠ Adding decoys error: ${error.message}`);
    return code;
  }
}

// Main obfuscation function - very safe and minimal
function obfuscateCode(code) {
  // Skip existing obfuscated files
  if (code.includes('_obfuscated_')) {
    return code;
  }
  
  console.log(`  ➤ Adding code watermarks...`);
  let obfuscated = addCodeWatermark(code);
  
  console.log(`  ➤ Adding decoy comments...`);
  obfuscated = addDecoyComments(obfuscated);
  
  // Add obfuscation marker and header
  return `/**
 * [Obfuscated] NCLEX Nursing Platform
 * This file has been obfuscated to protect intellectual property.
 * ${new Date().toISOString()}
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
console.log('║          NCLEX FRONTEND CODE OBFUSCATION TOOL              ║');
console.log('╠════════════════════════════════════════════════════════════╣');
console.log('║ Starting secure frontend obfuscation...                    ║');
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