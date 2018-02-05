import base from './base'
import wepy from 'wepy';
import store from '../store/utils';
import WxUtils from '../utils/WxUtils';

/**
 * 权限服务类
 */
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
        console.warn('check login code fial', loginCode);
        await this.doLogin();
      }
    } else {
      console.warn('login code not exists', loginCode);
      await this.doLogin();
    }
  }

  /**
   * 获取用户信息
   */
  static async user(param = {block: false, redirect: false}, userInfo) {
    try {
      // 检查
      if (this.hasConfig('user')) {
        store.save('user', this.getConfig('user'));
        return true;
      }
      console.info('[auth] user check fail');
      // 重新登录
      await this.doLogin();
      // 获取用户信息
      const rawUser = userInfo != null ? userInfo : await wepy.getUserInfo();
      // 检查是否通过
      // await this.checkUserInfo(rawUser);
      // 解密信息
      const {user} = await this.decodeUserInfo(rawUser);
      // 保存登录信息
      await this.setConfig('user', user);
      store.save('user', user);
      return true;
    } catch (error) {
      console.error('[auth] 授权失败', error);
      if (param.block) {
        const url = `/pages/home/login?redirect=${param.redirect}`;
        if (param.redirect) {
          WxUtils.backOrRedirect(url);
        } else {
          WxUtils.backOrNavigate(url);
        }
      }
      return false;
    }
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
      app_code: this.getShopCode()
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
      app_code: this.getShopCode()
    };
    return await this.get(url, param);
  }

  /**
   * 执行登录操作
   */
  static async doLogin() {
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
    const shopCode = wepy.$instance.globalData.appCode;
    const url = `${this.baseUrl}/auth/session?code=${jsCode}&app_code=${shopCode}`;
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
    return wepy.$instance.globalData.appCode;
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
    console.info(`[auth] clear auth config [${key}]`);
    wepy.$instance.globalData.auth[key] = null;
    await wepy.removeStorage({key: key});
  }
}
