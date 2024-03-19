// plugins/socket.io.js

import io from 'socket.io-client';

const token = localStorage.getItem('token')
const socket = io("https://api-test.taurion.ai?token=" + token, {
  reconnectionAttempts: 15,
}); // 确保这里的 URL 指向你的服务端地址

export default (context, inject) => {
  inject('socket', socket);
};
