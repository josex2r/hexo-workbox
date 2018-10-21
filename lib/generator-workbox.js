const workboxBuild = require('workbox-build');

module.exports = function generatorWorkbox(/* locals */) {
  const config = Object.assign({}, this.config.workbox);

  delete config.swDest;
  delete config.globDirectory;
  delete config.globPatterns;
  delete config.globIgnores;

  return {
    path: this.config.workbox.swDest,
    data() {
      return workboxBuild.generateSWString(config)
        .then(data => data && data.swString);
    },
  };
};
