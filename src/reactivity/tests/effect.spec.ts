import { reactive } from "../reactive";
import { effect } from "../effect";

describe("effect", () => {
  it("happy path", () => {
    let user = reactive({ age: 10, num: 2 });
    let user2 = reactive({ age: 18 });
    let nextAge;
    let user2Age;
    let demoAge = 0;
    effect(() => {
      nextAge = user.age + 1;
    });
    effect(() => {
      user2Age = user2.age + 1;
    });
    effect(() => {
      demoAge++;
    });
    expect(nextAge).toBe(11);

    user.age++;
    expect(nextAge).toBe(12);
    expect(demoAge).toBe(2);
    expect(user2Age).toBe(19);

    user.num++;
    expect(nextAge).toBe(12);
    expect(demoAge).toBe(3);
    expect(user2Age).toBe(19);

    user2.age++;
    expect(nextAge).toBe(12);
    expect(demoAge).toBe(4);
    expect(user2Age).toBe(20);
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
});
