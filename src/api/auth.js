import base from './base'
import wepy from 'wepy';

export default class auth extends base {
  /**
   * 一键登录
   */
  static async login() {
    const loginCode = this.getConfig('login_code');
    if (loginCode != null && loginCode != '') {
      try {
        await this.check(loginCode);
      } catch (e) {
        await this.doLogin();
      }
    } else {
      await this.doLogin();
    }
  }
  /**
   * 执行登录操作
   */
  static async doLogin() {
    await this.removeConfig('login_code');
    const {code} = await wepy.login();
    const {third_session, login_code} = await this.session(code);
    await this.setConfig('login_code', login_code);
    await this.setConfig('third_session', third_session);
    await this.login();
  }

  /**
   * 获取会话
   */
  static async session(jsCode) {
    const shopCode = wepy.$instance.globalData.shopCode;
    const url = `${this.baseUrl}/auth/session?code=${jsCode}&shop_code=${shopCode}`;
    return await this.get(url);
  }

  /**
   * 检查登录情况
   */
  static async check(loginCode) {
    const url = `${this.baseUrl}/auth/check_session?login_code=${loginCode}`;
    const data = await this.get(url);
    return data.result;
  }

  /**
   * 设置权限值
   */
  static getConfig(key) {
    return wepy.$instance.globalData.auth[key];
  }

  /**
   * 读取权限值
   */
  static async setConfig(key, value) {
    await wepy.setStorage({key: key, data: value});
    wepy.$instance.globalData.auth[key] = value;
  }

  /**
   * 删除权限值
   */
  static async removeConfig(key) {
    wepy.$instance.globalData.auth[key] = null;
    await wepy.removeStorage({key: key});
  }
}
