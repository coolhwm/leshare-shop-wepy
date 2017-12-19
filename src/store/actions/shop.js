import shop from '../../api/shop';
import { UPDATE } from '../types/shop';
import { createAction } from 'redux-actions';
import { getStore } from 'wepy-redux'

const store = getStore();

export const updateStore = key => {
  const promise = createPromise(key);
  store.dispatch(createAction(UPDATE, () => {
    return promise.then(data => {
      return {
        key: key,
        value: data
      }
    })
  })());
};

const createPromise = key => {
  return shop.info();
};
