<div align="center">
  <a href="https://github.com/vanillawc/wc-carousel-lite/releases"><img src="https://badgen.net/github/tag/vanillawc/wc-carousel-lite" alt="GitHub Releases"></a>
  <a href="https://www.npmjs.com/package/@vanillawc/wc-carousel-lite"><img src="https://badgen.net/npm/v/@vanillawc/wc-carousel-lite" alt="NPM Releases"></a>
  <a href="https://bundlephobia.com/result?p=@vanillawc/wc-carousel-lite"><img src="https://badgen.net/bundlephobia/minzip/@vanillawc/wc-carousel-lite" alt="Bundlephobia"></a>
  <a href="https://github.com/vanillawc/wc-carousel-lite/actions"><img src="https://github.com/vanillawc/wc-carousel-lite/workflows/Latest/badge.svg" alt="Latest Status"></a>
  <a href="https://github.com/vanillawc/wc-carousel-lite/actions"><img src="https://github.com/vanillawc/wc-carousel-lite/workflows/Release/badge.svg" alt="Release Status"></a>

  <a href="https://discord.gg/aSWYgtybzV"><img alt="Discord" src="https://img.shields.io/discord/723296249121603604?color=%23738ADB"></a>
</div>

# wc-carousel-lite

A web component that wraps HTML elements and forms a horizontal carousel slider out of them.

