const NodeCache = require('node-cache');

// TTL = 5 minutos (300 segundos)
const cache = new NodeCache({ stdTTL: 300 });

module.exports = cache;
