const { io } = require('socket.io-client');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHVkZW50LTAwMiIsImVtYWlsIjoic3R1ZGVudC0wMDJAdWNlLmVkdS5lYyIsInJvbGVzIjpbInN0dWRlbnQiXSwiaWF0IjoxNzgxODI2NTY0LCJleHAiOjE3ODE4MzAxNjR9.8hvefouSqbzMy6qNzz7vn-LJOuuskvsJ9jrk3JeFPBc';

const socket = io('http://localhost:3010', {
  auth: {
    token,
  },
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('notification:new', (data) => {
  console.log('notification:new', data);
});

socket.on('notification:unread-count', (data) => {
  console.log('notification:unread-count', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});