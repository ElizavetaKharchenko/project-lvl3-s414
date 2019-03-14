export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const channelTitle = doc.querySelector('channel title').textContent;
  const description = doc.querySelector('channel description').textContent;
  const items = [...doc.querySelectorAll('item')].map((elem) => {
    const title = elem.querySelector('title').textContent;
    const link = elem.querySelector('link').textContent;
    return { title, link };
  });
  return { channelTitle, description, items };
};
