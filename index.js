// ==UserScript==
// @name         Not working YouTube spacebar!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixed space bar not working after switching windows with Alt + Tab
// @author       namugach
// @match        https://www.youtube.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// ==/UserScript==


const obj = {
  isAltKey: false,
  isBlur: false,
  activeVideo: true,
  getAsyncValue(callback, time = 1000) {
    return new Promise(res => {
      const id = setInterval(() => {
        const value = callback();
        if (value) {
          res(value);
          clearInterval(id);
        }
      }, time);
    });
  },
  /**
   * @param {HTMLVideoElement} elem 
   * @param {string} code 
   */
  checkVideoPausedAndSetActive(elem, code) {
    if (elem.paused) {
      if (code === "ArrowRight" || code === "ArrowLeft") {
        this.activeVideo = false;
      }
    }
  },
  async setEvent() {
    /**
     * @type {HTMLVideoElement}
     */
    const video = await this.getAsyncValue(() => {
      return document.querySelector('video.html5-main-video');
    });
    const controls = document.querySelector(".ytp-chrome-controls");


    window.addEventListener("blur", () => {
      this.isBlur = true;
      if (this.isAltKey) {
        this.activeVideo = false;
      }
    });


    video.addEventListener("click", e => {
      this.isBlur = false;
      this.isAltKey = false;
      this.activeVideo = true;
    });

    controls.addEventListener("click", e => {
      this.isBlur = false;
      this.isAltKey = false;
      this.activeVideo = !(
        e.target.className === "ytp-play-button ytp-button" ||
        e.target.className === "ytp-mute-button ytp-button"
      )
    });
    window.addEventListener("keydown", e => {
      if (e.key === 'Alt') this.isAltKey = true;
      this.checkVideoPausedAndSetActive(video, e.code);
      if (this.activeVideo) return;
      if (e.code === "Space") {
        this.isAltKey = false;
        this.isBlur = false;
        video.paused ? video.play() : video.pause()
      }
    });
  },

  main() {
    this.setEvent();
  }
}

obj.main();


