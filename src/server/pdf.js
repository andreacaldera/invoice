import wkhtmltopdf from 'wkhtmltopdf';
import superagent from 'superagent';

export function createFromHtml(html) {
  return wkhtmltopdf(html);
}

export function createFromUrl(url) {
  return superagent.get(url)
    .then(({ text }) => createFromHtml(text));
}
