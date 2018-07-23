// My sweet16 mapping

const map = {
  '0': 'powerbot-shutdown',
  '1': 'shutdown',
  '2': null,
  '3': null,
  '4': null,
  '5': null,
  '6': null,
  '7': null,
  '8': 'seekback',
  '9': 'seekfwd',
  ')': null,
  '!': null,
  '@': 'previous',
  '#': 'toggle',
  '$': null,
  '%': 'next',
};

module.exports = {
  btnToAction: (key) => {
    return map[key];
  }
};
