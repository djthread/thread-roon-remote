const build = (prefix, args) => {
  return [prefix].concat(Array.from(args));
};

module.exports = {
  debug: function() {
    return console.log.apply(null, build('..', arguments));
  },
  info: function() {
    return console.log.apply(null, build('--', arguments));
  },
  warn: function() {
    return console.log.apply(null, build('??', arguments));
  },
  error: function() {
    return console.log.apply(null, build('!!', arguments));
  }
};
