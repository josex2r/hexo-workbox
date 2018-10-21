/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable global-require */
const chai = require('chai');
const sinon = require('sinon');
const path = require('path');
const generatorWorkbox = require('../lib/generator-workbox');
const filterWorkbox = require('../lib/filter-workbox');

const { expect } = chai;

global.hexo = {
  extend: {
    generator: {
      register() {}
    },
    filter: {
      register() {}
    }
  },
  config: {}
};

describe('index', () => {
  let sandbox;

  beforeEach(() => {
    global.config = {};
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    const indexPath = path.join(__dirname, '..', 'index.js');

    sandbox.restore();
    delete require.cache[indexPath];
  });

  it('does not register anything if the plugin is disabled', () => {
    const generatorStub = sandbox.stub(global.hexo.extend.generator, 'register');
    const filterStub = sandbox.stub(global.hexo.extend.filter, 'register');

    global.hexo.config.hexoWorkbox = {
      enable: false
    };
    require('../index');

    expect(generatorStub.called).to.not.be.ok;
    expect(filterStub.called).to.not.be.ok;
  });

  it('registers a generator', () => {
    const stub = sandbox.stub(global.hexo.extend.generator, 'register');

    global.hexo.config.hexoWorkbox = {
      enable: true
    };
    require('../index');

    expect(stub.calledWith('workbox', generatorWorkbox)).to.be.ok;
  });

  it('registers a filter', () => {
    const stub = sandbox.stub(global.hexo.extend.filter, 'register');

    global.hexo.config.hexoWorkbox = {
      enable: true
    };
    require('../index');

    expect(stub.calledWith('after_generate', filterWorkbox)).to.be.ok;
  });
});
