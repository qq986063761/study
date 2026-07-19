import { Fragment as e, Transition as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createTextVNode as o, defineComponent as s, normalizeClass as c, normalizeStyle as l, openBlock as u, ref as d, renderList as f, renderSlot as p, toDisplayString as m, withCtx as h, withKeys as g, withModifiers as _ } from "vue";
import { useRoute as v, useRouter as y } from "vue-router";
//#region src/components/Button.vue?vue&type=script&setup=true&lang.ts
var b = ["disabled"], x = {
	key: 0,
	class: "ui-button__loading"
}, S = {
	key: 1,
	class: "ui-button__icon"
}, C = { class: "ui-button__text" }, w = /*@__PURE__*/ s({
	name: "UiButton",
	__name: "Button",
	props: {
		type: { default: "default" },
		size: { default: "medium" },
		disabled: {
			type: Boolean,
			default: !1
		},
		loading: {
			type: Boolean,
			default: !1
		},
		round: {
			type: Boolean,
			default: !1
		},
		plain: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["click"],
	setup(e, { emit: t }) {
		let n = t;
		function o(e) {
			n("click", e);
		}
		return (t, n) => (u(), i("button", {
			class: c(["ui-button", [
				`ui-button--${e.type}`,
				`ui-button--${e.size}`,
				{
					"is-disabled": e.disabled,
					"is-loading": e.loading,
					"is-round": e.round,
					"is-plain": e.plain
				}
			]]),
			disabled: e.disabled || e.loading,
			onClick: o
		}, [
			e.loading ? (u(), i("span", x, "⟳")) : r("", !0),
			t.$slots.icon && !e.loading ? (u(), i("span", S, [p(t.$slots, "icon", {}, void 0, !0)])) : r("", !0),
			a("span", C, [p(t.$slots, "default", {}, void 0, !0)])
		], 10, b));
	}
}), T = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, E = /*#__PURE__*/ T(w, [["__scopeId", "data-v-7ca27033"]]), D = { class: "ui-input__wrapper" }, O = {
	key: 0,
	class: "ui-input__prefix"
}, k = [
	"type",
	"value",
	"placeholder",
	"disabled",
	"readonly",
	"maxlength"
], A = {
	key: 2,
	class: "ui-input__suffix"
}, j = {
	key: 0,
	class: "ui-input__error"
}, M = /*#__PURE__*/ T(/* @__PURE__ */ s({
	name: "UiInput",
	__name: "Input",
	props: {
		modelValue: { default: "" },
		type: { default: "text" },
		placeholder: { default: "请输入" },
		size: { default: "medium" },
		disabled: {
			type: Boolean,
			default: !1
		},
		readonly: {
			type: Boolean,
			default: !1
		},
		clearable: {
			type: Boolean,
			default: !1
		},
		maxlength: {},
		errorMsg: { default: "" }
	},
	emits: [
		"update:modelValue",
		"input",
		"focus",
		"blur",
		"enter",
		"clear"
	],
	setup(e, { expose: t, emit: n }) {
		let o = n, s = d(!1), l = d();
		function f(e) {
			let t = e.target;
			o("input", t.value), o("update:modelValue", t.value);
		}
		function h(e) {
			s.value = !0, o("focus", e);
		}
		function _(e) {
			s.value = !1, o("blur", e);
		}
		function v(e) {
			o("enter", e);
		}
		function y() {
			o("input", ""), o("update:modelValue", ""), o("clear"), l.value?.focus();
		}
		function b() {
			l.value?.focus();
		}
		function x() {
			l.value?.blur();
		}
		return t({
			focus: b,
			blur: x
		}), (t, n) => (u(), i("div", { class: c(["ui-input", [`ui-input--${e.size}`, {
			"is-disabled": e.disabled,
			"is-focus": s.value,
			"is-error": !!e.errorMsg
		}]]) }, [a("div", D, [
			t.$slots.prefix ? (u(), i("span", O, [p(t.$slots, "prefix", {}, void 0, !0)])) : r("", !0),
			a("input", {
				ref_key: "inputRef",
				ref: l,
				class: "ui-input__inner",
				type: e.type,
				value: e.modelValue,
				placeholder: e.placeholder,
				disabled: e.disabled,
				readonly: e.readonly,
				maxlength: e.maxlength,
				onInput: f,
				onFocus: h,
				onBlur: _,
				onKeydown: g(v, ["enter"])
			}, null, 40, k),
			e.clearable && e.modelValue && !e.disabled ? (u(), i("span", {
				key: 1,
				class: "ui-input__clear",
				onClick: y
			}, "✕")) : r("", !0),
			t.$slots.suffix ? (u(), i("span", A, [p(t.$slots, "suffix", {}, void 0, !0)])) : r("", !0)
		]), e.errorMsg ? (u(), i("p", j, m(e.errorMsg), 1)) : r("", !0)], 2));
	}
}), [["__scopeId", "data-v-7879c389"]]), N = { class: "ui-dialog__header" }, P = { class: "ui-dialog__title" }, F = { class: "ui-dialog__body" }, I = {
	key: 0,
	class: "ui-dialog__footer"
}, L = /*#__PURE__*/ T(/* @__PURE__ */ s({
	name: "UiDialog",
	__name: "Dialog",
	props: {
		visible: {
			type: Boolean,
			default: !1
		},
		title: { default: "提示" },
		width: { default: "480px" },
		showClose: {
			type: Boolean,
			default: !0
		},
		closeOnClickOverlay: {
			type: Boolean,
			default: !0
		},
		fullscreen: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["update:visible", "close"],
	setup(e, { emit: s }) {
		let d = s;
		function f() {
			d("update:visible", !1), d("close");
		}
		function g() {
			d("update:visible", !1), d("close");
		}
		return (s, d) => (u(), n(t, { name: "ui-dialog-fade" }, {
			default: h(() => [e.visible ? (u(), i("div", {
				key: 0,
				class: "ui-dialog-overlay",
				onClick: _(g, ["self"])
			}, [a("div", {
				class: c(["ui-dialog", { "is-fullscreen": e.fullscreen }]),
				style: l({ width: e.fullscreen ? "100%" : e.width })
			}, [
				a("div", N, [a("h3", P, [p(s.$slots, "title", {}, () => [o(m(e.title), 1)], !0)]), e.showClose ? (u(), i("button", {
					key: 0,
					class: "ui-dialog__close",
					onClick: f
				}, " ✕ ")) : r("", !0)]),
				a("div", F, [p(s.$slots, "default", {}, void 0, !0)]),
				s.$slots.footer ? (u(), i("div", I, [p(s.$slots, "footer", {}, void 0, !0)])) : r("", !0)
			], 6)])) : r("", !0)]),
			_: 3
		}));
	}
}), [["__scopeId", "data-v-1990b8aa"]]), R = { class: "ui-menu__logo" }, z = {
	key: 0,
	class: "ui-menu__logo-text"
}, B = {
	key: 1,
	class: "ui-menu__logo-icon"
}, V = { class: "ui-menu__list" }, H = ["onClick"], U = { class: "ui-menu__item-icon" }, W = {
	key: 0,
	class: "ui-menu__item-label"
}, G = {
	key: 1,
	class: "ui-menu__item-badge"
}, K = { class: "ui-menu__toggle-icon" }, q = /*#__PURE__*/ T(/* @__PURE__ */ s({
	name: "UiMenu",
	__name: "Menu",
	props: {
		title: { default: "UI Kit" },
		collapsed: {
			type: Boolean,
			default: !1
		},
		menuItems: { default: () => [] }
	},
	emits: ["update:collapsed", "toggle"],
	setup(t, { emit: n }) {
		let o = n, s = y(), l = v();
		function d(e) {
			return l.path === e;
		}
		function p(e) {
			l.path !== e && s.push(e);
		}
		function h() {
			o("update:collapsed", !1), o("toggle", !1);
		}
		return (n, o) => (u(), i("div", { class: c(["ui-menu", { "is-collapsed": t.collapsed }]) }, [
			a("div", R, [t.collapsed ? (u(), i("span", B, "UI")) : (u(), i("span", z, m(t.title), 1))]),
			a("ul", V, [(u(!0), i(e, null, f(t.menuItems, (e) => (u(), i("li", {
				key: e.path,
				class: c(["ui-menu__item", { "is-active": d(e.path) }]),
				onClick: (t) => p(e.path)
			}, [
				a("span", U, m(e.icon), 1),
				t.collapsed ? r("", !0) : (u(), i("span", W, m(e.label), 1)),
				!t.collapsed && e.badge ? (u(), i("span", G, m(e.badge), 1)) : r("", !0)
			], 10, H))), 128))]),
			a("div", {
				class: "ui-menu__toggle",
				onClick: h
			}, [a("span", K, m(t.collapsed ? "▶" : "◀"), 1)])
		], 2));
	}
}), [["__scopeId", "data-v-49910b9b"]]), J = [
	E,
	M,
	L,
	q
], Y = (e) => {
	J.forEach((t) => {
		t.name && e.component(t.name, t);
	});
};
//#endregion
export { E as UiButton, L as UiDialog, M as UiInput, q as UiMenu, Y as install };

//# sourceMappingURL=vite-vue3-ui-lib.es.js.map