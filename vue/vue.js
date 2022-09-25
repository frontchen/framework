class Vue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    if (this.$el) {
      // 数据劫持 把对象的所有属性 改成get和set方法
      new Observer(this.$data);
      this.proxyData(this.$data);
      //数据和元素进行模板编译
      new Compile(this.$el, this);
    }
  }
  proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newValue) {
          data[key] = newValue;
        },
      });
    });
  }
  use() {
    console.log(arguments);
  }
}
