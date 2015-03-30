var imagesLoaded = require('imagesloaded');

(function($) {
  
  /***
   * Main
   ***/
   
  var UniformThumbs = function($ele, settings){
    this.$ele = $ele;
    this.settings = settings;
    
    this.resizing = false;
    
    this.formater = new UniformThumbsFormater(this.$ele, this.settings);
    this.fitter = new UniformThumbsFitter(this.$ele, this.settings);
    this.imageLoaded = imagesLoaded(this.$ele);
    
    this.addEventHandlers();
    this.hideImages();
  };
  
  UniformThumbs.prototype.addEventHandlers = function(){
    var self = this;
    
    this.imageLoaded.on('done', function(){
      self.resizing = true;
      self.formater.setImageFormat();
      self.fitter.setImageFit();
      self.showImages();
      self.$ele.trigger('ut_imageLoaded');
      self.resizing = false;
    });
    
    // resize images on window resize
    var timeout;
    $(window).resize(function() {
      if (timeout) {
        clearInterval(timeout);
      }
      timeout = setInterval(function() {
        
        if (!self.resizing) {
          self.formater.setImageFormat();
          self.fitter.setImageFit();
          self.resizing = false;
        }
        
      }, 500);
    });
  };
  
  UniformThumbs.prototype.hideImages = function(){
    this.$ele.css({
      opacity: 0,
      overflow: 'hidden'
    });
  };
  
  UniformThumbs.prototype.showImages = function(){
    this.$ele.fadeTo(900, 1);
  };
  
  /***
   * Image formater
   ***/
   
  var UniformThumbsFormater = function($wrapper, settings){
    this.$wrapper = $wrapper;
    this.settings = settings;
    this.ratio = this.getRatio();
  };
  
  UniformThumbsFormater.prototype.setImageFormat = function(){
    var widthRatio = this.$wrapper.width() / this.ratio.width;
    var heightRatio = widthRatio * this.ratio.height;
    this.$wrapper.height(heightRatio);
  };
  
  UniformThumbsFormater.prototype.getRatio = function(){
    var ratioStr = this._getRatioString();
    return this._getRatioFromString(ratioStr);
  };
  
  UniformThumbsFormater.prototype._getRatioString = function(){
    switch (this.settings.format) {
      case 'square':
        return '1:1';
      case 'landscape':
        return this.settings.landscapeRatio;
      case 'portrait':
        return this.settings.portraitRatio;
      default:
        return this.settings.ratio;
    }
  };
  
  UniformThumbsFormater.prototype._getRatioFromString = function(ratioStr){
    var ratioArr = ratioStr.split(':');
    return {
       width: ratioArr[0],
      height: ratioArr[1]
    };
  };
  
  /***
   * Image fitter
   ***/
  
  var UniformThumbsFitter = function($wrapper, settings){
    this.$wrapper = $wrapper;
    this.$image = this.$wrapper.find('img');
    this.settings = settings;
    this.wrapperRatio;
    this.imageRatio;
    this.imageNaturalWidth;
    this.imageNaturalHeight;
  };
  
  UniformThumbsFitter.prototype.setImageFit = function(){
    this._resetImageCSS();
    switch (this.settings.fit) {
      case 'crop':
        this._cropImage();
        break;
      case 'scale':
        this._scaleImage();
        break;
    }
    this._alignImage();
  };
  
  UniformThumbsFitter.prototype._cropImage = function(){
    if(this._imageRatio() > this._wrapperRatio()){
      this._fitHorizontal();
    } else {
      this._fitVertical();
    }
  };
  
  UniformThumbsFitter.prototype._scaleImage = function(){
    if(this._imageRatio() > this._wrapperRatio()){
      this._fitVertical();
    } else {
      this._fitHorizontal();
    }
  };
  
  UniformThumbsFitter.prototype._fitHorizontal = function() {
    if (this._getNaturalHeight(this.$image) >= this.$wrapper.height()) {
      this.$image.height(this.$wrapper.height());
    }
  };
  
  UniformThumbsFitter.prototype._fitVertical = function() {
    if (this._getNaturalWidth(this.$image) >= this.$wrapper.width()) {
      this.$image.width(this.$wrapper.width());
    }
  };

  UniformThumbsFitter.prototype._imageRatio = function(){
    // cache the images ratio because we don't need to calculate it every time
    this.imageRatio = this.imageRatio || this._getNaturalWidth(this.$image) / this._getNaturalHeight(this.$image);
    return this.imageRatio;
  };

  UniformThumbsFitter.prototype._wrapperRatio = function(){
    // cache the wrappers ratio because we don't need to calculate it every time
    this.wrapperRatio = this.wrapperRatio || this.$wrapper.width() / this.$wrapper.height();
    return this.wrapperRatio;
  };
  
  UniformThumbsFitter.prototype._alignImage = function(){
    var style = {};
    style.marginLeft = (this.$wrapper.width() - this.$image.width()) / 2;
    switch (this.settings.align) {
      case 'top':
        break;
      case 'middle':
        style.marginTop = (this.$wrapper.height() - this.$image.height()) / 2;
        break;
      case 'bottom':
        style.marginTop = this.$wrapper.height() - this.$image.height();
        break;
    }
    this.$image.css(style);
  };
  
  UniformThumbsFitter.prototype._getNaturalHeight = function($image){
    if (!this.imageNaturalHeight) {
      if ($image.prop('naturalHeight')) {
        this.imageNaturalHeight = $image.prop('naturalHeight');
      } else {
        this.imageNaturalHeight = this._getNaturalSize($image).height;
      }
    }
    return this.imageNaturalHeight;
  };
  
  UniformThumbsFitter.prototype._getNaturalWidth = function($image){
    if (!this.imageNaturalWidth) {
      if ($image.prop('naturalWidth')) {
        this.imageNaturalWidth = $image.prop('naturalWidth');
      } else {
        this.imageNaturalWidth = this._getNaturalSize($image).width;
      }
    }
    return this.imageNaturalWidth;
  };
  
  UniformThumbsFitter.prototype._getNaturalSize = function($image){
    if ($image.prop('src')) {
      var img = new Image();
      img.src = $image.prop('src');
      return { width: img.width, height: img.height };
    } else {
      return false;
    }
  };
  
  UniformThumbsFitter.prototype._resetImageCSS = function(){
    this.$image.css({
      maxWidth: 'none',
      width: 'auto',
      height: 'auto'
    });
  };

  /***
   * jQuery-ify
   ***/
   
  var thumbnailCompleteCount = 0;
  var invokeFinalTrigger = function(self){
    thumbnailCompleteCount++;
    if (thumbnailCompleteCount === self.length) {
      $(self).last().trigger('ut_complete');
    }
  };
   
  $.fn.uniform_thumbnails = function( options ) {
    // collect settings
    var settings = $.extend( {}, $.fn.uniform_thumbnails.defaults, options );
    // build plugin
    var self = this;
    return self.each(function(){
      var $ele = $(this);
      $ele.data('_uniform_thumbnails', new UniformThumbs($ele, settings));
      $ele.on('ut_imageLoaded', function(){
        invokeFinalTrigger(self);
      });
    });
  };
  
  // Default settings
  $.fn.uniform_thumbnails.defaults = {
               fit: 'crop',   // crop|scale
             ratio: '1:1',    // aspect ratio for image container
            format: 'ratio',  // ratio|square|landscape|portrait
             align: 'middle', // top|middle|bottom
    landscapeRatio: '4:3',    // default ratio for landscape
     portraitRatio: '3:4'     // default ratio for portrait
  };

}(jQuery));