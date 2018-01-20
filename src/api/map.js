
const QQMap = require('../utils/QQMap.js');

/**
 * QQ地图解析类  TODO 需要重构到服务端
 */
export default class map {
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
  static search (keyword) {
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
        fail: function (res) {
          reject(res);
        }
      });
    });
  }

  /**
   * 地址逆解析
   */
  static reverse (latitude, longitude) {
    return new Promise((resolve, reject) => {
      this.map.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        get_poi: 1,
        poi_options: 'policy=2',
        success: ({result}) => {
          const current = {};
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
        fail: function (res) {
          reject(res);
        }
      });
    });
  }

  /**
   * 处理POI数据
   */
  static processPOI (poi) {
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
}
