function diff(oldTree, newTree) {
  let patches = {};
  /**
   * 规则：当节点类型相同时，比较属性是否相同，产生一个属性的补丁包 {type:'ATRS',attrs:{class:'list-group'}}
   * 新的dom节点不存在 {type:'REMOVE',index:0}
   * 节点类型不相同 直接采用替换模式 {type:'REPLACE',newNode:newNode}
   * 节点类型相同 文本内容不一样 {type:"TEXT",text:1}
   */
  let index = 0;
  //递归树 比较树的结果 放到补丁包中
  walk(oldTree, newTree, index, patches);
  return patches;
}
function diffAttr(oldAttrs, newAttrs) {
  let patch = {};
  for (const key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key]; //老属性被删除 就是undefined
    }
  }
  // 老节点 没有新节点的属性
  for (const key in newAttrs) {
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key]; //老属性被删除 就是undefined
    }
  }
  return patch;
}
const ATTRS = "ATTRS";
const TEXT = "TEXT";
const REMOVE = "REMOVE";
const REPLACE = "";
let Index = 0;
function diffChildren(oldChildren, newChildren, index, patches) {
  oldChildren.forEach((child, idx) => {
    walk(child, newChildren[idx], ++Index, patches);
  });
}
function isString(node) {
  return Object.prototype.toString.call(node) === "[object String]";
}
function walk(oldTree, newTree, index, patches) {
  let currentPatch = []; //每个元素都有一个补丁对象
  if (!newTree) {
    currentPatch.push({
      type: REMOVE,
      index,
    });
  } else if (isString(oldTree) && isString(newTree)) {
    if (oldTree !== newTree) {
      currentPatch.push({
        type: TEXT,
        text: newTree,
      });
    }
  } else if (oldTree.type === newTree.type) {
    //比较属性是否有更改
    let attrs = diffAttr(oldTree.props, newTree.props);
    if (Object.keys(attrs).length) {
      currentPatch.push({
        type: ATTRS,
        attrs,
      });
    }
    diffChildren(oldTree.children, newTree.children, index, patches);
  } else {
    // 节点被替换
    currentPatch.push({
      type: REPLACE,
      index,
      newNode: newTree,
    });
  }
  //当前元素有更新补丁 加入大补丁包
  if (currentPatch.length) patches[index] = currentPatch;
}

export default diff;
