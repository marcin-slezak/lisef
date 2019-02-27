const { Builder, WebDriver } = require('selenium-webdriver');
const chromedriverExec = require('chromedriver');
const chromeDriver = require('selenium-webdriver/chrome');
const Http = require( 'selenium-webdriver/http');

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

const startNewSession = async () => {
    let options = new chromeDriver.Options();

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

const getDriver = async (storage) => {
    const sessionId = storage.get('settings.sessionId').value()
    console.log('[getDriver] sessionId from storage', sessionId)
    if(!sessionId){
        const driver = await startNewSession()
        const newSessionId = await getSessionId(driver)
        storage.set('settings.sessionId', newSessionId).write()
        console.log('[getDriver] new sessionId generated', newSessionId)
        return driver;
    }
    console.log('[getDriver] used sessionId from storage', sessionId)
    return buildDriverUsingSession(sessionId)
}

const getSessionId = async (driver) => {
    return (await driver.getSession()).getId();
}

module.exports = { startChromeDriver, stopChromeDriver, startNewSession, getSessionId, buildDriverUsingSession, getDriver}