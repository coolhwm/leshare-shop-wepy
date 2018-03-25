import base from './base';
import Page from '../utils/Page';

/**
 * 商品服务类
 */
export default class goods extends base {
  /**
   * 获取推荐
   */
  static recommend () {
    let url = `${this.baseUrl}/goods/recommend`;
    return new Page(url, item => {
      this._processGoodsData(item);
    });
  }

  /**
   * 新的分页方法
   */
  static list (discount) {
    let url = `${this.baseUrl}/goods/list`;
    return new Page(url, item => {
      this._processGoodsDiscount(item, discount);
      this._processGoodsData(item);
    });
  }

  /**
   * 获取商品库存
   */
  static stock (goodsId, sku = '') {
    const url = `${this.baseUrl}/goods/${goodsId}/stock?sku=${sku}`;
    return this.get(url).then(data => data.stock);
  }

  /**
   * 查询商品目录
   */
  static categories (pid = 0) {
    const url = `${this.baseUrl}/goods/inner_category`;
    return this.get(url).then(data => this._createGoodsCategories(data));
  }

  /**
   * 查询商品详情
   */
  static getInfo (goodsId, discount) {
    const url = `${this.baseUrl}/goods/${goodsId}`;
    return this.get(url, {}).then(data => {
      this._processGoodsDiscount(data, discount);
      return this._processGoodsDetail(data)
    });
  }

  /** ********************* 数据处理方法 ***********************/

  static _createGoodsCategories (data) {
    const list = [];
    if (data != null) {
      list.push(...data.map(item => {
        return {
          id: item.id,
          title: item.name
        };
      }));
    }
    const selectedId = list.length > 0 ? list[0].id : null;
    return {
      list,
      selectedId,
      scroll: false
    };
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

    // 处理运费
    this._processGoodsPostFeeText(detail);
    return detail;
  }

  /**
   * 处理折扣价格
   */
  static _processGoodsDiscount(goods, discount) {
    const isDiscount = discount != null ? discount.categories.some(cid => cid == goods.innerCid) : false;
    if (!isDiscount) {
      return;
    }
    const rate = discount.rate / 100;
    const isSku = goods.goodsSkuInfo;
    if (isSku) {
      // 多规格数据处理
      const skuList = goods.goodsSkuInfo.goodsSkuDetails;
      skuList.forEach(item => {
        const detail = item.goodsSkuDetailBase;
        const price = detail.price;
        // 最低的价格作为原价
        if (item.originalPrice == null || price < item.originalPrice) {
          item.originalPrice = price;
        }
        // 设置原价和当前价格
        detail.originalPrice = price;
        detail.price = (price * rate).toFixed(2);
      });
    } else {
      // 单规格数据处理
      goods.originalPrice = goods.sellPrice;
      goods.sellPrice = (goods.sellPrice * rate).toFixed(2);
    }
    // 折扣文本展现
    goods.discountRate = discount.rate / 10 + '折';
    goods.discountText = `会员折扣`;
    goods.discount = true;
  }

  /**
   * 处理运费信息
   */
  static _processGoodsPostFeeText (detail) {
    const fee = detail.postFee;
    let feeText = '';
    if (!fee || fee == 0) {
      feeText = '配送：免运费';
    } else {
      feeText = `同城配送：￥${fee} (支持自提)`;
    }
    detail.feeText = feeText;
  }

  /**
   * 处理价格商品区间
   */
  static _processGoodsPriceRange (detail) {
    if (!detail.goodsSkuInfo || !detail.goodsSkuInfo.goodsSkuDetails) {
      return;
    }
    const skuDetails = detail.goodsSkuInfo.goodsSkuDetails;
    let maxPrice = 0;
    let minPrice = Number.MAX_VALUE;

    for (let i in skuDetails) {
      const detail = skuDetails[i].goodsSkuDetailBase;
      maxPrice = Math.max(detail.price, maxPrice);
      minPrice = Math.min(detail.price, minPrice);
    }
    detail.maxPrice = maxPrice;
    detail.minPrice = minPrice;
  }

  /**
   * 处理价格展现标签 / 需要先调用区间处理
   */
  static _processGoodsPriceLabel (detail) {
    let priceLable = detail.sellPrice;

    if (detail.maxPrice && detail.minPrice) {
      // priceLable = `${detail.minPrice}~${detail.maxPrice}`;
      priceLable = detail.minPrice;
    }
    detail.priceLable = isNaN(detail.priceLable) ? priceLable : priceLable.toFixed(2);
  }

  /**
   * 处理SKU标签
   */
  static _processSkuLable (detail) {
    const skuInfo = detail.goodsSkuInfo;
    if (!skuInfo) {
      return;
    }

    const skuLabels = [];
    for (let i = 1; i <= 3; i++) {
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
    detail.labels = skuLabels;
  }

  /**
   * 处理商品信息
   */
  static _processGoodsData (item) {
    // 结构赋值
    const {name, sellPrice, originalPrice} = item;

    // 长名字处理
    if (name.length > 12) {
      item.simple_name = name.substring(0, 12) + '...';
    }
    // 长名字处理
    if (name.length > 30) {
      item.name = name.substring(0, 30) + '...';
    }

    // 销售价处理
    if (originalPrice == null || originalPrice == 0) {
      item.originalPrice = sellPrice;
    }

    // 处理图片
    this._processGoodsPreview(item);
    this._processSkuLable(item);
    this._processGoodsPriceRange(item);
    this._processGoodsPriceLabel(item);
    this._processGoodsQuantity(item);
  }

  /**
   * 处理数量（已购买）
   */
  static _processGoodsQuantity (item) {
    item.num = 0;
  }

  /**
   * 处理预览图
   */
  static _processGoodsPreview (item) {
    const images = item.images;
    // 图片处理
    if (images == null || images.length < 1) {
      item.imageUrl = '/images/icons/broken.png';
    } else if (images[0].url == null) {
      item.imageUrl = '/images/icons/broken.png';
    } else {
      item.imageUrl = images[0].url + '/medium';
    }
  }
}
