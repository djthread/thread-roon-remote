const build = (prefix, args) => {
  return [`${prefix} `].concat(args);
};

module.exports = {
  debug: () => {
    return apply(console.log, build(' )', arguments));
  },
  info: () => {
    return apply(console.log, build('--', arguments));
  },
  warn: () => {
    return apply(console.log, build('??', arguments));
  },
  error: () => {
    return apply(console.log, build('!!', arguments));
  }
};