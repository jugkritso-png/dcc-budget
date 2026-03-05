(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,31278,e=>{"use strict";let t=(0,e.i(75254).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["Loader2",()=>t],31278)},63209,e=>{"use strict";let t=(0,e.i(75254).default)("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);e.s(["AlertCircle",()=>t],63209)},56909,e=>{"use strict";let t=(0,e.i(75254).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["Save",()=>t],56909)},37727,e=>{"use strict";let t=(0,e.i(75254).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",()=>t],37727)},5766,e=>{"use strict";let t,s;var r,a=e.i(71645);let i={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,c=(e,t)=>{let s="",r="",a="";for(let i in e){let l=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+l+";":r+="f"==i[1]?c(l,i):i+"{"+c(l,"k"==i[1]?"":t)+"}":"object"==typeof l?r+=c(l,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=l&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=c.p?c.p(i,l):i+":"+l+";")}return s+(t&&a?t+"{"+a+"}":a)+r},d={},u=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+u(e[s]);return t}return e};function x(e){let t,s,r=this||{},a=e.call?e(r.p):e;return((e,t,s,r,a)=>{var i;let x=u(e),m=d[x]||(d[x]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(x));if(!d[m]){let t=x!==e?e:(e=>{let t,s,r=[{}];for(;t=l.exec(e.replace(o,""));)t[4]?r.shift():t[3]?(s=t[3].replace(n," ").trim(),r.unshift(r[0][s]=r[0][s]||{})):r[0][t[1]]=t[2].replace(n," ").trim();return r[0]})(e);d[m]=c(a?{["@keyframes "+m]:t}:t,s?"":"."+m)}let p=s&&d.g?d.g:null;return s&&(d.g=d[m]),i=d[m],p?t.data=t.data.replace(p,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),m})(a.unshift?a.raw?(t=[].slice.call(arguments,1),s=r.p,a.reduce((e,r,a)=>{let i=t[a];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):a.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):a,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(r.target),r.g,r.o,r.k)}x.bind({g:1});let m,p,h,f=x.bind({k:1});function g(e,t){let s=this||{};return function(){let r=arguments;function a(i,l){let o=Object.assign({},i),n=o.className||a.className;s.p=Object.assign({theme:p&&p()},o),s.o=/ *go\d+/.test(n),o.className=x.apply(s,r)+(n?" "+n:""),t&&(o.ref=l);let c=e;return e[0]&&(c=o.as||e,delete o.as),h&&c[0]&&h(o),m(c,o)}return t?t(a):a}}var y=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),j="default",v=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return v(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},N=[],w={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},k={},C=(e,t=j)=>{k[t]=v(k[t]||w,e),N.forEach(([e,s])=>{e===t&&s(k[t])})},$=e=>Object.keys(k).forEach(t=>C(e,t)),E=(e=j)=>t=>{C(t,e)},S=e=>(t,s)=>{let r,a=((e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||b()}))(t,e,s);return E(a.toasterId||(r=a.id,Object.keys(k).find(e=>k[e].toasts.some(e=>e.id===r))))({type:2,toast:a}),a.id},A=(e,t)=>S("blank")(e,t);A.error=S("error"),A.success=S("success"),A.loading=S("loading"),A.custom=S("custom"),A.dismiss=(e,t)=>{let s={type:3,toastId:e};t?E(t)(s):$(s)},A.dismissAll=e=>A.dismiss(void 0,e),A.remove=(e,t)=>{let s={type:4,toastId:e};t?E(t)(s):$(s)},A.removeAll=e=>A.remove(void 0,e),A.promise=(e,t,s)=>{let r=A.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?y(t.success,e):void 0;return a?A.success(a,{id:r,...s,...null==s?void 0:s.success}):A.dismiss(r),e}).catch(e=>{let a=t.error?y(t.error,e):void 0;a?A.error(a,{id:r,...s,...null==s?void 0:s.error}):A.dismiss(r)}),e};var L=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,z=f`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,M=f`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,I=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${z} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${M} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,P=f`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,R=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${P} 1s linear infinite;
`,B=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,O=f`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,T=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${O} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,_=g("div")`
  position: absolute;
