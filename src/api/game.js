
import base from './base';

export default class game extends base {
  /**
   * 所有游戏信息
   */
  static games() {
    const url = `${this.baseUrl}/game_activity/rules`;
    return this.get(url);
  }
  /**
   * 根据id获取特定游戏信息
   */
  static gameInfo(gameId) {
    const url = `${this.baseUrl}/game_activity/rules?id=${gameId}`;
    return this.get(url);
  }
  /**
   * 开始抽奖
   */
  static gameAction(rule) {
    const url = `${this.baseUrl}/game_activity`;
    return this.post(url, rule);
  }
  /**
   * 游戏可玩次数
   */
  static gameTime(ruleId) {
    const url = `${this.baseUrl}/game_activity/times?ruleId=${ruleId}`;
    return this.get(url);
  }
}
