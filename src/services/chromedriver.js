const { Builder, WebDriver } = require('selenium-webdriver');
const chromedriverExec = require('chromedriver');
const chromeDriver = require('selenium-webdriver/chrome');
const Http = require( 'selenium-webdriver/http');
var path = require('path');
const storage = require('./storage')

const pm2 = require('pm2');

const startChromeDriver = () => new Promise((resolve, reject) => {
    pm2.connect(function (err) {
        if (err) {
            return reject(err)
        }
        pm2.start({
            script: `${chromedriverExec.path}`, // -- --port=65345  
            interpreter: 'none',
            args: '--port=65345'
        }, function (err, apps) {
            pm2.disconnect();   // Disconnects from PM2
            if (err) {
                return reject(err)
            }
            resolve(apps)
        });
    });
})

const isChromeDriverEnabled = () => new Promise((resolve, reject) => {
    pm2.connect(function (err) {
        if (err) {
            return reject(err)
        }
        pm2.list(function (err, processes) {
            pm2.disconnect();   // Disconnects from PM2
            if (err) {
                return reject(err)
            }
            const isRunning = processes.filter(e => e.name === 'chromedriver' && e.pm2_env.status === 'online').length > 0
            resolve(isRunning)
        });
    });
})

const stopChromeDriver = () => new Promise((resolve, reject) => {
    pm2.connect(function (err) {
        if (err) {
            return reject(err)
        }
        pm2.stop('chromedriver', function (err, apps) {
            pm2.disconnect();   // Disconnects from PM2
            if (err) {
                return reject(err)
            }
            resolve(apps)
        });
    });
})

const startNewSession = async (freshSession) => {
    let options = new chromeDriver.Options();

    if(!freshSession){
        const userProfileWindwos = path.resolve('./lisef/chromeProfile/') 
        options.addArguments(`user-data-dir=${userProfileWindwos}`);
    }

    options.addArguments('start-maximized');
    // options.setUserPreferences({ 'download.default_directory': opt.downloadFolder || path.resolve("./tmp") });
    return await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .usingServer('http://127.0.0.1:65345/')
        .build()
}

const buildDriverUsingSession = (sessionId) => {
    return new WebDriver(sessionId, new Http.Executor(new Http.HttpClient('http://127.0.0.1:65345/')));
}

const getDriver = async (freshSession) => {
    const oldChromeDriver = await isChromeDriverEnabled()

    if(!oldChromeDriver){
        await startChromeDriver()
    }

    const sessionId = storage.get('settings.sessionId').value()
    
    if(!sessionId || !oldChromeDriver){
        const driver = await startNewSession(freshSession)
        const newSessionId = await getSessionId(driver)
        storage.set('settings.sessionId', newSessionId).write()
        await driver.manage().setTimeouts({ implicit: 5000 })
        return driver;
    }
    const driver = buildDriverUsingSession(sessionId)
    await driver.manage().setTimeouts({ implicit: 5000 })
    return driver
}

const getSessionId = async (driver) => {
    return (await driver.getSession()).getId();
}

module.exports = { startChromeDriver, stopChromeDriver, startNewSession, getSessionId, buildDriverUsingSession, getDriver}