`,F=g("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,q=f`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,H=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${q} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,D=({toast:e})=>{let{icon:t,type:s,iconTheme:r}=e;return void 0!==t?"string"==typeof t?a.createElement(H,null,t):t:"blank"===s?null:a.createElement(F,null,a.createElement(R,{...r}),"loading"!==s&&a.createElement(_,null,"error"===s?a.createElement(I,{...r}):a.createElement(T,{...r})))},W=g("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,V=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;a.memo(({toast:e,position:t,style:r,children:i})=>{let l=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,i]=(()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${f(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${f(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=a.createElement(D,{toast:e}),n=a.createElement(V,{...e.ariaProps},y(e.message,e));return a.createElement(W,{className:e.className,style:{...l,...r,...e.style}},"function"==typeof i?i({icon:o,message:n}):a.createElement(a.Fragment,null,o,n))}),r=a.createElement,c.p=void 0,m=r,p=void 0,h=void 0,x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",()=>A],5766)},3812,e=>{"use strict";var t=e.i(43476),s=e.i(71645),r=e.i(75157);let a=s.default.forwardRef(({className:e,error:s,icon:a,...i},l)=>(0,t.jsxs)("div",{className:"relative w-full",children:[a&&(0,t.jsx)("div",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",children:(0,t.jsx)(a,{size:18})}),(0,t.jsx)("input",{className:(0,r.cn)("flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",!a&&"pl-4",s&&"border-red-500 focus:ring-red-500 bg-red-50",e),style:{paddingLeft:a?"3rem":void 0},ref:l,...i})]}));a.displayName="Input",e.s(["Input",0,a])},88653,32098,e=>{"use strict";e.i(47167);var t=e.i(43476),s=e.i(71645),r=e.i(31178),a=e.i(47414),i=e.i(74008),l=e.i(21476),o=e.i(72846),n=s,c=e.i(37806);function d(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class u extends n.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=t.offsetParent,s=(0,o.isHTMLElement)(e)&&e.offsetWidth||0,r=(0,o.isHTMLElement)(e)&&e.offsetHeight||0,a=this.props.sizeRef.current;a.height=t.offsetHeight||0,a.width=t.offsetWidth||0,a.top=t.offsetTop,a.left=t.offsetLeft,a.right=s-a.width-a.left,a.bottom=r-a.height-a.top}return null}componentDidUpdate(){}render(){return this.props.children}}function x({children:e,isPresent:r,anchorX:a,anchorY:i,root:l,pop:o}){let x=(0,n.useId)(),m=(0,n.useRef)(null),p=(0,n.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0}),{nonce:h}=(0,n.useContext)(c.MotionConfigContext),f=function(...e){return s.useCallback(function(...e){return t=>{let s=!1,r=e.map(e=>{let r=d(e,t);return s||"function"!=typeof r||(s=!0),r});if(s)return()=>{for(let t=0;t<r.length;t++){let s=r[t];"function"==typeof s?s():d(e[t],null)}}}}(...e),e)}(m,e.props?.ref??e?.ref);return(0,n.useInsertionEffect)(()=>{let{width:e,height:t,top:s,left:n,right:c,bottom:d}=p.current;if(r||!1===o||!m.current||!e||!t)return;let u="left"===a?`left: ${n}`:`right: ${c}`,f="bottom"===i?`bottom: ${d}`:`top: ${s}`;m.current.dataset.motionPopId=x;let g=document.createElement("style");h&&(g.nonce=h);let y=l??document.head;return y.appendChild(g),g.sheet&&g.sheet.insertRule(`
          [data-motion-pop-id="${x}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            ${u}px !important;
            ${f}px !important;
          }
        `),()=>{y.contains(g)&&y.removeChild(g)}},[r]),(0,t.jsx)(u,{isPresent:r,childRef:m,sizeRef:p,pop:o,children:!1===o?e:n.cloneElement(e,{ref:f})})}let m=({children:e,initial:r,isPresent:i,onExitComplete:o,custom:n,presenceAffectsLayout:c,mode:d,anchorX:u,anchorY:m,root:h})=>{let f=(0,a.useConstant)(p),g=(0,s.useId)(),y=!0,b=(0,s.useMemo)(()=>(y=!1,{id:g,initial:r,isPresent:i,custom:n,onExitComplete:e=>{for(let t of(f.set(e,!0),f.values()))if(!t)return;o&&o()},register:e=>(f.set(e,!1),()=>f.delete(e))}),[i,f,o]);return c&&y&&(b={...b}),(0,s.useMemo)(()=>{f.forEach((e,t)=>f.set(t,!1))},[i]),s.useEffect(()=>{i||f.size||!o||o()},[i]),e=(0,t.jsx)(x,{pop:"popLayout"===d,isPresent:i,anchorX:u,anchorY:m,root:h,children:e}),(0,t.jsx)(l.PresenceContext.Provider,{value:b,children:e})};function p(){return new Map}var h=e.i(64978);let f=e=>e.key||"";function g(e){let t=[];return s.Children.forEach(e,e=>{(0,s.isValidElement)(e)&&t.push(e)}),t}let y=({children:e,custom:l,initial:o=!0,onExitComplete:n,presenceAffectsLayout:c=!0,mode:d="sync",propagate:u=!1,anchorX:x="left",anchorY:p="top",root:y})=>{let[b,j]=(0,h.usePresence)(u),v=(0,s.useMemo)(()=>g(e),[e]),N=u&&!b?[]:v.map(f),w=(0,s.useRef)(!0),k=(0,s.useRef)(v),C=(0,a.useConstant)(()=>new Map),$=(0,s.useRef)(new Set),[E,S]=(0,s.useState)(v),[A,L]=(0,s.useState)(v);(0,i.useIsomorphicLayoutEffect)(()=>{w.current=!1,k.current=v;for(let e=0;e<A.length;e++){let t=f(A[e]);N.includes(t)?(C.delete(t),$.current.delete(t)):!0!==C.get(t)&&C.set(t,!1)}},[A,N.length,N.join("-")]);let z=[];if(v!==E){let e=[...v];for(let t=0;t<A.length;t++){let s=A[t],r=f(s);N.includes(r)||(e.splice(t,0,s),z.push(s))}return"wait"===d&&z.length&&(e=z),L(g(e)),S(v),null}let{forceRender:M}=(0,s.useContext)(r.LayoutGroupContext);return(0,t.jsx)(t.Fragment,{children:A.map(e=>{let s=f(e),r=(!u||!!b)&&(v===A||N.includes(s));return(0,t.jsx)(m,{isPresent:r,initial:(!w.current||!!o)&&void 0,custom:l,presenceAffectsLayout:c,mode:d,root:y,onExitComplete:r?void 0:()=>{if($.current.has(s)||($.current.add(s),!C.has(s)))return;C.set(s,!0);let e=!0;C.forEach(t=>{t||(e=!1)}),e&&(M?.(),L(k.current),u&&j?.(),n&&n())},anchorX:x,anchorY:p,children:e},s)})})};e.s(["AnimatePresence",()=>y],88653);var b=e.i(74080),j=e.i(37727),v=e.i(46932),N=e.i(75157),w=e.i(59544);e.s(["Modal",0,({isOpen:e,onClose:r,title:a,children:i,footer:l,width:o="max-w-2xl"})=>{let[n,c]=s.default.useState(!1);return(s.default.useEffect(()=>{c(!0)},[]),!n||"u"<typeof document)?null:(0,b.createPortal)((0,t.jsx)(y,{children:e&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(v.motion.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:r,className:"fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity"}),(0,t.jsx)("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none",children:(0,t.jsxs)(v.motion.div,{initial:{opacity:0,scale:.9,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:10},transition:{type:"spring",stiffness:350,damping:25,duration:.3},className:(0,N.cn)("bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-h-[90vh] flex flex-col pointer-events-auto border border-white/60 ring-4 ring-primary-50/50",o),children:[(0,t.jsxs)("div",{className:"flex items-center justify-between p-6 border-b border-gray-100 shrink-0",children:[(0,t.jsx)("h3",{className:"text-xl font-semibold text-gray-900",children:a}),(0,t.jsx)(w.Button,{variant:"ghost",size:"sm",onClick:r,className:"rounded-full h-8 w-8 p-0 hover:bg-gray-100",children:(0,t.jsx)(j.X,{className:"h-5 w-5"})})]}),(0,t.jsx)("div",{className:"p-6 overflow-y-auto flex-1",children:i}),l&&(0,t.jsx)("div",{className:"p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl flex justify-end gap-3 shrink-0",children:l})]})})]})}),document.body)}],32098)},49413,e=>{"use strict";var t=e.i(43476),s=e.i(71645),r=e.i(92321),a=e.i(46932),i=e.i(88653),l=e.i(78583),o=e.i(69638),n=e.i(63209),c=e.i(56909),d=e.i(37727);let u=(0,e.i(75254).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);var x=e.i(32098),m=e.i(59544),p=e.i(3812),h=e.i(5766);e.s(["default",0,()=>{let{requests:e,user:f,submitExpenseReport:g,completeRequest:y,revertComplete:b,rejectExpenseReport:j}=(0,r.useBudget)(),[v,N]=(0,s.useState)(""),[w,k]=(0,s.useState)(null),[C,$]=(0,s.useState)(!1),[E,S]=(0,s.useState)(!1),[A,L]=(0,s.useState)([]),[z,M]=(0,s.useState)("active"),I=(0,s.useMemo)(()=>e.filter(e=>{if("active"===z&&"approved"!==e.status||"history"===z&&"completed"!==e.status||"verify"===z&&"waiting_verification"!==e.status)return!1;if(v){let t=v.toLowerCase();return e.project.toLowerCase().includes(t)||e.requester.toLowerCase().includes(t)}return!0}),[e,z,v,f]),P=async()=>{if(w)try{await y(w.id),h.default.success("ตรวจสอบและปิดโครงการเรียบร้อยแล้ว"),S(!1),k(null)}catch(e){console.error(e),h.default.error("เกิดข้อผิดพลาดในการตรวจสอบ")}},R=async()=>{if(!w)return;let e=prompt("ระบุเหตุผลที่ส่งกลับ (Optional):");if(null!==e)try{await j(w.id,e),h.default.success("ส่งกลับให้แก้ไขเรียบร้อยแล้ว"),S(!1),k(null),M("active")}catch(e){console.error(e),h.default.error("เกิดข้อผิดพลาดในการส่งกลับ")}},B=e=>{k(e),L(e.expenseItems?.map(e=>({...e,actualAmount:e.actualAmount??0}))||[]),$(!0)},O=()=>{let e=w?.amount||0,t=A.reduce((e,t)=>e+(t.actualAmount||0),0);return{totalBudget:e,totalActual:t,returnAmount:e-t}},T=async()=>{if(w)try{let{totalActual:e,returnAmount:t}=O();await g(w.id,{expenseItems:A,actualTotal:e,returnAmount:t}),h.default.success("ส่งรายงานผลการตรวจสอบเรียบร้อยแล้ว (Waiting for Verification)"),$(!1),k(null)}catch(e){console.error(e),h.default.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล")}},{totalBudget:_,totalActual:F,returnAmount:q}=O();return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 md:px-0",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",children:"รายงานผลการใช้จ่าย (Expense Report)"}),(0,t.jsx)("p",{className:"text-gray-500 text-sm mt-1",children:"บันทึกค่าใช้จ่ายจริงและปิดโครงการเพื่อคืนเงินงบประมาณ"})]}),(0,t.jsxs)("div",{className:"flex gap-2 bg-gray-100 p-1 rounded-xl",children:[(0,t.jsx)("button",{onClick:()=>M("active"),className:`px-4 py-2 rounded-lg text-sm font-medium transition-all ${"active"===z?"bg-white text-blue-600 shadow-sm":"text-gray-500 hover:text-gray-700"}`,children:"รอรายงานผล"}),(0,t.jsxs)("button",{onClick:()=>M("verify"),className:`px-4 py-2 rounded-lg text-sm font-medium transition-all ${"verify"===z?"bg-white text-orange-600 shadow-sm":"text-gray-500 hover:text-gray-700"}`,children:["รอตรวจสอบ (",e.filter(e=>"waiting_verification"===e.status).length,")"]}),(0,t.jsx)("button",{onClick:()=>M("history"),className:`px-4 py-2 rounded-lg text-sm font-medium transition-all ${"history"===z?"bg-white text-blue-600 shadow-sm":"text-gray-500 hover:text-gray-700"}`,children:"ประวัติการปิดโครงการ"})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[(0,t.jsx)(i.AnimatePresence,{mode:"popLayout",children:I.map((e,s)=>(0,t.jsxs)(a.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,scale:.95},transition:{delay:.05*s},className:"bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all relative overflow-hidden group",children:[(0,t.jsx)("div",{className:"absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity",children:(0,t.jsx)(l.FileText,{className:"w-24 h-24 text-gray-100 -rotate-12 transform translate-x-8 -translate-y-8"})}),(0,t.jsxs)("div",{className:"relative z-10",children:[(0,t.jsxs)("div",{className:"flex justify-between items-start mb-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{className:"inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 mb-2 border border-blue-100",children:e.category}),(0,t.jsx)("h3",{className:"text-lg font-bold text-gray-800 line-clamp-1",children:e.project}),(0,t.jsxs)("p",{className:"text-sm text-gray-500",children:["ผู้ขอ: ",e.requester]})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsxs)("p",{className:"text-2xl font-bold text-gray-900",children:["฿",e.amount.toLocaleString()]}),(0,t.jsx)("p",{className:"text-xs text-gray-500",children:"งบประมาณที่ได้รับ"})]})]}),(0,t.jsxs)("div",{className:"border-t border-gray-100 pt-4 mt-4 flex justify-between items-center",children:[(0,t.jsx)("div",{className:"text-sm text-gray-500",children:"history"===z&&e.actualAmount?(0,t.jsxs)("span",{className:"text-green-600 font-medium flex items-center gap-1",children:[(0,t.jsx)(o.CheckCircle,{size:14})," ใช้จริง: ฿",e.actualAmount.toLocaleString()]}):"verify"===z?(0,t.jsxs)("span",{className:"text-orange-500 font-medium flex items-center gap-1",children:[(0,t.jsx)(n.AlertCircle,{size:14})," รอการตรวจสอบ"]}):(0,t.jsxs)("span",{className:"text-orange-500 font-medium flex items-center gap-1",children:[(0,t.jsx)(n.AlertCircle,{size:14})," รอการรายงานผล"]})}),e.rejectionReason&&(0,t.jsxs)("div",{className:"mt-2 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100 italic",children:['เหตุผลที่ส่งกลับ: "',e.rejectionReason,'"']}),"active"===z&&(0,t.jsx)(m.Button,{onClick:()=>B(e),className:"bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30",children:"รายงานผล"}),"verify"===z&&(0,t.jsx)(m.Button,{onClick:()=>{k(e),S(!0)},className:"bg-orange-500 text-white shadow-lg hover:bg-orange-600",children:"ตรวจสอบและปิดโครงการ"}),"history"===z&&(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(m.Button,{onClick:async()=>{confirm("ยืนยันส่งกลับไปตรวจสอบ? (ยอดเงินจะถูกคืนค่ากลับ)")&&(await b(e.id),h.default.success("ส่งกลับไปสถานะรอตรวจสอบแล้ว"),M("verify"))},className:"bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 px-3 py-1.5 text-xs h-auto",children:"ส่งกลับไปตรวจสอบ"}),(0,t.jsx)(m.Button,{variant:"ghost",onClick:()=>B(e),disabled:!0,className:"text-gray-400 cursor-not-allowed",children:"ปิดโครงการแล้ว"})]})]})]})]},e.id))}),0===I.length&&(0,t.jsxs)("div",{className:"col-span-full flex flex-col items-center justify-center py-12 text-gray-400",children:[(0,t.jsx)(l.FileText,{size:48,className:"mb-4 opacity-50"}),(0,t.jsx)("p",{children:"ไม่พบรายการที่ต้องรายงานผล"})]})]}),(0,t.jsx)(x.Modal,{isOpen:C,onClose:()=>$(!1),title:"รายงานผลการใช้จ่ายจริง (Actual Expense Reporting)",footer:(0,t.jsxs)("div",{className:"flex justify-between w-full items-center",children:[(0,t.jsxs)("div",{className:"text-left",children:[(0,t.jsx)("p",{className:"text-sm text-gray-500",children:q>=0?"คืนเงินงบประมาณ":"เกินงบประมาณ (Over Budget)"}),(0,t.jsxs)("p",{className:`text-xl font-bold ${q>=0?"text-green-600":"text-red-600"}`,children:[q>=0?"":"-","฿",Math.abs(q).toLocaleString()]})]}),(0,t.jsxs)("div",{className:"flex gap-3",children:[(0,t.jsx)(m.Button,{variant:"outline",onClick:()=>$(!1),children:"ยกเลิก"}),(0,t.jsxs)(m.Button,{onClick:T,children:[(0,t.jsx)(c.Save,{size:18,className:"mr-2"})," ยืนยันปิดโครงการ"]})]})]}),children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-blue-600 font-medium",children:"โครงการ"}),(0,t.jsx)("p",{className:"text-lg font-bold text-blue-900",children:w?.project})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"text-sm text-blue-600 font-medium",children:"งบประมาณอนุมัติ"}),(0,t.jsxs)("p",{className:"text-xl font-bold text-blue-900",children:["฿",w?.amount.toLocaleString()]})]})]}),(0,t.jsx)("div",{className:"max-h-[50vh] overflow-y-auto overflow-x-auto pr-2 space-y-4",children:(0,t.jsxs)("table",{className:"w-full text-sm text-left",children:[(0,t.jsx)("thead",{className:"text-gray-500 bg-gray-50 sticky top-0",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"p-3 rounded-tl-lg",children:"รายการ"}),(0,t.jsx)("th",{className:"p-3",children:"จำนวน"}),(0,t.jsx)("th",{className:"p-3",children:"งบประมาณ (บาท)"}),(0,t.jsx)("th",{className:"p-3 rounded-tr-lg w-48",children:"ใช้จ่ายจริง (บาท)"})]})}),(0,t.jsxs)("tbody",{className:"divide-y divide-gray-100",children:[A.map((e,s)=>(0,t.jsxs)("tr",{className:"hover:bg-gray-50/50",children:[(0,t.jsx)("td",{className:"p-3 font-medium text-gray-700",children:0===e.total||e.id.startsWith("temp-")?(0,t.jsx)(p.Input,{value:e.description,onChange:t=>{let s=t.target.value;L(t=>t.map(t=>t.id===e.id?{...t,description:s}:t))},placeholder:"ระบุรายการ...",className:"h-9 text-sm"}):e.description}),(0,t.jsx)("td",{className:"p-3 text-gray-500",children:0===e.total||e.id.startsWith("temp-")?(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)(p.Input,{type:"number",value:e.quantity,onChange:t=>{let s=parseFloat(t.target.value)||0;L(t=>t.map(t=>t.id===e.id?{...t,quantity:s}:t))},className:"h-9 w-16 text-sm text-center"}),(0,t.jsx)("span",{className:"text-xs",children:e.unit||"หน่วย"})]}):`${e.quantity} ${e.unit}`}),(0,t.jsxs)("td",{className:"p-3 text-gray-900 font-semibold",children:["฿",e.total.toLocaleString()]}),(0,t.jsx)("td",{className:"p-3",children:(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(p.Input,{type:"number",value:e.actualAmount||"",onChange:t=>{var s;let r;return s=e.id,r=parseFloat(t.target.value)||0,void L(e=>e.map(e=>e.id===s?{...e,actualAmount:r}:e))},className:"text-right font-bold text-blue-600 bg-white border-gray-200 focus:border-blue-500 min-w-[100px]",placeholder:"0.00"}),(0===e.total||e.id.startsWith("temp-"))&&(0,t.jsx)("button",{onClick:()=>L(t=>t.filter(t=>t.id!==e.id)),className:"text-red-400 hover:text-red-600 p-1",children:(0,t.jsx)(d.X,{size:16})})]})})]},e.id)),(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:4,className:"p-2 text-center border-t border-dashed border-gray-200",children:(0,t.jsx)(m.Button,{type:"button",variant:"ghost",size:"sm",onClick:()=>L(e=>[...e,{id:`temp-${Date.now()}`,category:w?.category||"",description:"",quantity:1,unit:"หน่วย",unitPrice:0,total:0,actualAmount:0}]),className:"text-blue-500 hover:text-blue-700 hover:bg-blue-50 w-full",children:"+ เพิ่มรายการพิเศษ (Extra Item)"})})})]})]})}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4 border-t border-gray-100 pt-4",children:[(0,t.jsxs)("div",{className:"p-4 rounded-xl bg-gray-50 border border-gray-100 text-center",children:[(0,t.jsx)("p",{className:"text-sm text-gray-500 mb-1",children:"รวมใช้จ่ายจริง"}),(0,t.jsxs)("p",{className:"text-2xl font-bold text-gray-900",children:["฿",F.toLocaleString()]})]}),(0,t.jsxs)("div",{className:"p-4 rounded-xl bg-green-50 border border-green-100 text-center",children:[(0,t.jsx)("p",{className:"text-sm text-green-600 mb-1",children:"เงินคงเหลือส่งคืน"}),(0,t.jsxs)("p",{className:"text-2xl font-bold text-green-700",children:["฿",q.toLocaleString()]})]})]})]})}),(0,t.jsx)(x.Modal,{isOpen:E,onClose:()=>S(!1),title:"ตรวจสอบความถูกต้อง (Verify Expense Report)",footer:(0,t.jsxs)("div",{className:"flex justify-between w-full",children:[(0,t.jsx)("div",{className:"flex gap-2",children:(0,t.jsxs)(m.Button,{variant:"outline",onClick:R,className:"border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300",children:[(0,t.jsx)(u,{size:18,className:"mr-2"})," ส่งกลับแก้ไข"]})}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(m.Button,{variant:"outline",onClick:()=>S(!1),children:"ยกเลิก"}),(0,t.jsxs)(m.Button,{onClick:P,className:"bg-orange-500 hover:bg-orange-600 text-white",children:[(0,t.jsx)(o.CheckCircle,{size:18,className:"mr-2"})," ยืนยันตรวจสอบและปิดโครงการ"]})]})]}),children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"bg-orange-50 p-4 rounded-xl border border-orange-100 flex justify-between items-center",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-orange-600 font-medium",children:"โครงการที่ตรวจสอบ"}),(0,t.jsx)("p",{className:"text-lg font-bold text-orange-900",children:w?.project})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"text-sm text-orange-600 font-medium",children:"ผู้ขอเบิก"}),(0,t.jsx)("p",{className:"text-lg font-bold text-orange-900",children:w?.requester})]})]}),(0,t.jsx)("div",{className:"max-h-[50vh] overflow-y-auto overflow-x-auto pr-2",children:(0,t.jsxs)("table",{className:"w-full text-sm text-left",children:[(0,t.jsx)("thead",{className:"text-gray-500 bg-gray-50 sticky top-0",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"p-3 rounded-tl-lg",children:"รายการ"}),(0,t.jsx)("th",{className:"p-3",children:"จำนวน"}),(0,t.jsx)("th",{className:"p-3 text-right",children:"งบประมาณ (บาท)"}),(0,t.jsx)("th",{className:"p-3 rounded-tr-lg text-right",children:"ใช้จ่ายจริง (บาท)"})]})}),(0,t.jsx)("tbody",{className:"divide-y divide-gray-100",children:w?.expenseItems?.map((e,s)=>(0,t.jsxs)("tr",{className:"hover:bg-gray-50/50",children:[(0,t.jsx)("td",{className:"p-3 font-medium text-gray-700",children:e.description}),(0,t.jsxs)("td",{className:"p-3 text-gray-500",children:[e.quantity," ",e.unit]}),(0,t.jsxs)("td",{className:"p-3 text-right text-gray-900",children:["฿",e.total.toLocaleString()]}),(0,t.jsxs)("td",{className:"p-3 text-right font-bold text-blue-600",children:["฿",(e.actualAmount||0).toLocaleString()]})]},e.id||s))}),(0,t.jsxs)("tfoot",{className:"bg-gray-50 font-bold border-t border-gray-200",children:[(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{colSpan:2,className:"p-3 text-right",children:"รวมทั้งหมด"}),(0,t.jsxs)("td",{className:"p-3 text-right",children:["฿",w?.amount.toLocaleString()]}),(0,t.jsxs)("td",{className:"p-3 text-right text-blue-700",children:["฿",(w?.actualAmount||0).toLocaleString()]})]}),(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{colSpan:3,className:"p-3 text-right text-green-600",children:"เงินคงเหลือคืนงบประมาณ"}),(0,t.jsxs)("td",{className:"p-3 text-right text-green-700",children:["฿",((w?.amount||0)-(w?.actualAmount||0)).toLocaleString()]})]})]})]})})]})})]})}],49413)}]);