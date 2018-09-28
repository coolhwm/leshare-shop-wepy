import base from '../../api/base';
import wepy from 'wepy';
import Page from '../../utils/Page';
import goods from '../../api/goods';
import Lang from '../../utils/Lang';

export default class group extends base {
  /***
   * 根据拼团商品规则ID查找拼团信息(商品)
   */
  static rules (ruleId) {
    const url = `${this.baseUrl}/goods_group/rules/${ruleId}`;
    return this.get(url).then(data => this._processGoodsDetail(data));
  }

  /***
   * 获取商品详情中所展示的拼团信息(3条)
   */
  static processing (ruleId) {
    const url = `${this.baseUrl}/goods_group/processing?rule_id=${ruleId}&sort=asc&by=group_time&limit=3`;
    return this.get(url).then(data => this._processGroupProcessingDetail(data));
  }
  /***
   * 获取正在拼团的拼团信息
   */
  static processingList (ruleId) {
    const url = `${this.baseUrl}/goods_group/processing?rule_id=${ruleId}`;
    return new Page(url, item => {
      this._processGroupProcessingListDetail(item);
    });
  }

  /**
   * 返回参团列表
   */
  static list (status) {
    const url = `${this.baseUrl}/goods_group/group_list?status=${status}`;
    return new Page(url, item => {
      this._processListItem(item)
    });
  }

  /***
   * 根据拼团ID查找拼团详情
   */
  static groupDetail (groupId) {
    const url = `${this.baseUrl}/goods_group/${groupId}`;
    return this.get(url).then(data => this._processGroupDetail(data));
  }

  /***
   * 查看拼团商品列表
   */
  static groupGoodsList () {
    const url = `${this.baseUrl}/goods_group/rules`;
    return new Page(url, item => {
      goods._processGoodsPreview(item.goods)
    });
  }

  /**
   * 推荐商品列表
   */
  static recommendList() {
    const url = `${this.baseUrl}/goods_group/rules`;
    return this.get(url).then(data => {
      data.forEach(item => {
        goods._processGoodsPreview(item.goods);
      });
      return data;
    });
  }

  // *** 数据处理方法

  /**
   * 处理商品详情
   */
  static _processGoodsDetail (detail) {
    // 解析预览图
    goods._processGoodsPreview(detail.goods);

    // 解析SKU规格
    goods._processSkuLable(detail.goods);

    // 处理价格范围区间
    goods._processGoodsPriceRange(detail.goods);

    // 处理价格标签
    goods._processGoodsPriceLabel(detail.goods);
    detail.sellPrice = Lang._fixedPrice(detail.sellPrice);
    // 页面显示的原价
    detail.goods.originSellPrice = detail.goods.sellPrice;
    detail.goods.sellPrice = Lang._fixedPrice(detail.goods.sellPrice);
    // 处理活动时间状态
    this._processTimeStatus(detail);

    return detail;
  }

  /**
   * 处理拼团列表
   */
  static _processListItem(item) {
    item.ruleSellPrice = Lang._fixedPrice(item.ruleSellPrice);
    item.rulePrice = Lang._fixedPrice(item.rulePrice);
    return item;
  }

  /***
   * 拼团栏信息处理
   */
  static _processGroupProcessingDetail (detail) {
    if (detail === null) return [];
    detail.forEach(item => {
      // 解析预览图
      goods._processGoodsPreview(item.rule.goods);

      // 解析SKU规格
      goods._processSkuLable(item.rule.goods);

      // 处理价格范围区间
      goods._processGoodsPriceRange(item.rule.goods);

      // 处理价格标签
      goods._processGoodsPriceLabel(item.rule.goods);

      // 处理开团时间
      this._processGroupTime(item);

      // 筛选团长
      this._processGroupHeader(item);

      // 判断是否已开团
      this._processGroupParticipated(item);
    });
    return detail;
  }
  /***
   * 正在拼团信息处理
   */
  static _processGroupProcessingListDetail (detail) {
    // 解析预览图
    goods._processGoodsPreview(detail.rule.goods);

    // 解析SKU规格
    goods._processSkuLable(detail.rule.goods);

    // 处理价格范围区间
    goods._processGoodsPriceRange(detail.rule.goods);

    // 处理价格标签
    goods._processGoodsPriceLabel(detail.rule.goods);

    // 判断是否已开团
    this._processGroupParticipated(detail);

    // 处理开团时间
    this._processGroupTime(detail);

    // 筛选团长
    this._processGroupHeader(detail);

    return detail;
  }

  /***
   * 拼团详情处理
   */
  static _processGroupDetail (data) {
    const rule = data.rule;
    // 解析预览图
    goods._processGoodsPreview(rule.goods);

    // 解析SKU规格
    goods._processSkuLable(rule.goods);

    // 处理价格范围区间
    goods._processGoodsPriceRange(rule.goods);

    // 处理价格标签
    goods._processGoodsPriceLabel(rule.goods);
    rule.sellPrice = Lang._fixedPrice(rule.sellPrice);
    rule.goods.sellPrice = rule.sellPrice;
    // 处理list.length和参团人数一致
    this._processGroupListLength(data, rule);
    return data;
  }

  /***
   * 团长信息处理
   */
  static _processGroupHeader (detail) {
    if (!detail.list) return;
    detail.header = detail.list.find(item => item.head === true);
  }

  /***
   * 开团时间处理
   */
  static _processGroupTime (detail) {
    const time = new Date(detail.groupTime.replace(/-/g, '/')) - new Date() + 1000 * 60 * 60 * 24;
    if (time > 0) {
      let hour = Math.floor(time / 3600000);
      let min = Math.floor((time / 60000) % 60);
      let sec = Math.floor((time / 1000) % 60);
      hour = hour < 10 ? '0' + hour : hour;
      min = min < 10 ? '0' + min : min;
      sec = sec < 10 ? '0' + sec : sec;
      detail.time = `还剩${hour}:${min}:${sec}`;
    } else {
      detail.time = `已结束`;
    }
  }

  /***
   * 判断是否已开团
   */
  static _processGroupParticipated (detail) {
    const user = wepy.$instance.globalData.auth['user'];
    detail.list.forEach(item => {
      detail.isPar = item.customerId === user.id;
    });
  }

  /***
   * 处理参团list
   */
  static _processGroupListLength (data, rule) {
    rule.spareCustomer = rule.limitCustomer - data.list.length;
    if (rule.limitCustomer > data.list.length) {
      for (let i = 1; i <= rule.spareCustomer; i++) data.list.push({})
    }
  }

  /***
   * 处理活动时间状态
   */
  static _processTimeStatus(detail) {
    detail.isTimeOut = new Date(detail.endTime).getTime() < new Date().getTime();
    const beginTime = detail.startTime || detail.beginTime;
    detail.isBegin = new Date(beginTime).getTime() > new Date().getTime();
  }
}
