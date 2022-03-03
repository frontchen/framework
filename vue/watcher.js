//观察者的目的就是给需要变化的那个元素增加一个观察者，当数据变化后执行对应的方法
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    //用新值和旧值进行对比 如果发生变化就调用更新方法
    // 获取旧值
    this.value = this.get();
  }
  getVal(vm, expr) {
    //获取实例上对应的数据
    expr = expr.split(".");
    let data = vm.$data;
    return expr.reduce((prev, next) => {
      return prev[next];
    }, data);
  }
  get() {
    Deep.target = this;
    let value = this.getVal(this.vm, this.expr);
    Deep.target = null;
    return value;
  }
  //对外暴露的更新方法
  update() {
    let newValue = this.getVal(this.vm, this.expr);
    let oldValue = this.value;
    if (newValue !== oldValue) {
      this.cb(newValue, oldValue); //调用watch的回调函数
    }
  }
}
