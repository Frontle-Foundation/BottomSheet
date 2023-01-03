import {findHighestZIndex} from './util/zIndexManager.js';

export class BottomSheet {
  status = {};

  // required
  parents = '';
  html = '';

  // options
  height = 50;
  startY = 0;
  sheetClass = '';
  contentsClass = '';
  backgroundClass = '';
  backgroundClickExit = true;

  beforeOpen = () => {};
  afterOpen = () => {};
  beforeEnd = () => {};
  afterEnd = () => {};

  constructor(parents, html) {
    if (parents === null) {
      throw {
        message: 'parents must be entered',
      };
    }
    if (html === null) {
      throw {message: 'html must be entered'};
    }

    this.parents = parents;
    this.html = html;
  }

  async open() {
    // create id
    const id = String(BottomSheet.makeID(32));

    // get z-index
    const zIndex = findHighestZIndex(this.parents);

    // set sheet id
    const sheetId = 'sheet_' + id;

    // set status
    this.status[sheetId] = {};
    this.status[sheetId].mousedown = false;
    this.status[sheetId].mouseup = false;

    // add default sheet css
    if (document.getElementById('frontleBottomSheetCSS') === null) {
      const sheetCSSElement = document.createElement('style');
      sheetCSSElement.setAttribute('id', 'frontleBottomSheetCSS');
      sheetCSSElement.innerHTML = `
        .frontleBottomSheet{
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        .frontleBottomSheetBackground{
            position: relative;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: #000000;
            opacity: 0;
            transition: opacity ease 0.4s 0s;
        }
        .frontleBottomSheetContents{
            position: absolute;
            width: 100%;
            bottom: 0vh;
            margin: 0 auto;
            padding: 0rem 1.5rem 0rem 1.5rem;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            box-sizing: border-box;
            background: #ffffff;
            overflow: hidden;
        }
        .frontleBottomSheetBar{
            position: relative;
            display: block;
            padding-top: 0.5rem;
            padding-bottom: 1rem;
        }
        .frontleBottomSheetBarLine{
            position: relative;
            display: block;
            margin: 0 auto;
            width: 2.5rem;
            height: 0.3125rem;
            border-radius: 10px;
            background: #c4c4c4;
        }
        .frontleBottomSheetHtml{
            position: relative;
            display: block;
            width: 100%;
            height: calc(100% - 2.75rem);
            overflow: scroll;
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
        }
        .frontleBottomSheetHtml::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera*/
        }
      `;
      document.head.insertBefore(sheetCSSElement, document.head.childNodes[0]);
    }

    // set html
    const html = /* html */ `
      <div class="frontleBottomSheetBackground ${this.backgroundClass}" style="z-index: ${zIndex + 1}"></div>

      <div class="frontleBottomSheetContents ${this.contentsClass}" style="
        max-height: ${this.height}vh;
        height: ${this.height}vh;
        z-index: ${zIndex + 2};
        bottom: -${this.height}vh;
        transition: bottom ease 0.4s 0s;
      ">
        <div class="frontleBottomSheetBar">
          <div class="frontleBottomSheetBarLine"></div>
        </div>
        <div class="frontleBottomSheetHtml">${this.html}</div>
      </div>
    `;

    // add sheet
    const sheetElement = document.createElement('div');
    sheetElement.setAttribute('id', sheetId);
    sheetElement.className = `frontleBottomSheet ${this.sheetClass}`;
    sheetElement.innerHTML = html;
    sheetElement.style.zIndex = String(zIndex);
    document.querySelector(this.parents).append(sheetElement);

    // run lifecycle
    await this.beforeOpen(sheetId);

    // start sheet animation
    setTimeout(() => {
      // background opacity
      const sheetBackground = sheetElement.querySelector('.frontleBottomSheetBackground');
      if (sheetBackground !== null) {
        sheetBackground.style.opacity = '0.4';
      }

      // contents pos move up
      const sheetContents = sheetElement.querySelector('.frontleBottomSheetContents');
      if (sheetContents !== null) {
        sheetContents.style.bottom = `${this.startY}vh`;
      }
    }, 100);

    // end sheet animation
    setTimeout(async () => {
      // set mouse down event
      const sheetBar = sheetElement.querySelector('.frontleBottomSheetBar');
      if (sheetBar !== null) {
        this.status[sheetId].mouseDownEvent = e => {
          e.preventDefault();
          this.eventMouseDown(sheetId);
        };
        sheetBar.addEventListener('mousedown', this.status[sheetId].mouseDownEvent, false);

        this.status[sheetId].touchStartEvent = () => {
          this.eventMouseDown(sheetId);
        };
        sheetBar.addEventListener('touchstart', this.status[sheetId].touchStartEvent, false);
      }

      const sheetContents = sheetElement.querySelector('.frontleBottomSheetContents');

      // set mouse up event
      this.status[sheetId].mouseUpEvent = e => {
        e.preventDefault();
        this.eventMouseUp(e, sheetId, sheetContents);
      };
      document.addEventListener('mouseup', this.status[sheetId].mouseUpEvent, false);

      this.status[sheetId].touchEndEvent = e => {
        this.eventMouseUp(e.changedTouches[0], sheetId, sheetContents);
      };
      document.addEventListener('touchend', this.status[sheetId].touchEndEvent, false);

      // set mouse move event
      this.status[sheetId].mouseMoveEvent = e => {
        e.preventDefault();
        this.eventMouseMove(e, sheetId, sheetContents);
      };
      document.addEventListener('mousemove', this.status[sheetId].mouseMoveEvent, false);

      this.status[sheetId].touchMoveEvent = e => {
        this.eventMouseMove(e.changedTouches[0], sheetId, sheetContents);
      };
      document.addEventListener('touchmove', this.status[sheetId].touchMoveEvent, false);

      // set close event
      if (this.backgroundClickExit === true) {
        const sheetBackground = sheetElement.querySelector('.frontleBottomSheetBackground');
        if (sheetBackground !== null) {
          sheetBackground.addEventListener(
            'click',
            () => {
              this.close(sheetId);
            },
            false,
          );
        }
      }

      // delete animation
      if (sheetContents !== null) {
        sheetContents.style.removeProperty('transition');
      }

      // run lifecycle
      await this.afterOpen(sheetId);
    }, 0.4 * 1000 + 100);

    return sheetId;
  }

