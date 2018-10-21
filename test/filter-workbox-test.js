/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const sinon = require('sinon');
const path = require('path');
const fs = require('hexo-fs');
const workboxBuild = require('workbox-build');
const filterWorkbox = require('../lib/filter-workbox');

const { expect } = chai;

describe('filter-workbox', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('exists', () => {
    expect(filterWorkbox).to.be.a('function');
  });

  context('output dir does not exists', () => {
    it('returns null if "public_dir" is defined', () => {
      const ctx = { log: console, public_dir: 'foo', config: { workbox: {} } };
      const fn = filterWorkbox.bind(ctx);
      const result = fn();

      expect(result).to.be.equal(null);
    });

    it('logs a message', () => {
      const ctx = {
        log: {
          error: sandbox.spy()
        },
        public_dir: 'foo',
        config: { workbox: {} }
      };
      const fn = filterWorkbox.bind(ctx);

      fn();

      expect(ctx.log.error.calledOnce).to.be.ok;
    });
  });

  context('output dir exists', () => {
    const publicDir = 'foo';
    const absPublicDir = path.join(__dirname, 'foo');

    beforeEach(() => fs.mkdir(absPublicDir));

    afterEach(() => fs.rmdir(absPublicDir));

    it('returns a Promise', () => {
      const ctx = {
        log: console,
        public_dir: absPublicDir,
        config: {
          public_dir: publicDir,
          workbox: {
            swDest: 'sw.js'
          }
        }
      };
      const fn = filterWorkbox.bind(ctx);
      const result = fn();

      expect(result.then).to.be.a('function');
    });

    it('creates the service worker file', () => {
      const swDest = 'sw.js';
      const ctx = {
        log: console,
        public_dir: absPublicDir,
        config: {
          public_dir: absPublicDir,
          workbox: {
            swDest,
            globDirectory: absPublicDir
          }
        }
      };
      const fn = filterWorkbox.bind(ctx);
      const outputSwDest = path.join(absPublicDir, swDest);

      return fn().then(() => {
        expect(fs.existsSync(outputSwDest)).to.be.ok;
      });
    });
  });
});
