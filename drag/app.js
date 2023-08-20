// 監聽要拖拉的項目及 body ，使用 fromEvent
const dragDOM = document.getElementById("drag");
const body = document.body;

const mouseDown = Rx.Observable.fromEvent(dragDOM, "mousedown");
const mouseUp = Rx.Observable.fromEvent(body, "mouseup");
const mouseMove = Rx.Observable.fromEvent(body, "mousemove");

const source = mouseDown
  .map((event) => mouseMove.takeUntil(mouseUp))
  .concatAll()
  .map((event) => ({
    x: event.clientX,
    y: event.clientY,
  }))
  .subscribe((pos) => {
    dragDOM.style.left = `${pos.x}px`;
    dragDOM.style.top = `${pos.y}px`;
  });

console.log(1);
