class Observer {
  constructor(data) {
    this.observer(data);
  }
  // 要对data中原有的数据 改成get和set形式
  observer(data) {
    if (typeof data !== "object") {
      return;
    }
    // 要将数据一一劫持 想获取到data的key和value
    Object.keys(data).forEach((key) => {
      this.observer(data[key]); //深度递归劫持
      //劫持
      this.defineReactive(data, key, data[key]);
    });
  }
  defineReactive(data, key, value) {
    let that = this;
    let dep = new Deep(); //每个变化的数据，都会对应一个数组，这个数组是存放所有更新的操作
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        Deep.target && dep.addSub(Deep.target);
        //当取值调用的方法
        return value;
      },
      set: function (newVal) {
        //当给data属性中
        if (newVal !== value) {
          value = newVal;
          that.observer(newVal);

          dep.notify(); //通知所有人数据更新了
        }
        // data[key]=newVal
      },
    });
  }
}

class Deep {
  constructor() {
    //订阅的数据
    this.subs = [];
  }
  //添加订阅
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}
