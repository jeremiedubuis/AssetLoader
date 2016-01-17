var AssetLoader = function() {

    this.loaded = []; // array of loaded files
    this.errors = []; // logged errors
    this.loadingList= []; // active loadingList

    // loop over argument arrays to preload files
    for (var i = 0, j = arguments.length; i<j; ++i) {
        this.preload([arguments[i]]);
    }

};

AssetLoader.prototype = {

    preload: function( array, callback ) {
        this.loadingList = typeof array === "string" ? [array] : array;
        this.activeIndex = null;
        this.callback = callback;
        this.preloadIndex();
    },

    // preloads index in loadList array
    preloadIndex: function( ) {

        this.activeIndex = this.activeIndex === null ? 0 : this.activeIndex+1;

        if (this.activeIndex < this.loadingList.length-1 ) {

            if (this.isImage(this.loadingList[this.activeIndex]))
                func = this.preloadImage;
            else if (this.isVideo(this.loadingList[this.activeIndex]))
                func = this.preloadVideo;
            else
                throw "File must be a supported video or image format";

            func.call(this,this.loadingList[this.activeIndex]);

        } else {
            this.callback.call(this);
        }

    },

    preloadImage: function( url ) {
        if  (this.loaded.indexOf(url) === -1 ) {

            var _img = new Image();
            var _this = this;

            _img.onload = function() {
                _img.onload = null;
                _this.loaded.push(url);
                _this.preloadIndex();

            };

            _img.onerror = _img.onabort = function(e){
                _this.errors.push({url: url, error:e});
            };

            _img.src = url;

        } else {
            this.preloadIndex();
        }

    },

    preloadVideo: function( url ) {

        if  (this.loaded.indexOf(url) < 0 ) {

            var _video = document.createElement('video');
            var _src   = document.createElement('source');
            var _this = this;


            _video.ondurationchange = function() {

                _video.ondurationchange = null;
                _this.loaded.push(url);
                _this.preloadIndex();

            };

            _src.src = url;
            _src.type = this.getVideoType(url);
            _video.appendChild(_src);
        } else {
            _this.preloadIndex();
        }

    },

    isImage: function(_url) {
        return /^.*\.(jpg|gif|bmp|png)$/.test(_url);
    },

    isVideo: function(_url) {
        return /^.*\.(mpeg|mp4|ogg|avi)$/.test(_url);
    },

    getVideoType: function(_url) {
        return "video/"+(_url.split(".").pop());
    }

};
