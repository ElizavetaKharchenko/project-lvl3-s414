import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import $ from 'jquery';
import _ from 'lodash/fp';
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
  // const proxyCors = 'https://cors-anywhere.herokuapp.com/';
  // const proxyCors = 'https://crossorigin.me/';
  const proxyCors = 'http://cors.io/?';
  const formAddFeed = document.querySelector('#formAddFeed');


  const update = () => {
    if (state.feedsUrl.length === 0) {
      return;
    }
    const promises = state.feedsUrl.map(url => axios.get(`${url}`)); // ${proxyCors}
    axios.all(promises)
      .then((response) => {
        const newFeeds = response.map((res) => {
          const { items } = parse(res.data);
          return items.filter(item => !state.feeds.articles.some(_.isEqual(item)));
        }).flat();
        console.log(newFeeds);
        state.feeds.articles.push(...newFeeds);
        setTimeout(update, 5000);
      }).catch(() => {
        setTimeout(update, 5000);
      });
  };


  input.addEventListener('input', (e) => {
    state.inputValue = e.target.value;
    if (state.inputValue === '') {
      input.value = '';
      state.inputState = 'empty';
      state.errorMessage = '';
    } else {
      const validation = validate(state.inputValue, state.feedsUrl);
      state.inputState = validation.state;
      state.errorMessage = validation.error;
    }
  });

  formAddFeed.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedUrl = state.inputValue;
    // const urlProxy = `${proxyCors}${feedUrl}`;
    const urlProxy = `${feedUrl}`;
    state.submitted = true;
    axios.get(urlProxy).then((result) => {
      state.feedsUrl.push(feedUrl);
      const { items, channelTitle, description } = parse(result.data);
      state.feeds.channels.push({ channelTitle, description });
      state.feeds.articles.push(...items);
      state.submitted = false;
      state.inputState = 'empty';
    }).catch((error) => {
      console.log(error);
      state.errorMessage = error.message;
      state.submitted = false;
    }).finally(() => setTimeout(update, 5000));
  });

  watch(state, 'inputState', () => {
    if (state.inputState === 'empty') {
      input.classList.remove('is-invalid');
      input.classList.remove('is-valid');
      btnAddFeed.setAttribute('disabled', '');
      input.value = '';
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

  watch(state, 'submitted', () => {
    if (state.submitted) {
      btnAddFeed.setAttribute('disabled', '');
      input.setAttribute('disabled', '');
    } else {
      btnAddFeed.removeAttribute('disabled', '');
      input.removeAttribute('disabled', '');
    }
  });
};
