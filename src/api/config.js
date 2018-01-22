
import base from './base';
import goods from './goods';
import shop from './shop';
import member from './member';

export default class config extends base {
  static fieldsToCopy = {
    SWIPER: ['height'],
    IMAGE_BOX: ['heigth', 'width', 'isTitle'],
    GOODS_BOX: ['isCart', 'isPrice', 'isGoodsName', 'isSales', 'skuMode', 'isTips']
  };
  /**
   * 获取店铺完整配置信息
   */
  static init () {
    const url = `${this.baseUrl}/shops/full`;
    return this.get(url).then(data => {
      return {
        page: this._processPage(data.homePageConfig),
        categories: goods._createGoodsCategories(data.goodsInnerCategories),
        card: data.memberCard,
        member: data.member,
        notices: shop._processNotices(data.notices),
        reduce: shop._processReduce(data.reduceRules),
        shop: shop._processInfo(data.shop),
        version: shop._precoessVersion(data.shopChargeLimit),
        status: shop._processStatus(data.shopStatusInfo),
        campaign: data.campaignCoupon
      };
    }).then(config => {
      const {card, member: info} = config;
      config.discount = member.processDiscount(card, info);
      return config;
    });
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
      .map(component => {
        // 先处理参数合并
        if (component.param) {
          const param = JSON.parse(component.param);
          Object.assign(component, param);
          component.param = null;
        }
        // 处理内嵌数据
        if (component.data) {
          component.data = JSON.parse(component.data);
        }
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
    const {data, type} = component;
    const fields = this.fieldsToCopy[type];
    if (fields != null) {
      data.forEach(item => {
        fields.forEach(field => {
          item[field] = component[field];
        });
      });
    }
    return component;
  }
}
