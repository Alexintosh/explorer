//* Web3 information *//
var Web3 = require('web3');
var fs = require('fs');

/**
  Start config for node connection
**/
var config = {};
//Look for config.json file if not
try {
    var configContents = fs.readFileSync('config.json');
    config = JSON.parse(configContents);
    console.log('config.json found.');
}
catch (error) {
  if (error.code === 'ENOENT') {
      console.log('No config file found.');
  }
  else {
      throw error;
      process.exit(1);
  }
}

function buildURI(config) {
  // set the default NODE address to localhost if it's not provided
  if (!('nodeAddr' in config) || !(config.nodeAddr)) {
    config.nodeAddr = 'localhost'; // default
  }
  // set the default geth port if it's not provided
  if (!('gethPort' in config) || (typeof config.gethPort) !== 'number') {
    config.gethPort = 8545; // default
  }
  //set protocol
  if (!('isSSL' in config) || !(config.isSSL)) {
    var protocol = "http://";
  } else {
    var protocol = "https://";
  }
  //true is using unsigned certs
  if (!('unsafeTLS' in config) || (config.unsafeTLS)) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
  //timeout
  if (!('timeout' in config) || (typeof config.timeout) !== 'number') {
    config.timeout = 0; // default
  }
  // put it all together
  if (!('userName' in config)) {
    var uri = protocol
              + config.nodeAddr + ":" + config.gethPort.toString()
              + "," + config.timeout.toString();
    console.log('Connecting ' + config.nodeAddr + ':' + config.gethPort + '...');
  } else {
    var uri = protocol
            + config.nodeAddr + ":" + config.gethPort.toString()
            + "," + config.timeout.toString()
            + "," + config.userName
            + "," + config.password;
   console.log('Connecting ' + config.nodeAddr + ':' + config.gethPort + ' with user: ' + config.userName + ' ...');
  }
  return uri;
}

module.exports = new Web3(new Web3.providers.HttpProvider(buildURI(config)));
