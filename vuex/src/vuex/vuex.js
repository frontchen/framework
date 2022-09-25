let Vue;
const forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback && callback(key, obj[key]);
  });
};

class ModuleCollection {
  constructor(options) {
    this.register([], options);
  }
  register(path, rootModule) {
    let newModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state,
    };
    if (!path.length) {
      this.root = newModule;
    } else {
      let parent = path.slice(0, -1).reduce((root, current) => {
        return this.root._children[current];
      }, this.root);
      parent._children[path[path.length - 1]] = newModule;
    }
    console.log(["path", path]);
    if (rootModule.modules) {
      forEach(rootModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module);
      });
    }
  }
}
//将结果挂载到store下的state getters mutations actions
const installModule = (store, state, path, rootModule) => {
  // 子模块的状态放入父模块上
  if (path.length) {
    let parent = path.slice(0, -1).reduce((state, current) => {
      return state[current];
    }, state);
    Vue.set(parent, path[path.length - 1], rootModule.state);
  }
  // 先处理根模块的getters属性
  let getters = rootModule._raw.getters;
  if (getters) {
    forEach(getters, (getterName, fn) => {
      Object.defineProperty(store.getters, getterName, {
        get: () => {
          return fn(rootModule.state);
        },
      });
    });
  }
  let mutations = rootModule._raw.mutations;
  if (mutations) {
    //MUTIONS:{ ADD:[FN,FN1]}
    forEach(mutations, (mutationName, fn) => {
      let arr =
        store.mutations[mutationName] || (store.mutations[mutationName] = []);
      arr.push(payload => {
        fn(rootModule.state, payload);
      });
    });
  }
  let actions = rootModule._raw.actions;
  if (actions) {
    forEach(actions, (actionName, fn) => {
      let arr = store.actions[actionName] || (store.actions[actionName] = []);
      arr.push(payload => {
        fn(store, payload);
      });
    });
  }

  let children = rootModule._children;
  forEach(children, (moduleName, module) => {
    installModule(store, state, path.concat(moduleName), module);
  });
};
class Store {
  constructor(options) {
    this._vm = new Vue({
      data: {
        state: options.state,
      },
    });
    this.getters = {};
    this.actions = {};
    this.mutations = {};
    // 收集模块
    this.modules = new ModuleCollection(options);
    // 安装模块
    installModule(this, this.state, [], this.modules.root);
  }
  get state() {
    return this._vm.state;
  }
  commit = (type, payload) => {
    (this.mutations[type] || []).forEach(fn => {
      fn(payload);
    });
  };
  dispatch = (type, payload) => {
    (this.actions[type] || []).forEach(fn => {
      fn(payload);
    });
  };
}
//
//VUE组件渲染 先渲染父组件 再渲染子组件 深度优先
const install = _Vue => {
  Vue = _Vue;
  // 给每个组件注册$store属性
  Vue.mixin({
    beforeCreate() {
      // 先判断是父组件还是子组件
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store;
      } else {
        this.$store = this.$parent && this.$parent.$store;
      }
    },
  });
};
export default {
  install,
  Store,
};
