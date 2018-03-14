import base from './base'
import Page from '../utils/Page'

/**
 * 商品历史
 */
export default class history extends base {
  /**
   * 返回分页对象
   */
  static page() {
    const url = `${this.baseUrl}/visit_goods_log`;
    return new Page(url, this._processFavGoods.bind(this));
  }

  /**
   * 移除访问记录
   */
  static remove(goodsId) {
    const url = `${this.baseUrl}/visit_goods_log?goodsId=${goodsId}`;
    return this.delete(url);
  }

  /**
   * 数据处理
   */
  static _processFavGoods(data) {
    return {
      goodsId: data.goodsId,
      goodsName: data.goods.name,
      goodsPrice: data.goods.sellPrice.toFixed(2),
      imageUrl: this._processGoodsPreview(data.goods.images)
    };
  }

  /**
   * 处理预览图
   */
  static _processGoodsPreview(images) {
    // 图片处理
    if (images == null || images.length < 1) {
      return '/images/goods/broken.png';
    }
    else if (images[0].url == null) {
      return '/images/goods/broken.png';
    }
    else {
      return images[0].url + '/small';
    }
  }
}
