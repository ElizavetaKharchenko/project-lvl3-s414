import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import isValid from './validator';
import parse from './parser';
import { articlesRender, channelsRender } from './renders';

export default () => {
  const state = {
    feedsUrl: [],
    feeds: {
      channels: [],
      articles: [],
    },
    inputValue: '',
    submitted: false,
    inputState: '',
    errorType: '',
  };

  const { watch } = WatchJS;
  const input = document.querySelector('#feedURLInput');
  const btnAddFeed = document.querySelector('#btnAddFeed');
  const proxyCors = 'https://cors-anywhere.herokuapp.com/';
  const formAddFeed = document.querySelector('#formAddFeed');

  input.addEventListener('input', (e) => {
    state.inputValue = e.target.value;
    if (state.inputValue === '') {
      state.inputState = 'empty';
    } else {
      const validation = isValid(state.inputValue, state.feedsUrl);
      state.inputState = validation.state;
      state.errorType = validation.error;
    }
  });

  btnAddFeed.addEventListener('click', () => {
    const feedUrl = state.inputValue;
    const urlProxy = `${proxyCors}${feedUrl}`;
    axios.get(urlProxy).then((result) => {
      state.feedsUrl.push(feedUrl);
      const { items, channelTitle, description } = parse(result.data);
      state.feeds.channels.push({ channelTitle, description });
      state.feeds.articles.push(...items);
    });
  });

  formAddFeed.addEventListener('submit', (e) => {
    btnAddFeed.click();
    e.preventDefault();
  });

  watch(state, 'inputState', () => {
    if (state.inputState === 'empty') {
      input.classList.remove('is-invalid');
      input.classList.remove('is-valid');
    } else if (state.inputState === 'invalid') {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      btnAddFeed.setAttribute('disabled', '');
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      btnAddFeed.removeAttribute('disabled', '');
    }
  });

  watch(state, 'feeds', () => {
    input.value = '';
    state.inputState = 'empty';
    btnAddFeed.setAttribute('disabled', '');
    channelsRender(state.feeds.channels);
    articlesRender(state.feeds.articles);
  });
};
