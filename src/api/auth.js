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
        await this.checkLoginCode(loginCode);
      } catch (e) {
        await this.doLogin();
      }
    } else {
      await this.doLogin();
    }
  }

  /**
   * 获取用户信息
   */
  static async user() {
    // 检查
    if (this.hasConfig('user')) {
      return;
    }
    // 重新登录
    await this.login();
    // 获取用户信息
    const rawUser = await wepy.getUserInfo();
    // 检查是否通过
    await this.checkUserInfo(rawUser);
    // 解密信息
    const {user} = await this.decodeUserInfo(rawUser);
    // 保存登录信息
    await this.setConfig('user', user);
    // TODO 如果失败了要跳转到授权页面
    // wepy.navigate();
  }

  /**
   * 服务端检查数据完整性
   */
  static async checkUserInfo(rawUser) {
    const url = `${this.baseUrl}/auth/check_userinfo`;
    const param = {
      rawData: rawUser.rawData,
      signature: rawUser.signature,
      thirdSession: this.getConfig('third_session'),
      shop_code: this.getShopCode()
    };
    return await this.get(url, param);
  }

  /**
   * 服务端解密用户信息
   */
  static async decodeUserInfo(rawUser) {
    const url = `${this.baseUrl}/auth/decode_userinfo`;
    const param = {
      encryptedData: rawUser.encryptedData,
      iv: rawUser.iv,
      thirdSession: this.getConfig('third_session'),
      shop_code: this.getShopCode()
    };
    return await this.get(url, param);
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
  static async checkLoginCode(loginCode) {
    const url = `${this.baseUrl}/auth/check_session?login_code=${loginCode}`;
    const data = await this.get(url);
    return data.result;
  }

  /**
   * 获取店铺标识符
   */
  static getShopCode() {
    return wepy.$instance.globalData.shopCode;
  }

  /**
   * 设置权限值
   */
  static getConfig(key) {
    return wepy.$instance.globalData.auth[key];
  }

  /**
   * 检查是否存在权限制
   */
  static hasConfig(key) {
    const value = this.getConfig(key);
    return value != null && value != '';
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
