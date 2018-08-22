import base from './base';
import Page from '../utils/Page';
import goods from './goods'

export default class group extends base {
  /***
   * 根据拼团商品规则ID查找拼团信息(商品)
   */
  static detail(ruleId) {
    const url = `${this.baseUrl}/group_goods/rules/${ruleId}`;
    return this.get(url).then(data => this._processDetail(data));
  }

  /***
   * 获取正在拼团的拼团信息
   */
  static list() {
    const url = `${this.baseUrl}/group_goods/rules?status=1`;
    return new Page(url);
  }
  // 处理数据
  static _processDetail(data) {
    let details = []
    for (let i = 1; i < 5; i++) {
      const groupItem = data.groupDetails.filter(item => item.groupIndex === i)
      details.push({
        group: data[`group${i}Name`],
        groupValue: groupItem,
        groupNum: i
      })
    }
    details = details.filter(item => {
      if (item.groupValue.length > 0) {
        item.groupValue.forEach(goodsItem => {
          goods._processGoodsPreview(goodsItem.goods)
        })
      }
      return item.groupValue.length > 0
    })
    data.groupDetails = details
    data.goodsList = data.groupDetails.map(item => {
      return item.groupValue[0]
    })

    return data
  }
}
