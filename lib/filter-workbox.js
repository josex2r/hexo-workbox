const fs = require('hexo-fs');
const path = require('path');
const workboxBuild = require('workbox-build');

module.exports = function filterWorkbox(/* locals */) {
  const log = this.log || console;

  if (!fs.existsSync(this.public_dir)) {
    log.info('precache manifest will only be created after `hexo generate` command');
    return null;
  }

  const swFile = path.join(this.config.public_dir, this.config.workbox.swDest);

  this.config.workbox.swDest = swFile;

  return workboxBuild.generateSW(this.config.workbox);
};
