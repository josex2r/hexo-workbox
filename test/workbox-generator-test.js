/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const sinon = require('sinon');
const workboxBuild = require('workbox-build');
const generatorWorkbox = require('../lib/generator-workbox');

const expect = chai.expect;

describe('workbox-generator', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('exists', () => {
    expect(generatorWorkbox).to.be.a('function');
  });

  it('returns an object', () => {
    const ctx = { config: { workbox: {} } };
    const fn = generatorWorkbox.bind(ctx);
    const result = fn();

    expect(result).to.be.a('object');
  });

  it('the returned object contains the service worker path', () => {
    const swDest = 'sw.js';
    const ctx = {
      config: {
        workbox: {
          swDest
        }
      }
    };
    const fn = generatorWorkbox.bind(ctx);
    const result = fn();

    expect(result.path).to.be.equal(swDest);
  });

  ['swDest', 'globIgnores', 'globPatterns', 'globDirectory'].forEach((property) => {
    it(`deletes the property from the configuration object (${property})`, () => {
      const stub = sandbox.stub(workboxBuild, 'generateSWString').returns(Promise.resolve());
      const ctx = {
        config: {
          workbox: {
            [property]: 'foo'
          }
        }
      };
      const fn = generatorWorkbox.bind(ctx);
      const result = fn();

      result.data();

      expect(stub.calledOnce).to.be.ok;
      expect(stub.getCall(0).args[0][property]).to.be.not.ok;
    });
  });

  it('returns the "swString" property from the workbox object', () => {
    const swString = 'foo';
    const ctx = { config: { workbox: {} } };
    const fn = generatorWorkbox.bind(ctx);

    sandbox.stub(workboxBuild, 'generateSWString').returns(Promise.resolve({ swString }));

    return fn().data().then((result) => {
      expect(result).to.be.equal(swString);
    });
  });
});
