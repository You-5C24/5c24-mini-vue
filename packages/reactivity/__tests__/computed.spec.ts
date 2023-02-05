import { computed } from "../src/computed";
import { reactive } from "../src/reactive";

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });

    const age = computed(() => {
      return user.age;
    });

    expect(age.value).toBe(10);
  });

  it("should compute lazily", () => {
    const value = reactive({ foo: 1 });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);

    // 懒执行 不调用 cValue 不会执行getter
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // 缓存机制 再次调用cValue.value getter不再执行
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // 当依赖的响应式对象的值发生改变 再次调用cValue.value  getter执行
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
