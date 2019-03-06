const path = require('path');
const fs = require('fs');
const util = require('util')
const fileExist = util.promisify(fs.exists)


const getConfig = async (requestedProfile) => {

    const configPath = path.resolve(`./lisef/aut.config.json`)
    const configExist = await fileExist(configPath)

    if(!requestedProfile && !configExist){
        return {}
    }

    if(requestedProfile && !configExist){
        throw new Error(`Lisef have not found config file in ${configPath}`)
    }

    
    let config = require(configPath)
    
    if(requestedProfile && !config[requestedProfile]){
        throw new Error(`Lisef have not found requested ${requestedProfile} in file ${configPath}`)
    }
    
    const profile = requestedProfile || 'default'
    
    if(!config[profile]){
        throw new Error(`Lisef have not found key ${profile} in file ${configPath}`)
    }

    return config[profile]
}



module.exports = getConfig