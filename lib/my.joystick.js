// My joystick mapping

const map = {
  start: 'previous',
  b: 'toggle',
  a: 'next',
  select: 'shutdown',
  left: 'seekback',
  right: 'seekfwd',
  up: 'mode'
};

module.exports = {
  btnToAction: (btn) => {
    return map[btn];
  }
};
