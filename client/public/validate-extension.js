const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Chrome Extension...\n');

// Check manifest.json
try {
    const manifestPath = path.join(__dirname, 'manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    console.log('✅ manifest.json is valid JSON');
    
    // Check required fields
    const requiredFields = ['manifest_version', 'name', 'version'];
    const missingFields = requiredFields.filter(field => !manifest[field]);
    
    if (missingFields.length > 0) {
        console.log('❌ Missing required fields:', missingFields);
    } else {
        console.log('✅ All required manifest fields present');
    }
    
    // Check icon files
    const iconSizes = ['16', '32', '48', '128'];
    const missingIcons = [];
    
    for (const size of iconSizes) {
        const iconPath = path.join(__dirname, 'icons', `icon${size}.png`);
        if (!fs.existsSync(iconPath)) {
            missingIcons.push(`icon${size}.png`);
        } else {
            const stats = fs.statSync(iconPath);
            if (stats.size === 0) {
                missingIcons.push(`icon${size}.png (empty file)`);
            }
        }
    }
    
    if (missingIcons.length > 0) {
        console.log('❌ Missing or empty icon files:', missingIcons);
    } else {
        console.log('✅ All icon files present and valid');
    }
    
    // Check content scripts
    const contentScripts = manifest.content_scripts || [];
    const missingScripts = [];
    
    for (const script of contentScripts) {
        for (const jsFile of script.js || []) {
            const scriptPath = path.join(__dirname, jsFile);
            if (!fs.existsSync(scriptPath)) {
                missingScripts.push(jsFile);
            }
        }
    }
    
    if (missingScripts.length > 0) {
        console.log('❌ Missing content script files:', missingScripts);
    } else {
        console.log('✅ All content script files present');
    }
    
    // Check background script
    if (manifest.background && manifest.background.service_worker) {
        const bgScriptPath = path.join(__dirname, manifest.background.service_worker);
        if (!fs.existsSync(bgScriptPath)) {
            console.log('❌ Missing background script:', manifest.background.service_worker);
        } else {
            console.log('✅ Background script present');
        }
    }
    
    // Check permissions
    console.log('\n📋 Permissions:');
    (manifest.permissions || []).forEach(perm => {
        console.log(`  • ${perm}`);
    });
    
    console.log('\n📋 Host Permissions:');
    (manifest.host_permissions || []).forEach(perm => {
        console.log(`  • ${perm}`);
    });
    
    console.log('\n🎯 Summary:');
    console.log(`  • Extension Name: ${manifest.name}`);
    console.log(`  • Version: ${manifest.version}`);
    console.log(`  • Manifest Version: ${manifest.manifest_version}`);
    
    console.log('\n✅ Extension validation complete!');
    
} catch (error) {
    console.log('❌ Error validating extension:', error.message);
}
