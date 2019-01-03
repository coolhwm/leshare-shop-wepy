import base from './base'
import wepy from 'wepy';

export default class auth extends base {

  /**
   * 检查二维码授权登录
   */
  static async checkQrCode(code) {
    console.info('checkQrCode')
    const loginCode = this.getConfig('login_code');
    const url = `${this.baseUrl}/auth/web_login/login_code?random_code=${code}&login_code=${loginCode}`;
    const data = await this.post(url);
    console.info(data);
  }

  /**
   * 获取会话
   */
  static async session() {
    const {code} = await wepy.login();
    console.info(`[auth] js_code =${code}`);
    const {third_session, login_code} = await this.getSession(code);
    await this.setConfig('login_code', login_code);
    await this.setConfig('third_session', third_session);
  }

  /**
   * 设置权限值
   */
  static getConfig(key) {
    return wepy.$instance.globalData.auth[key];
  }

  /**
   * 获取会话
   */
  static async getSession(jsCode) {
    const appCode = wepy.$instance.globalData.appCode;
    const url = `${this.baseUrl}/auth/session?code=${jsCode}&app_code=${appCode}`;
    return await this.get(url);
  }

  /**
   * 读取权限值
   */
  static async setConfig(key, value) {
    await wepy.setStorage({key: key, data: value});
    wepy.$instance.globalData.auth[key] = value;
  }
}
