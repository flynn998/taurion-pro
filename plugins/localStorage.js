// plugins/localStorage.js
export default ({ app }, inject) => {
  inject('localStorage', {
    setItem(key, value) {
      if (process.client) {
        localStorage.setItem(key, value);
      }
    },
    getItem(key) {
      if (process.client) {
        return localStorage.getItem(key);
      }
      return null; // 或者返回一个默认值
    },
    // 可以添加更多localStorage方法
  });
};