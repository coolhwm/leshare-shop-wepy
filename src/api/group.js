import base from './base';
import wepy from 'wepy';
import Page from '../utils/Page';

export default class group extends base {
  /***
   * 根据拼团商品规则ID查找拼团信息(商品)
   */
  static rules (ruleId) {
    const url = `${this.baseUrl}/goods_group/rules/${ruleId}`;
    return this.get(url).then(data => this._processGoodsDetail(data));
  }

  /***
   * 获取正在拼团信息
   */
  static processing (ruleId) {
    const url = `${this.baseUrl}/goods_group/processing?rule_id=${ruleId}`;
    return this.get(url).then(data => this._processGroupDetail(data));
  }

  /**
   * 处理商品详情
   */
  static _processGoodsDetail (detail) {
    // 解析预览图
    this._processGoodsPreview(detail);

    // 解析SKU规格
    this._processSkuLable(detail);

    // 处理价格范围区间
    this._processGoodsPriceRange(detail);

    // 处理价格标签
    this._processGoodsPriceLabel(detail);

    return detail;
  }

  /**
   * 处理预览图
   */
  static _processGoodsPreview (item) {
    const images = item.goods.images;
    // 图片处理
    if (images == null || images.length < 1) {
      item.goods.imageUrl = '/images/goods/broken.png';
    } else if (images[0].url == null) {
      item.goods.imageUrl = '/images/goods/broken.png';
    } else {
      item.goods.imageUrl = images[0].url + '/medium';
    }
  }

  /**
   * 处理SKU标签
   */
  static _processSkuLable (detail) {
    const skuInfo = detail.goods.goodsSkuInfo;
    if (!skuInfo) {
      return;
    }

    const skuLabels = [];
    for (let i = 1; i <= 5; i++) {
      const skuKey = skuInfo[`prop${i}`];
      const skuValueStr = skuInfo[`value${i}`];
      if (skuKey && skuValueStr) {
        const skuValues = skuValueStr.split(',');
        const sku = {
          key: skuKey,
          value: skuValues
        };
        skuLabels.push(sku);
      } else {
        break;
      }
    }
    detail.goods.labels = skuLabels;
  }

  /**
   * 处理价格商品区间
   */
  static _processGoodsPriceRange (detail) {
    if (!detail.goods.goodsSkuInfo || !detail.goods.goodsSkuInfo.goodsSkuDetails) {
      return;
    }
    const skuDetails = detail.goods.goodsSkuInfo.goodsSkuDetails;
    let maxPrice = 0;
    let minPrice = Number.MAX_VALUE;

    for (let i in skuDetails) {
      const detail = skuDetails[i].goodsSkuDetailBase;
      maxPrice = Math.max(detail.price, maxPrice);
      minPrice = Math.min(detail.price, minPrice);
    }
    detail.goods.maxPrice = maxPrice;
    detail.goods.minPrice = minPrice;
  }

  /**
   * 处理价格展现标签 / 需要先调用区间处理
   */
  static _processGoodsPriceLabel (detail) {
    let priceLable = detail.goods.sellPrice;

    if (detail.goods.maxPrice && detail.goods.minPrice) {
      // priceLable = `${detail.minPrice}~${detail.maxPrice}`;
      priceLable = detail.goods.minPrice;
    }
    detail.goods.priceLable = isNaN(detail.goods.priceLable) ? priceLable : priceLable.toFixed.toFixed(2);
  }

  /***
   * 拼团团长信息处理
   */
  static _processGroupDetail (detail) {
    // 筛选团长
    detail.forEach(item => {
      item.header = item.list.find(item => item.head === true);
    });

    // 处理开团时间
    // this._processGroupTime(detail);

    return detail
  }

  /***
   * 开团时间处理
   */
  static _processGroupTime (detail) {
    for (let item of detail) {
      let timer = setInterval(async () => {
        const time = new Date(item.groupTime) - new Date() + 1000 * 60 * 60 * 72;
        if (time > 0) {
          let hour = Math.floor(time / 3600000);
          let min = Math.floor((time / 60000) % 60);
          let sec = Math.floor((time / 1000) % 60);
          hour = hour < 10 ? '0' + hour : hour;
          min = min < 10 ? '0' + min : min;
          sec = sec < 10 ? '0' + sec : sec;
          item.time = {
            hour: hour,
            min: min,
            sec: sec
          };
        } else {
          clearInterval(timer);
        }
      }, 1000);
    }
  }
}
