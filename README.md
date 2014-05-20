# Uniform Thumbnails

A jQuery plugin that will crop, scale and align your thumbnail images. Usefull for when you have rows of things like product thumbs but can't control the image processing before they are uploaded.

**Note:** It will not scale images any bigger than they can go.

## Installation

Download the repo or just grab the minified file from `dist/jquery.uniform_thumbnails.min.js`.

## Usage

Select the element that wraps your thumbnail image and call the `uniform_thumbnails` plugin.

    <a class="image-wrapper" href="#">
      <img src="http://placehold.it/500x700">
    </a>
    
    <script>
      $('.image-wrapper').uniform_thumbnails();
    </script>
    
## Options

### Fitting

You can specify the fit option with either `crop` or `scale`.  
The default is `crop`.

    $('.image-wrapper').uniform_thumbnails({
      fit: 'scale'
    });
    
### Format & Ratio

You can set either the format or ratio.  
**Format** options are `square`, `landscape`, `portrait` or `ratio`.  
Default is `ratio` which tells the plugin to use the ratio option.

    $('.image-wrapper').uniform_thumbnails({
      format: 'square'
    });

For a more advanced format you can use **ratio**. Options are a string layed out like: `[width]:[height]` e.g. `'1:1'`, `'4:6'` or `'5:2'`.  
The default is `'1:1'`.

    $('.image-wrapper').uniform_thumbnails({
      ratio: '6:4'
    });
    
### Alignment

This sets the vertical alignment of the image inside the wrapper element. Images will always be centered horizontally.  
Options are `top`, `middle` and `bottom`. Default is `middle`.

    $('.image-wrapper').uniform_thumbnails({
      align: 'bottom'
    });
    
## Demo

There is an `index.html` in the root folder. Feel free to play around with it to see how things work.
    
## Bugs and Issues

Please submit an [issue](https://github.com/luciddesign/uniform-thumbnails/issues) or [pull request](https://github.com/luciddesign/uniform-thumbnails/pulls).

## Thanks

We use [imagesLoaded](https://github.com/desandro/imagesloaded) by [desandro](https://github.com/desandro).