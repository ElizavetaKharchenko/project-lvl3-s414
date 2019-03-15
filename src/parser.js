export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const channelTitle = doc.querySelector('channel title').textContent;
  const description = doc.querySelector('channel description').textContent;
  const items = [...doc.querySelectorAll('item')].map((elem) => {
    const title = elem.querySelector('title').textContent;
    const link = elem.querySelector('link').textContent;
    const articleDescription = elem.querySelector('description').textContent;
    return { title, link, articleDescription };
  });
  return { channelTitle, description, items };
};
