import base from './base'
import Page from '../utils/Page'

/**
 * 收藏服务类
 */
export default class favorite extends base {
  /**
   * 返回分页对象
   */
  static page() {
    const url = `${this.baseUrl}/favorite_goods`;
    return new Page(url, this._processFavGoods.bind(this));
  }

  /**
   * 判断是否为收藏商品
   */
  static is(goodsId) {
    const url = `${this.baseUrl}/favorite_goods/check`;
    const param = {goodsId: goodsId};
    return this.get(url, param);
  }

  /**
   * 增加收藏
   */
  static add(goodsId) {
    const url = `${this.baseUrl}/favorite_goods`;
    const param = { goodsId: goodsId };
    return this.post(url, param);
  }

  /**
   * 增加收藏
   */
  static addBatch(goodsIdList) {
    const url = `${this.baseUrl}/favorite_goods/batch`;
    return this.post(url, goodsIdList);
  }

  /**
   * 移除收藏
   */
  static remove(goodsId) {
    const url = `${this.baseUrl}/favorite_goods`;
    const param = { goodsId: goodsId };
    return this.delete(url, param);
  }

  /**
   * 数据处理
   */
  static _processFavGoods(data) {
    if (data.goods == null) {
      return;
    }
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
    } else if (images[0].url == null) {
      return '/images/goods/broken.png';
    } else {
      return images[0].url + '/small';
    }
  }
}
