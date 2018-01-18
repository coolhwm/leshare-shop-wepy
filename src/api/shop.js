
import base from './base';
import goods from './goods';
import wepy from 'wepy';
import Page from '../utils/Page';

export default class shop extends base {
  static TYPE = {
    '1': {
      key: '1',
      name: '在线商城',
      badgeText: '商城',
      basicName: '商品展示',
      basicBadgeText: '商城'
    },
    '2': {
      key: '2',
      name: '点外卖',
      badgeText: '外卖',
      basicName: '在线菜单',
      basicBadgeText: '菜单'
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
   * 获取店铺完整配置信息
   */
  static config () {
    const url = `${this.baseUrl}/shops/full`;
    return this.get(url).then(data => {
      return [{
        key: 'page',
        value: this._processPage(data.globalConfig)
      },
      {
        key: 'categories',
        value: this._createGoodsCategories(data.goodsInnerCategories)
      },
      {
        key: 'card',
        value: data.memberCard
      },
      {
        key: 'notices',
        value: this._processNotices(data.notices)
      },
      {
        key: 'reduce',
        value: this._processReduce(data.reduceRules)
      },
      {
        key: 'shop',
        value: this._processInfo(data.shop)
      },
      {
        key: 'version',
        value: this._precoessVersion(data.shopChargeLimit)
      },
      {
        key: 'status',
        value: this._processStatus(data.shopStatusInfo)
      }]
    });
  }

  /**
   * 获取店铺信息
   */
  static async info() {
    const url = `${this.baseUrl}/shops`;
    return await this.get(url).then(data => this._processInfo(data));
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
    return this.get(url).then(data => this._processStatus(data));
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
  static notices() {
    const url = `${this.baseUrl}/notices`;
    return this.get(url).then(data => this._processNotices(data));
  }
  /**
   * 查询满减信息
   */
  static reduces() {
    const url = `${this.baseUrl}/reduce_rule`;
    return this.get(url).then(data => this._processReduce(data));
  }
  /**
   * 查询版本及配额信息
   */
  static chargeLimit () {
    const url = `${this.baseUrl}/shop_charge_limit`;
    return this.get(url).then(data => this._precoessVersion(data));
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
  /**
   * 签到记录信息
   */
  static signList(memberId) {
    const url = `${this.baseUrl}/member_sign?member_id=${memberId}`;
    return this.get(url);
  }
  /**
   * 签到
   */
  static sign(memberId) {
    const url = `${this.baseUrl}/member_sign?member_id=${memberId}`;
    return this.post(url);
  }
  /**
   * 签到历史记录
   */
  static signHistory() {
    const url = `${this.baseUrl}/member_sign/history`;
    return new Page(url, this._processSignData.bind(this));
  }

  // *** 数据处理方法
  /**
   * 处理页面
   */
  static _processPage(data) {
    const config = JSON.parse(data);
    const components = this.processComponents(config.components);
    const plugins = this.processPlugins(config.plugins);
    return {
      components, plugins
    }
  }

  /**
   * 处理页面的插件
   */
  static processPlugins (plugins) {
    return plugins;
  }

  /**
   * 处理页面的组件
   */
  static processComponents (components) {
    return components
      .filter(component => component.display !== false)
      .map(component => {
        // 需要处理商品信息
        if (component.type == 'GOODS_BOX') {
          component.data = component.data.map(item => goods._processGoodsDetail(item));
        }
        return this.copyParamToData(component);
      });
  }

  /**
   * 拷贝配置参数
   */
  static copyParamToData(component) {
    const fieldsToCopy = {
      SWIPER: ['height'],
      IMAGE_BOX: ['heigth', 'width', 'isTitle'],
      GOODS_BOX: ['isCart', 'isPrice', 'isName', 'isSales', 'skuMode', 'isTips']
    };
    const {data, type} = component;
    const fields = fieldsToCopy[type];
    if (fields != null) {
      data.forEach(item => {
        fields.forEach(field => {
          item[field] = component[field];
        });
      });
    }
    return component;
  }
  /**
   * 处理基本信息
   */
  static _processInfo(data) {
    data.type = this.type();
    return data;
  }
  /**
   * 处理状态
   */
  static _processStatus(data) {
    if (data.beginTime == null || data.endTime == null) {
      return;
    }
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
   * 处理版本
   */
  static _precoessVersion(data) {
    if (data == null) {
      // 没有初始化收费配置的情况下，开启所有权限
      return {
        isMember: true,
        isOrder: true
      }
    } else {
      const version = data.chargeVersion;
      data.isMember = [2, 3, 6, 7].some(value => value == version);
      data.isOrder = [4, 5, 6, 7].some(value => value == version);
      return data;
    }
  }
  /**
   * 处理满减
   */
  static _processReduce(data) {
    data.forEach(item => {
      item.showText = `满${item.limitPrice}减${item.fee}`;
    });
    const showText = data.map(v => v.showText).join(',');
    return {
      list: data, showText
    }
  }
  /**
   * 处理公告
   */
  static _processNotices(data) {
    return data == null || data.length < 1 ? [{ content: '暂无公告' }] : data;
  }
  /**
   * 处理签到历史记录数据
   */
  static _processSignData(item) {
    const sign = {};
    sign.createTime = item.createTime;
    if (item.bonusType == 0) {
      sign.typeDesc = '积分';
      sign.addBonus = item.bonusResult;
    } else {
      sign.typeDesc = '优惠券';
      sign.couponName = item.coupon.name;
    }
    sign.orderId = 0;
    return sign;
  }

  // *** 整合数据的外部处理方法
  static _createGoodsCategories (data) {
    const list = [];
    list.push({
      id: '-1',
      title: '推荐'
    });

    if (data != null) {
      list.push(...data.map(item => {
        return {
          id: item.id,
          title: item.name
        };
      }));
    }
    return {
      list: list,
      selectedId: '-1',
      scroll: false
    };
  }
}
