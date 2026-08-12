const { register } = require('node:module')
const { pathToFileURL } = require('node:url')

// Fixed: Added the explicit node:fs import right inside the runner string
const code = `
import fs from 'node:fs';

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') && !specifier.endsWith('.js') && !specifier.endsWith('.json') && !specifier.endsWith('.html')) {
    const parentURL = new URL(context.parentURL);
    const resolvedPath = new URL(specifier, parentURL).pathname;
    
    // Check if the path is a file directly
    if (fs.existsSync(resolvedPath + '.js')) {
      return nextResolve(specifier + '.js', context);
    }
    // Check if the path is a folder containing an index.js
    if (fs.existsSync(resolvedPath + '/index.js')) {
      return nextResolve(specifier + '/index.js', context);
    }
  }
  return nextResolve(specifier, context);
}
`

// Creates an inline data URI loader to bypass requiring external files or npm modules
const dataUrl = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
register(dataUrl, pathToFileURL(__filename))

async function loadApp() {
    console.log('========================================')
    console.log('HARMONY HEALTH PASSENGER APP STARTING')
    console.log('Loading:', './dist/server.js')
    console.log('========================================')

    await import('./dist/server.js')
}

loadApp().catch(error => {
    console.error('========================================')
    console.error('HARMONY HEALTH PASSENGER FAILED TO START')
    console.error(error)
    console.error('========================================')
})

loadApp()
