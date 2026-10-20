/* Swimart Robotic Cleaner Selector: standalone page runtime.
   Renders the {{hole}}, <sc-for> and <sc-if> template inside <x-dc> from the page's Component class. */
(function () {
  class DCLogic {
    constructor(p) { this.props = p || {}; this.state = {}; }
    setState(u) { Object.assign(this.state, typeof u === 'function' ? u(this.state) : u); render(); }
  }
  window.DCLogic = DCLogic;
  let host, tpl, inst, lastKey = '';
  const HOLE = /\{\{\s*([\w.$]+)\s*\}\}/g;
  const get = (scope, path) => path.trim().split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
  const interp = (str, scope) => str.replace(HOLE, (_, p) => { const v = get(scope, p); return v == null ? '' : v; });
  function walk(node, scope) {
    if (node.nodeType === 3) { if (node.textContent.indexOf('{{') >= 0) node.textContent = interp(node.textContent, scope); return; }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    if (tag === 'sc-for') {
      const m = node.getAttribute('list').match(/\{\{\s*([\w.$]+)\s*\}\}/);
      const list = (m && get(scope, m[1])) || [];
      const as = node.getAttribute('as');
      const frag = document.createDocumentFragment();
      list.forEach(it => {
        const c = node.cloneNode(true);
        const s = Object.assign({}, scope, {[as]: it});
        Array.from(c.childNodes).forEach(ch => walk(ch, s));
        while (c.firstChild) frag.appendChild(c.firstChild);
      });
      node.replaceWith(frag); return;
    }
    if (tag === 'sc-if') {
      const m = node.getAttribute('value').match(/\{\{\s*([\w.$]+)\s*\}\}/);
      if (!(m && get(scope, m[1]))) { node.remove(); return; }
      const frag = document.createDocumentFragment();
      Array.from(node.childNodes).forEach(ch => walk(ch, scope));
      while (node.firstChild) frag.appendChild(node.firstChild);
      node.replaceWith(frag); return;
    }
    let selVal;
    for (const at of Array.from(node.attributes)) {
      const whole = at.value.match(/^\{\{\s*([\w.$]+)\s*\}\}$/);
      if (/^on[a-z]+$/i.test(at.name)) {
        node.removeAttribute(at.name);
        const fn = whole && get(scope, whole[1]);
        if (typeof fn === 'function') node.addEventListener(at.name.slice(2).toLowerCase(), fn);
        continue;
      }
      if (at.name === 'value' && whole && node.tagName === 'SELECT') { selVal = get(scope, whole[1]); node.removeAttribute('value'); continue; }
      if (at.value.indexOf('{{') >= 0) node.setAttribute(at.name, interp(at.value, scope));
    }
    Array.from(node.childNodes).forEach(ch => walk(ch, scope));
    if (selVal !== undefined) node.value = selVal == null ? '' : selVal;
  }
  function render() {
    const scrolls = Array.from(host.querySelectorAll('[data-scroll]')).map(e => e.scrollTop);
    const winY = window.scrollY;
    const vals = inst.renderVals();
    host.innerHTML = tpl;
    Array.from(host.childNodes).forEach(ch => walk(ch, vals));
    host.querySelectorAll('img[data-src]').forEach(i => { i.setAttribute('src', i.getAttribute('data-src')); i.removeAttribute('data-src'); });
    const st = inst.state || {}, key = [st.step, st.mode, st.showBrands].join('|');
    if (key === lastKey) host.querySelectorAll('[data-scroll]').forEach((e, i) => { if (scrolls[i] !== undefined) e.scrollTop = scrolls[i]; });
    lastKey = key;
    window.scrollTo(0, winY);
  }
  document.addEventListener('DOMContentLoaded', () => {
    host = document.querySelector('x-dc');
    const helmet = host.querySelector('helmet');
    if (helmet) { while (helmet.firstChild) document.head.appendChild(helmet.firstChild); helmet.remove(); }
    tpl = host.innerHTML;
    const sc = document.querySelector('script[data-dc-script]');
    const props = {};
    try { const d = JSON.parse(sc.dataset.props || '{}'); for (const k in d) if (d[k] && d[k].default !== undefined) props[k] = d[k].default; } catch (e) {}
    const Comp = new Function('DCLogic', sc.textContent + '\nreturn Component;')(DCLogic);
    inst = new Comp(props);
    render();
  });
})();
