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
});
