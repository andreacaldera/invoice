import superagent from 'superagent';

import wkhtmltopdfFactory from './wkhtmltopdf';

export default (config) => {
  const wkhtmltopdf = wkhtmltopdfFactory(config);

  const createFromHtml = (html) => wkhtmltopdf(html);

  const createFromUrl = (url) =>
    superagent.get(url).then(({ text }) => createFromHtml(text));

  return Object.freeze({
    createFromUrl,
    createFromHtml,
  });
};
