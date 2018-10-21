/* globals hexo */
const generatorWorkbox = require('./lib/generator-workbox');
const filterWorkbox = require('./lib/filter-workbox');

hexo.config.workbox = hexo.config.workbox || {};
hexo.config.workbox.swDest = hexo.config.workbox.swDest || 'sw.js';
hexo.config.workbox.globDirectory = hexo.config.public_dir;

if (hexo.config.hexoWorkbox && hexo.config.hexoWorkbox.enable) {
  hexo.extend.generator.register('workbox', generatorWorkbox);
  hexo.extend.filter.register('after_generate', filterWorkbox);
}
