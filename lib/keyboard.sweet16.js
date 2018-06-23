// My sweet16 mapping

const map = {
  '0': 'shutdown',
  '1': null,
  '2': null,
  '3': null,
  '4': null,
  '5': null,
  '6': null,
  '7': null,
  '8': 'seekback',
  '9': 'seekfwd',
  'a': null,
  'b': null,
  'c': 'previous',
  'd': 'toggle',
  'e': null,
  'f': 'next',
};

module.exports = {
  btnToAction: (key) => {
    return map[key];
  }
};
