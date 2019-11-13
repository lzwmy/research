// import axios from 'axios';
import utils from 'components/utils';
import { MessageBox } from 'element-ui';

/** 获取全局配置 */

/**
 * Created by hh on 17/12/20.
 *获取外部config输入的常量，iam_clientid,iam_sso_host
 *@param
 *@return
 */
const getGlobal = () => {
  return axios.get('./serverconfig.json?v=' + (+new Date())).then((response) => {
    if (response && response.data) {
      return response;
    }
  }).catch((error) => {
    return error;
  });
};

/**  获取外部的serverconfig.json文件的配置存储于session后
 *
 * @returns {Promise.<*>}
 */
const getConfigJson = async () => {
  try {
    let response = await getGlobal();
    document.title = response.data.title ? response.data.title : '专病科研平台';
    sessionStorage.setItem('Global', JSON.stringify(response.data));
    // 从配置文件中获取请求baseURL，如果注销了这段，那请求baseURL被代理或者是根路径；

    if (process.env.NODE_ENV === 'production') { // 打包的时候生产环境下
      if (response.data.baseURL) {
        axios.defaults.baseURL = response.data.baseURL;
      } else {
        MessageBox.confirm('配置文件出错，请联系管理员！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showCancelButton: false
        }).then(() => {
          utils.ssoLogout();
        }).catch((errors) => {
          utils.ssoLogout();
        });
      }
    } else { // 开发环境下服务是通过代理config下的代理
      if (response.data.baseURL) {
        let arr = response.data.baseURL.split('/');
        let baseURL = '';
        if (arr[arr.length - 1]) { // 配置的baseURL后没有带/
          baseURL = window.location.protocol + '//' + window.location.host + '/' + arr[arr.length - 1] + '/';
        } else { // 配置的baseURL后带/
          baseURL = window.location.protocol + '//' + window.location.host + '/' + arr[arr.length - 2] + '/';
        }
        axios.defaults.baseURL = baseURL;
      } else {
        MessageBox.confirm('配置文件出错，请联系管理员！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showCancelButton: false
        }).then(() => {
          utils.ssoLogout();
        }).catch((errors) => {
          console.log(errors);
          utils.ssoLogout();
        });
      }
    }
    return response;
  } catch (err) {
    return err;
  }
};

export default {
  getConfigJson
};
