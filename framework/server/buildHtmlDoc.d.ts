declare const buildHtmlDoc: (
  [initialHtml, initialData]: [string, string?],
  withScript?: boolean,
) => string;
export default buildHtmlDoc;
