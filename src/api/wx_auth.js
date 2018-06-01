import http from '../utils/Http'
import store from '../store/utils';
import wepy from 'wepy';
import config from './config';

const baseUrl = wepy.$instance.globalData.baseUrl;
let isInit = false;

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

async function doInitWxApp (initStore) {
  // 已初始化，直接返回
  if (isInit) return;
  // 未初始化，开始进行程序初始化
  if (isLoginCodeEmpty()) {
    // 登录状态失效，重新建立session
    console.info('[wx_login] login_code invalid, relogin wx');
    const {code} = await wepy.login();
    const config = await createWxSession(code);
    // 保存全局配置
    store.saveFieldData('config', config);
    // 异步获取优惠券
    store.use('coupon').then();
  } else {
    console.info('[wx_login] login_code is ok, load store');
    await initStore();
  }
  // 初始化状态
  isInit = true;
}

/**
 * 重新启动，清空信息
 */
export function relaunchWxApp() {
  console.info('[wx_login] relaunch, clear login_code and third_session');
  setLoginCode('');
  setThirdSession('');
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
    const userInfo = rawUser.userInfo;
    console.info('[wx_login] get wx user_info success, user=', userInfo);
    setUser(rawUser.userInfo);
    return rawUser;
  } else {
    return null;
  }
}

/**
 * 创建服务器会话
 */
async function createWxSession (jsCode) {
  const appCode = getAppCode();
  const url = `${baseUrl}/auth/wx_session`;
  // 基础参数
  const param = {
    appCode: appCode,
    code: jsCode,
    withConfig: true
  };
  const {thirdSession, loginCode, fullShopInfo} = await http.post(url, param);
  // 保存权限信息
  setLoginCode(loginCode);
  setThirdSession(thirdSession);
  return config.process(fullShopInfo);
}

/**
 * 检查用户信息是否完整
 */
function isUserComplete () {
  const user = getUser();
  return hasUser() && user.id != null && user.nickName != null;
}

/**
 * 检查LoginCode是否为空
 */
function isLoginCodeEmpty () {
  const code = getLoginCode();
  return code == null || code == '' || code == 'null';
}

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
  return set('user', user)
}

function set(key, value) {
  wepy.$instance.globalData.auth[key] = value;
  wepy.setStorageSync(key, value);
}

function get(key) {
  return wepy.$instance.globalData.auth[key];
}
