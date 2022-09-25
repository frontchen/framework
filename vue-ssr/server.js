const Koa = require("koa");
const Router = require("koa-router");
const Static = require("koa-static");
const app = new Koa();
const router = new Router();

const Vue = require("vue");
const VuseServerRenderer = require("vue-server-renderer");
const fs = require("fs");
const vm = new Vue({
  data() {
    return {
      msg: "hello word",
    };
  },
  template: `<div>{{msg}}</div>`,
});
const template = fs.readFileSync("./template.html", "utf-8");
let render = VuseServerRenderer.createRenderer({
  template, //模板中必须要有 vue-ssr-outlet
});
router.get("/", async ctx => {
  ctx.body = await render.renderToString(vm);
});

app.use(router.routes());
app.listen(5000, () => {
  console.log("app is runing at port 5000");
});
