
import { app, BrowserWindow, shell, Menu } from 'electron';
import { join } from 'path';
import { autoUpdater } from 'electron-updater';
import isDev from 'electron-is-dev';

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 500,
        height: 400,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    splashWindow.loadFile(join(__dirname, 'splash.html'));
    splashWindow.center();

    splashWindow.on('closed', () => {
        splashWindow = null;
    });
}

function createWindow() {
    const windowConfig: Electron.BrowserWindowConstructorOptions = {
        width: 1280,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        show: false, // Don't show until ready
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true, // Hide menu bar (can be toggled with Alt key)
    };

    // Platform-specific title bar configuration
    if (process.platform === 'darwin') {
        // macOS: Use hidden title bar with custom traffic light position
        windowConfig.titleBarStyle = 'hidden';
        windowConfig.trafficLightPosition = { x: 15, y: 15 };
    }
    // Windows and Linux will use the default frame with native controls

    mainWindow = new BrowserWindow(windowConfig);

    // Remove the menu bar completely
    Menu.setApplicationMenu(null);

    if (isDev) {
        mainWindow.loadURL(process.env.ELECTRON_APP_URL || 'http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(join(__dirname, '../out/index.html'));
    }

    // Show main window when ready and close splash
    mainWindow.once('ready-to-show', () => {
        // Small delay for smooth transition
        setTimeout(() => {
            if (splashWindow) {
                splashWindow.close();
            }
            mainWindow?.show();
        }, 500);
    });

    // Open external links in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Auto-updater event handlers
function setupAutoUpdater() {
    // Only check for updates in production
    if (isDev) return;

    // Check for updates on startup (after 3 seconds)
    setTimeout(() => {
        autoUpdater.checkForUpdates().catch((err) => {
            console.log('Update check failed:', err.message);
        });
    }, 3000);

    // Check for updates every hour
    setInterval(() => {
        autoUpdater.checkForUpdates().catch((err) => {
            console.log('Update check failed:', err.message);
        });
    }, 60 * 60 * 1000); // 1 hour

    autoUpdater.on('update-available', (info) => {
        console.log('Update available:', info.version);
    });

    autoUpdater.on('update-downloaded', (info) => {
        console.log('Update downloaded:', info.version);
        // Notify user and install on app quit
        const { dialog } = require('electron');
        dialog.showMessageBox(mainWindow!, {
            type: 'info',
            title: 'Update Ready',
            message: 'A new version has been downloaded.',
            detail: `Version ${info.version} is ready to install. The update will be applied when you restart the app.`,
            buttons: ['Restart Now', 'Later']
        }).then((result: Electron.MessageBoxReturnValue) => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });

    autoUpdater.on('error', (err) => {
        console.log('Update error:', err);
    });
}

app.on('ready', () => {
    // Show splash screen first
    createSplashWindow();

    // Create main window (will show when ready)
    createWindow();

    // Setup auto-updater
    setupAutoUpdater();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
