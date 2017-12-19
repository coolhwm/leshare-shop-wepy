import { getStore } from 'wepy-redux';
import { SAVE } from './types/shop';
import shop from '../api/shop';
import goods from '../api/goods';
import coupon from '../api/coupon';
import member from '../api/member';
import card from '../api/member_card';
const store = getStore();

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
    'reduce',
    'recommend'
  );
};

/**
 * 声明使用数据
 */
const use = async (...fields) => {
  console.info(`use store: fields=${fields}`);
  fields.forEach(async field => {
    if (exists(field)) return;
    // 异步保存
    fetch(field).then(data => {
      save(field, data);
    })
  });
};

/**
 * 刷新数据
 */
const reflesh = async (...fields) => {
  console.info(`reflesh store: fields=${fields}`);
  fields.forEach(async field => {
    // 异步保存
    fetch(field).then(data => {
      save(field, data);
    })
  });
};

/**
 * 加载数据， 返回Promise
 */
const fetch = (field) => {
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
  return state.shop[key] != null;
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
