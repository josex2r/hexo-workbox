# hexo-workbox [![Build Status](https://travis-ci.org/josex2r/hexo-workbox.svg?branch=master)](https://travis-ci.org/josex2r/hexo-workbox) [![GitHub version](https://badge.fury.io/gh/josex2r%2Fhexo-workbox.svg)](https://badge.fury.io/gh/josex2r%2Fhexo-workbox) [![Dependency Status](https://travis-ci.org/josex2r/hexo-workbox.svg)](https://travis-ci.org/josex2r/hexo-workbox)

A plugin for your `Hexo` blog, giving your app offline caching as a progressive enhancement using service workers.
`hexo-workbox` will add a service worker to your blog registering it on initial page load.

This plugin simplify service worker registration and caching, powered by [workbox-build](https://www.npmjs.com/package/workbox-build).
Workbox library automate precaching of static resources (HTML, JavaScript, CSS, and images) and handle runtime caching and fallback strategies.
It allows to implement a performant strategy in which a static content is always served directly from the cache, and dynamic or remote resources are served from the network, with fallbacks to cached or static responses when needed.

**IMPORTANT!**

The [glob pattern matching](https://github.com/isaacs/node-glob#glob-primer) will be performed against the local file system, and the directory that `globDirectory` is set to must exist at the time the plugin runs.
This might run afoul of [hexo-server](https://github.com/hexojs/hexo-server/) configurations, where an in-memory file system is used.

That means the precached files will only be registered after `hexo generate` command ends.

For more details on Workbox check out:
- [Workbox Google Developers](https://developers.google.com/web/tools/workbox/)
- [Service Workers cookbook](https://serviceworke.rs/)

## Installation

`npm i --save hexo-workbox`

## Configuration

First, enable the plugin in your configuration file (`_config.yml`):

```yml
hexoWorkbox:
  enable: true
```

Then, start defining your cache strategies using the same [configuration as workbox](https://developers.google.com/web/tools/workbox/modules/workbox-build#generatesw).
For example, to caching only the `index.html` and all the `jpg` images use something like this:

```yml
workbox:
  swDest: 'sw.js'
  globPatterns:
    - '**/*.html'
  globIgnores:
    - '!index.html'
  runtimeCaching:
    - urlPattern: '**/*.jpg'
      handler: 'staleWhileRevalidate'
      options:
        cacheName: 'images'
  skipWaiting: true
  clientsClaim: true
```

An one more step...
To register the service worker don't forget to add this snippet into yout layout:

```html
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('<%=path %>').then(function() {
    console.log('ServiceWorker has been registered!');
  }).catch(console.error);
}
</script>
```

> Next releases will contain a way to omit this step.

## Contributing

Do not forget to follow the `eslint` rules and make test for the new functionalities/fixes.

## License

[hexo-workbox](https://github.com/josex2r/hexo-workbox) is released under the MIT License.
