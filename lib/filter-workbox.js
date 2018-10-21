/* globals hexo */
const fs = require('hexo-fs');
const path = require('path');
const tmp = require('tmp');
const util = require('util');
const workboxBuild = require('workbox-build');
const sanitizeConfig = require('./sanitize-config');

const createTmpDir = util.promisify(tmp.dir);

module.exports = function filterWorkbox(/* locals */) {
  const log = this.log || console;

  if (!fs.existsSync(this.public_dir)) {
    log.info('precache manifest will only be created after `hexo generate` command');
    return null;
  }

  const routes = this.route.list();
  const swFile = path.join(this.public_dir, this.config.workbox.swDest);
  let tmpSwFile;
  const config = sanitizeConfig.forInjectManifest(this.config.workbox);

  config.injectionPointRegexp = /(=\s*)\[.*\](\.concat)/;

  return createTmpDir().then((tmpDir) => {
    tmpSwFile = path.join(tmpDir, path.basename(swFile));
    return fs.copyFile(swFile, tmpSwFile);
  }).then(() => {
    config.swSrc = tmpSwFile;
    config.swDest = swFile;
    return workboxBuild.injectManifest(config);
  }).then(({ count, size }) => {
    console.info(`Generated ${swFile}, which will precache ${count} files, totaling ${size} bytes.`);
    return fs.unlink(tmpSwFile);
  });
};
