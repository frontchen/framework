let str = require("./a");
document.body.innerText = str;
import "./index.less";
import "./b.less";
if (module.hot) {
  module.hot.accept();
}
