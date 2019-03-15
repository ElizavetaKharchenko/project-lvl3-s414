import isURL from 'validator/lib/isURL';

export default (value, array) => {
  const result = {
    state: 'invalid',
    error: '',
  };

  if (array.length > 0 && array.includes(value)) {
    result.error = 'URL already exists';
  } else if (!isURL(value)) {
    result.error = 'URL is invalid';
  } else {
    result.state = 'valid';
    result.error = '';
  }
  return result;
};