Live demo available [here.](http://135.181.40.67/wc-carousel-lite/)

## Features
Wc-carousel-lite is a standalone vanilla JS web component that does not use shadow DOM.

Component features include:
- content agnostic: carousel items should be able to contain any HTML
- responsive: adapts to different screen widths automatically
- infinite looping of items
- support for swipe gestures (mouse & touch)
- keyboard control (left/right arrow)
- autoplay

## Usage
- create item containers by assigning item class to them
- add content inside the containers
- wrap the item containers inside a carousel component
- set necessary carousel style (width, height)

**HTML example:**

 ```html
     <wc-carousel-lite>
        <div class='item' style="width:200px">
          <img src="./myimage_1.png">
        </div>
        <div class='item' style="width:100px">
          <img src="./myimage_2.png">
        </div>
        <div class='item' style="width:300px">
          <img src="./myimage_3.png">
        </div>
     </wc-carousel-lite>    
 ```
**Styling the carousel:**

 ```css
   wc-carousel-lite {
    height: 200px;
    width: 500px;
    margin: auto;
    display: flex;
  }
```

**Setting width of the space between items:**

```css
   .item {
     margin-left: 20px;
     margin-right: 20px;
  }
```

**Another HTML example, using images directly as items:**

 ```html
     <wc-carousel-lite>
       <img src="./myimage_1.png" class="item" width="200">
       <img src="./myimage_2.png" class="item" width="100">
       <img src="./myimage_3.png" class="item" width="300">
     </wc-carousel-lite>    
 ```

**Note! Carousel item widths should always be set explicitly.**

## Including the component to an HTML file

1. Import polyfill, this is not needed for modern browsers:

    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements/1.4.2/custom-elements.min.js"></script>
    ```

2. Import custom element:

    ```html
    <script defer src='wc-carousel-lite.min.js'></script>
    ```

3. Start using it!

    ```html
     <wc-carousel-lite>
       <img src="https://placekitten.com/g/400/200" class="item" width="400">
       <img src="https://placekitten.com/g/300/200" class="item" width="300">
       <img src="https://placekitten.com/g/250/200" class="item" width="250">      
     </wc-carousel-lite>    
    ```

## Including the component from NPM

1. Install and import polyfill, this is not needed for modern browsers:

   See https://www.npmjs.com/package/@webcomponents/custom-elements

2. Install wc-menu-wrapper NPM package:

    ```console
    npm i @vanillawc/wc-carousel-lite
    ```

3. Import custom element:

    ```javascript
    import '@vanillawc/wc-carousel-lite'
    ```

4. Start using it:

   ```javascript
   let carousel = document.createElement("wc-carousel-lite");
   carousel.transitionDuration = 1000;
   carousel.infinite = true;
   carousel.autoplay = true;
   carousel.centerBetween = true;
   
   let img = document.createElement("img");
   img.setAttribute("src", "./myimage_1.png");
   img.setAttribute("width", 300);
   img.classList.add("item");
   carousel.appendChild(img);   
   
   let img_2 = document.createElement("img");
   img_2.setAttribute("src", "./myimage_2.png");
   img_2.setAttribute("width", 300);
   img_2.classList.add("item");
   carousel.appendChild(img_2);
   
   document.body.appendChild(carousel);
   ```

## Attributes

### infinite

If defined, the carousel will be in infinite looping mode.

By default, the carousel will not be in infinite looping mode.

This attribute is a boolean attribute, also known as a valueless attribute.

HTML example:

```html
<wc-carousel-lite infinite>
```

### init-item

Defines which item will be initially shown at the carousel midpoint.

Item numbering begins from zero.

Default value is 0.

HTML example:

```html
<wc-carousel-lite init-item=1>
```

### autoplay

If defined, the carousel will automatically shift items.

By default, the the carousel will not shift items automatically.

This attribute is a boolean attribute, also known as a valueless attribute.

HTML example:

```html
<wc-carousel-lite autoplay>
```

### interval

Defines autoplay shift interval in milliseconds.

Default value is 1000.

This value must be equal or bigger than transition duration.

HTML example:

```html
<wc-carousel-lite interval=2000>
```

### transition-duration

Defines item shift duration in milliseconds.

Default value is 0, meaning that that the shift takes place instantly.

This value must be equal or smaller than interval.

HTML example:

```html
<wc-carousel-lite transition-duration=1000>
```

### transition-type

Defines the speed curve of the item shift transition effect.

For possible attribute values, see https://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp

Default value is 'ease'.

HTML example:

```html
<wc-carousel-lite transition-type='linear'>
```

### center-between

If defined, the items are centered so that the carousel midpoint is between the items.

By default, the items are centered so that the carousel midpoint is in the middle of item.

This attribute is a boolean attribute, also known as a valueless attribute.

HTML example:

```html
<wc-carousel-lite center-between>
```

### direction

Defines autoplay shift direction.

Attribute value must be either 'right' or 'left'

Default value is left (items will shift to left).

HTML example:

```html
<wc-carousel-lite direction='right'>
```

### no-touch

If defined, touch swiping is disabled.

By default, touch swiping is enabled.

This attribute is a boolean attribute, also known as a valueless attribute.

HTML example:

```html
<wc-carousel-lite no-touch>
```

### item

Defines new item class name, if the default class name 'item' can not be used.

HTML example:

```html
<wc-carousel-lite item='slide'>
  <img src="https://placekitten.com/g/400/200" class="slide" width="400">
  <img src="https://placekitten.com/g/300/200" class="slide" width="300">
  <img src="https://placekitten.com/g/250/200" class="slide" width="250">      
</wc-carousel-lite>
```

### touchVelocityLimit

Defines the swipe velocity limit for item shift boosting.

When touch swipe velocity is bigger than the limit, items are shifted with an additional shift.

Default value is 1.5 (pixels per millisecond).

This attribute can't be assigned as an HTML attribute.

### mouseVelocityLimit

Defines the swipe velocity limit for item shift boosting.

When mouse swipe velocity is bigger than the limit, items are shifted with an additional shift.

Default value is 3.0 (pixels per millisecond).

This attribute can't be assigned as an HTML attribute.

### minShiftRequired

Minimum horizontal swipe movement required to shift an item.

Default value is 30 (pixels).

This attribute can't be assigned as an HTML attribute.

## Setting attributes dynamically

*initItem* and *infinite* attributes should be set only when the carousel is not appended to DOM.

*noTouch* value can't be changed once the carousel is appended to DOM.

Example:

   ```javascript
   let carousel = document.createElement("wc-carousel-lite");

   carousel.initItem = 2;
   carousel.transitionType = 'linear';
   carousel.transitionDuration = 1000;
   carousel.interval = 2000;
   carousel.infinite = true;
   carousel.autoplay = true;
   carousel.centerBetween = true;
   carousel.direction = right;
   carousel.touchVelocityLimit = 1;
   carousel.mouseVelocityLimit = 2;
   carousel.minShiftRequired = 20;
   carousel.noTouch = true;

   // Add items:
   let img = document.createElement("img");
   img.setAttribute("src", "./myimage_1.png");
   img.setAttribute("width", 300);
   img.classList.add("item");
   carousel.appendChild(img);   

   let img_2 = document.createElement("img");
   img_2.setAttribute("src", "./myimage_2.png");
   img_2.setAttribute("width", 300);
   img_2.classList.add("item");
   carousel.appendChild(img_2);

   // Finally append to DOM:
   document.body.appendChild(carousel);
   ```

## Methods

Methods should not be used unless the carousel is appended to DOM.

### next( shift )

Shifts items to left.

Parameter shift is a number indicating the number of items to be shifted.

Parameter default value is 1.

### prev( shift )

Shifts items to right.

Parameter shift is a number indicating the number of items to be shifted.

Parameter default value is 1.

### goto( index )

Centers item according to index.

Parameter index is a number indicating the item ordinal number beginning from zero.

### play

Starts autoplay.

### stop

Stops autoplay.

## Adding and removing items dynamically

Carousel does not have specific methods to add / remove items dynamically.

When carousel is appended to DOM, items can not be added or removed.

To add / remove items dynamically, do the following:

1. Remove carousel from DOM
2. Add / remove items from the carousel by using appendChild / remove
3. Append carousel back to DOM

## Default attribute values

Default values are defined and modifiable in the custom element constructor.

See file *wc-carousel-lite.js* in *dist* folder.

```javascript
    this.item = "item";
    this.initItem = 0;
    this.transitionDuration = 0;
    this.transitionType = "ease";
    this.interval = 1000;
    this.direction = "left";
    this.touchVelocityLimit = 1.5; // pixels per millisecond
    this.mouseVelocityLimit = 3.0; // pixels per millisecond
    this.minShiftRequired = 30; // minimum x shift required to shift the item (pixels)
```

Infinite, no-touch, center-between and autoplay are all disabled by default and not initialized in constructor at all.

To enable them by default, add following lines to constructor:

```javascript
    this.infinite = true;
    this.noTouch = true;
    this.centerBetween = true;
    this.autoplay = true;
```

## Building

Unminified scripts in the dist folder can be used and modified as such, there are no build scripts available for them.

Building is done by executing the minifier script minify.cmd, which is a Linux bash shell script.

Minify.cmd can be found from dist folder.

Building (minifying) requires [terser](https://github.com/terser/terser) command line tool to be installed. It can be installed with following command:
```console
 npm install terser -g
   ```
## Contributing

Questions, suggestions and bug reports are welcome. Safari testing would be nice.

## To do

- dots
- add / remove item methods

## License

Copyright (c) 2020 Jussi Utunen

Licensed under the MIT License
