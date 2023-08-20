function create(subscriber) {
  var observable = {
    subscribe: function (observerOrNext, error, complete) {
      const realObserver = new Observer(observerOrNext, error, complete);
      subscriber(realObserver);
      return realObserver;
    },
  };
  return observable;
}

var observer = {
  next: function (value) {
    console.log(value);
  },
  complete: function () {
    console.log("complete!");
  },
};

const emptyObserver = {
  next: () => {},
  error: (err) => {
    throw err;
  },
  complete: () => {},
};

class Observer {
  constructor(destinationOrNext, error, complete) {
    switch (arguments.length) {
      case 0:
        this.destination = this.saveObserver(emptyObserver);
        break;
      case 1:
        if (!destinationOrNext) {
          // 空的 observer
          this.destination = this.saveObserver(emptyObserver);
          break;
        }
        if (typeof destinationOrNext === "object") {
          // 傳入了 observer 物件
          this.destination = this.saveObserver(destinationOrNext);
          break;
        }
      default:
        // 如果上面都不是，代表應該是傳入了一到三個 function
        this.destination = this.saveObserver(
          destinationOrNext,
          error,
          complete
        );
        break;
    }
  }

  saveObserver(observerOrNext, error, complete) {
    let next;
    if (typeof observerOrNext === "function") {
      next = observerOrNext;
    } else if (observerOrNext) {
      next =
        observerOrNext.next ||
        function () {
          return {};
        };
      error =
        observerOrNext.error ||
        function (err) {
          throw err;
        };
      complete =
        observerOrNext.complete ||
        function () {
          return {};
        };
    }
    return {
      next,
      error,
      complete,
    };
  }

  next(value) {
    if (!this.isStopped && this.next) {
      // 先判斷是否停止過
      try {
        this.destination.next(value); // 傳送值
      } catch (err) {
        this.unsubscribe();
        throw err;
      }
    }
  }

  error(err) {
    if (!this.isStopped && this.error) {
      try {
        this.destination.error(err); // 傳送錯誤
      } catch (err) {
        this.unsubscribe();
        throw err;
      }
      this.unsubscribe();
    }
  }

  complete() {
    if (!this.isStopped && this.complete) {
      // 先判斷是否停止過
      try {
        this.destination.complete(); // 發送停止訊息
      } catch (err) {
        this.unsubscribe();
        throw err;
      }
      this.unsubscribe(); // 發送停止訊息後退訂
    }
  }

  unsubscribe() {
    this.isStopped = true; // 偷塞一個屬性 isStopped
  }
}

var observable = create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
  observer.next("not work");
});
observable.subscribe(observer);
