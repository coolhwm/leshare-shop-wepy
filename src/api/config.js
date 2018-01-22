
import base from './base';
import goods from './goods';
import shop from './shop';

export default class config extends base {
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
      const {card, member} = config;
      config.discount = this.processDiscount(card, member);
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
   * 处理折扣率
   */
  static processDiscount(card, member) {
    if (member == null || card == null) {
      return null;
    }
    if (card.supplyDiscount != 1) {
      return null;
    }
    // 计算折扣
    const {discountRule, customDiscount} = member;
    if (discountRule == null) {
      return null;
    }
    let discount = 100;
    if (customDiscount > 0 && customDiscount <= 100) {
      // 自定义折扣
      discount = customDiscount;
    } else if (discountRule != null && discountRule.discount < 100) {
      // 等级折扣
      discount = discountRule.discount;
    }
    // 判断异常情况
    if (discount == null || discount >= 100 || discount <= 0) {
      return null;
    }
    const {discountCategoryLists} = discountRule;
    if (discountCategoryLists == null || discountCategoryLists.length < 1) {
      return null;
    }
    const categories = discountRule.discountCategoryLists.map(item => item.categoryId);
    return {
      level: discountRule.levelName,
      categories,
      rate: discount
    };
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
}
