//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var e = !1, t = !1;
function n() {
	t = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
n();
//#endregion
//#region node_modules/svelte/src/constants.js
var r = {}, i = Symbol(), a = Array.isArray, o = Array.prototype.indexOf, s = Array.prototype.includes;
Array.from;
var c = Object.defineProperty, l = Object.getOwnPropertyDescriptor, u = Object.getOwnPropertyDescriptors, d = Object.prototype, f = Array.prototype, p = Object.getPrototypeOf, m = () => {};
function h(e) {
	return e();
}
function g(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function _() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var v = 1024, y = 2048, b = 4096, ee = 8192, te = 16384, ne = 32768, re = 1 << 25, ie = 65536, ae = 1 << 19, oe = 1 << 20, x = 65536, se = 1 << 21, ce = 1 << 23, S = Symbol("$state"), le = Symbol("legacy props"), ue = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
function de(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function fe() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function pe(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function me() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function he(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function ge() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function _e() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function ve() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ye() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function be(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var xe = !1, C;
function Se(e) {
	if (e === null) throw be(), r;
	return C = e;
}
function Ce() {
	return Se(/* @__PURE__ */ xt(C));
}
function we(e) {
	if (xe) {
		if (/* @__PURE__ */ xt(C) !== null) throw be(), r;
		C = e;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Te(e) {
	return e === this.v;
}
function Ee(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function De(e) {
	return !Ee(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var w = null;
function Oe(e) {
	w = e;
}
function ke(e, n = !1, r) {
	w = {
		p: w,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: V,
		l: t && !n ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ae(e) {
	var t = w, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Mt(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, w = t.p, e ?? {};
}
function je() {
	return !t || w !== null && w.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var T = [];
function Me() {
	var e = T;
	T = [], g(e);
}
function Ne(e) {
	if (T.length === 0 && !We) {
		var t = T;
		queueMicrotask(() => {
			t === T && Me();
		});
	}
	T.push(e);
}
function Pe(e) {
	var t = V;
	if (t === null) return R.f |= ce, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Fe(e, t);
}
function Fe(e, t) {
	for (; t !== null;) {
		if (t.f & 128) {
			if (!(t.f & 32768)) throw e;
			try {
				t.b.error(e);
				return;
			} catch (t) {
				e = t;
			}
		}
		t = t.parent;
	}
	throw e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Ie = ~(y | b | v);
function E(e, t) {
	e.f = e.f & Ie | t;
}
function Le(e) {
	e.f & 512 || e.deps === null ? E(e, v) : E(e, b);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function Re(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= x, Re(t.deps));
}
function ze(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), Re(e.deps), E(e, v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var Be = !1, Ve = !1;
function He(e) {
	var t = Ve;
	try {
		return Ve = !1, [e(), Ve];
	} finally {
		Ve = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var D = /* @__PURE__ */ new Set(), O = null, k = null, Ue = null, We = !1, Ge = !1, A = null, j = null, Ke = 0, qe = 1, Je = class t {
	id = qe++;
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#e = /* @__PURE__ */ new Set();
	#t = /* @__PURE__ */ new Set();
	#n = /* @__PURE__ */ new Set();
	#r = /* @__PURE__ */ new Map();
	#i = /* @__PURE__ */ new Map();
	#a = null;
	#o = [];
	#s = [];
	#c = /* @__PURE__ */ new Set();
	#l = /* @__PURE__ */ new Set();
	#u = /* @__PURE__ */ new Map();
	#d = /* @__PURE__ */ new Set();
	is_fork = !1;
	#f = !1;
	#p = /* @__PURE__ */ new Set();
	#m() {
		return this.is_fork || this.#i.size > 0;
	}
	#h() {
		for (let n of this.#p) for (let r of n.#i.keys()) {
			for (var e = !1, t = r; t.parent !== null;) {
				if (this.#u.has(t)) {
					e = !0;
					break;
				}
				t = t.parent;
			}
			if (!e) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#u.has(e) || this.#u.set(e, {
			d: [],
			m: []
		}), this.#d.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#u.get(e);
		if (n) {
			this.#u.delete(e);
			for (var r of n.d) E(r, y), t(r);
			for (r of n.m) E(r, b), t(r);
		}
		this.#d.add(e);
	}
	#g() {
		if (Ke++ > 1e3 && (D.delete(this), Ye()), !this.#m()) {
			for (let e of this.#c) this.#l.delete(e), E(e, y), this.schedule(e);
			for (let e of this.#l) E(e, b), this.schedule(e);
		}
		let n = this.#o;
		this.#o = [], this.apply();
		var r = A = [], i = [], a = j = [];
		for (let e of n) try {
			this.#_(e, r, i);
		} catch (t) {
			throw tt(e), t;
		}
		if (O = null, a.length > 0) {
			var o = t.ensure();
			for (let e of a) o.schedule(e);
		}
		if (A = null, j = null, this.#m() || this.#h()) {
			this.#v(i), this.#v(r);
			for (let [e, t] of this.#u) et(e, t);
		} else {
			this.#r.size === 0 && D.delete(this), this.#c.clear(), this.#l.clear();
			for (let e of this.#e) e(this);
			this.#e.clear(), Xe(i), Xe(r), this.#a?.resolve();
		}
		var s = O;
		if (this.#o.length > 0) {
			let e = s ??= this;
			e.#o.push(...this.#o.filter((t) => !e.#o.includes(t)));
		}
		s !== null && (D.add(s), s.#g()), e && !D.has(this) && this.#y();
	}
	#_(t, n, r) {
		t.f ^= v;
		for (var i = t.first; i !== null;) {
			var a = i.f, o = (a & 96) != 0;
			if (!(o && a & 1024 || a & 8192 || this.#u.has(i)) && i.fn !== null) {
				o ? i.f ^= v : a & 4 ? n.push(i) : e && a & 16777224 ? r.push(i) : Y(i) && (a & 16 && this.#l.add(i), Z(i));
				var s = i.first;
				if (s !== null) {
					i = s;
					continue;
				}
			}
			for (; i !== null;) {
				var c = i.next;
				if (c !== null) {
					i = c;
					break;
				}
				i = i.parent;
			}
		}
	}
	#v(e) {
		for (var t = 0; t < e.length; t += 1) ze(e[t], this.#c, this.#l);
	}
	capture(e, t, n = !1) {
		e.v !== i && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), k?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		O = this;
	}
	deactivate() {
		O = null, k = null;
	}
	flush() {
		try {
			Ge = !0, O = this, this.#g();
		} finally {
			Ke = 0, Ue = null, A = null, j = null, Ge = !1, O = null, k = null, N.clear();
		}
	}
	discard() {
		for (let e of this.#t) e(this);
		this.#t.clear(), this.#n.clear(), D.delete(this);
	}
	register_created_effect(e) {
		this.#s.push(e);
	}
	#y() {
		for (let l of D) {
			var e = l.id < this.id, t = [];
			for (let [r, [i, a]] of this.current) {
				if (l.current.has(r)) {
					var n = l.current.get(r)[0];
					if (e && i !== n) l.current.set(r, [i, a]);
					else continue;
				}
				t.push(r);
			}
			var r = [...l.current.keys()].filter((e) => !this.current.has(e));
			if (r.length === 0) e && l.discard();
			else if (t.length > 0) {
				if (e) for (let e of this.#d) l.unskip_effect(e, (e) => {
					e.f & 4194320 ? l.schedule(e) : l.#v([e]);
				});
				l.activate();
				var i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
				for (var o of t) Ze(o, r, i, a);
				a = /* @__PURE__ */ new Map();
				var s = [...l.current.keys()].filter((e) => this.current.has(e) ? this.current.get(e)[0] !== e : !0);
				for (let e of this.#s) !(e.f & 155648) && Qe(e, s, a) && (e.f & 4194320 ? (E(e, y), l.schedule(e)) : l.#c.add(e));
				if (l.#o.length > 0) {
					l.apply();
					for (var c of l.#o) l.#_(c, [], []);
					l.#o = [];
				}
				l.deactivate();
			}
		}
		for (let e of D) e.#p.has(this) && (e.#p.delete(this), e.#p.size === 0 && !e.#m() && (e.activate(), e.#g()));
	}
	increment(e, t) {
		let n = this.#r.get(t) ?? 0;
		if (this.#r.set(t, n + 1), e) {
			let e = this.#i.get(t) ?? 0;
			this.#i.set(t, e + 1);
		}
	}
	decrement(e, t, n) {
		let r = this.#r.get(t) ?? 0;
		if (r === 1 ? this.#r.delete(t) : this.#r.set(t, r - 1), e) {
			let e = this.#i.get(t) ?? 0;
			e === 1 ? this.#i.delete(t) : this.#i.set(t, e - 1);
		}
		this.#f || n || (this.#f = !0, Ne(() => {
			this.#f = !1, this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#c.add(t);
		for (let e of t) this.#l.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#e.add(e);
	}
	ondiscard(e) {
		this.#t.add(e);
	}
	on_fork_commit(e) {
		this.#n.add(e);
	}
	run_fork_commit_callbacks() {
		for (let e of this.#n) e(this);
		this.#n.clear();
	}
	settled() {
		return (this.#a ??= _()).promise;
	}
	static ensure() {
		if (O === null) {
			let e = O = new t();
			Ge || (D.add(O), We || Ne(() => {
				O === e && e.flush();
			}));
		}
		return O;
	}
	apply() {
		if (!e || !this.is_fork && D.size === 1) {
			k = null;
			return;
		}
		k = /* @__PURE__ */ new Map();
		for (let [e, [t]] of this.current) k.set(e, t);
		for (let e of D) if (!(e === this || e.is_fork)) {
			var t = !1, n = !1;
			if (e.id < this.id) for (let [r, [, i]] of e.current) i || (t ||= this.current.has(r), n ||= !this.current.has(r));
			if (t && n) this.#p.add(e);
			else for (let [t, n] of e.previous) k.has(t) || k.set(t, n);
		}
	}
	schedule(t) {
		if (Ue = t, t.b?.is_pending && t.f & 16777228 && !(t.f & 32768)) {
			t.b.defer_effect(t);
			return;
		}
		for (var n = t; n.parent !== null;) {
			n = n.parent;
			var r = n.f;
			if (A !== null && n === V && (e || (R === null || !(R.f & 2)) && !Be)) return;
			if (r & 96) {
				if (!(r & 1024)) return;
				n.f ^= v;
			}
		}
		this.#o.push(n);
	}
};
function Ye() {
	try {
		me();
	} catch (e) {
		Fe(e, Ue);
	}
}
var M = null;
function Xe(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Y(r) && (M = /* @__PURE__ */ new Set(), Z(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && zt(r), M?.size > 0)) {
				N.clear();
				for (let e of M) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) M.has(n) && (M.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Z(n);
					}
				}
				M.clear();
			}
		}
		M = null;
	}
}
function Ze(e, t, n, r) {
	if (!n.has(e) && (n.add(e), e.reactions !== null)) for (let i of e.reactions) {
		let e = i.f;
		e & 2 ? Ze(i, t, n, r) : e & 4194320 && !(e & 2048) && Qe(i, t, r) && (E(i, y), $e(i));
	}
}
function Qe(e, t, n) {
	let r = n.get(e);
	if (r !== void 0) return r;
	if (e.deps !== null) for (let r of e.deps) {
		if (s.call(t, r)) return !0;
		if (r.f & 2 && Qe(r, t, n)) return n.set(r, !0), !0;
	}
	return n.set(e, !1), !1;
}
function $e(e) {
	O.schedule(e);
}
function et(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), E(e, v);
		for (var n = e.first; n !== null;) et(n, t), n = n.next;
	}
}
function tt(e) {
	E(e, v);
	for (var t = e.first; t !== null;) tt(t), t = t.next;
}
ie | ae;
/* @__NO_SIDE_EFFECTS__ */
function nt(e) {
	var t = 2 | y;
	return V !== null && (V.f |= ae), {
		ctx: w,
		deps: null,
		effects: null,
		equals: Te,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: i,
		wv: 0,
		parent: V,
		ac: null
	};
}
/* @__NO_SIDE_EFFECTS__ */
function rt(e) {
	let t = /* @__PURE__ */ nt(e);
	return t.equals = De, t;
}
function it(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Lt(t[n]);
	}
}
function at(e) {
	var t, n = V, r = e.parent;
	if (!L && r !== null && r.f & 24576) return ye(), e.v;
	H(r);
	try {
		e.f &= ~x, it(e), t = Xt(e);
	} finally {
		H(n);
	}
	return t;
}
function ot(e) {
	var t = at(e);
	if (!e.equals(t) && (e.wv = Jt(), (!O?.is_fork || e.deps === null) && (O === null ? e.v = t : O.capture(e, t, !0), e.deps === null))) {
		E(e, v);
		return;
	}
	L || (k === null ? Le(e) : (kt() || O?.is_fork) && k.set(e, t));
}
function st(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(ue), t.teardown = m, t.ac = null, X(t, 0), Ft(t));
}
function ct(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && Z(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var lt = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map(), ut = !1;
function dt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Te,
		rv: 0,
		wv: 0
	};
}
/* @__NO_SIDE_EFFECTS__ */
function P(e, t) {
	let n = dt(e, t);
	return Wt(n), n;
}
function F(e, t, n = !1) {
	return R !== null && (!z || R.f & 131072) && je() && R.f & 4325394 && (U === null || !s.call(U, e)) && ve(), ft(e, n ? I(t) : t, j);
}
function ft(e, t, n = null) {
	if (!e.equals(t)) {
		N.set(e, L ? t : e.v);
		var r = Je.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && at(t), k === null && Le(t);
		}
		e.wv = Jt(), ht(e, y, n), je() && V !== null && V.f & 1024 && !(V.f & 96) && (K === null ? Gt([e]) : K.push(e)), !r.is_fork && lt.size > 0 && !ut && pt();
	}
	return t;
}
function pt() {
	ut = !1;
	for (let e of lt) e.f & 1024 && E(e, b), Y(e) && Z(e);
	lt.clear();
}
function mt(e) {
	F(e, e.v + 1);
}
function ht(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = je(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === V)) {
			var l = (c & y) === 0;
			if (l && E(s, t), c & 2) {
				var u = s;
				k?.delete(u), c & 65536 || (c & 512 && (s.f |= x), ht(u, b, n));
			} else if (l) {
				var d = s;
				c & 16 && M !== null && M.add(d), n === null ? $e(d) : n.push(d);
			}
		}
	}
}
function I(e) {
	if (typeof e != "object" || !e || S in e) return e;
	let t = p(e);
	if (t !== d && t !== f) return e;
	var n = /* @__PURE__ */ new Map(), r = a(e), o = /* @__PURE__ */ P(0), s = null, c = J, u = (e) => {
		if (J === c) return e();
		var t = R, n = J;
		B(null), qt(c);
		var r = e();
		return B(t), qt(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ P(e.length, s)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && ge();
			var i = n.get(t);
			return i === void 0 ? u(() => {
				var e = /* @__PURE__ */ P(r.value, s);
				return n.set(t, e), e;
			}) : F(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = u(() => /* @__PURE__ */ P(i, s));
					n.set(t, e), mt(o);
				}
			} else F(r, i), mt(o);
			return !0;
		},
		get(t, r, a) {
			if (r === S) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || l(t, r)?.writable) && (o = u(() => /* @__PURE__ */ P(I(c ? t[r] : i), s)), n.set(r, o)), o !== void 0) {
				var d = Q(o);
				return d === i ? void 0 : d;
			}
			return Reflect.get(t, r, a);
		},
		getOwnPropertyDescriptor(e, t) {
			var r = Reflect.getOwnPropertyDescriptor(e, t);
			if (r && "value" in r) {
				var a = n.get(t);
				a && (r.value = Q(a));
			} else if (r === void 0) {
				var o = n.get(t), s = o?.v;
				if (o !== void 0 && s !== i) return {
					enumerable: !0,
					configurable: !0,
					value: s,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === S) return !0;
			var r = n.get(t), a = r !== void 0 && r.v !== i || Reflect.has(e, t);
			return (r !== void 0 || V !== null && (!a || l(e, t)?.writable)) && (r === void 0 && (r = u(() => /* @__PURE__ */ P(a ? I(e[t]) : i, s)), n.set(t, r)), Q(r) === i) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = n.get(t), f = t in e;
			if (r && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = n.get(p + "");
				m === void 0 ? p in e && (m = u(() => /* @__PURE__ */ P(i, s)), n.set(p + "", m)) : F(m, i);
			}
			if (d === void 0) (!f || l(e, t)?.writable) && (d = u(() => /* @__PURE__ */ P(void 0, s)), F(d, I(a)), n.set(t, d));
			else {
				f = d.v !== i;
				var h = u(() => I(a));
				F(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (r && typeof t == "string") {
					var _ = n.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && F(_, v + 1);
				}
				mt(o);
			}
			return !0;
		},
		ownKeys(e) {
			Q(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== i;
			});
			for (var [r, a] of n) a.v !== i && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			_e();
		}
	});
}
var gt, _t, vt;
function yt(e = "") {
	return document.createTextNode(e);
}
/* @__NO_SIDE_EFFECTS__ */
function bt(e) {
	return _t.call(e);
}
/* @__NO_SIDE_EFFECTS__ */
function xt(e) {
	return vt.call(e);
}
function St(e, t) {
	if (!xe) return /* @__PURE__ */ bt(e);
	var n = /* @__PURE__ */ bt(C);
	if (n === null) n = C.appendChild(yt());
	else if (t && n.nodeType !== 3) {
		var r = yt();
		return n?.before(r), Se(r), r;
	}
	return t && wt(n), Se(n), n;
}
function Ct(e, t, n) {
	let r = n ? { is: n } : void 0;
	return document.createElementNS(t ?? "http://www.w3.org/1999/xhtml", e, r);
}
function wt(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function Tt(e) {
	var t = R, n = V;
	B(null), H(null);
	try {
		return e();
	} finally {
		B(t), H(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function Et(e) {
	V === null && (R === null && pe(e), fe()), L && de(e);
}
function Dt(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Ot(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= ee);
	var r = {
		ctx: w,
		deps: null,
		nodes: null,
		f: e | y | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	O?.register_created_effect(r);
	var i = r;
	if (e & 4) A === null ? Je.ensure().schedule(r) : A.push(r);
	else if (t !== null) {
		try {
			Z(r);
		} catch (e) {
			throw Lt(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ie));
	}
	if (i !== null && (i.parent = n, n !== null && Dt(i, n), R !== null && R.f & 2 && !(e & 64))) {
		var a = R;
		(a.effects ??= []).push(i);
	}
	return r;
}
function kt() {
	return R !== null && !z;
}
function At(e) {
	let t = Ot(8, null);
	return E(t, v), t.teardown = e, t;
}
function jt(e) {
	Et("$effect");
	var t = V.f;
	if (!R && t & 32 && !(t & 32768)) {
		var n = w;
		(n.e ??= []).push(e);
	} else return Mt(e);
}
function Mt(e) {
	return Ot(4 | oe, e);
}
function Nt(e) {
	return Et("$effect.pre"), Ot(8 | oe, e);
}
function Pt(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = L, n = R;
		Ut(!0), B(null);
		try {
			t.call(null);
		} finally {
			Ut(e), B(n);
		}
	}
}
function Ft(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && Tt(() => {
			e.abort(ue);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Lt(n, t), n = r;
	}
}
function It(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Lt(t), t = n;
	}
}
function Lt(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Rt(e.nodes.start, e.nodes.end), n = !0), E(e, re), Ft(e, t && !n), X(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Pt(e), e.f ^= re, e.f |= te;
	var i = e.parent;
	i !== null && i.first !== null && zt(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Rt(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ xt(e);
		e.remove(), e = n;
	}
}
function zt(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Bt(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ee;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = (i.f & 65536) != 0 || (i.f & 32) != 0 && (e.f & 16) != 0;
				Bt(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Vt = null, Ht = !1, L = !1;
function Ut(e) {
	L = e;
}
var R = null, z = !1;
function B(e) {
	R = e;
}
var V = null;
function H(e) {
	V = e;
}
var U = null;
function Wt(t) {
	R !== null && (!e || R.f & 2) && (U === null ? U = [t] : U.push(t));
}
var W = null, G = 0, K = null;
function Gt(e) {
	K = e;
}
var Kt = 1, q = 0, J = q;
function qt(e) {
	J = e;
}
function Jt() {
	return ++Kt;
}
function Y(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~x), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Y(a) && ot(a), a.wv > e.wv) return !0;
		}
		t & 512 && k === null && E(e, v);
	}
	return !1;
}
function Yt(t, n, r = !0) {
	var i = t.reactions;
	if (i !== null && !(!e && U !== null && s.call(U, t))) for (var a = 0; a < i.length; a++) {
		var o = i[a];
		o.f & 2 ? Yt(o, n, !1) : n === o && (r ? E(o, y) : o.f & 1024 && E(o, b), $e(o));
	}
}
function Xt(e) {
	var t = W, n = G, r = K, i = R, a = U, o = w, s = z, c = J, l = e.f;
	W = null, G = 0, K = null, R = l & 96 ? null : e, U = null, Oe(e.ctx), z = !1, J = ++q, e.ac !== null && (Tt(() => {
		e.ac.abort(ue);
	}), e.ac = null);
	try {
		e.f |= se;
		var u = e.fn, d = u();
		e.f |= ne;
		var f = e.deps, p = O?.is_fork;
		if (W !== null) {
			var m;
			if (p || X(e, G), f !== null && G > 0) for (f.length = G + W.length, m = 0; m < W.length; m++) f[G + m] = W[m];
			else e.deps = f = W;
			if (kt() && e.f & 512) for (m = G; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && G < f.length && (X(e, G), f.length = G);
		if (je() && K !== null && !z && f !== null && !(e.f & 6146)) for (m = 0; m < K.length; m++) Yt(K[m], e);
		if (i !== null && i !== e) {
			if (q++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = q;
			if (t !== null) for (let e of t) e.rv = q;
			K !== null && (r === null ? r = K : r.push(...K));
		}
		return e.f & 8388608 && (e.f ^= ce), d;
	} catch (e) {
		return Pe(e);
	} finally {
		e.f ^= se, W = t, G = n, K = r, R = i, U = a, Oe(o), z = s, J = c;
	}
}
function Zt(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = o.call(n, e);
		if (r !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[r] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (W === null || !s.call(W, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~x), c.v !== i && Le(c), st(c), X(c, 0);
	}
}
function X(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Zt(e, n[r]);
}
function Z(e) {
	var t = e.f;
	if (!(t & 16384)) {
		E(e, v);
		var n = V, r = Ht;
		V = e, Ht = !0;
		try {
			t & 16777232 ? It(e) : Ft(e), Pt(e);
			var i = Xt(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Kt;
		} finally {
			Ht = r, V = n;
		}
	}
}
function Q(e) {
	var t = (e.f & 2) != 0;
	if (Vt?.add(e), R !== null && !z && !(V !== null && V.f & 16384) && (U === null || !s.call(U, e))) {
		var n = R.deps;
		if (R.f & 2097152) e.rv < q && (e.rv = q, W === null && n !== null && n[G] === e ? G++ : W === null ? W = [e] : W.push(e));
		else {
			(R.deps ??= []).push(e);
			var r = e.reactions;
			r === null ? e.reactions = [R] : s.call(r, R) || r.push(R);
		}
	}
	if (L && N.has(e)) return N.get(e);
	if (t) {
		var i = e;
		if (L) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || $t(i)) && (a = at(i)), N.set(i, a), a;
		}
		var o = (i.f & 512) == 0 && !z && R !== null && (Ht || (R.f & 512) != 0), c = (i.f & ne) === 0;
		Y(i) && (o && (i.f |= 512), ot(i)), o && !c && (ct(i), Qt(i));
	}
	if (k?.has(e)) return k.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Qt(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (ct(t), Qt(t));
}
function $t(e) {
	if (e.v === i) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (N.has(t) || t.f & 2 && $t(t)) return !0;
	return !1;
}
function en(e) {
	var t = z;
	try {
		return z = !0, e();
	} finally {
		z = t;
	}
}
function tn(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (S in e) nn(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && S in n && nn(n);
		}
	}
}
function nn(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			nn(e[n], t);
		} catch {}
		let n = p(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = u(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var $ = Symbol("events");
function rn(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || sn.call(t, e), !e.cancelBubble) return Tt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Ne(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function an(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = rn(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && At(() => {
		t.removeEventListener(e, o, a);
	});
}
var on = null;
function sn(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	on = e;
	var o = 0, s = on === e && e[$];
	if (s) {
		var l = i.indexOf(s);
		if (l !== -1 && (t === document || t === window)) {
			e[$] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		l <= u && (o = l);
	}
	if (a = i[o] || e.target, a !== t) {
		c(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var d = R, f = V;
		B(null), H(null);
		try {
			for (var p, m = []; a !== null;) {
				var h = a.assignedSlot || a.parentNode || a.host || null;
				try {
					var g = a[$]?.[r];
					g != null && (!a.disabled || e.target === a) && g.call(a, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble || h === t || h === null) break;
				a = h;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[$] = t, delete e.currentTarget, B(d), H(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var cn = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function ln(e) {
	return cn?.createHTML(e) ?? e;
}
function un(e) {
	var t = Ct("template");
	return t.innerHTML = ln(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function dn(e, t) {
	var n = V;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/* @__NO_SIDE_EFFECTS__ */
function fn(e, t) {
	var n = (t & 1) != 0, r = (t & 2) != 0, i, a = !e.startsWith("<!>");
	return () => {
		if (xe) return dn(C, null), C;
		i === void 0 && (i = un(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ bt(i)));
		var t = r || gt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ bt(t), s = t.lastChild;
			dn(o, s);
		} else dn(t, t);
		return t;
	};
}
function pn(e, t) {
	if (xe) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = C), Ce();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function mn(e = !1) {
	let t = w, n = t.l.u;
	if (!n) return;
	let r = () => tn(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ nt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => Q(i);
	}
	n.b.length && Nt(() => {
		hn(t, r), g(n.b);
	}), jt(() => {
		let e = en(() => n.m.map(h));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && jt(() => {
		hn(t, r), g(n.a);
	});
}
function hn(e, t) {
	if (e.l.s) for (let t of e.l.s) Q(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function gn(e, n, r, i) {
	var a = !t || (r & 2) != 0, o = (r & 8) != 0, s = (r & 16) != 0, c = i, u = !0, d = () => (u && (u = !1, c = s ? en(i) : i), c);
	let f;
	if (o) {
		var p = S in e || le in e;
		f = l(e, n)?.set ?? (p && n in e ? (t) => e[n] = t : void 0);
	}
	var m, h = !1;
	o ? [m, h] = He(() => e[n]) : m = e[n], m === void 0 && i !== void 0 && (m = d(), f && (a && he(n), f(m)));
	var g = a ? () => {
		var t = e[n];
		return t === void 0 ? d() : (u = !0, t);
	} : () => {
		var t = e[n];
		return t !== void 0 && (c = void 0), t === void 0 ? c : t;
	};
	if (a && !(r & 4)) return g;
	if (f) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!a || !t || _ || h) && f(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (r & 1 ? nt : rt)(() => (v = !1, g()));
	o && Q(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Q(y) : a && o ? I(e) : e;
			return F(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return L && v || b.f & 16384 ? y.v : Q(y);
	});
}
var _n = /* @__PURE__ */ fn("<div class=\"card\"><div class=\"card-body\"><button class=\"btn btn-primary\">Update Course Order</button></div></div>");
function vn(e, t) {
	ke(t, !1);
	let n = gn(t, "engine", 8);
	gn(t, "initialData", 24, () => []);
	async function r() {
		let e = await n().CalculatePriority();
		console.log(e);
	}
	mn();
	var i = _n(), a = St(i), o = St(a);
	we(a), we(i), an("click", o, r), pn(e, i), Ae();
}
//#endregion
//#region entry.js
function yn(e, t) {
	return new vn({
		target: e,
		props: t
	});
}
//#endregion
export { yn as mountCoursePrioritizer };
