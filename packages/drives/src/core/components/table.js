export function YsTableComponent(domId, data) {
  const dom = document.getElementById(domId);
  console.log(dom)
  const vnodeChildren = data.map(nodeTr => {
    const vnodeTd = nodeTr.map(nodeTd => {
      return snabbdom.h('td', nodeTd.text);
    })
    return snabbdom.h('tr', vnodeTd);
  });
  const vnode = snabbdom.h('table', { on: { click: 'test' } }, vnodeChildren)

  patch(dom, vnode);
}