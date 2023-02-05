import { reactive } from "../src/reactive";
import { effect, stop } from "../src/effect";

describe("effect", () => {
  it("happy path", () => {
    let user = reactive({ age: 10, name: "5c24" });
    let nextAge;
    let nextInfo;

    effect(() => {
      nextAge = user.age + 1;
    });

    effect(() => {
      nextInfo = `name: ${user.name}, age: ${user.age}`;
    });

    expect(nextAge).toBe(11);
    expect(nextInfo).toBe(`name: 5c24, age: 10`);

    user.age++;
    expect(nextAge).toBe(12);
    expect(nextInfo).toBe(`name: 5c24, age: 11`);

    user.name = "You";
    expect(nextInfo).toBe(`name: You, age: 11`);
  });

  it("should runner when call effect", () => {
    let foo = 10;
    let runner = effect(() => {
      foo++;
      return "foo";
    });

    expect(foo).toBe(11);
    let r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });

  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    // 初始化不执行 scheduler
    expect(scheduler).not.toHaveBeenCalled();
    // 初始化执行 fn
    expect(dummy).toBe(1);
    obj.foo++;
    // 触发 set 执行 scheduler
    expect(scheduler).toHaveBeenCalledTimes(1);
    // 触发 set 不执行 fn
    expect(dummy).toBe(1);
    // 执行 runner ，再次执行 fn
    run();
    expect(dummy).toBe(2);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });

    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    // obj.prop = 3;
    obj.prop++;
    expect(dummy).toBe(2);

    runner();
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    const obj = reactive(() => {
      foo: 1;
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { onStop }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
