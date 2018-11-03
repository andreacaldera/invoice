import express from 'express';
import winston from 'winston';

import pdfFactory from '../pdf';

export default ({ invoiceStore, companyStore, config }) => {
  const router = express.Router();
  const { createFromUrl } = pdfFactory(config);

  router.post('/company', (req, res, next) =>
    companyStore
      .save(req.body)
      .then((invoice) => res.json(invoice))
      .catch(next)
  );

  router.post('/invoices/add-invoice', (req, res, next) =>
    invoiceStore
      .save(req.body)
      .then((invoice) => res.json(invoice))
      .catch(next)
  );

  router.get('/invoices/:invoiceId', (req, res, next) =>
    invoiceStore
      .get(req.params.invoiceId)
      .then((invoice) => res.json(invoice))
      .catch(next)
  );

  router.get('/download-invoice/:invoiceId', (req, res, next) => {
    const { invoiceId } = req.params;
    invoiceStore.findOne({ invoiceId }).then((invoice) => {
      res.header(
        'Content-disposition',
        `attachment; filename=${invoice.invoiceNumber.toLowerCase()}.pdf;`
      );
      res.header('Content-type', 'application/pdf');

      const url = `http://localhost:${
        config.port
      }/invoice-preview/${invoiceId}?download-invoice`;

      winston.info(`Downloading invoice from URL ${url}`);

      return createFromUrl(url)
        .then((pdfStream) => pdfStream.pipe(res))
        .catch(next);
    });
  });

  return router;
};
