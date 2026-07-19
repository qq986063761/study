import { shallowMount } from "@vue/test-utils";
import UiButton from "@/components/Button.vue";

describe("UiButton.vue", () => {
  it("renders default slot content", () => {
    const wrapper = shallowMount(UiButton, {
      slots: { default: "测试按钮" },
    });
    expect(wrapper.text()).toMatch("测试按钮");
  });

  it("applies type class correctly", () => {
    const wrapper = shallowMount(UiButton, {
      propsData: { type: "primary" },
      slots: { default: "按钮" },
    });
    expect(wrapper.classes()).toContain("ui-button--primary");
  });

  it("applies size class correctly", () => {
    const wrapper = shallowMount(UiButton, {
      propsData: { size: "large" },
      slots: { default: "按钮" },
    });
    expect(wrapper.classes()).toContain("ui-button--large");
  });

  it("is disabled when disabled prop is true", () => {
    const wrapper = shallowMount(UiButton, {
      propsData: { disabled: true },
      slots: { default: "按钮" },
    });
    expect(wrapper.classes()).toContain("is-disabled");
    expect(wrapper.attributes("disabled")).toBe("disabled");
  });

  it("emits click event when clicked", async () => {
    const wrapper = shallowMount(UiButton, {
      slots: { default: "按钮" },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
    expect(wrapper.emitted("click")?.length).toBe(1);
  });

  it("does not emit click when disabled", async () => {
    const wrapper = shallowMount(UiButton, {
      propsData: { disabled: true },
      slots: { default: "按钮" },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeFalsy();
  });
});
