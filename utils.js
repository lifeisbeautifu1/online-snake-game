module.exports = {
  makeid,
};

function makeid(length) {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; ++i) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
}
