import { render, createElement, renderDom } from "./element.js";
import diff from "./diff.js";
import patch from "./patch";
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

renderDom(el, document.getElementById("app"));
let patchs = diff(virtualDom, virtualDom1);
patch(el, patchs);
console.log(el, patchs);
