import base from './base';
import Page from '../utils/Page';

/**
 *  地址服务类
 */
export default class address extends base {
  /**
   * 返回分页对象
   */
  static page () {
    const url = `${this.baseUrl}/addresses`;
    return new Page(url, this._processAddress.bind(this));
  }
  /**
   * 返回可用地址
   */
  static available (goodsList) {
    const url = `${this.baseUrl}/addresses/available`;
    return this.post(url, goodsList).then(data => {
      return data.map(this._processAddress.bind(this));
    }).then(data => {
      const available = [];
      const disable = [];
      data.forEach(item => {
        if (item.available) {
          available.push(item);
        } else {
          disable.push(item);
        }
      });
      return {available, disable};
    });
  }
  /**
   * 返回默认的可用地址
   */
  static async defaultAvailable (goodsList) {
    const {available} = await this.available(goodsList);
    if (available == null || available.length < 1) {
      return null;
    }
    const address = available.find(item => item.isDefault == 1);
    if (address) {
      return this._processAddress(address);
    } else {
      return this._processAddress(available[0]);
    }
  }
  /**
   * 新增地址
   */
  static save (address) {
    const url = `${this.baseUrl}/addresses`;
    return this.post(url, address);
  }
  /**
   * 更新地址对象
   */
  static update (addrId, address) {
    const url = `${this.baseUrl}/addresses/${addrId}`;
    return this.put(url, address);
  }
  /**
   * 获取地址对象
   */
  static info (addrId) {
    const url = `${this.baseUrl}/addresses/${addrId}`;
    return this.get(url, address).then(data => {
      data.location = data.fullAddress.replace(data.detail, '');
      return data;
    });
  }
  /**
   * 设置默认
   */
  static setDefault (id) {
    const url = `${this.baseUrl}/addresses/${id}/default`;
    return this.put(url);
  }
  /**
   * 删除地址对象
   */
  static remove (id) {
    const url = `${this.baseUrl}/addresses/${id}`;
    return this.delete(url);
  }
  /**
   * 处理地址数据
   */
  static _processAddress (data) {
    if (data) {
      const {fullAddress, province, city, country} = data;
      data.simpleAddress = fullAddress.replace(province, '').replace(city, '').replace(country, '');
      data.sexText = '';
      if (data.sex == 1) {
        data.sexText = '先生';
      } else if (data.sex == 2) {
        data.sexText = '女士';
      }
    }
    return data;
  }
}
