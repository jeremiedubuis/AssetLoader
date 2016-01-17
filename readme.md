**AssetLoader**

Assetloader is a simple js preloader that runs a callback whenever preloading is finished.

```
     var assetLoader = new AssetLoader();

     assetLoader.preload(_urlsToLoad, function() {

         console.log(_urlsToLoad.join(',')+' loaded');

     });
```