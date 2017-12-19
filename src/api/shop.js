
import base from './base';
import wepy from 'wepy';

export default class shop extends base {
  static TYPE = {
    '1': {
      name: '在线商城',
      badgeText: '商城'
    },
    '2': {
      name: '点外卖',
      badgeText: '外卖'
    }
  };

  /**
   * 访问店铺
   */
  static visit(customScene, scene) {
    const url = `${this.baseUrl}/visit_shops`;
    wepy.getSystemInfo().then(res => {
      res.customScene = customScene;
      res.scene = scene;
      return this.post(url, res);
    }).then(_ => {});
  }
  /**
   * 获取店铺信息
   */
  static async info() {
    const url = `${this.baseUrl}/shops`;
    return await this.get(url).then(data => {
      data.type = this.type();
      return data;
    });
  }

  /**
   * 获取店铺类型
   */
  static type() {
    const type = wepy.$instance.globalData.shopType;
    return this.TYPE[type];
  }
  /**
   * 获取店铺状态
   */
  static async getStatus() {
    const url = `${this.baseUrl}/shops/status`;
    const data = await this.get(url);
    // 文本转换
    data.timeText = `周一至周日 ${data.beginTime}至${data.endTime}`;
    if (data.status == 'CLOSE') {
      data.closeTips = '店铺已休息，请稍后再来';
    } else if (data.status == 'NORMAL' && !data.open) {
      data.closeTips = '店铺已休息，请稍后再来';
      // data.closeTips = `店铺已休息，营业时间：${data.beginTime} - ${data.endTime}`;
    }
    return data;
  }

  /**
   * 判断店铺是否营业
   */
  static async isStatusOpen() {
    const url = `${this.baseUrl}/shops/status`;
    const {open} = await this.get(url);
    return open;
  }

  /**
   * 获取店铺公告（第一个）
   */
  static async notices() {
    const url = `${this.baseUrl}/notices`;
    const data = await this.get(url);
    return data == null || data.length < 1 ? [{ content: '暂无公告' }] : data;
  }
  /**
   * 查询满减信息
   */
  static reduces() {
    const url = `${this.baseUrl}/reduce_rule`;
    return this.get(url).then(data => {
      data.forEach(item => {
        item.showText = `满${item.limitPrice}减${item.fee}`;
      });
      const showText = data.map(v => v.showText).join(',');
      return {
        list: data, showText
      }
    });
  }

  /**
   * 上报FORM
   */
  static reportFormId(id, delay = 3000) {
    try {
      const url = `${this.baseUrl}/visit_shops/form_id`;
      const param = [{
        formId: id
      }];
      if (delay > 0) {
        setTimeout(() => {
          this.post(url, param, false);
        }, delay);
      } else {
        this.post(url, param, false);
      }
    } catch (e) {
      console.warn('formid上报错误', e);
    }
  }
}
