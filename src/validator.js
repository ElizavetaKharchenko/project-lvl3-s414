import isURL from 'validator/lib/isURL';

export default (value, array) => {
  const result = {
    state: 'invalid',
    error: '',
  };

  if (array.length > 0 && array.includes(value)) {
    result.error = 'alreadyExist';
  } else if (!isURL(value)) {
    result.error = 'invalidUrl';
  } else {
    result.state = 'valid';
    result.error = '';
  }
  return result;
};
