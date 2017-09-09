import base from './base';
import Page from '../utils/Page';
const QQMap = require('../utils/QQMap.js');

/**
 * 购物车服务类
 */
export default class address extends base {
  static API_KEY = 'TRZBZ-TSJ3U-ROQVP-4EMUK-EQA52-V5FWT';

  static API_REGION = '福州市';

  /**
   * QQ地图API
   */
  static map = new QQMap({
    key: 'TRZBZ-TSJ3U-ROQVP-4EMUK-EQA52-V5FWT'
  });

  /**
   * 地址检索
   */
  static search(keyword) {
    return new Promise((resolve, reject) => {
      this.map.search({
        boundary: `region(${this.API_REGION},0)`,
        keyword: keyword,
        success: ({data}) => {
          const result = [];
          data.forEach(poi => {
            const address = this.processPOI(poi);
            result.push(address);
          });
          resolve(result);
        },
        fail: function(res) {
          reject(res);
        }
      });
    });
  }

  /**
   * 地址逆解析
   */
  static reverse(latitude, longitude) {
    return new Promise((resolve, reject) => {
      this.map.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        get_poi: 1,
        poi_options: 'policy=2',
        success: ({result}) => {
          const current = {}
          console.info(result);
          // 当前地址文本
          current.display = result.formatted_addresses.recommend;
          current.province = result.ad_info.province;
          current.city = result.ad_info.city;
          current.country = result.ad_info.district;
          current.town = result.address_reference.town.title;
          current.address = result.address;
          current.detail = result.address + current.display;
          current.latitude = result.location.lat;
          current.longitude = result.location.lng;
          // 附近的POI
          const nearby = [];
          const pois = result.pois;
          pois.forEach(poi => {
            const address = this.processPOI(poi);
            address.town = current.town;
            nearby.push(address);
          });
          resolve({current, nearby});
        },
        fail: function(res) {
          reject(res);
        }
      });
    });
  }

  /**
   * 处理POI数据
   */
  static processPOI(poi) {
    const address = {};
    address.display = poi.title;
    address.province = poi.ad_info.province;
    address.city = poi.ad_info.city;
    address.country = poi.ad_info.district;
    address.detail = poi.address + poi.title;
    address.latitude = poi.location.lat;
    address.longitude = poi.location.lng;
    address.address = poi.address;
    return address;
  }
  /**
   * 返回分页对象
   */
  static page () {
    const url = `${this.baseUrl}/addresses`
    return new Page(url, this._processAddress.bind(this))
  }

  /**
   * 返回可用地址
   */
  static available (goodsList) {
    const url = `${this.baseUrl}/addresses/available`
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
      })
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
   * 获取地址对象
   */
  static info (addrId) {
    const url = `${this.baseUrl}/addresses/${addrId}`
    return this.get(url, address).then(data => {
      data.location = data.fullAddress.replace(data.detail, '');
      return data;
    });
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
    return this.get(url).then(data => data != '' ? this._processAddress(data) : this.getFirstAddress());
  }

  /**
   * 获取第一个地址
   */
  static getFirstAddress () {
    const url = `${this.baseUrl}/addresses`
    return this.get(url).then(data => data.length > 0 ? this._processAddress(data[0]) : Promise.reject('NO_ADDRESS'))
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
