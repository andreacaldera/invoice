import fs from 'fs';
import { merge } from 'lodash';
import winston from 'winston';

if (!process.env.INVOICE_CONFIG) {
  winston.warn('Config not specified, defaulting to local');
}

const invoiceConfig = process.env.INVOICE_CONFIG || 'local';

winston.info(`Using config ${invoiceConfig}`);

const secretsFile = './config/secrets.json';

const secretsConfig = fs.existsSync(secretsFile) ? JSON.parse(fs.readFileSync(secretsFile, 'utf8')) : {};

const config = JSON.parse(fs.readFileSync(`./config/${invoiceConfig}.json`, 'utf8'));

export default Object.assign({}, merge(secretsConfig, config), { invoiceConfig });
