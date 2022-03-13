import { render, Element } from "./element";

let allPaches;
let index = 0; //默认哪个需要打补丁
function patch(node, patches) {
  allPaches = patches;

  //给某个元素打补丁
  walk(node);
}

function walk(node) {
  let currentPatch = allPaches[index++];
  let childNodes = node.childNodes;
  childNodes.forEach((child) => {
    walk(child);
  });
  if (currentPatch && currentPatch.length) {
    doPatch(node, currentPatch);
  }
}
function setAttr(node, key, value) {
  switch (key) {
    case "value":
      if (
        node.tagName.toUperCase() === "INPUT" ||
        node.tagName.toUperCase() === "TEXTAREA"
      ) {
        node.value = value;
      } else {
        node.setAttribute(key, value);
      }
      break;
    case "style":
      node.style.cssText = value;
      break;
    default:
      node.setAttribute(key, value);
      break;
  }
}
// 给哪个元素打制定的补丁
function doPatch(node, patches) {
  patches.forEach((patch) => {
    switch (patch.type) {
      case "ATTRS":
        for (const key in patch.attrs) {
          let value = patch.attrs[key];
          if (value) {
            setAttr(node, key, value);
          } else {
            node.removeAttribute(node, key);
          }
        }
        break;
      case "TEXT":
        node.textContent = patch.text;
        break;
      case "REMOVE":
        node.parentNode.removeChild(node);
        break;
      case "REPLACE":
        let newNode =
          patch.newNode instanceof Element
            ? render(patch.newNode)
            : document.createTextNode(patch.newNode);
        node.parentNode.replaceChild(newNode, node);
        break;
      default:
        break;
    }
  });
}

export default patch;
