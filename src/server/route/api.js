import express from 'express';

import { createFromUrl } from '../pdf';

export default ({ invoiceStore, companyStore }) => {
  const router = express.Router();

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
    return createFromUrl(`http://localhost:3001/invoice-preview/${req.params.invoiceId}?download-invoice`)
      .then((pdfStream) => pdfStream.pipe(res))
      .catch(next);
  });

  return router;
};
