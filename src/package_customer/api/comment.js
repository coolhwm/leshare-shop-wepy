import base from '../../api/base';
import Page from '../../utils/Page';

export default class comment extends base {
  /**
   * 买家自己商品评论列表
   */
  static list() {
    const url = `${this.baseUrl}/comments/list`;
    return new Page(url, this._processGoodsComment.bind(this));
  }
  /**
   * 处理评价列表数据
   */
  static _processGoodsComment (data) {
    const comment = {};
    comment.createTime = data.createTime.substring(0, 10);
    comment.starArr = [0, 0, 0, 0, 0];
    for (let i = 0; i < data.star; i++) {
      comment.starArr[i] = 1;
    }
    comment.star = data.star;
    if (data.customer) {
      comment.avatar = data.customer.avatarUrl;
      comment.nickName = data.customer.nickName;
    } else {
      comment.avatar = '/images/icons/customer.png';
      comment.nickName = '微信用户';
    }

    comment.comment = data.comment;
    if (data.goods !== null) {
      comment.goods_image = data.goods.images[0].url;
      comment.goods_name = data.goods.name;
    }
    return comment;
  }
}
