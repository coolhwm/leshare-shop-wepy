import base from '../../api/base';
import Page from '../../utils/Page';
import wepy from 'wepy'

export default class invite extends base {
  /**
   * 查询邀请列表
   */
  static page () {
    let url = `${this.baseUrl}/members/invite/list`;
    return new Page(url, this._processInvite.bind(this));
  }
  /**
   * 查询邀请人数
   */
  static count () {
    const url = `${this.baseUrl}/members/invite/count/detail`;
    return this.post(url);
  }
  static _processInvite(data) {
    if (data.inviteeCustomer == null) {
      data.inviteeCustomer = {
        nickName: '微信好友',
        avatarUrl: 'http://img.leshare.shop/shop/other/customer_white.png'
      }
    }
  }
  /**
   * 查看海报
   */
  static async poster() {
    const url = `${this.baseUrl}/members/invite/poster`;
    const data = await wepy.downloadFile({
      url: url
    });
    if (data.statusCode == 200) {
      return data.tempFilePath;
    } else {
      return null;
    }
  }
}
