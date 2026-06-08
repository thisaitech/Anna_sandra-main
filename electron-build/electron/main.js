import { app, BrowserWindow, session } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// FIXED port so localStorage/IndexedDB persist across restarts
// (origin = http://127.0.0.1:19847 never changes)
const FIXED_PORT = 19847

let mainWindow = null
let server = null

function createServer() {
  return new Promise((resolve, reject) => {
    server = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0]
      let filePath = path.join(__dirname, '../dist', urlPath === '/' ? 'index.html' : urlPath)

      // Downloads: never SPA-fallback (avoid serving index.html as .exe)
      const isDownload = urlPath.startsWith('/downloads/')
      if (isDownload && !fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('File not found. Run build-desktop.ps1 to generate the installer.')
        return
      }
      // SPA fallback: if file doesn't exist, serve index.html
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(__dirname, '../dist/index.html')
      }

      const ext = path.extname(filePath)
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.exe': 'application/vnd.microsoft.portable-executable',
        '.apk': 'application/vnd.android.package-archive',
        '.css': 'text/css; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.json': 'application/json; charset=utf-8',
        '.webmanifest': 'application/manifest+json; charset=utf-8',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.map': 'application/json; charset=utf-8',
        '.webp': 'image/webp'
      }

      const contentType = mimeTypes[ext] || 'application/octet-stream'

      if (isDownload) {
        const stat = fs.statSync(filePath)
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': stat.size,
          'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`
        })
        fs.createReadStream(filePath).pipe(res)
        return
      }

      fs.readFile(filePath, (err, content) => {
        if (err) {
          // Last resort: serve index.html for SPA routing
          fs.readFile(path.join(__dirname, '../dist/index.html'), (err2, fallback) => {
            if (err2) {
              res.writeHead(500)
              res.end('Internal Server Error')
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
              res.end(fallback)
            }
          })
        } else {
          res.writeHead(200, { 'Content-Type': contentType })
          res.end(content)
        }
      })
    })

    server.listen(FIXED_PORT, '127.0.0.1', () => {
      console.log(`Local server running at http://127.0.0.1:${FIXED_PORT}`)
      resolve(FIXED_PORT)
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port already in use (maybe another instance), try to connect to it
        console.log(`Port ${FIXED_PORT} in use, connecting to existing instance...`)
        resolve(FIXED_PORT)
      } else {
        reject(err)
      }
    })
  })
}

function createWindow(port) {
  // Configure persistent storage for offline data
  const ses = session.defaultSession

  // Enable persistent storage permission (for IndexedDB, localStorage)
  ses.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true)
  })

  mainWindow = new BrowserWindow({
    width: 1536,
    height: 960,
    minWidth: 1280,
    minHeight: 720,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      // Use persistent partition so data survives restarts
      partition: 'persist:sandra-erp'
    },
    icon: path.join(__dirname, '../dist/icon-512x512.png'),
    title: 'Sandra ERP | Business Management Solution',
    backgroundColor: '#ffffff'
  })

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  // Always load from our fixed-port local server
  mainWindow.loadURL(`http://127.0.0.1:${port}`)

  // DevTools off by default so layout matches web (sidebar needs full width)

  // Log any loading errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription)
    // Retry after a short delay
    setTimeout(() => {
      mainWindow.loadURL(`http://127.0.0.1:${port}`)
    }, 1000)
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(
      "document.body&&document.body.classList.add('sandra-desktop-app')",
      true
    ).catch(() => {})
    console.log('Page loaded successfully!')
  })

  // Remove menu bar for cleaner look
  mainWindow.setMenuBarVisibility(false)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  try {
    const port = await createServer()
    createWindow(port)
  } catch (err) {
    console.error('Failed to start server:', err)
    app.quit()
  }

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(FIXED_PORT)
    }
  })
})

app.on('window-all-closed', () => {
  if (server) {
    server.close()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
