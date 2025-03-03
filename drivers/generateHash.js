'use strict';

const crypto = require('crypto');
const Homey = require('homey');

function generateHash(appId, appSecret, timestamp) {
  const data = `${appId}${appSecret}${timestamp}`;
  // Create a SHA-512 hash
  const hash = crypto.createHash('sha512').update(data).digest('hex');
  return hash;
}

function generateHeader(homey, sysSn) {
  const appId = homey.settings.get('appId');
  const appSecret = homey.settings.get('appSecret');

  const timeStamp = Math.floor(Date.now() / 1000);

  const sign = generateHash(appId, appSecret, timeStamp);

  const header = {
    headers: {
      appId,
      timeStamp,
      sign,
    }
  };

  return header;
}

module.exports = {
  generateHash : generateHash,
  generateHeader : generateHeader
};
