class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el); //string document
    this.vm = vm;
    if (this.el) {
      //元素存在 开始编译
      //1.先把真实的dom 移入内存中 fragment文档碎片中
      let fragment = this.nodeToFragment(this.el);
      //2.编译 提取想要的元素节点 v-model 和文本节点
      this.compile(fragment);
      //3.把编译好的framgent
      this.el.appendChild(fragment);
    }
  }
  //辅助编译模板
  isElementNode(node) {
    return node.nodeType === 1;
  }
  //是否指令
  isDirective(name) {
    return name.includes("v-");
  }
  //核心编译方法
  compileElement(node) {
    // 带v-model
    let attrs = node.attributes;
    Array.from(attrs).forEach((attr) => {
      let attrName = attr.name;
      // 判断属性名称是否指令
      if (this.isDirective(attrName)) {
        //取到对应的值放到节点中
        let expr = attr.value;
        let type = attrName.slice(2);
        ComplieUtil[`${type}`](node, this.vm, expr);
      }
    });
  }
  compileText(node) {
    // 带 {{}}
    let expr = node.textContent;
    let reg = /\{\{([^}]+)\}\}/g;
    if (reg.test(expr)) {
      //node this.vm.$data
      ComplieUtil["text"](node, this.vm, expr);
    }
  }
  compile(fragment) {
    let childNodes = fragment.childNodes;
    //递归子节点
    Array.from(childNodes).forEach((node) => {
      if (this.isElementNode(node)) {
        // 是元素节点 还需要继续深入的检查
        // 这里编译元素
        this.compileElement(node);
        this.compile(node);
      } else {
        // 文本节点
        // 编译文本
        this.compileText(node);
      }
    });
  }

  nodeToFragment(el) {
    //需要将el的内容放入内存中
    // 文档碎片
    let fragment = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = el.firstChild)) {
      fragment.appendChild(firstChild);
    }
    return fragment; //内存中的节点
  }
}

ComplieUtil = {
  getVal(vm, expr) {
    //获取实例上对应的数据
    expr = expr.split(".");
    let data = vm.$data;
    return expr.reduce((prev, next) => {
      return prev[next];
    }, data);
  },
  getTextVal(vm, expr) {
    return expr.replace(/\{\{([^}]+)\}\}/g, (...attrs) => {
      return this.getVal(vm, attrs[1]);
    });
  },
  text(node, vm, expr) {
    let updateFn = this.updater["textUpdater"];
    let value = this.getTextVal(vm, expr);
    expr.replace(/\{\{([^}]+)\}\}/g, (...attrs) => {
      console.log(["value", attrs]);
      new Watcher(vm, attrs[1], (newValue) => {
        value = this.getTextVal(vm, expr);
        //如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的 内容
        updateFn && updateFn(node, value);
      });
    });

    updateFn && updateFn(node, value);
  }, // 文本处理
  setVal(vm, expr, value) {
    expr = expr.split(".");
    let data = vm.$data;
    return expr.reduce((prev, next, currentIndex) => {
      if (currentIndex === expr.length - 1) {
        return (prev[next] = value);
      }
      return prev[next];
    }, data);
  },
  model(node, vm, expr) {
    let updateFn = this.updater["modelUpdater"];
    // 这里应该加个数据监控数据变化 调用watch的回调函数
    new Watcher(vm, expr, (newValue) => {
      //当值变化后会调用cb 将新的值传递过来 ()
      updateFn && updateFn(node, this.getVal(vm, expr));
    });
    node.addEventListener("input", (e) => {
      let newValue = e.target.value;

      this.setVal(vm, expr, newValue);
    });
    updateFn && updateFn(node, this.getVal(vm, expr));
  }, // 输入框 双向绑定
  updater: {
    // 文本更新
    textUpdater(node, value) {
      node.textContent = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    },
  },
};
