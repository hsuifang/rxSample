// 第一步，取得會用到的 DOM
const video = document.getElementById("video");
const anchor = document.getElementById("anchor");

// 建立會用到的 observable
const scroll = Rx.Observable.fromEvent(document, "scroll");

scroll
  .map((e) => anchor.getBoundingClientRect().bottom < 0)
  .subscribe((bool) => {
    if (bool) {
      video.classList.add("video-fixed");
    } else {
      video.classList.remove("video-fixed");
    }
  });

const mouseDown = Rx.Observable.fromEvent(video, "mousedown");
const mouseUp = Rx.Observable.fromEvent(document, "mouseup");
const mouseMove = Rx.Observable.fromEvent(document, "mousemove");

const validValue = (value, max, min) => {
  return Math.min(Math.max(value, min), max);
};

mouseDown
  .filter((e) => video.classList.contains("video-fixed"))
  .map((e) => mouseMove.takeUntil(mouseUp))
  .concatAll()
  .withLatestFrom(mouseDown, (move, down) => {
    return {
      x: validValue(move.clientX - down.offsetX, window.innerWidth - 320, 0),
      y: validValue(move.clientY - down.offsetY, window.innerHeight - 180, 0),
    };
  })
  .subscribe((pos) => {
    video.style.top = pos.y + "px";
    video.style.left = pos.x + "px";
  });
