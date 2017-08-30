import base from './base';
import Page from '../utils/Page';
const QQMap = require('../utils/QQMap.js');

/**
 * 购物车服务类
 */
export default class address extends base {
  /**
   * QQ地图API
   */
  static map = new QQMap({
    key: 'TRZBZ-TSJ3U-ROQVP-4EMUK-EQA52-V5FWT'
  });

  /**
   * 地址逆解析
   */
  static reverse(latitude, longitude) {
    this.map.reverseGeocoder({
      location: {
        latitude: 39.984060,
        longitude: 116.307520
      },
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  }

  /**
   * 返回分页对象
   */
  static page () {
    const url = `${this.baseUrl}/addresses`
    return new Page(url, this._processAddress.bind(this))
  }

  /**
   * 新增地址
   */
  static save (address) {
    const url = `${this.baseUrl}/addresses`
    return this.post(url, address)
  }

  /**
   * 更新地址对象
   */
  static update (addrId, address) {
    const url = `${this.baseUrl}/addresses/${addrId}`
    return this.put(url, address)
  }

  /**
   * 设置默认
   */
  static setDefault (id) {
    const url = `${this.baseUrl}/addresses/${id}/default`
    return this.put(url)
  }

  /**
   * 获取默认
   */
  static getDefault () {
    const url = `${this.baseUrl}/addresses/default`
    return this.get(url).then(data => data != '' ? data : this.getFirstAddress())
  }

  /**
   * 获取第一个地址
   */
  static getFirstAddress () {
    const url = `${this.baseUrl}/addresses`
    return this.get(url).then(data => data.length > 0 ? data[0] : Promise.reject('NO_ADDRESS'))
  }

  /**
   * 删除地址对象
   */
  static remove (id) {
    const url = `${this.baseUrl}/addresses/${id}`
    return this.delete(url)
  }

  /**
   * 选择微信地址
   */
  static wxAddress () {
    return new Promise((resolve, reject) => {
      wx.chooseAddress({
        success: data => {
          resolve({
            name: data.userName,
            phone: data.telNumber,
            province: data.provinceName,
            city: data.cityName,
            country: data.countyName,
            detail: data.detailInfo,
            isDefault: 0
          })
        },
        fail: reject
      })
    })
  }

  /**
   * 处理地址数据
   */
  static _processAddress (data) {
    return data.data
  }
}
