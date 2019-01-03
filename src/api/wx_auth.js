import http from '../utils/Http'

import wepy from 'wepy';
import store from '../store/utils';
import config from './config';
import Tips from '../utils/Tips';
import WxUtils from '../utils/WxUtils';

const baseUrl = wepy.$instance.globalData.baseUrl;
const auth = wepy.$instance.globalData.auth;
let isInit = false;
let inviteId = null;

/**
 * 异步启动程序
 */
export async function initWxApp () {
  await doInitWxApp(() => {
    store.init().then();
  });
}

/**
 * 同步启动程序
 */
export async function initWxAppSync () {
  return doInitWxApp(() => store.init());
}

/**
 * 设置邀请人信息
 */
export function setInviteId (scene) {
  const id = WxUtils.parseQrScene(scene, 'invite');
  if (id != null) {
    inviteId = id;
    console.info(`[wx_login] scene invite_id=${inviteId}`);
  }
}

/**
 * 清空权限数据
 */
export function relaunchWxApp() {
  console.info('[wx_login] reladunc, clear login_code and third_session');
  isInit = false;
  setThirdSession('');
  setLoginCode('');
}

/**
 * 检查session_key是否过期
 */
export async function checkThridSession() {
  try {
    await wepy.checkSession();
    console.info('[wx_login] check third session success');
  } catch (e) {
    // 异步刷新
    console.info('[wx_login] check third session fail');
    await refreshThirdSession();
  }
}

/**
 * 检查用户信息并抛出异常
 */
export async function checkUserInfoWithError () {
  await checkUserInfo(true);
}

/**
 * 检查是否授权用户信息
 */
export async function checkUserInfo(throwException = false) {
  // 信息完整通过校验
  if (isUserComplete()) {
    console.info('[wx_login] check user info success');
    return true;
  }
  // 尝试获取用户信息
  const rawUser = await getWxUserInfo();
  if (rawUser == null) {
    return redirectToLoginPage('获取用户信息失败', throwException)
  }
  console.info('[wx_login] getUserInfo succeess, begin decode');
  // 服务端解析用户信息（还需要考虑thridSession失效问题）
  const success = await saveWxUserInfo(rawUser);
  return success ? true : redirectToLoginPage('服务端解析失败', throwException);
}

/**
 * 检查用户是否已经注册会员
 */
export async function checkUserMember() {
  const member = store.getState('member');
  if (member == null) {
    console.info('[wx_login] member info is empty');
    await Tips.modal('请点击绑定手机，享受更多会员特权');
    wepy.switchTab({url: '/pages/customer/index_template'});
    // 抛出异常
    throw new Error('尚未绑定手机');
  }
  // 还需要检查用户信息是否完整
  await checkUserInfo();
}

/**
 * 保存并注册用户
 */
export async function saveWxUserPhone (data) {
  if (data.encryptedData == null) {
    return false;
  }
  const url = `${baseUrl}/auth/register_phone`;
  const param = {
    encryptedData: data.encryptedData,
    iv: data.iv,
    thirdSession: getThirdSession(),
    app_code: getAppCode()
  };
  const result = await http.get(url, param);
  return result.memberId != null;
}

/**
 * 处理电话号码事件
 */
export async function handleGetPhoneNumber(detail) {
  if (detail.errMsg == 'getPhoneNumber:fail user deny' || detail.errMsg == 'getPhoneNumber:fail:cancel to confirm login') {
    await Tips.alert('请允许授权');
    throw new Error('用户未授权电话号码');
  }
  try {
    // 其他错误不尝试注册
    if (detail.errMsg != 'getPhoneNumber:ok') {
      console.info(`[login] get phone number fail, message=${detail.errMsg}`, detail);
      return false;
    }
    Tips.loading();
    const result = await saveWxUserPhone(detail);
    if (result) {
      await store.refresh('member');
      return true;
    }
  } catch (e) {
    // 判断已注册的情况
    if (e.serverCode == 52000) {
      console.info('[login] 用户已注册，刷新本地缓存', e);
      await store.refresh('member');
      return true;
    } else {
      console.warn('注册失败', e);
      return false;
    }
  } finally {
    Tips.loaded();
  }
}

/**
 * 保存微信用户信息
 */
