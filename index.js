/**
 * @param {String} 传入节点名字符串
 * @param {Object}以及代理对象
 */
const fn1 = (node, _data) => {
  const fram = document.createDocumentFragment(); //创建文本代码片段
  let chiid;
  // console.log(node.firstChild, fram);
  while ((chiid = node.firstChild)) {
    fram.append(chiid);
    fn2(chiid, _data);
  }
  return fram;
  console.log(Function);
};
/**
 * @param {Object} 传入代理对象
 * @param {String}对象键
 * @param {String}对象值
 */
const createObj = (_data, key, value) => {
  // console.log(_data, key, value);
  const dep = new Dep(); //启动 订阅发布
  console.log(new Dep());
  Object.defineProperty(_data, key, {
    get() {
      //判断观察者是否有数据 没有数据就不放进去
      if (Dep.target) {
        // console.log(new Dep());
        dep.addSub(Dep.target);
      }
      return value;
      // console.log("取值触发");
    },
    set(val) {
      if (val === value) return;
      value = val;
      dep.Notify();
      //最终执行Notify函数来修改页面数据
      // console.log(value, "设置值触发了");
    },
  });
};
/**
 * @param {Object,Object} 传入劫持对象以及代理对象
 */
const SetDefineProperty = (data, _data) => {
  Object.entries(data).forEach(([key, val]) => [createObj(_data, key, val)]);
};
//渲染数据 节点判断
const fn2 = (node, _data) => {
  // console.log(_data[RegExp.$1.trim()]);
  //元素节点
  const Reg = /\{\{(.*)\}\}/;

  if (node.nodeType === 1) {
    [...node.attributes].forEach((item) => {
      if (item.nodeName === "v-model") {
        // console.log(item.nodeValue);
        node.addEventListener("input", (e) => {
          //input事件实现双向数据绑定
          _data[item.nodeValue] = e.target.value;
        });
        node.value = _data[item.nodeValue];
        new Watcher(_data, node, RegExp.$1.trim()); //保存节点
      } else if (item.nodeName === "v-bind") {
      }
    });
  }
  if (node.nodeType === 3) {
    // //文本节点
    if (Reg.test(node.nodeValue)) {
      node.nodeValue = _data[RegExp.$1.trim()];
      //将数据存储data下来
      new Watcher(_data, node, RegExp.$1.trim()); //保存节点
    }
  }
};
//订阅发布  在数据变动时发给订阅者，触发对应的函数
class Dep {
  constructor() {
    //保留数据
    this.sub = [];
  }
  addSub(value) {
    //push进空数组

    this.sub.push(value);
  }
  Notify() {
    //最后修改页面数据
    this.sub.forEach((item) => {
      item.update();
    });
  }
}

/**
 * @param {Object} 传入代理对象
 * @param {Node}节点
 * @param {String}值
 */
// 观察者 用于保存数据 后期进行修改
class Watcher {
  constructor(_data, node, name) {
    Dep.target = this; //这个target 可以直接拿到Watcher类所有的属性方法
    this._data = _data;
    this.node = node;
    this.name = name;
    this.init();
  }
  init() {
    //用于后期进行数据修改
    this.update();
    Dep.target = null; //更新完毕之后清除
  }
  update() {
    //用于获取数据
    this.get();
    this.node.value = this.node.nodeValue = this.value;
    // console.log(this._data, this.node, this.name);
  }
  get() {
    this.value = this._data[this.name];
  }
}

class Vue {
  constructor({ el, data, methods }) {
    this.el = document.querySelector(el);
    this._data = data; //赋值代理对象
    this.methods = methods;
    SetDefineProperty(this._data, this._data);
    //拿所有节点，
    this.Dom = fn1(this.el, this._data); //拿到节点以及代理——data对象
    this.el.appendChild(this.Dom);
  }
}
//实例化;
const vm = new Vue({
  el: "#app",
  data: {
    age: 18,
    name: "小明",
    sex: "男",
  },
  methods: {},
});
