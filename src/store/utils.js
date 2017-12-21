import { getStore } from 'wepy-redux';
import { SAVE } from './types/shop';
import shop from '../api/shop';
import goods from '../api/goods';
import coupon from '../api/coupon';
import member from '../api/member';
import card from '../api/member_card';
const store = getStore();
const meta = {};

/**
 * 构造取值器
 */
const get = key => {
  return (state) => {
    return state.shop[key]
  }
};

/**
 * 保存数据
 */
const save = (key, data) => {
  store.dispatch({
    type: SAVE,
    payload: {
      key: key,
      value: data
    }
  });
};

/**
 * 初始化
 */
const init = async () => {
  await use(
    'shop',
    'notices',
    'status',
    'categories',
    'ownCoupons',
    'pickCoupons',
    'card',
    'member',
    'reduce'
  );
};

/**
 * 加载指定字段的数据，并发加载，一次性返回，已经加载的数据不会再次加载
 */
const use = async (...fields) => {
  // 过滤已加载完毕的字段
  const fetchFileds = fields.filter(field => !exists(field));
  console.info(`use store: fields=${fetchFileds}`);
  // 加载未加载的数据
  await load(fetchFileds);
};

/**
 * 加载指定字段的数据
 */
const load = async (fields) => {
  // 将字段构造Promise
  const fetchPromises = fields.map(field => fetch(field));
  // 获取所有数据，等待最后一个返回
  const data = await Promise.all(fetchPromises);
  // 保存结果
  fields.forEach((field, index) => save(field, data[index]));
  // 保存元数据
  save('meta', meta);
};

/**
 * 刷新数据
 */
const reflesh = async (...fields) => {
  console.info(`reflesh store: fields=${fields}`);
  await load(fields);
};

/**
 * 加载数据， 返回Promise
 */
const fetch = (field) => {
  meta[field] = true;
  switch (field) {
    case 'shop':
      return shop.info();
    case 'notices':
      return shop.notices();
    case 'status' :
      return shop.getStatus();
    case 'categories' :
      return goods.categories();
    case 'ownCoupons' :
      return coupon.own();
    case 'pickCoupons' :
      return coupon.list();
    case 'card' :
      return card.info();
    case 'member' :
      return member.info();
    case 'reduce' :
      return shop.reduces();
    case 'recommend' :
      return goods.page(true).next();
  }
};

/**
 * 判断是否存在
 */
const exists = key => {
  const state = store.getState();
  return state.shop[key] != null && meta[key] != null;
};

/**
 * 取出数据
 */
// const get = (key, promise) => {
//   if (!exists(key)) {
//     promise.then(data => {
//       save(key, data);
//     });
//   }
//   return createGetter(key);
// };

export default {get, save, use, reflesh, init}
