import base from './base';
import wepy from 'wepy';
import Page from '../utils/Page';
import Lang from '../utils/Lang';

export default class shop extends base {

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
    return await this.get(url).then(data => this._processInfo(data));
  }
  /**
   * 获取店铺类型
   */
  static type() {
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
   * 上报FORM
   */
  static reportFormId(id, delay = 3000) {
    if (id == 'the formId is a mock one') {
      return;
    }
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
    return this.get(url).then(data => {
      if (data == null) {
        return;
      }
      data.today = data.lastDate == Lang.dateFormate(new Date(), 'yyyyMMdd');
      return data;
    });
  }
  /**
   * 签到
   */
  static sign(memberId) {
    const url = `${this.baseUrl}/member_sign?member_id=${memberId}`;
    return this.post(url)
  }
  /**
   * 签到历史记录
   */
  static signHistory() {
    const url = `${this.baseUrl}/member_sign/history`;
    return new Page(url, this._processSignData.bind(this));
  }

  /***
   * 归属门店列表
   */
  static subShopList() {
    const url = `${this.baseUrl}/shops/sub_shop_list`;
    const page = new Page(url, this._processSubShopData.bind(this));
    page.method = 'POST';
    return page;
  }

  /**
   * 新人专享的门店列表
   */
  static subNewShopList(param) {
    const url = `${this.baseUrl}/shops/sub_shop_list`;
    return this.post(url, param)
  }
  /***
   * 推荐归属门店列表
   */
  static RecommendationShopList() {
    const url = `${this.baseUrl}/shops/sub_shop_list?from=0&limit=5`;
    return this.post(url, {});
  }
  /***
   * 归属门店图文详情
   */
  static subShopDetail(subShopId) {
    const url = `${this.baseUrl}/shops/details?sub_shop_id=${subShopId}`;
    return this.get(url);
  }

  /***
   * 归属门店信息详情
   */
  static subShopInfo(subShopId) {
    const url = `${this.baseUrl}/shops/sub_shop/${subShopId}`;
    return this.get(url);
  }

  /***
   * 归属门店商品详情
   */
  static goodsList(subShopId) {
    const url = `${this.baseUrl}/goods/list?rel_shop_id=${subShopId}&is_new=1`;
    return this.get(url)
  }
  /***
   * 归属门店商品详情
   */
  static subShopGoodsList(subShopId) {
    const url = `${this.baseUrl}/goods/list?sub_shop_id=${subShopId}&is_new=1&from=0&limit=10&by=sales_volume`;
    return this.get(url).then(data => {
      data.forEach(item => {
        item.isPrice = true;
        item.isGoodsName = true;
      });
      return data
    })
  }
  /***
   * 归属门店标签
   */
  static subShopTag() {
    const url = `${this.baseUrl}/shops/shop_tag`;
    return this.get(url);
  }

  /***
   * 弹出框规则
   */
  static popupsRules() {
    const url = `${this.baseUrl}/popups/rules`;
    return this.get(url).then(data => {
      if (data) {
        data.targetId = data.target
        return data
      }
    });
  }

  /***
   * 更新弹出框
   */
  static popupsResults(resultId) {
    const url = `${this.baseUrl}/popups/results?result_id=${resultId}`;
    return this.post(url);
  }

  /***
   * 查当前累积情况
   */
  static benifit() {
    const url = `${this.baseUrl}/benefit/info`;
    return this.get(url);
  }

  // *** 数据处理方法
  /**
   * 处理基本信息
   */
  static _processInfo(data) {
    // data.type = this.type();
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
    }
    return data;
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

  /**
   * 筛选活动商家的商品
   */
  static grepActivityGoodsList(shops) {
    if (!shops) {
      return [];
    }
    const list = [];
    shops.forEach(shop => {
      if (shop.goodsList == null) {
        return;
      }
      shop.goodsList.filter(goods => goods.isTop).forEach(goods => {
        const result = {
          id: goods.id,
          imageUrl: goods.imageUrl,
          name: goods.simpleName,
          price: goods.price.toFixed(2),
          originalPrice: goods.originalPrice,
          areaTag: shop.areaTag,
          distance: shop.distance,
          goodsType: goods.goodsType,
          typeText: goods.typeText
        };
        // 处理积分商品
        if (goods.goodsType == 'BONUS') {
          result.price = goods.price.toFixed(0);
        }
        // 处理活动商品
        if (goods.rule) {
          result.price = goods.rule.price.toFixed(2);
          result.ruleId = goods.rule.ruleId;
        }
        // 如果是新客人，则优先显示，否则显示在最后面
        if (goods.goodsType == 'NEW_CUSTOMER') {
          if (this.orderCount > 1) {
            result.distance = 99999;
          } else {
            result.distance = 0;
          }
        }
        // 助力置顶
        if (goods.goodsType == 'ASSIST') {
          result.distance = 1;
        }
        list.push(result);
      });
    });
    // 根据距离排序
    list.sort((a, b) => a.distance - b.distance);
    // 取距离最近的前三个
    return list
  }
  /**
   * 处理子商户列表
   */
  static _processSubShopData(item) {
    // 处理标签
    this._processSubShopTags(item);
    // 处理赠送金规则
    this._processPointRule(item);
    // 处理商品
    if (item.goodsList && item.goodsList.length > 0) {
      // 商品信息处理
      item.goodsList.forEach(goods => {
        this._processSubShopGoods(goods);
      });
      // 商品排序
      item.goodsList.sort((a, b) => {
        return a.sord - b.sord;
      });
    }
  }

  /**
   * 处理子商户使用赠送金的规则
   */
  static _processPointRule(shop) {
    const rule = shop.memberPointRule;
    if (rule == null) {
      return;
    }
    const result = {};
    result.available = rule.available;
    // 规则当前生效
    if (rule.percent > 0) {
      result.useTips = `可抵${rule.percent}%`;
      // if (rule.perMax) {
      //   result.useTips += `,最多${rule.perMax}元`;
      // }
    } else if (rule.perMax > 0) {
      result.useTips = `可抵${rule.perMax}元`
    } else if (rule.percent == 0) {
      result.useTips = `可抵100%`;
    }
    // 规则当前失效
    const list = [];
    const now = new Date();
    if (rule.beginTime && new Date(rule.beginTime) > now) {
      list.push(`${rule.beginTime.substring(0, 11)}开始`);
    }
    if (rule.endTime && new Date(rule.endTime) > now) {
      list.push(`${rule.endTime.substring(0, 11)}前`);
    }
    if (rule.date) {
      list.push(`每月${rule.date}日`);
    } else if (rule.week) {
      list.push(`每周${rule.week}`);
    }
    if (rule.time) {
      list.push(`每日${rule.time}`);
    }
    if (list.length > 0) {
      result.limitTips = '限' + list.join(',') + '使用';
    } else {
      result.limitTips = '全天可用'
    }
    shop.memberPointRule = null;
    shop.point = result;
  }

  /**
   * 处理子商户标签
   */
  static _processSubShopTags(shop) {
    // 处理标签
    const tags = shop.tags;
    let areaTag, typeTag;
    if (tags.BUSSINESS_AREA && tags.BUSSINESS_AREA.length > 0) {
      areaTag = tags.BUSSINESS_AREA[0];
    } else {
      areaTag = '其他商圈';
    }
    if (tags.TAG && tags.TAG.length > 0) {
      typeTag = tags.TAG[0];
    } else {
      typeTag = '其他'
    }
    shop.areaTag = areaTag;
    // 活动标签
    shop.tagText = `${typeTag} | ${areaTag}`;
    if (tags.ACTIVITY && tags.ACTIVITY.length > 0) {
      shop.activityTag = tags.ACTIVITY[0];
      shop.isActivity = true;
    } else {
      shop.activityTag = '品质商家'
    }
  }

  /**
   * 处理子商户的商品信息
   */
  static _processSubShopGoods(goods) {
    // 处理简化名称
    const nameArr = goods.name.split(' ');
    if (nameArr.length == 2 && nameArr[1].length > 1) {
      goods.simpleName = nameArr[1];
    } else {
      goods.simpleName = goods.name;
    }
    // 处理积分抵扣
    if (goods.paymentType == 'bonus') {
      // goods.bounsText = `免费兑换`;
    } else if (goods.maxCostBonus > 0) {
      const bounsPrice = (goods.maxCostBonus / 100).toFixed(0);
      if (bounsPrice > 0) {
        goods.bounsText = `抵${bounsPrice}元`;
      }
    }
    // 置顶标志处理
    goods.isTop = false;
    // 排序号
    if (goods.rule) {
      goods.goodsType = goods.rule.ruleType;
      if (goods.goodsType == 'BARGAIN') {
        goods.typeText = '疯狂砍价';
      } else if (goods.goodsType == 'GROUP') {
        goods.typeText = '限时拼团';
      } else if (goods.goodsType == 'ASSIST') {
        goods.typeText = '助力领奖';
      }
      goods.sord = 2;
      goods.isTop = true;
    } else if (goods.paymentType == 'bonus') {
      goods.goodsType = 'BONUS';
      goods.typeText = '免费兑换';
      goods.sord = 3;
      goods.isTop = true;
    } else if (goods.limitType == 'NEW_CUSTOMER') {
      goods.goodsType = 'NEW_CUSTOMER';
      goods.typeText = '新客专享';
      goods.isTop = true;
      goods.sord = 1;
    } else if (goods.isRecommend == 1) {
      goods.goodsType = 'RECOMMEND';
      goods.typeText = '招牌推荐';
      goods.sord = 4;
    } else {
      goods.sord = 5;
    }
  }
}
