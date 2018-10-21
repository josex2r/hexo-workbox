function sanitizeConfig(originalConfig, allowedProperties) {
  const config = Object.assign({}, originalConfig);

  Object.keys(config).forEach((property) => {
    if (!allowedProperties.includes(property)) {
      delete config[property];
    }
  });

  return config;
}

function forInjectManifest(originalConfig) {
  const allowedProperties = [
    'swDest',
    'swSrc',
    'globDirectory',
    'globFollow',
    'globIgnores',
    'globPatterns',
    'globStrict',
    'templatedUrls',
    'maximumFileSizeToCacheInBytes',
    'dontCacheBustUrlsMatching',
    'modifyUrlPrefix',
    'manifestTransforms',
  ];

  return sanitizeConfig(originalConfig, allowedProperties);
}

module.exports = {
  forInjectManifest,
};
