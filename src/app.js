import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.min';
import validate from './validator';
import parse from './parser';
import { articlesRender, channelsRender } from './renders';

export default () => {
  const state = {
    feedsUrl: [],
    feeds: {
      channels: [],
      articles: [],
    },
    modal: {
      content: '',
      active: false,
    },
    inputValue: '',
    submitted: false,
    inputState: '',
    errorMessage: '',
  };

  const { watch } = WatchJS;
  const input = document.querySelector('#feedURLInput');
  const btnAddFeed = document.querySelector('#btnAddFeed');
  const proxyCors = 'https://cors-anywhere.herokuapp.com/';
  const formAddFeed = document.querySelector('#formAddFeed');


  input.addEventListener('input', (e) => {
    state.inputValue = e.target.value;
    if (state.inputValue === '') {
      input.value = '';
      state.inputState = 'empty';
      state.errorMessage = '';
      btnAddFeed.setAttribute('disabled', '');
    } else {
      const validation = validate(state.inputValue, state.feedsUrl);
      state.inputState = validation.state;
      state.errorMessage = validation.error;
    }
  });

  formAddFeed.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedUrl = state.inputValue;
    const urlProxy = `${proxyCors}${feedUrl}`;
    input.value = '';
    state.inputState = 'empty';
    btnAddFeed.setAttribute('disabled', '');
    axios.get(urlProxy).then((result) => {
      state.feedsUrl.push(feedUrl);
      const { items, channelTitle, description } = parse(result.data);
      state.feeds.channels.push({ channelTitle, description });
      state.feeds.articles.push(...items);
    }).catch((error) => {
      state.errorMessage = error.message;
    });
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
    channelsRender(state.feeds.channels);
    articlesRender(state.feeds.articles);
    $(document).ready(() => {
      $('.modalBtn').click((e) => {
        const articleTitle = e.target.previousElementSibling.textContent;
        const article = state.feeds.articles.filter(({ title }) => title === articleTitle);
        const desc = article[0].articleDescription;
        $('.modal-window').find('.modal-body p').text(desc);
        $('.modal-window').modal('show');
      });
    });
  });

  watch(state, 'errorMessage', () => {
    $(document).ready(() => {
      $('.jumbotron').find('.text-danger').text(state.errorMessage);
    });
  });
};
