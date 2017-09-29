
import superagent from 'superagent';
import { browserHistory } from 'react-router';
import { takeEvery, call, put } from 'redux-saga/effects';

import { ADD_INVOICE, INVOICE_ADDED } from './constants';

const callAddInvoiceApi = (invoice) => superagent.post('/api/invoices/add-invoice').send(invoice).then(({ body }) => body);

function* addInvoice(payload) {
  const { billing, invoiceNumber } = payload.invoiceData;
  try {
    const newInvoice = yield call(callAddInvoiceApi, { billings: [billing], invoiceNumber });

    yield put({ type: INVOICE_ADDED, invoice: newInvoice });
    browserHistory.push('/invoices');
  } catch (err) {
    // TODO
  }
}

function* watchAddInvoice() {
  yield takeEvery(ADD_INVOICE, addInvoice);
}

export default [watchAddInvoice];
