class ReactiveEffct {
  private _fn;
  constructor(fn) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    this._fn();
  }
}

let targetMap = new Map();
export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (let effect of dep) {
    effect.run();
  }
}

let activeEffect;
export function effect(fn) {
  let _effct = new ReactiveEffct(fn);

  _effct.run();
}
