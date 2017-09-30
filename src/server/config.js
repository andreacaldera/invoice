import fs from 'fs';

const invoiceEnv = process.env.NODE_ENV;
const config = JSON.parse(fs.readFileSync(`./config/${invoiceEnv}.json`, 'utf8'));

export default Object.assign({}, config, { invoiceEnv });
