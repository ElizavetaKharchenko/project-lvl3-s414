// import 'bootstrap/dist/js/bootstrap.min';

export const articlesRender = (articles) => {
  const container = document.querySelector('.articles-list');
  const header = document.createElement('h2');
  header.classList.add('ml-2');
  header.textContent = 'Articles';
  const innerHTML = articles.map(({ title, link }) => (
    `<div class="list-group-item">
      <a href="${link}" class="article-link">${title}</a>
      <a href="#modalBtn" role="button" class="btn btn-outline-secondary btn-sm ml-3 modalBtn" data-toggle="modal">See more</a>
    </div>`
  )).join('');
  container.innerHTML = innerHTML;
  container.prepend(header);
};

export const channelsRender = (channelsList) => {
  const container = document.querySelector('.channel-list');
  const header = document.createElement('h2');
  header.classList.add('ml-2');
  header.textContent = 'Feeds';
  const innerHTML = channelsList.map(({ channelTitle, description }) => (
    `<div class="list-group-item">
      <h5 class="mb-1 channel-title">${channelTitle}</h5>
      <p class="mb-1 channel-description">${description}</p>
    </div>`
  )).join('');
  container.innerHTML = innerHTML;
  container.prepend(header);
};
