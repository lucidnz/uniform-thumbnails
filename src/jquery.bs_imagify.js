(function($) {
  
  /***
   * Main
   ***/
   
  var BSImagify = function($ele, settings){
    this.$ele = $ele;
    this.settings = settings;
    
    this.formater = new BSImagifyFormater(this.$ele, this.settings);
    this.fitter = new BSImagifyFitter(this.$ele, this.settings);
    this.imageLoaded = imagesLoaded(this.$ele);
    
    this.addEventHandlers();
    this.hideImages();
  };
  
  BSImagify.prototype.addEventHandlers = function(){
    var self = this;
    
    this.imageLoaded.on('done', function(){
      self.formater.setImageFormat();
      self.fitter.setImageFit();
      self.showImages();
    });
    
    $(window).resize(function(){
      self.formater.setImageFormat();
      self.fitter.setImageFit();
    });
  };
  
  BSImagify.prototype.hideImages = function(){
    this.$ele.css({opacity: 0});
  };
  
  BSImagify.prototype.showImages = function(){
    this.$ele.fadeTo(900, 1);
  };
  
  /***
   * Image formater
   ***/
   
  var BSImagifyFormater = function($wrapper, settings){
    this.$wrapper = $wrapper;
    this.settings = settings;
    this.ratio = this.getRatio();
  };
  
  BSImagifyFormater.prototype.setImageFormat = function(){
    var widthRatio = this.$wrapper.width() / this.ratio.width;
    var heightRatio = widthRatio * this.ratio.height;
    this.$wrapper.height(heightRatio);
  };
  
  BSImagifyFormater.prototype.getRatio = function(){
    var ratioStr = this._getRatioString();
    return this._getRatioFromString( ratioStr );
  };
  
  BSImagifyFormater.prototype._getRatioString = function(){
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
  
  BSImagifyFormater.prototype._getRatioFromString = function(ratioStr){
    var ratioArr = ratioStr.split(':');
    return {
       width: ratioArr[0],
      height: ratioArr[1]
    };
  };
  
  /***
   * Image fitter
   ***/
  
  var BSImagifyFitter = function($wrapper, settings){
    this.$wrapper = $wrapper;
    this.$image = this.$wrapper.find('img');
    this.settings = settings;
    this._resetImageCSS();
  };
  
  BSImagifyFitter.prototype.setImageFit = function(){
    switch (this.settings.fit) {
      case 'crop':
        this._cropImage();
        break;
      case 'scale':
        this._scaleImage();
        break;
    }
  };
  
  BSImagifyFitter.prototype._cropImage = function(){
    if (this.$image.width() > this.$image.height()) {
      this._fitHorizontal();
    } else {
      this._fitVertical();
    }
    this._centerImage();
  };
  
  BSImagifyFitter.prototype._scaleImage = function(){
    if (this.$image.width() > this.$image.height()) {
      this._fitVertical();
    } else {
      this._fitHorizontal();
    }
    this._alignImage();
  };
  
  BSImagifyFitter.prototype._fitHorizontal = function(){
    if (this.$image.height() >= this.$wrapper.height()) {
      this.$image.height(this.$wrapper.height());
    }
  };
  
  BSImagifyFitter.prototype._fitVertical = function(){
    if (this.$image.width() >= this.$wrapper.width()) {
      this.$image.width(this.$wrapper.width());
    }
  };
  
  BSImagifyFitter.prototype._alignImage = function(){
    var style = {};
    style.left = (this.$wrapper.width() - this.$image.width()) / 2;
/*
    switch (this.settings.fit) {
      case 'crop':
        this._cropImage();
        break;
      case 'scale':
        this._scaleImage();
        break;
    }
    
    
    if(this.settings.align == 'top'){
      
    } else if(){
      
    } else 
*/
  
/*
    var top = (this.$wrapper.height() - this.$image.height()) / 2;
    var left
    this.$image.css({
      marginTop: top,
      marginLeft: left
    });
*/
  };
  
  BSImagifyFitter.prototype._resetImageCSS = function(){
    this.$image.css({
      maxWidth: 'none'
    });
  };

  /***
   * jQuery-ify
   ***/
   
  $.fn.bs_imagify = function( options ) {
    // collect settings
    var settings = $.extend( {}, $.fn.bs_imagify.defaults, options );
    // build plugin
    return this.each(function(){
      var $ele = $(this);
      $ele.data('_bs_imagify', new BSImagify($ele, settings));
    });
  };
  
  // Default settings
  $.fn.bs_imagify.defaults = {
               fit: 'crop',   // crop|scale
             ratio: '1:1',    // aspect ratio for image container
            format: 'ratio',  // ratio|square|landscape|portrait
             align: 'middle', // top|middle|bottom
    landscapeRatio: '4:3',    // default ratio for landscape
     portraitRatio: '3:4'     // default ratio for portrait
  };

}(jQuery));