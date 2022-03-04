class Element {
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}

function createElement() {
  let [type, ...others] = arguments;
  return new Element(
    type,
    others.length > 1 ? others[0] : {},
    others.length > 1 ? others[1] : others[0]
  );
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

//render方法 可以将虚拟dom转化为真实dom
function render(eleobj) {
  let el = document.createElement(eleobj.type);
  for (const key in eleobj.props) {
    setAttr(el, key, eleobj.props[key]);
  }
  console.log("eleobj.children", eleobj.children);
  if (Array.isArray(eleobj.children)) {
    eleobj.children.forEach((child) => {
      child =
        child instanceof Element
          ? render(child)
          : document.createTextNode(child);
      el.appendChild(child);
    });
  } else {
    if (["number", "string"].includes(typeof eleobj.children)) {
      el.textContent = eleobj.children;
    }
  }

  return el;
}
function renderDom(el, target) {
  target.appendChild(el);
}
export { createElement, render, renderDom };
