import { render, createElement, renderDom } from "./element.js";
import diff from "./diff.js";
let virtualDom = createElement("ul", { class: "test" }, [
  createElement(
    "li",
    {
      class: "li",
    },
    [createElement("div", "11111111")]
  ),
]);
let virtualDom1 = createElement("ul", { class: "test" }, [
  createElement("li", {
    class: "li",
  }),
]);
let el = render(virtualDom);
let patchs = diff(virtualDom, virtualDom1);
console.log(el);
renderDom(el, document.getElementById("app"));
