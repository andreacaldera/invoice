const localHostname = '127.0.0.1'; // require('os').hostname();

module.exports = {
  url: `mongodb://${localHostname}/invoice`,
};
