import "../../test/demo2.vue-8fb9fa47.js";
function Xt(e, t) {
  const n = /* @__PURE__ */ Object.create(null), s = e.split(",");
  for (let r = 0; r < s.length; r++)
    n[s[r]] = !0;
  return t ? (r) => !!n[r.toLowerCase()] : (r) => !!n[r];
}
const v = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {}, Zt = process.env.NODE_ENV !== "production" ? Object.freeze([]) : [], pt = () => {
}, kt = /^on[^a-z]/, en = (e) => kt.test(e), R = Object.assign, tn = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, nn = Object.prototype.hasOwnProperty, m = (e, t) => nn.call(e, t), h = Array.isArray, H = (e) => Ne(e) === "[object Map]", dt = (e) => Ne(e) === "[object Set]", E = (e) => typeof e == "function", D = (e) => typeof e == "string", Me = (e) => typeof e == "symbol", w = (e) => e !== null && typeof e == "object", rn = (e) => w(e) && E(e.then) && E(e.catch), ht = Object.prototype.toString, Ne = (e) => ht.call(e), _t = (e) => Ne(e).slice(8, -1), gt = (e) => Ne(e) === "[object Object]", Fe = (e) => D(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, sn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, on = sn(
  (e) => e.charAt(0).toUpperCase() + e.slice(1)
), _e = (e, t) => !Object.is(e, t), cn = (e, t, n) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
};
let Ye;
const xe = () => Ye || (Ye = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Ae(e) {
  if (h(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = D(s) ? fn(s) : Ae(s);
      if (r)
        for (const o in r)
          t[o] = r[o];
    }
    return t;
  } else {
    if (D(e))
      return e;
    if (w(e))
      return e;
  }
}
const ln = /;(?![^(]*\))/g, un = /:([^]+)/, an = /\/\*[^]*?\*\//g;
function fn(e) {
  const t = {};
  return e.replace(an, "").split(ln).forEach((n) => {
    if (n) {
      const s = n.split(un);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function je(e) {
  let t = "";
  if (D(e))
    t = e;
  else if (h(e))
    for (let n = 0; n < e.length; n++) {
      const s = je(e[n]);
      s && (t += s + " ");
    }
  else if (w(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Kr = (e) => D(e) ? e : e == null ? "" : h(e) || w(e) && (e.toString === ht || !E(e.toString)) ? JSON.stringify(e, mt, 2) : String(e), mt = (e, t) => t && t.__v_isRef ? mt(e, t.value) : H(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce((n, [s, r]) => (n[`${s} =>`] = r, n), {})
} : dt(t) ? {
  [`Set(${t.size})`]: [...t.values()]
} : w(t) && !h(t) && !gt(t) ? String(t) : t;
function Qe(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let Et;
function pn(e, t = Et) {
  t && t.active && t.effects.push(e);
}
function dn() {
  return Et;
}
const Ie = (e) => {
  const t = new Set(e);
  return t.w = 0, t.n = 0, t;
}, wt = (e) => (e.w & j) > 0, Nt = (e) => (e.n & j) > 0, hn = ({ deps: e }) => {
  if (e.length)
    for (let t = 0; t < e.length; t++)
      e[t].w |= j;
}, _n = (e) => {
  const { deps: t } = e;
  if (t.length) {
    let n = 0;
    for (let s = 0; s < t.length; s++) {
      const r = t[s];
      wt(r) && !Nt(r) ? r.delete(e) : t[n++] = r, r.w &= ~j, r.n &= ~j;
    }
    t.length = n;
  }
}, Re = /* @__PURE__ */ new WeakMap();
let k = 0, j = 1;
const ye = 30;
let O;
const U = Symbol(process.env.NODE_ENV !== "production" ? "iterate" : ""), De = Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
class gn {
  constructor(t, n = null, s) {
    this.fn = t, this.scheduler = n, this.active = !0, this.deps = [], this.parent = void 0, pn(this, s);
  }
  run() {
    if (!this.active)
      return this.fn();
    let t = O, n = W;
    for (; t; ) {
      if (t === this)
        return;
      t = t.parent;
    }
    try {
      return this.parent = O, O = this, W = !0, j = 1 << ++k, k <= ye ? hn(this) : Xe(this), this.fn();
    } finally {
      k <= ye && _n(this), j = 1 << --k, O = this.parent, W = n, this.parent = void 0, this.deferStop && this.stop();
    }
  }
  stop() {
    O === this ? this.deferStop = !0 : this.active && (Xe(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function Xe(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
let W = !0;
const bt = [];
function Ot() {
  bt.push(W), W = !1;
}
function St() {
  const e = bt.pop();
  W = e === void 0 ? !0 : e;
}
function V(e, t, n) {
  if (W && O) {
    let s = Re.get(e);
    s || Re.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || s.set(n, r = Ie());
    const o = process.env.NODE_ENV !== "production" ? { effect: O, target: e, type: t, key: n } : void 0;
    mn(r, o);
  }
}
function mn(e, t) {
  let n = !1;
  k <= ye ? Nt(e) || (e.n |= j, n = !wt(e)) : n = !e.has(O), n && (e.add(O), O.deps.push(e), process.env.NODE_ENV !== "production" && O.onTrack && O.onTrack(
    R(
      {
        effect: O
      },
      t
    )
  ));
}
function z(e, t, n, s, r, o) {
  const i = Re.get(e);
  if (!i)
    return;
  let c = [];
  if (t === "clear")
    c = [...i.values()];
  else if (n === "length" && h(e)) {
    const a = Number(s);
    i.forEach((d, l) => {
      (l === "length" || l >= a) && c.push(d);
    });
  } else
    switch (n !== void 0 && c.push(i.get(n)), t) {
      case "add":
        h(e) ? Fe(n) && c.push(i.get("length")) : (c.push(i.get(U)), H(e) && c.push(i.get(De)));
        break;
      case "delete":
        h(e) || (c.push(i.get(U)), H(e) && c.push(i.get(De)));
        break;
      case "set":
        H(e) && c.push(i.get(U));
        break;
    }
  const u = process.env.NODE_ENV !== "production" ? { target: e, type: t, key: n, newValue: s, oldValue: r, oldTarget: o } : void 0;
  if (c.length === 1)
    c[0] && (process.env.NODE_ENV !== "production" ? oe(c[0], u) : oe(c[0]));
  else {
    const a = [];
    for (const d of c)
      d && a.push(...d);
    process.env.NODE_ENV !== "production" ? oe(Ie(a), u) : oe(Ie(a));
  }
}
function oe(e, t) {
  const n = h(e) ? e : [...e];
  for (const s of n)
    s.computed && Ze(s, t);
  for (const s of n)
    s.computed || Ze(s, t);
}
function Ze(e, t) {
  (e !== O || e.allowRecurse) && (process.env.NODE_ENV !== "production" && e.onTrigger && e.onTrigger(R({ effect: e }, t)), e.scheduler ? e.scheduler() : e.run());
}
const En = /* @__PURE__ */ Xt("__proto__,__v_isRef,__isVue"), Vt = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Me)
), wn = /* @__PURE__ */ ze(), Nn = /* @__PURE__ */ ze(!0), bn = /* @__PURE__ */ ze(!0, !0), ke = /* @__PURE__ */ On();
function On() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const s = p(this);
      for (let o = 0, i = this.length; o < i; o++)
        V(s, "get", o + "");
      const r = s[t](...n);
      return r === -1 || r === !1 ? s[t](...n.map(p)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      Ot();
      const s = p(this)[t].apply(this, n);
      return St(), s;
    };
  }), e;
}
function Sn(e) {
  const t = p(this);
  return V(t, "has", e), t.hasOwnProperty(e);
}
function ze(e = !1, t = !1) {
  return function(s, r, o) {
    if (r === "__v_isReactive")
      return !e;
    if (r === "__v_isReadonly")
      return e;
    if (r === "__v_isShallow")
      return t;
    if (r === "__v_raw" && o === (e ? t ? Dt : yt : t ? zn : Rt).get(s))
      return s;
    const i = h(s);
    if (!e) {
      if (i && m(ke, r))
        return Reflect.get(ke, r, o);
      if (r === "hasOwnProperty")
        return Sn;
    }
    const c = Reflect.get(s, r, o);
    return (Me(r) ? Vt.has(r) : En(r)) || (e || V(s, "get", r), t) ? c : S(c) ? i && Fe(r) ? c : c.value : w(c) ? e ? $t(c) : Ct(c) : c;
  };
}
const Vn = /* @__PURE__ */ xn();
function xn(e = !1) {
  return function(n, s, r, o) {
    let i = n[s];
    if (G(i) && S(i) && !S(r))
      return !1;
    if (!e && (!Ce(r) && !G(r) && (i = p(i), r = p(r)), !h(n) && S(i) && !S(r)))
      return i.value = r, !0;
    const c = h(n) && Fe(s) ? Number(s) < n.length : m(n, s), u = Reflect.set(n, s, r, o);
    return n === p(o) && (c ? _e(r, i) && z(n, "set", s, r, i) : z(n, "add", s, r)), u;
  };
}
function In(e, t) {
  const n = m(e, t), s = e[t], r = Reflect.deleteProperty(e, t);
  return r && n && z(e, "delete", t, void 0, s), r;
}
function Rn(e, t) {
  const n = Reflect.has(e, t);
  return (!Me(t) || !Vt.has(t)) && V(e, "has", t), n;
}
function yn(e) {
  return V(e, "iterate", h(e) ? "length" : U), Reflect.ownKeys(e);
}
const Dn = {
  get: wn,
  set: Vn,
  deleteProperty: In,
  has: Rn,
  ownKeys: yn
}, xt = {
  get: Nn,
  set(e, t) {
    return process.env.NODE_ENV !== "production" && Qe(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  },
  deleteProperty(e, t) {
    return process.env.NODE_ENV !== "production" && Qe(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, Cn = /* @__PURE__ */ R(
  {},
  xt,
  {
    get: bn
  }
), Ke = (e) => e, be = (e) => Reflect.getPrototypeOf(e);
function ie(e, t, n = !1, s = !1) {
  e = e.__v_raw;
  const r = p(e), o = p(t);
  n || (t !== o && V(r, "get", t), V(r, "get", o));
  const { has: i } = be(r), c = s ? Ke : n ? Be : We;
  if (i.call(r, t))
    return c(e.get(t));
  if (i.call(r, o))
    return c(e.get(o));
  e !== r && e.get(t);
}
function ce(e, t = !1) {
  const n = this.__v_raw, s = p(n), r = p(e);
  return t || (e !== r && V(s, "has", e), V(s, "has", r)), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function le(e, t = !1) {
  return e = e.__v_raw, !t && V(p(e), "iterate", U), Reflect.get(e, "size", e);
}
function et(e) {
  e = p(e);
  const t = p(this);
  return be(t).has.call(t, e) || (t.add(e), z(t, "add", e, e)), this;
}
function tt(e, t) {
  t = p(t);
  const n = p(this), { has: s, get: r } = be(n);
  let o = s.call(n, e);
  o ? process.env.NODE_ENV !== "production" && It(n, s, e) : (e = p(e), o = s.call(n, e));
  const i = r.call(n, e);
  return n.set(e, t), o ? _e(t, i) && z(n, "set", e, t, i) : z(n, "add", e, t), this;
}
function nt(e) {
  const t = p(this), { has: n, get: s } = be(t);
  let r = n.call(t, e);
  r ? process.env.NODE_ENV !== "production" && It(t, n, e) : (e = p(e), r = n.call(t, e));
  const o = s ? s.call(t, e) : void 0, i = t.delete(e);
  return r && z(t, "delete", e, void 0, o), i;
}
function rt() {
  const e = p(this), t = e.size !== 0, n = process.env.NODE_ENV !== "production" ? H(e) ? new Map(e) : new Set(e) : void 0, s = e.clear();
  return t && z(e, "clear", void 0, void 0, n), s;
}
function ue(e, t) {
  return function(s, r) {
    const o = this, i = o.__v_raw, c = p(i), u = t ? Ke : e ? Be : We;
    return !e && V(c, "iterate", U), i.forEach((a, d) => s.call(r, u(a), u(d), o));
  };
}
function ae(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, o = p(r), i = H(o), c = e === "entries" || e === Symbol.iterator && i, u = e === "keys" && i, a = r[e](...s), d = n ? Ke : t ? Be : We;
    return !t && V(
      o,
      "iterate",
      u ? De : U
    ), {
      // iterator protocol
      next() {
        const { value: l, done: f } = a.next();
        return f ? { value: l, done: f } : {
          value: c ? [d(l[0]), d(l[1])] : d(l),
          done: f
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function P(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(
        `${on(e)} operation ${n}failed: target is readonly.`,
        p(this)
      );
    }
    return e === "delete" ? !1 : this;
  };
}
function $n() {
  const e = {
    get(o) {
      return ie(this, o);
    },
    get size() {
      return le(this);
    },
    has: ce,
    add: et,
    set: tt,
    delete: nt,
    clear: rt,
    forEach: ue(!1, !1)
  }, t = {
    get(o) {
      return ie(this, o, !1, !0);
    },
    get size() {
      return le(this);
    },
    has: ce,
    add: et,
    set: tt,
    delete: nt,
    clear: rt,
    forEach: ue(!1, !0)
  }, n = {
    get(o) {
      return ie(this, o, !0);
    },
    get size() {
      return le(this, !0);
    },
    has(o) {
      return ce.call(this, o, !0);
    },
    add: P("add"),
    set: P("set"),
    delete: P("delete"),
    clear: P("clear"),
    forEach: ue(!0, !1)
  }, s = {
    get(o) {
      return ie(this, o, !0, !0);
    },
    get size() {
      return le(this, !0);
    },
    has(o) {
      return ce.call(this, o, !0);
    },
    add: P("add"),
    set: P("set"),
    delete: P("delete"),
    clear: P("clear"),
    forEach: ue(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((o) => {
    e[o] = ae(
      o,
      !1,
      !1
    ), n[o] = ae(
      o,
      !0,
      !1
    ), t[o] = ae(
      o,
      !1,
      !0
    ), s[o] = ae(
      o,
      !0,
      !0
    );
  }), [
    e,
    n,
    t,
    s
  ];
}
const [
  Tn,
  vn,
  Pn,
  Mn
] = /* @__PURE__ */ $n();
function He(e, t) {
  const n = t ? e ? Mn : Pn : e ? vn : Tn;
  return (s, r, o) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    m(n, r) && r in s ? n : s,
    r,
    o
  );
}
const Fn = {
  get: /* @__PURE__ */ He(!1, !1)
}, An = {
  get: /* @__PURE__ */ He(!0, !1)
}, jn = {
  get: /* @__PURE__ */ He(!0, !0)
};
function It(e, t, n) {
  const s = p(n);
  if (s !== n && t.call(e, s)) {
    const r = _t(e);
    console.warn(
      `Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Rt = /* @__PURE__ */ new WeakMap(), zn = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ new WeakMap();
function Kn(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Hn(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Kn(_t(e));
}
function Ct(e) {
  return G(e) ? e : Ue(
    e,
    !1,
    Dn,
    Fn,
    Rt
  );
}
function $t(e) {
  return Ue(
    e,
    !0,
    xt,
    An,
    yt
  );
}
function fe(e) {
  return Ue(
    e,
    !0,
    Cn,
    jn,
    Dt
  );
}
function Ue(e, t, n, s, r) {
  if (!w(e))
    return process.env.NODE_ENV !== "production" && console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const o = r.get(e);
  if (o)
    return o;
  const i = Hn(e);
  if (i === 0)
    return e;
  const c = new Proxy(
    e,
    i === 2 ? s : n
  );
  return r.set(e, c), c;
}
function B(e) {
  return G(e) ? B(e.__v_raw) : !!(e && e.__v_isReactive);
}
function G(e) {
  return !!(e && e.__v_isReadonly);
}
function Ce(e) {
  return !!(e && e.__v_isShallow);
}
function $e(e) {
  return B(e) || G(e);
}
function p(e) {
  const t = e && e.__v_raw;
  return t ? p(t) : e;
}
function Un(e) {
  return cn(e, "__v_skip", !0), e;
}
const We = (e) => w(e) ? Ct(e) : e, Be = (e) => w(e) ? $t(e) : e;
function S(e) {
  return !!(e && e.__v_isRef === !0);
}
function Wn(e) {
  return S(e) ? e.value : e;
}
const Bn = {
  get: (e, t, n) => Wn(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return S(r) && !S(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Jn(e) {
  return B(e) ? e : new Proxy(e, Bn);
}
const J = [];
function qn(e) {
  J.push(e);
}
function Gn() {
  J.pop();
}
function b(e, ...t) {
  if (process.env.NODE_ENV === "production")
    return;
  Ot();
  const n = J.length ? J[J.length - 1].component : null, s = n && n.appContext.config.warnHandler, r = Ln();
  if (s)
    q(
      s,
      n,
      11,
      [
        e + t.join(""),
        n && n.proxy,
        r.map(
          ({ vnode: o }) => `at <${Gt(n, o.type)}>`
        ).join(`
`),
        r
      ]
    );
  else {
    const o = [`[Vue warn]: ${e}`, ...t];
    r.length && o.push(`
`, ...Yn(r)), console.warn(...o);
  }
  St();
}
function Ln() {
  let e = J[J.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const s = e.component && e.component.parent;
    e = s && s.vnode;
  }
  return t;
}
function Yn(e) {
  const t = [];
  return e.forEach((n, s) => {
    t.push(...s === 0 ? [] : [`
`], ...Qn(n));
  }), t;
}
function Qn({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", s = e.component ? e.component.parent == null : !1, r = ` at <${Gt(
    e.component,
    e.type,
    s
  )}`, o = ">" + n;
  return e.props ? [r, ...Xn(e.props), o] : [r + o];
}
function Xn(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((s) => {
    t.push(...Tt(s, e[s]));
  }), n.length > 3 && t.push(" ..."), t;
}
function Tt(e, t, n) {
  return D(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : S(t) ? (t = Tt(e, p(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : E(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = p(t), n ? t : [`${e}=`, t]);
}
const vt = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  0: "setup function",
  1: "render function",
  2: "watcher getter",
  3: "watcher callback",
  4: "watcher cleanup function",
  5: "native event handler",
  6: "component event handler",
  7: "vnode hook",
  8: "directive hook",
  9: "transition hook",
  10: "app errorHandler",
  11: "app warnHandler",
  12: "ref function",
  13: "async component loader",
  14: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"
};
function q(e, t, n, s) {
  let r;
  try {
    r = s ? e(...s) : e();
  } catch (o) {
    Pt(o, t, n);
  }
  return r;
}
function Te(e, t, n, s) {
  if (E(e)) {
    const o = q(e, t, n, s);
    return o && rn(o) && o.catch((i) => {
      Pt(i, t, n);
    }), o;
  }
  const r = [];
  for (let o = 0; o < e.length; o++)
    r.push(Te(e[o], t, n, s));
  return r;
}
function Pt(e, t, n, s = !0) {
  const r = t ? t.vnode : null;
  if (t) {
    let o = t.parent;
    const i = t.proxy, c = process.env.NODE_ENV !== "production" ? vt[n] : n;
    for (; o; ) {
      const a = o.ec;
      if (a) {
        for (let d = 0; d < a.length; d++)
          if (a[d](e, i, c) === !1)
            return;
      }
      o = o.parent;
    }
    const u = t.appContext.config.errorHandler;
    if (u) {
      q(
        u,
        null,
        10,
        [e, i, c]
      );
      return;
    }
  }
  Zn(e, n, r, s);
}
function Zn(e, t, n, s = !0) {
  if (process.env.NODE_ENV !== "production") {
    const r = vt[t];
    if (n && qn(n), b(`Unhandled error${r ? ` during execution of ${r}` : ""}`), n && Gn(), s)
      throw e;
    console.error(e);
  } else
    console.error(e);
}
let ge = !1, ve = !1;
const C = [];
let F = 0;
const Q = [];
let T = null, M = 0;
const Mt = /* @__PURE__ */ Promise.resolve();
let Je = null;
const kn = 100;
function er(e) {
  const t = Je || Mt;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function tr(e) {
  let t = F + 1, n = C.length;
  for (; t < n; ) {
    const s = t + n >>> 1;
    re(C[s]) < e ? t = s + 1 : n = s;
  }
  return t;
}
function qe(e) {
  (!C.length || !C.includes(
    e,
    ge && e.allowRecurse ? F + 1 : F
  )) && (e.id == null ? C.push(e) : C.splice(tr(e.id), 0, e), Ft());
}
function Ft() {
  !ge && !ve && (ve = !0, Je = Mt.then(jt));
}
function At(e) {
  h(e) ? Q.push(...e) : (!T || !T.includes(
    e,
    e.allowRecurse ? M + 1 : M
  )) && Q.push(e), Ft();
}
function nr(e) {
  if (Q.length) {
    const t = [...new Set(Q)];
    if (Q.length = 0, T) {
      T.push(...t);
      return;
    }
    for (T = t, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), T.sort((n, s) => re(n) - re(s)), M = 0; M < T.length; M++)
      process.env.NODE_ENV !== "production" && zt(e, T[M]) || T[M]();
    T = null, M = 0;
  }
}
const re = (e) => e.id == null ? 1 / 0 : e.id, rr = (e, t) => {
  const n = re(e) - re(t);
  if (n === 0) {
    if (e.pre && !t.pre)
      return -1;
    if (t.pre && !e.pre)
      return 1;
  }
  return n;
};
function jt(e) {
  ve = !1, ge = !0, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), C.sort(rr);
  const t = process.env.NODE_ENV !== "production" ? (n) => zt(e, n) : pt;
  try {
    for (F = 0; F < C.length; F++) {
      const n = C[F];
      if (n && n.active !== !1) {
        if (process.env.NODE_ENV !== "production" && t(n))
          continue;
        q(n, null, 14);
      }
    }
  } finally {
    F = 0, C.length = 0, nr(e), ge = !1, Je = null, (C.length || Q.length) && jt(e);
  }
}
function zt(e, t) {
  if (!e.has(t))
    e.set(t, 1);
  else {
    const n = e.get(t);
    if (n > kn) {
      const s = t.ownerInstance, r = s && qt(s.type);
      return b(
        `Maximum recursive updates exceeded${r ? ` in component <${r}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`
      ), !0;
    } else
      e.set(t, n + 1);
  }
}
const Z = /* @__PURE__ */ new Set();
process.env.NODE_ENV !== "production" && (xe().__VUE_HMR_RUNTIME__ = {
  createRecord: Oe(sr),
  rerender: Oe(or),
  reload: Oe(ir)
});
const me = /* @__PURE__ */ new Map();
function sr(e, t) {
  return me.has(e) ? !1 : (me.set(e, {
    initialDef: te(t),
    instances: /* @__PURE__ */ new Set()
  }), !0);
}
function te(e) {
  return Lt(e) ? e.__vccOpts : e;
}
function or(e, t) {
  const n = me.get(e);
  n && (n.initialDef.render = t, [...n.instances].forEach((s) => {
    t && (s.render = t, te(s.type).render = t), s.renderCache = [], s.update();
  }));
}
function ir(e, t) {
  const n = me.get(e);
  if (!n)
    return;
  t = te(t), st(n.initialDef, t);
  const s = [...n.instances];
  for (const r of s) {
    const o = te(r.type);
    Z.has(o) || (o !== n.initialDef && st(o, t), Z.add(o)), r.appContext.propsCache.delete(r.type), r.appContext.emitsCache.delete(r.type), r.appContext.optionsCache.delete(r.type), r.ceReload ? (Z.add(o), r.ceReload(t.styles), Z.delete(o)) : r.parent ? qe(r.parent.update) : r.appContext.reload ? r.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn(
      "[HMR] Root or manually mounted instance modified. Full reload required."
    );
  }
  At(() => {
    for (const r of s)
      Z.delete(
        te(r.type)
      );
  });
}
function st(e, t) {
  R(e, t);
  for (const n in e)
    n !== "__file" && !(n in t) && delete e[n];
}
function Oe(e) {
  return (t, n) => {
    try {
      return e(t, n);
    } catch (s) {
      console.error(s), console.warn(
        "[HMR] Something went wrong during Vue component hot-reload. Full reload required."
      );
    }
  };
}
let A = null, cr = null;
const lr = (e) => e.__isSuspense;
function ur(e, t) {
  t && t.pendingBranch ? h(e) ? t.effects.push(...e) : t.effects.push(e) : At(e);
}
const pe = {};
function ar(e, t, { immediate: n, deep: s, flush: r, onTrack: o, onTrigger: i } = v) {
  var c;
  process.env.NODE_ENV !== "production" && !t && (n !== void 0 && b(
    'watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'
  ), s !== void 0 && b(
    'watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'
  ));
  const u = (g) => {
    b(
      "Invalid watch source: ",
      g,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, a = dn() === ((c = X) == null ? void 0 : c.scope) ? X : null;
  let d, l = !1, f = !1;
  if (S(e) ? (d = () => e.value, l = Ce(e)) : B(e) ? (d = () => e, s = !0) : h(e) ? (f = !0, l = e.some((g) => B(g) || Ce(g)), d = () => e.map((g) => {
    if (S(g))
      return g.value;
    if (B(g))
      return Y(g);
    if (E(g))
      return q(g, a, 2);
    process.env.NODE_ENV !== "production" && u(g);
  })) : E(e) ? t ? d = () => q(e, a, 2) : d = () => {
    if (!(a && a.isUnmounted))
      return _ && _(), Te(
        e,
        a,
        3,
        [x]
      );
  } : (d = pt, process.env.NODE_ENV !== "production" && u(e)), t && s) {
    const g = d;
    d = () => Y(g());
  }
  let _, x = (g) => {
    _ = y.onStop = () => {
      q(g, a, 4);
    };
  }, I = f ? new Array(e.length).fill(pe) : pe;
  const K = () => {
    if (y.active)
      if (t) {
        const g = y.run();
        (s || l || (f ? g.some(
          (Yt, Qt) => _e(Yt, I[Qt])
        ) : _e(g, I))) && (_ && _(), Te(t, a, 3, [
          g,
          // pass undefined as the old value when it's changed for the first time
          I === pe ? void 0 : f && I[0] === pe ? [] : I,
          x
        ]), I = g);
      } else
        y.run();
  };
  K.allowRecurse = !!t;
  let se;
  r === "sync" ? se = K : r === "post" ? se = () => ut(K, a && a.suspense) : (K.pre = !0, a && (K.id = a.uid), se = () => qe(K));
  const y = new gn(d, se);
  return process.env.NODE_ENV !== "production" && (y.onTrack = o, y.onTrigger = i), t ? n ? K() : I = y.run() : r === "post" ? ut(
    y.run.bind(y),
    a && a.suspense
  ) : y.run(), () => {
    y.stop(), a && a.scope && tn(a.scope.effects, y);
  };
}
function fr(e, t, n) {
  const s = this.proxy, r = D(e) ? e.includes(".") ? pr(s, e) : () => s[e] : e.bind(s, s);
  let o;
  E(t) ? o = t : (o = t.handler, n = t);
  const i = X;
  ft(this);
  const c = ar(r, o.bind(s), n);
  return i ? ft(i) : $r(), c;
}
function pr(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++)
      s = s[n[r]];
    return s;
  };
}
function Y(e, t) {
  if (!w(e) || e.__v_skip || (t = t || /* @__PURE__ */ new Set(), t.has(e)))
    return e;
  if (t.add(e), S(e))
    Y(e.value, t);
  else if (h(e))
    for (let n = 0; n < e.length; n++)
      Y(e[n], t);
  else if (dt(e) || H(e))
    e.forEach((n) => {
      Y(n, t);
    });
  else if (gt(e))
    for (const n in e)
      Y(e[n], t);
  return e;
}
function Hr(e, t) {
  return E(e) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => R({ name: e.name }, t, { setup: e }))()
  ) : e;
}
const dr = Symbol.for("v-ndc"), Pe = (e) => e ? Tr(e) ? vr(e) || e.proxy : Pe(e.parent) : null, ne = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ R(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => process.env.NODE_ENV !== "production" ? fe(e.props) : e.props,
    $attrs: (e) => process.env.NODE_ENV !== "production" ? fe(e.attrs) : e.attrs,
    $slots: (e) => process.env.NODE_ENV !== "production" ? fe(e.slots) : e.slots,
    $refs: (e) => process.env.NODE_ENV !== "production" ? fe(e.refs) : e.refs,
    $parent: (e) => Pe(e.parent),
    $root: (e) => Pe(e.root),
    $emit: (e) => e.emit,
    $options: (e) => gr(e),
    $forceUpdate: (e) => e.f || (e.f = () => qe(e.update)),
    $nextTick: (e) => e.n || (e.n = er.bind(e.proxy)),
    $watch: (e) => fr.bind(e)
  })
), hr = (e) => e === "_" || e === "$", Se = (e, t) => e !== v && !e.__isScriptSetup && m(e, t), _r = {
  get({ _: e }, t) {
    const { ctx: n, setupState: s, data: r, props: o, accessCache: i, type: c, appContext: u } = e;
    if (process.env.NODE_ENV !== "production" && t === "__isVue")
      return !0;
    let a;
    if (t[0] !== "$") {
      const _ = i[t];
      if (_ !== void 0)
        switch (_) {
          case 1:
            return s[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return o[t];
        }
      else {
        if (Se(s, t))
          return i[t] = 1, s[t];
        if (r !== v && m(r, t))
          return i[t] = 2, r[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (a = e.propsOptions[0]) && m(a, t)
        )
          return i[t] = 3, o[t];
        if (n !== v && m(n, t))
          return i[t] = 4, n[t];
        i[t] = 0;
      }
    }
    const d = ne[t];
    let l, f;
    if (d)
      return t === "$attrs" ? (V(e, "get", t), process.env.NODE_ENV !== "production" && void 0) : process.env.NODE_ENV !== "production" && t === "$slots" && V(e, "get", t), d(e);
    if (
      // css module (injected by vue-loader)
      (l = c.__cssModules) && (l = l[t])
    )
      return l;
    if (n !== v && m(n, t))
      return i[t] = 4, n[t];
    if (
      // global properties
      f = u.config.globalProperties, m(f, t)
    )
      return f[t];
    process.env.NODE_ENV !== "production" && A && (!D(t) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    t.indexOf("__v") !== 0) && (r !== v && hr(t[0]) && m(r, t) ? b(
      `Property ${JSON.stringify(
        t
      )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
    ) : e === A && b(
      `Property ${JSON.stringify(t)} was accessed during render but is not defined on instance.`
    ));
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: r, ctx: o } = e;
    return Se(r, t) ? (r[t] = n, !0) : process.env.NODE_ENV !== "production" && r.__isScriptSetup && m(r, t) ? (b(`Cannot mutate <script setup> binding "${t}" from Options API.`), !1) : s !== v && m(s, t) ? (s[t] = n, !0) : m(e.props, t) ? (process.env.NODE_ENV !== "production" && b(`Attempting to mutate prop "${t}". Props are readonly.`), !1) : t[0] === "$" && t.slice(1) in e ? (process.env.NODE_ENV !== "production" && b(
      `Attempting to mutate public property "${t}". Properties starting with $ are reserved and readonly.`
    ), !1) : (process.env.NODE_ENV !== "production" && t in e.appContext.config.globalProperties ? Object.defineProperty(o, t, {
      enumerable: !0,
      configurable: !0,
      value: n
    }) : o[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, propsOptions: o }
  }, i) {
    let c;
    return !!n[i] || e !== v && m(e, i) || Se(t, i) || (c = o[0]) && m(c, i) || m(s, i) || m(ne, i) || m(r.config.globalProperties, i);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : m(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
process.env.NODE_ENV !== "production" && (_r.ownKeys = (e) => (b(
  "Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."
), Reflect.ownKeys(e)));
function ot(e) {
  return h(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
function gr(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: r,
    optionsCache: o,
    config: { optionMergeStrategies: i }
  } = e.appContext, c = o.get(t);
  let u;
  return c ? u = c : !r.length && !n && !s ? u = t : (u = {}, r.length && r.forEach(
    (a) => Ee(u, a, i, !0)
  ), Ee(u, t, i)), w(t) && o.set(t, u), u;
}
function Ee(e, t, n, s = !1) {
  const { mixins: r, extends: o } = t;
  o && Ee(e, o, n, !0), r && r.forEach(
    (i) => Ee(e, i, n, !0)
  );
  for (const i in t)
    if (s && i === "expose")
      process.env.NODE_ENV !== "production" && b(
        '"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.'
      );
    else {
      const c = mr[i] || n && n[i];
      e[i] = c ? c(e[i], t[i]) : t[i];
    }
  return e;
}
const mr = {
  data: it,
  props: lt,
  emits: lt,
  // objects
  methods: ee,
  computed: ee,
  // lifecycle
  beforeCreate: N,
  created: N,
  beforeMount: N,
  mounted: N,
  beforeUpdate: N,
  updated: N,
  beforeDestroy: N,
  beforeUnmount: N,
  destroyed: N,
  unmounted: N,
  activated: N,
  deactivated: N,
  errorCaptured: N,
  serverPrefetch: N,
  // assets
  components: ee,
  directives: ee,
  // watch
  watch: wr,
  // provide / inject
  provide: it,
  inject: Er
};
function it(e, t) {
  return t ? e ? function() {
    return R(
      E(e) ? e.call(this, this) : e,
      E(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Er(e, t) {
  return ee(ct(e), ct(t));
}
function ct(e) {
  if (h(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function N(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function ee(e, t) {
  return e ? R(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function lt(e, t) {
  return e ? h(e) && h(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : R(
    /* @__PURE__ */ Object.create(null),
    ot(e),
    ot(t ?? {})
  ) : t;
}
function wr(e, t) {
  if (!e)
    return t;
  if (!t)
    return e;
  const n = R(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = N(e[s], t[s]);
  return n;
}
const ut = ur, Nr = (e) => e.__isTeleport, Kt = Symbol.for("v-fgt"), br = Symbol.for("v-txt"), Or = Symbol.for("v-cmt"), de = [];
let $ = null;
function Ur(e = !1) {
  de.push($ = e ? null : []);
}
function Sr() {
  de.pop(), $ = de[de.length - 1] || null;
}
function Vr(e) {
  return e.dynamicChildren = $ || Zt, Sr(), $ && $.push(e), e;
}
function Wr(e, t, n, s, r, o) {
  return Vr(
    Wt(
      e,
      t,
      n,
      s,
      r,
      o,
      !0
      /* isBlock */
    )
  );
}
function xr(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
const Ir = (...e) => Bt(
  ...e
), Ht = "__vInternal", Ut = ({ key: e }) => e ?? null, he = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? D(e) || S(e) || E(e) ? { i: A, r: e, k: t, f: !!n } : e : null);
function Wt(e, t = null, n = null, s = 0, r = null, o = e === Kt ? 0 : 1, i = !1, c = !1) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Ut(t),
    ref: t && he(t),
    scopeId: cr,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: o,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: A
  };
  return c ? (Ge(u, n), o & 128 && e.normalize(u)) : n && (u.shapeFlag |= D(n) ? 8 : 16), process.env.NODE_ENV !== "production" && u.key !== u.key && b("VNode created with invalid key (NaN). VNode type:", u.type), // avoid a block node from tracking itself
  !i && // has current parent block
  $ && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (u.patchFlag > 0 || o & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  u.patchFlag !== 32 && $.push(u), u;
}
const Rr = process.env.NODE_ENV !== "production" ? Ir : Bt;
function Bt(e, t = null, n = null, s = 0, r = null, o = !1) {
  if ((!e || e === dr) && (process.env.NODE_ENV !== "production" && !e && b(`Invalid vnode type when creating vnode: ${e}.`), e = Or), xr(e)) {
    const c = we(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Ge(c, n), !o && $ && (c.shapeFlag & 6 ? $[$.indexOf(e)] = c : $.push(c)), c.patchFlag |= -2, c;
  }
  if (Lt(e) && (e = e.__vccOpts), t) {
    t = yr(t);
    let { class: c, style: u } = t;
    c && !D(c) && (t.class = je(c)), w(u) && ($e(u) && !h(u) && (u = R({}, u)), t.style = Ae(u));
  }
  const i = D(e) ? 1 : lr(e) ? 128 : Nr(e) ? 64 : w(e) ? 4 : E(e) ? 2 : 0;
  return process.env.NODE_ENV !== "production" && i & 4 && $e(e) && (e = p(e), b(
    "Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.",
    `
Component that was made reactive: `,
    e
  )), Wt(
    e,
    t,
    n,
    s,
    r,
    i,
    o,
    !0
  );
}
function yr(e) {
  return e ? $e(e) || Ht in e ? R({}, e) : e : null;
}
function we(e, t, n = !1) {
  const { props: s, ref: r, patchFlag: o, children: i } = e, c = t ? Cr(s || {}, t) : s;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: c,
    key: c && Ut(c),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? h(r) ? r.concat(he(t)) : [r, he(t)] : he(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: process.env.NODE_ENV !== "production" && o === -1 && h(i) ? i.map(Jt) : i,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Kt ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && we(e.ssContent),
    ssFallback: e.ssFallback && we(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
}
function Jt(e) {
  const t = we(e);
  return h(e.children) && (t.children = e.children.map(Jt)), t;
}
function Dr(e = " ", t = 0) {
  return Rr(br, null, e, t);
}
function Ge(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (h(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Ge(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !(Ht in t) ? t._ctx = A : r === 3 && A && (A.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else
    E(t) ? (t = { default: t, _ctx: A }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [Dr(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Cr(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = je([t.class, s.class]));
      else if (r === "style")
        t.style = Ae([t.style, s.style]);
      else if (en(r)) {
        const o = t[r], i = s[r];
        i && o !== i && !(h(o) && o.includes(i)) && (t[r] = o ? [].concat(o, i) : i);
      } else
        r !== "" && (t[r] = s[r]);
  }
  return t;
}
let X = null, Le, L, at = "__VUE_INSTANCE_SETTERS__";
(L = xe()[at]) || (L = xe()[at] = []), L.push((e) => X = e), Le = (e) => {
  L.length > 1 ? L.forEach((t) => t(e)) : L[0](e);
};
const ft = (e) => {
  Le(e), e.scope.on();
}, $r = () => {
  X && X.scope.off(), Le(null);
};
function Tr(e) {
  return e.vnode.shapeFlag & 4;
}
function vr(e) {
  if (e.exposed)
    return e.exposeProxy || (e.exposeProxy = new Proxy(Jn(Un(e.exposed)), {
      get(t, n) {
        if (n in t)
          return t[n];
        if (n in ne)
          return ne[n](e);
      },
      has(t, n) {
        return n in t || n in ne;
      }
    }));
}
const Pr = /(?:^|[-_])(\w)/g, Mr = (e) => e.replace(Pr, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function qt(e, t = !0) {
  return E(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Gt(e, t, n = !1) {
  let s = qt(t);
  if (!s && t.__file) {
    const r = t.__file.match(/([^/\\]+)\.\w+$/);
    r && (s = r[1]);
  }
  if (!s && e && e.parent) {
    const r = (o) => {
      for (const i in o)
        if (o[i] === t)
          return i;
    };
    s = r(
      e.components || e.parent.type.components
    ) || r(e.appContext.components);
  }
  return s ? Mr(s) : n ? "App" : "Anonymous";
}
function Lt(e) {
  return E(e) && "__vccOpts" in e;
}
function Ve(e) {
  return !!(e && e.__v_isShallow);
}
function Fr() {
  if (process.env.NODE_ENV === "production" || typeof window > "u")
    return;
  const e = { style: "color:#3ba776" }, t = { style: "color:#0b1bc9" }, n = { style: "color:#b62e24" }, s = { style: "color:#9d288c" }, r = {
    header(l) {
      return w(l) ? l.__isVue ? ["div", e, "VueInstance"] : S(l) ? [
        "div",
        {},
        ["span", e, d(l)],
        "<",
        c(l.value),
        ">"
      ] : B(l) ? [
        "div",
        {},
        ["span", e, Ve(l) ? "ShallowReactive" : "Reactive"],
        "<",
        c(l),
        `>${G(l) ? " (readonly)" : ""}`
      ] : G(l) ? [
        "div",
        {},
        ["span", e, Ve(l) ? "ShallowReadonly" : "Readonly"],
        "<",
        c(l),
        ">"
      ] : null : null;
    },
    hasBody(l) {
      return l && l.__isVue;
    },
    body(l) {
      if (l && l.__isVue)
        return [
          "div",
          {},
          ...o(l.$)
        ];
    }
  };
  function o(l) {
    const f = [];
    l.type.props && l.props && f.push(i("props", p(l.props))), l.setupState !== v && f.push(i("setup", l.setupState)), l.data !== v && f.push(i("data", p(l.data)));
    const _ = u(l, "computed");
    _ && f.push(i("computed", _));
    const x = u(l, "inject");
    return x && f.push(i("injected", x)), f.push([
      "div",
      {},
      [
        "span",
        {
          style: s.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: l }]
    ]), f;
  }
  function i(l, f) {
    return f = R({}, f), Object.keys(f).length ? [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        l
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(f).map((_) => [
          "div",
          {},
          ["span", s, _ + ": "],
          c(f[_], !1)
        ])
      ]
    ] : ["span", {}];
  }
  function c(l, f = !0) {
    return typeof l == "number" ? ["span", t, l] : typeof l == "string" ? ["span", n, JSON.stringify(l)] : typeof l == "boolean" ? ["span", s, l] : w(l) ? ["object", { object: f ? p(l) : l }] : ["span", n, String(l)];
  }
  function u(l, f) {
    const _ = l.type;
    if (E(_))
      return;
    const x = {};
    for (const I in l.ctx)
      a(_, I, f) && (x[I] = l.ctx[I]);
    return x;
  }
  function a(l, f, _) {
    const x = l[_];
    if (h(x) && x.includes(f) || w(x) && f in x || l.extends && a(l.extends, f, _) || l.mixins && l.mixins.some((I) => a(I, f, _)))
      return !0;
  }
  function d(l) {
    return Ve(l) ? "ShallowRef" : l.effect ? "ComputedRef" : "Ref";
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(r) : window.devtoolsFormatters = [r];
}
function Ar() {
  Fr();
}
process.env.NODE_ENV !== "production" && Ar();
const Br = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
};
export {
  Br as _,
  Wr as c,
  Hr as d,
  Ur as o,
  Kr as t
};