  async close(sheetID) {
    // run lifecycle
    await this.beforeEnd(sheetID);

    const sheetElement = document.getElementById(sheetID);

    // background opacity
    const sheetBackground = sheetElement.querySelector('.frontleBottomSheetBackground');
    if (sheetBackground !== null) sheetBackground.style.opacity = '0';

    // contents pos move down
    const sheetContents = sheetElement.querySelector('.frontleBottomSheetContents');
    if (sheetContents !== null) {
      sheetContents.style.transition = 'bottom ease 0.4s 0s';
      sheetContents.style.bottom = `-${this.height}vh`;
    }

    // end sheet animation
    setTimeout(async () => {
      document.removeEventListener('mousedown', this.status[sheetID].mouseDownEvent);
      document.removeEventListener('touchstart', this.status[sheetID].touchStartEvent);

      document.removeEventListener('mousemove', this.status[sheetID].mouseMoveEvent);
      document.removeEventListener('touchmove', this.status[sheetID].touchMoveEvent);

      document.removeEventListener('mouseup', this.status[sheetID].mouseUpEvent);
      document.removeEventListener('touchend', this.status[sheetID].touchEndEvent);

      delete this.status[sheetID];

      // remove sheet
      if (sheetElement !== null) sheetElement.remove();

      // run lifecycle
      await this.afterEnd(sheetID);
    }, 0.4 * 1000);
  }

  eventMouseDown(sheetID) {
    if (this.status[sheetID].mouseup === false) {
      this.status[sheetID].mousedown = true;
    }
  }

  eventMouseUp(e, sheetID, element) {
    // if mouse down
    if (this.status[sheetID].mousedown) {
      this.status[sheetID].mousedown = false;
      this.status[sheetID].mouseup = true;

      // positioning
      let mouseY = window.innerHeight - e.clientY;
      if (mouseY < 0) mouseY = 0;
      if (mouseY > window.innerHeight) mouseY = window.innerHeight;
      let moveY = (mouseY / window.innerHeight) * 100 - Number(this.height);
      if (moveY >= 0) moveY = 0;

      // Move to full height
      if (Number(moveY) >= Number(this.startY)) {
        let bottomVH;
        if (Number(this.startY) / 2 <= Number(moveY)) {
          bottomVH = 0;
        } else {
          bottomVH = this.startY;
        }

        // start animation
        element.style.transition = 'bottom ease 0.4s 0s';
        element.style.bottom = `${bottomVH}vh`;

        // end animation
        setTimeout(() => {
          element.style.removeProperty('transition');

          this.status[sheetID].mouseup = false;
        }, 400);
      }
      // close bottom sheet
      else {
        this.close(sheetID);
      }
    }
  }

  eventMouseMove(e, sheetID, element) {
    if (this.status[sheetID].mousedown) {
      let mouseY = window.innerHeight - e.clientY;
      if (mouseY < 0) mouseY = 0;
      if (mouseY > window.innerHeight) mouseY = window.innerHeight;

      let moveY = (mouseY / window.innerHeight) * 100 - Number(this.height);
      if (moveY >= 0) moveY = 0;
      element.style.bottom = `${moveY}vh`;
    }
  }

  static makeID(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
