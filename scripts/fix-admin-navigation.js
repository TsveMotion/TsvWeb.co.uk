// Script to remove duplicate inner navigation from admin pages
const fs = require('fs');
const path = require('path');

// Define the admin directory path
const adminDir = path.join(__dirname, '../src/app/admin');

// Function to process a file and remove inner navigation
function processFile(filePath) {
  try {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Define patterns to match different types of inner navigation headers
    const patterns = [
      // Pattern 1: Standard flex container with h1 title
      /<div[^>]*className="[^"]*flex[^"]*justify-between[^"]*"[^>]*>[\s\S]*?<h1[^>]*>[\s\S]*?<\/h1>[\s\S]*?<\/div>/g,
      
      // Pattern 2: Any div with h1 title and logout button nearby
      /<div[^>]*>[\s\S]*?<h1[^>]*>[\s\S]*?<\/h1>[\s\S]*?LogoutButton[\s\S]*?<\/div>/g,
      
      // Pattern 3: Extra whitespace or empty divs between components
      /\s*<div[^>]*>\s*<\/div>\s*/g,
      
      // Pattern 4: Specific to admin inquiries page - any duplicate headers
      /<div[^>]*className="[^"]*flex-1[^"]*"[^>]*>[\s\S]*?<h1[^>]*>[\s\S]*?<\/h1>[\s\S]*?<\/div>/g,
      
      // Pattern 5: Empty space at the beginning of content div
      /(<div className="space-y-6">)\s+/g
    ];
    
    let found = false;
    
    // Apply each pattern
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        // For pattern 5, replace with the capture group to preserve the div
        if (pattern.toString().includes('space-y-6')) {
          content = content.replace(pattern, '$1\n        ');
        } else {
          // For other patterns, remove completely
          content = content.replace(pattern, '');
        }
        found = true;
      }
    }
    
    // Also remove any extra blank lines (more than 2 consecutive)
    content = content.replace(/\n{3,}/g, '\n\n');
    
    if (found && content !== originalContent) {
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed inner navigation in: ${path.relative(__dirname, filePath)}`);
      return true;
    } else {
      console.log(`⏭️ No inner navigation found in: ${path.relative(__dirname, filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error);
    return false;
  }
}

// Function to recursively process all .tsx files in a directory
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let fixedCount = 0;
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively process subdirectories
      fixedCount += processDirectory(fullPath);
    } else if (entry.name === 'page.tsx') {
      // Process page.tsx files
      if (processFile(fullPath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

console.log('🔍 Scanning admin pages for inner navigation issues...');
const fixedCount = processDirectory(adminDir);
console.log(`✨ Done! Fixed inner navigation in ${fixedCount} files.`);
