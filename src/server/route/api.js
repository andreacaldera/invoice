import express from 'express';
import winston from 'winston';

import pdfFactory from '../pdf';

export default ({ invoiceStore, companyStore, config }) => {
  const router = express.Router();
  const { createFromUrl } = pdfFactory(config);

  router.post('/company', (req, res, next) =>
    companyStore.save(req.body)
      .then((invoice) => res.json(invoice))
      .catch(next)
  );

  router.post('/invoices/add-invoice', (req, res, next) =>
    invoiceStore.save(req.body)
      .then((invoice) => res.json(invoice))
      .catch(next)
  );

  router.get('/invoices/:invoiceId', (req, res, next) =>
    invoiceStore.get(req.params.invoiceId)
      .then((invoice) => res.json(invoice))
      .catch(next)
  );

  router.get('/download-invoice/:invoiceId', (req, res, next) => {
    res.header('Content-disposition', 'attachment');
    res.header('Content-type', 'application/pdf');

    const url = `http://localhost:${config.port}/invoice-preview/${req.params.invoiceId}?download-invoice`;

    winston.info(`Downloading invoice from URL ${url}`);

    return createFromUrl(url)
      .then((pdfStream) => pdfStream.pipe(res))
      .catch(next);
  });

  return router;
};
