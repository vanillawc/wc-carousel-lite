
export class Customcarousel extends HTMLElement {
  constructor() {
    super();
    this.item = "item";
    this.initItem = 0;
    this.transitionDuration = 0;
    this.transitionType = "ease";
    this.interval = 1000;
    this.direction = "left";
    this.touchVelocityLimit = 1.5; // pixels per millisecond
    this.mouseVelocityLimit = 3.0; // pixels per millisecond
    this.minShiftRequired = 30; // minimum x shift required to shift the item (pixels)
    this.autoPlayIntervalId = null;
    this.intervalId = null;
    this.carouselImages = [];
  }

  static get observedAttributes() {
    return [
      "infinite",
      "init-item",
      "center-between",
      "autoplay",
      "interval",
      "direction",
      "transition-duration",
      "transition-type",
      "item",
      "no-touch"
    ];
  }

  disconnectedCallback() {
    while (this.itemsContainer.firstChild) {
      this.itemsContainer.firstChild.remove();
    }
    for (let i = 0; i < this.originalEntries.length; i++) {
      this.appendChild(this.originalEntries[i].cloneNode(true));
    }
    this.originalEntries = [];
    this.currentFactor = null;
    this.stop(this.autoplay);
    this.connected = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "infinite") {
      this.infinite = true;
    } else if (name === "init-item") {
      this.initItem = parseInt(newValue);
    } else if (name === "center-between") {
      this.centerBetween = true;
    } else if (name === "transition-duration") {
      this.transitionDuration = parseInt(newValue);
    } else if (name === "transition-type") {
      this.transitionType = newValue;
    } else if (name === "autoplay") {
      this.autoplay = true;
    } else if (name === "interval") {
      this.interval = parseInt(newValue);
    } else if (name === "direction") {
      this.direction = newValue;
    } else if (name === "item") {
      this.item = newValue;
    } else if (name === "no-touch") {
      this.noTouch = true;
    }
  }

  connectedCallback() {
    // https://stackoverflow.com/questions/58676021/accessing-custom-elements-child-element-without-using-slots-shadow-dom
    setTimeout(() => {
      this._init();
    }, 0);
    this.connected = true;
  }

  next(shift = 1) {
    if (shift === 0) {
      shift = 1;
    }

    if (!this.infinite) {
      if (
        (!this.centerBetween && this.currentlyCentered + (shift - 1) < this.itemsCount - 1) ||
        (this.centerBetween && this.currentlyCentered < this.itemsCount - 3)
      ) {
        this._stopTransition();
      }
      shift = this._shiftReducer("l", shift);
      this._centerItemByIndex(this.currentlyCentered + shift);
      return;
    }

    if (parseInt(getComputedStyle(this.itemsContainer).left) < 0) {
      this._stopTransition();
      this._moveItemFromLeftToRight(shift);
      this._centerItemByIndex(this.currentlyCentered + shift);
      this._updateOriginalIndex(shift);
    }
  }

  prev(shift = 1) {
    if (shift === 0) {
      shift = 1;
    }

    if (!this.infinite) {
      if (this.currentlyCentered < 0) {
        this._stopTransition();
      }
      shift = this._shiftReducer("r", shift);
      this._centerItemByIndex(this.currentlyCentered - shift);
      return;
    }

    if (
      this.itemsContainer.offsetWidth + parseInt(getComputedStyle(this.itemsContainer).left) >
      this.offsetWidth
    ) {
      this._stopTransition();
      this._moveItemFromRightToLeft(shift);
      this._centerItemByIndex(this.currentlyCentered - shift);
      this._updateOriginalIndex(-shift);
    }
  }

  _stopTransition() {
    this.itemsContainer.style.left = getComputedStyle(this.itemsContainer).left;
  }

  _centerItemByIndex(index) {
    let center = this.offsetWidth / 2;
    let entries = this.itemsContainer.querySelectorAll("." + this.item);
    if ((this.centerBetween && index === entries.length - 1) || !entries[index]) {
      return;
    }
    let i,
      nextMarginMiddle,
      style,
      margin,
      sum = 0;
    for (i = 0; i < index; i++) {
      style = getComputedStyle(entries[i]);
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      sum += entries[i].offsetWidth + margin;
    }
    nextMarginMiddle = parseFloat(getComputedStyle(entries[i]).marginRight);

    let initLeftMargin = parseFloat(getComputedStyle(entries[0]).marginLeft);
    let itemWidthHalf = this.centerBetween
      ? entries[index].offsetWidth + nextMarginMiddle
      : entries[index].offsetWidth / 2;
    let left = center - (sum + initLeftMargin + itemWidthHalf);
    this.itemsContainer.style.transition = "left " + this.transitionDuration + "ms";
    this.itemsContainer.style.transitionTimingFunction = this.transitionType;
    this.itemsContainer.style.left = left + "px";
    this.currentlyCentered = index;
  }

  goto(index) {
    if (index > this.originalEntries.length - 1) {
      return;
    }

    if (!this.infinite) {
      this._centerItemByIndex(index);
      return;
    }

    let distance, distance_2;
    // Note: this.originalIndex is applicable only when this.infinite is truthy
    distance = index - this.originalIndex;

    if (index > this.originalIndex) {
      distance_2 = index - this.originalIndex - this.originalEntries.length;
    } else {
      distance_2 = index - this.originalIndex + this.originalEntries.length;
    }

    let shortest = Math.abs(distance) <= Math.abs(distance_2) ? distance : distance_2;

    if (shortest < 0) {
      this._moveItemFromRightToLeft(Math.abs(shortest));
    } else if (shortest > 0) {
      this._moveItemFromLeftToRight(Math.abs(shortest));
    }

    this._centerItemByIndex(this.currentlyCentered + shortest);
    this._updateOriginalIndex(shortest);
  }

  _itemShift(shift) {
    this.itemsContainer.style.left = parseInt(this.itemsContainer.style.left) + shift + "px";
  }

  _copyItems(factor) {
    while (this.itemsContainer.firstChild) {
      this.itemsContainer.firstChild.remove();
    }

    let items = this.querySelectorAll("." + this.item);

    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        this.itemsContainer.appendChild(items[i]);
      }
      factor--;
    }

    for (let ii = 0; ii < factor; ii++) {
      for (let i = 0; i < this.originalEntries.length; i++) {
        this.itemsContainer.appendChild(this.originalEntries[i].cloneNode(true));
      }
    }

    this.itemsCount = this.itemsContainer.querySelectorAll("." + this.item).length;
  }

  _getItemWidth(item) {
    let style, margin;
    style = getComputedStyle(item);
    margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    let width = item.offsetWidth;
    return width + margin;
  }

  _moveItemFromLeftToRight(count = 1) {
    for (let i = 0; i < count; i++) {
      this.itemsContainer.style.transition = "";

      let itemToBeRemoved = this.itemsContainer.querySelectorAll("." + this.item)[0];
      this._itemShift(this._getItemWidth(itemToBeRemoved));
      this.itemsContainer.appendChild(this.itemsContainer.removeChild(itemToBeRemoved));
      this.currentlyCentered--;
    }
  }

  _moveItemFromRightToLeft(count = 1) {
    for (let i = 0; i < count; i++) {
      this.itemsContainer.style.transition = "";

      let itemToBeRemoved = [...this.itemsContainer.querySelectorAll("." + this.item)].pop();
      //let itemToBeRemoved = this.itemsContainer.querySelectorAll('.' + this.item)[this.itemsContainer.querySelectorAll('.' + this.item).length - 1]
      this._itemShift(-this._getItemWidth(itemToBeRemoved));
      this.itemsContainer.insertAdjacentElement(
        "afterbegin",
        this.itemsContainer.removeChild(itemToBeRemoved)
      );
      this.currentlyCentered++;
    }
  }

  _itemsInit() {
    if (!this.connected) {
      return;
    }

    if (!this.infinite) {
      this._centerItemByIndex(this.currentlyCentered);
      return;
    }

    let factor = parseInt((2.75 * this.offsetWidth) / this.initItemsWidth);

    if (this.originalEntries.length < 3) {
      factor += 3;
    }
    if (factor === 0) {
      factor++;
    }
    if (factor % 2) {
      factor++;
    }

    if (factor !== this.currentFactor) {
      this._copyItems(factor);
      let index;
      if (this.currentlyCentered) {
        index = this.originalIndex;
      } else {
        index = this.initItem;
      }
      this._centerItemByIndex(this.originalEntries.length * (factor / 2) + index);
      this._checkItemBalance();
      this.currentFactor = factor;
      this.originalIndex = index;
    } else {
      this.goto(this.originalIndex);
    }
  }

  _checkItemBalance() {
    //negative offset implies right side shortage of items
    //positive offset implies left side shortage of items
    let offset = this.itemsCount / 2 - this.currentlyCentered;

    if (offset === 0) {
      return;
    }

    if (offset < 0) {
      this._moveItemFromLeftToRight();
    } else if (offset > 0) {
      this._moveItemFromRightToLeft();
    }

    // potentially dangerous recursion!
    this._checkItemBalance();
  }

  _updateOriginalIndex(update) {
    for (let i = 0; i < Math.abs(update); i++) {
      if (update > 0) {
        if (this.originalIndex + 1 === this.originalEntries.length) {
          this.originalIndex = 0;
        } else {
          this.originalIndex++;
        }
      }
      if (update < 0) {
        if (this.originalIndex === 0) {
          this.originalIndex = this.originalEntries.length - 1;
        } else {
          this.originalIndex--;
        }
      }
    }
  }

  _autoplayHandler() {
    if (!this.infinite) {
      if (this.centerBetween && this.currentlyCentered >= this.itemsCount - 2) {
        this.direction = "right";
      } else if (this.currentlyCentered >= this.itemsCount - 1) {
        this.direction = "right";
      } else if (this.currentlyCentered === 0) {
        this.direction = "left";
      }
    }
    if (this.direction === "right") {
      this.prev();
    } else {
      this.next();
    }
  }

  stop(state = false) {
    clearInterval(this.autoPlayIntervalId);
    this.autoPlayIntervalId = null;
    this.autoplay = state;
  }

  play() {
    if (this.autoPlayIntervalId === null) {
      this._autoplayHandler();
      this.autoPlayIntervalId = setInterval(() => {
        this._autoplayHandler();
      }, this.interval);
      this.autoplay = true;
    }
  }

  _shiftReducer(dir, shift) {
    let remaining;
    if (dir === "l") {
      remaining =
        this.originalEntries.length - (this.centerBetween ? 2 : 1) - this.currentlyCentered;
    } else {
      remaining = this.currentlyCentered;
    }

    if (remaining < shift) {
      return remaining;
    }
    return shift;
  }

  _getItemIndex(elem) {
    if (!elem) {
      return null;
    }
    let i = 0;
    while ((elem = elem.previousSibling) !== null) {
      i++;
    }
    return i;
  }

  _downEventHandler(event) {
    let closestElement = event.target.closest("." + this.item);
    this.downEventItemIndex = this._getItemIndex(closestElement);

    event.preventDefault();
    if (event.pageX) {
      this.x = event.pageX;
      this.y = event.pageY;
    } else if (event.targetTouches[0].pageX) {
      this.x = event.targetTouches[0].pageX;
      this.y = event.targetTouches[0].pageY;
    }
    this.startTime = new Date().getTime();
  }

  _upEventHandler(event) {
    let elem;
    if (event.changedTouches) {
      elem = document.elementFromPoint(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
      );
    } else {
      elem = event.target;
    }

    let closestElement = elem.closest("." + this.item);
    let closestIndex = this._getItemIndex(closestElement);
    let shiftInItems;
    if (Number.isInteger(this.downEventItemIndex) && Number.isInteger(closestIndex)) {
      shiftInItems = Math.abs(this.downEventItemIndex - closestIndex);
    } else {
      shiftInItems = 1;
    }

    let xShift = (event.pageX ? event.pageX : event.changedTouches[0].pageX) - this.x;
    let yShift = (event.pageY ? event.pageY : event.changedTouches[0].pageY) - this.y;

    let elapsedTime = new Date().getTime() - this.startTime;
    let velocity = Math.abs(xShift / elapsedTime);

    if (velocity > this.touchVelocityLimit && event.changedTouches) {
      shiftInItems++; // boost touch swipe if it's above the velocity limit
    } else if (velocity > this.mouseVelocityLimit) {
      shiftInItems++; // boost mouse swipe if it's above the velocity limit
    }

    if (Math.abs(xShift) > this.minShiftRequired && Math.abs(xShift) > Math.abs(yShift)) {
      event.preventDefault();
      this.preventClick = true;
      if (xShift < -this.minShiftRequired) {
        this.next(shiftInItems);
      } else if (xShift > this.minShiftRequired) {
        this.prev(shiftInItems);
      }
    }
  }

  _clickHandler(event) {
    if (this.preventClick) {
      event.preventDefault();
    }
    this.preventClick = false;
    this.focus();
  }

  _keyDownEventHandler(event) {
    if (event.key === "ArrowRight") {
      this.prev();
    } else if (event.key === "ArrowLeft") {
      this.next();
    }
  }

  _checkImageLoading() {
    if (this.carouselImages.every((x) => x.complete === true)) {
      clearInterval(this.intervalId);
      this._finalInit();
      return true;
    }
  }

  _finalInit() {
    let style, margin;
    this.initItemsWidth = 0;
    for (let i = 0; i < this.originalEntries.length; i++) {
      style = getComputedStyle(this.originalEntries[i]);
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      this.initItemsWidth += this.originalEntries[i].offsetWidth + margin;
    }

    if (!this.infinite) {
      this._copyItems(1);
      this._centerItemByIndex(this.initItem);
    } else {
      this._itemsInit();
    }

    if (this.autoplay) {
      this.play();
    }
  }

  _init() {
    if (!this.isInitialized) {
      this.sliderContainer = this.appendChild(document.createElement("div"));
      this.sliderContainer.style.display = "flex";
      this.sliderContainer.style.overflow = "hidden";
      this.sliderContainer.style.width = "100%";
      this.itemsContainer = this.sliderContainer.appendChild(document.createElement("div"));
      this.itemsContainer.style.display = "flex";
      this.itemsContainer.style.position = "relative";
    }

    this.carouselImages = Array.from(this.querySelectorAll("img"));
    this.originalEntries = this.querySelectorAll("." + this.item);

    if (this.originalEntries.length === 0) {
      throw "couldn't find any children with " + this.item + " class";
    }

    if (this.initItem + 1 > this.originalEntries.length) {
      this.initItem = 0;
    }

    let style,
      allWidthsDefined = true;
    for (let i = 0; i < this.originalEntries.length; i++) {
      style = getComputedStyle(this.originalEntries[i]);
      if (parseFloat(style.width) === 0) {
        allWidthsDefined = false;
        break;
      }
    }

    if (allWidthsDefined) {
      this._finalInit();
    } else if (!this._checkImageLoading()) {
      this.intervalId = setInterval(() => {
        this._checkImageLoading();
      }, 100);
    }

    if (!this.isInitialized) {
      this.tabIndex = 0;

      if(!this.noTouch) {
        this.ontouchstart = this._downEventHandler;
        this.ontouchstart = this.ontouchstart.bind(this);

        this.ontouchend = this._upEventHandler;
        this.ontouchend = this.ontouchend.bind(this);
        /*
        this.ontouchcancel = this._upEventHandler
        this.ontouchcancel = this.ontouchcancel.bind(this)
        */
      }

      this.onmousedown = this._downEventHandler;
      this.onmousedown = this.onmousedown.bind(this);

      this.onmouseup = this._upEventHandler;
      this.onmouseup = this.onmouseup.bind(this);

      this.onclick = this._clickHandler;
      this.onclick = this.onclick.bind(this);

      this.onkeydown = this._keyDownEventHandler;
      this.onkeydown = this.onkeydown.bind(this);

      window.addEventListener("resize", () => this._itemsInit());
    }

    this.isInitialized = true;
  }
}

customElements.define("wc-carousel-lite", Customcarousel);
