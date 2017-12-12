import fs from 'fs';
import { merge } from 'lodash';

const invoiceEnv = process.env.INVOICE_CONFIG; // TODO change to INVOICE_CONFIG

const secretsFile = './config/secrets.json';

const secretsConfig = fs.existsSync(secretsFile) ? JSON.parse(fs.readFileSync(secretsFile, 'utf8')) : {};

const config = JSON.parse(fs.readFileSync(`./config/${invoiceEnv}.json`, 'utf8'));

export default Object.assign({}, merge(config, secretsConfig), { invoiceEnv });
