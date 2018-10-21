/* globals hexo */
const workboxBuild = require('workbox-build');

module.exports = function generatorWorkbox(/* locals */) {
  const log = this.log || console;
  const config = Object.assign({
    importScripts: [],
  }, this.config.workbox);

  delete config.swDest;
  delete config.globDirectory;
  delete config.globPatterns;
  delete config.globIgnores;

  // const base = this.route.get(routes[0]);
  // if (fs.existsSync(this.public_dir)) {
  //   // Application have been generated, enable precache
  //   delete workboxConfig.globDirectory;
  // } else {

  // }
  //
  console.log(this.config.workbox.swDest)

  return {
    path: this.config.workbox.swDest,
    data() {
      console.log('sfdsfdf')
      return workboxBuild.generateSWString(config)
        .then(data => data.swString);
    },
  };
};
