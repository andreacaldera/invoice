
import superagent from 'superagent';
import { takeEvery, call, put } from 'redux-saga/effects';

import { ADD_INVOICE, INVOICE_ADDED, INVOICE_ERROR } from './constants';

const callAddInvoiceApi = (invoice) => superagent.post('/api/invoices/add-invoice').send(invoice).then(({ body }) => body);

function* addInvoice(payload) {
  const {
    billings, invoiceNumber, client, company,
  } = payload.invoiceData;
  try {
    const newInvoice = yield call(callAddInvoiceApi, {
      company, client, billings, invoiceNumber,
    });
    yield put({ type: INVOICE_ADDED, invoice: newInvoice });
  } catch (error) {
    yield put({ type: INVOICE_ERROR, error });
  }
}

function* watchAddInvoice() {
  yield takeEvery(ADD_INVOICE, addInvoice);
}

export default [watchAddInvoice];