export async function saveWxUserInfo(rawUser) {
  if (rawUser.encryptedData == null) {
    return false;
  }
  try {
    Tips.loading();
    const result = await decodeUserInfo(rawUser);
    if (result.user != null) {
      console.info('[wx_login] decodeUserInfo succeess', result.user);
      setUser(result.user);
      return true;
    } else {
      console.warn('[wx_login] decodeUserInfo fail, result is null');
      return false;
    }
  } catch (e) {
    if (e.statusCode == 403) {
      // 异步刷新
      refreshThirdSession().then();
      console.warn('[wx_login] decodeUserInfo fail, session_key invalid, relogin');
    } else {
      console.error('[wx_login] decodeUserInfo fail, server exception', e);
    }
    return false;
  } finally {
    Tips.loaded();
  }
}

/**
 *  启动程序
 */
async function doInitWxApp (initStore) {
  // 已初始化，直接返回
  if (isInit === true) {
    console.info('[wx_login] app already init, flag=', isInit);
    return;
  }
  // 未初始化，开始进行程序初始化
  if (isLoginCodeEmpty()) {
    // 登录状态失效，重新建立session
    console.info('[wx_login] login_code invalid, relogin wx');
    const config = await createServerSession();
    // 保存全局配置
    await store.initWithData(config);
    // 异步获取优惠券
    store.use('coupon').then();
  } else {
    console.info('[wx_login] login_code is ok, load store', auth);
    await initStore();
  }
  isInit = true;
}

/**
 * 获取微信的用户信息
 */
async function getWxUserInfo () {
  // 检查用户授权情况
  const {authSetting} = await wepy.getSetting();
  // 如果有授权，获取微信用户信息
  const isAuth = authSetting['scope.userInfo'];
  console.info(`[wx_login] scope.userInfo=${isAuth}`);
  if (isAuth == true) {
    const rawUser = await wepy.getUserInfo();
    console.info('[wx_login] get wx user_info success, user=', rawUser.userInfo);
    return rawUser;
  } else {
    return null;
  }
}

/**
 * 重定向到登录页面
 */
function redirectToLoginPage(errMsg, throwException) {
  wepy.navigateTo({url: '/pages/home/login'});
  if (throwException) {
    throw new Error(`[wx_login] check user_info fail, ${errMsg}`);
  }
  return false;
}

/**
 * 创建服务器会话
 */
async function createServerSession () {
  const {code} = await wepy.login();
  const appCode = getAppCode();
  const url = `${baseUrl}/auth/wx_session`;
  // 基础参数
  const param = {
    appCode: appCode,
    code: code,
    withConfig: true
  };
  // 邀请参数
  if (inviteId) {
    param.inviteId = inviteId;
    console.info(`[wx_login] report invite_id=${inviteId}`);
  }
  // 启动路径
  const path = wepy.$instance.globalData.launchPath;
  if (path) {
    param.scene = path;
  }
  const {thirdSession, loginCode, fullShopInfo} = await http.post(url, param);
  // 保存权限信息
  setLoginCode(loginCode);
  setThirdSession(thirdSession);
  return config.process(fullShopInfo);
}

/**
 * 刷新服务端的session_key
 */
async function refreshThirdSession() {
  const {code} = await wepy.login();
  const appCode = getAppCode();
  const url = `${baseUrl}/auth/3rd_session?code=${code}&app_code=${appCode}`;
  const { message } = await http.get(url);
  if (message != null && message != '') {
    setThirdSession(message);
  } else {
    console.error('[wx_login] refreshThirdSession fail, message is empty');
  }
}

/**
 * 服务端解密用户信息
 */
async function decodeUserInfo(rawUser) {
  const url = `${baseUrl}/auth/decode_userinfo`;
  const param = {
    encryptedData: rawUser.encryptedData,
    iv: rawUser.iv,
    thirdSession: getThirdSession(),
    app_code: getAppCode()
  };
  return await http.get(url, param);
}

/**
 * 检查用户信息是否完整
 */
function isUserComplete () {
  const user = getUser();
  return hasUser() && user.avatarUrl != null && user.nickName != null;
}

/**
 * 检查LoginCode是否为空
 */
function isLoginCodeEmpty () {
  const code = getLoginCode();
  return code == null || code == '' || code == 'null';
}

// getter and setter

function hasUser () {
  return getUser() != null && getUser() != '';
}

function getAppCode() {
  return wepy.$instance.globalData.appCode;
}

function getLoginCode() {
  return get('login_code')
}
function setLoginCode(loginCode) {
  set('login_code', loginCode);
}

function getThirdSession() {
  return get('third_session');
}

function setThirdSession(thirdSession) {
  set('third_session', thirdSession);
}

function getUser() {
  return get('user');
}

function setUser(user) {
  store.save('user', user);
  set('user', user);
}

function set(key, value) {
  auth[key] = value;
  wepy.setStorageSync(key, value);
}

function get(key) {
  return auth[key];
}
