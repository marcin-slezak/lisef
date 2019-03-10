const { until} = require('selenium-webdriver');

const seleniumExtension = (driver) => {
    
    driver.waitUntilClickable = async (locator) => {
        const element = await driver.waitUntilLocated(locator)
        await driver.waitFixed(until.elementIsVisible(element))
        return element
    }
    
    driver.waitUntilLocated = async (locator) => {
        await driver.waitFixed(until.elementLocated(locator))
        return await driver.findElement(locator)    
    }

    driver.waitFixed = async (condition) => {
        return await driver.wait((async driver => condition.fn(driver)), 2000)
    }

    return driver
}
module.exports = seleniumExtension