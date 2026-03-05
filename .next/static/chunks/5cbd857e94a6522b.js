(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,3116,e=>{"use strict";let t=(0,e.i(75254).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["Clock",()=>t],3116)},56909,e=>{"use strict";let t=(0,e.i(75254).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["Save",()=>t],56909)},37727,e=>{"use strict";let t=(0,e.i(75254).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",()=>t],37727)},7233,27612,e=>{"use strict";var t=e.i(75254);let a=(0,t.default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["Plus",()=>a],7233);let s=(0,t.default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["Trash2",()=>s],27612)},5766,e=>{"use strict";let t,a;var s,r=e.i(71645);let i={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,n=(e,t)=>{let a="",s="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":s+="f"==i[1]?n(o,i):i+"{"+n(o,"k"==i[1]?"":t)+"}":"object"==typeof o?s+=n(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=n.p?n.p(i,o):i+":"+o+";")}return a+(t&&r?t+"{"+r+"}":r)+s},c={},m=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+m(e[a]);return t}return e};function p(e){let t,a,s=this||{},r=e.call?e(s.p):e;return((e,t,a,s,r)=>{var i;let p=m(e),u=c[p]||(c[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!c[u]){let t=p!==e?e:(e=>{let t,a,s=[{}];for(;t=o.exec(e.replace(l,""));)t[4]?s.shift():t[3]?(a=t[3].replace(d," ").trim(),s.unshift(s[0][a]=s[0][a]||{})):s[0][t[1]]=t[2].replace(d," ").trim();return s[0]})(e);c[u]=n(r?{["@keyframes "+u]:t}:t,a?"":"."+u)}let x=a&&c.g?c.g:null;return a&&(c.g=c[u]),i=c[u],x?t.data=t.data.replace(x,i):-1===t.data.indexOf(i)&&(t.data=s?i+t.data:t.data+i),u})(r.unshift?r.raw?(t=[].slice.call(arguments,1),a=s.p,r.reduce((e,s,r)=>{let i=t[r];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":n(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(s.target),s.g,s.o,s.k)}p.bind({g:1});let u,x,h,f=p.bind({k:1});function b(e,t){let a=this||{};return function(){let s=arguments;function r(i,o){let l=Object.assign({},i),d=l.className||r.className;a.p=Object.assign({theme:x&&x()},l),a.o=/ *go\d+/.test(d),l.className=p.apply(a,s)+(d?" "+d:""),t&&(l.ref=o);let n=e;return e[0]&&(n=l.as||e,delete l.as),h&&n[0]&&h(l),u(n,l)}return t?t(r):r}}var g=(e,t)=>"function"==typeof e?e(t):e,y=(t=0,()=>(++t).toString()),v="default",w=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},j=[],N={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},k={},C=(e,t=v)=>{k[t]=w(k[t]||N,e),j.forEach(([e,a])=>{e===t&&a(k[t])})},A=e=>Object.keys(k).forEach(t=>C(e,t)),S=(e=v)=>t=>{C(t,e)},z=e=>(t,a)=>{let s,r=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||y()}))(t,e,a);return S(r.toasterId||(s=r.id,Object.keys(k).find(e=>k[e].toasts.some(e=>e.id===s))))({type:2,toast:r}),r.id},E=(e,t)=>z("blank")(e,t);E.error=z("error"),E.success=z("success"),E.loading=z("loading"),E.custom=z("custom"),E.dismiss=(e,t)=>{let a={type:3,toastId:e};t?S(t)(a):A(a)},E.dismissAll=e=>E.dismiss(void 0,e),E.remove=(e,t)=>{let a={type:4,toastId:e};t?S(t)(a):A(a)},E.removeAll=e=>E.remove(void 0,e),E.promise=(e,t,a)=>{let s=E.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?g(t.success,e):void 0;return r?E.success(r,{id:s,...a,...null==a?void 0:a.success}):E.dismiss(s),e}).catch(e=>{let r=t.error?g(t.error,e):void 0;r?E.error(r,{id:s,...a,...null==a?void 0:a.error}):E.dismiss(s)}),e};var $=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,D=f`
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
}`,I=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${$} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${D} 0.15s ease-out forwards;
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
`,L=f`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,F=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${L} 1s linear infinite;
`,O=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,T=f`
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
}`,P=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${O} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${T} 0.2s ease-out forwards;
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
`,U=b("div")`
  position: absolute;
`,_=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,V=f`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,q=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${V} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,B=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return void 0!==t?"string"==typeof t?r.createElement(q,null,t):t:"blank"===a?null:r.createElement(_,null,r.createElement(F,{...s}),"loading"!==a&&r.createElement(U,null,"error"===a?r.createElement(I,{...s}):r.createElement(P,{...s})))},H=b("div")`
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
`,Y=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;r.memo(({toast:e,position:t,style:s,children:i})=>{let o=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[r,i]=(()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*s}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*s}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${f(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${f(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},l=r.createElement(B,{toast:e}),d=r.createElement(Y,{...e.ariaProps},g(e.message,e));return r.createElement(H,{className:e.className,style:{...o,...s,...e.style}},"function"==typeof i?i({icon:l,message:d}):r.createElement(r.Fragment,null,l,d))}),s=r.createElement,n.p=void 0,u=s,x=void 0,h=void 0,p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",()=>E],5766)},7999,e=>{"use strict";var t=e.i(43476),a=e.i(71645),s=e.i(5766),r=e.i(92321),i=e.i(27025),o=e.i(12426);let l=(0,e.i(75254).default)("chart-pie",[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]]);var d=e.i(52008);let n=({totalAllocated:e,totalRemaining:a,categoriesCount:s,selectedYear:r})=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"flex flex-col md:flex-row justify-between items-end gap-4 px-1 md:px-0",children:(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl md:text-2xl font-bold text-gray-900",children:"การจัดการงบประมาณ"}),(0,t.jsx)("p",{className:"text-gray-500 text-sm",children:"บริหารโครงสร้างและวางแผนงบประมาณประจำปี"})]})}),(0,t.jsxs)("div",{className:"bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-soft relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6",children:[(0,t.jsx)("div",{className:"absolute right-0 top-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"}),(0,t.jsx)("div",{className:"absolute left-0 bottom-0 w-32 md:w-48 h-32 md:h-48 bg-blue-500/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"}),(0,t.jsxs)("div",{className:"flex items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto",children:[(0,t.jsx)("div",{className:"w-14 h-14 md:w-20 md:h-20 bg-white/15 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/20",children:(0,t.jsx)(i.Folder,{size:28,className:"text-white md:w-10 md:h-10"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl md:text-3xl font-bold mb-1 md:mb-2 tracking-tight",children:"หมวดหมู่งบประมาณ"}),(0,t.jsx)("p",{className:"text-blue-100 font-medium text-sm md:text-lg opacity-90",children:"บริหารจัดการโครงสร้างและติดตามงบ"})]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 mt-4 md:mt-6",children:[(0,t.jsxs)("div",{className:"bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-card relative overflow-hidden group",children:[(0,t.jsx)("div",{className:"absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4",children:(0,t.jsx)(o.DollarSign,{size:120,className:"md:w-[180px] md:h-[180px]"})}),(0,t.jsxs)("div",{className:"relative z-10 flex flex-col justify-between h-full min-h-[100px] md:min-h-[140px]",children:[(0,t.jsxs)("div",{className:"flex justify-between items-start mb-3 md:mb-4",children:[(0,t.jsx)("div",{className:"p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl border border-white/10",children:(0,t.jsx)(o.DollarSign,{className:"text-white w-5 h-5 md:w-7 md:h-7"})}),(0,t.jsx)("span",{className:"bg-blue-800/40 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold border border-white/10",children:r})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-blue-100 font-medium mb-0.5 md:mb-1 text-[10px] md:text-sm uppercase tracking-wider",children:"งบประมาณทั้งหมด"}),(0,t.jsxs)("h3",{className:"text-2xl md:text-4xl font-bold tracking-tight !text-white",children:["฿",e.toLocaleString()]})]})]})]}),(0,t.jsxs)("div",{className:"bg-gradient-to-br from-teal-400 to-teal-600 text-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-card relative overflow-hidden group",children:[(0,t.jsx)("div",{className:"absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4",children:(0,t.jsx)(l,{size:120,className:"md:w-[180px] md:h-[180px]"})}),(0,t.jsxs)("div",{className:"relative z-10 flex flex-col justify-between h-full min-h-[100px] md:min-h-[140px]",children:[(0,t.jsx)("div",{className:"flex justify-between items-start mb-3 md:mb-4",children:(0,t.jsx)("div",{className:"p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl border border-white/10 w-fit",children:(0,t.jsx)(l,{className:"text-white w-5 h-5 md:w-7 md:h-7"})})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-teal-50 font-medium mb-0.5 md:mb-1 text-[10px] md:text-sm uppercase tracking-wider",children:"คงเหลือจริง"}),(0,t.jsxs)("h3",{className:"text-2xl md:text-4xl font-bold tracking-tight !text-white",children:["฿",a.toLocaleString()]})]})]})]}),(0,t.jsxs)("div",{className:"col-span-2 sm:col-span-1 bg-gradient-to-br from-indigo-500 to-primary-800 text-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-card relative overflow-hidden group",children:[(0,t.jsx)("div",{className:"absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4",children:(0,t.jsx)(d.Layers,{size:120,className:"md:w-[180px] md:h-[180px]"})}),(0,t.jsxs)("div",{className:"relative z-10 flex flex-col justify-between h-full min-h-[80px] md:min-h-[140px]",children:[(0,t.jsx)("div",{className:"flex justify-between items-start mb-3 md:mb-4",children:(0,t.jsx)("div",{className:"p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl border border-white/10 w-fit",children:(0,t.jsx)(d.Layers,{className:"text-white w-5 h-5 md:w-7 md:h-7"})})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-indigo-100 font-medium mb-0.5 md:mb-1 text-[10px] md:text-sm uppercase tracking-wider",children:"หมวดหมู่ทั้งหมด"}),(0,t.jsxs)("h3",{className:"text-2xl md:text-4xl font-bold tracking-tight !text-white",children:[s," หมวด"]})]})]})]})]})]});var c=e.i(56545),m=e.i(8781),p=e.i(71979);let u=[{bg:"bg-emerald-600",label:"เขียว"},{bg:"bg-blue-600",label:"น้ำเงิน"},{bg:"bg-purple-600",label:"ม่วง"},{bg:"bg-orange-600",label:"ส้ม"},{bg:"bg-red-600",label:"แดง"},{bg:"bg-pink-600",label:"ชมพู"}];e.s(["default",0,()=>{let e,i,{categories:o,addCategory:l,updateCategory:d,deleteCategory:x,requests:h,subActivities:f,addSubActivity:b,deleteSubActivity:g,adjustBudget:y,getBudgetLogs:v,addExpense:w,getExpenses:j,deleteExpense:N}=(0,r.useBudget)(),[k,C]=(0,a.useState)(2569),[A,S]=(0,a.useState)(""),[z,E]=(0,a.useState)(!1),[$,D]=(0,a.useState)(null),[M,I]=(0,a.useState)(null),[L,F]=(0,a.useState)("requests"),[O,T]=(0,a.useState)([]),[P,U]=(0,a.useState)([]),_=o.map(e=>{let t=h.filter(t=>t.category===e.name&&"approved"===t.status).reduce((e,t)=>e+t.amount,0),a=h.filter(t=>t.category===e.name&&"pending"===t.status).reduce((e,t)=>e+t.amount,0);return{...e,used:e.used,reserved:t,pending:a}}).filter(e=>e.year===k),V=_.filter(e=>e.name.toLowerCase().includes(A.toLowerCase())||e.code.includes(A)),q=_.reduce((e,t)=>e+t.allocated,0),B=_.reduce((e,t)=>e+t.used,0);return(0,a.useEffect)(()=>{M&&"history"===L&&v(M.id).then(T),M&&"expenses"===L&&j(M.id).then(U)},[M,L]),(0,a.useEffect)(()=>{if(M){let e=o.find(e=>e.id===M.id);e&&e!==M&&I(e)}},[o]),(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsx)(n,{totalAllocated:q,totalRemaining:q-B,categoriesCount:_.length,selectedYear:k}),(0,t.jsx)(c.default,{categories:V,selectedYear:k,onYearChange:C,searchQuery:A,onSearchChange:S,onAddClick:()=>{D(null),E(!0)},onEditClick:e=>{D(e),E(!0)},onDeleteClick:x,onViewClick:e=>{I(e),F("requests")}}),(0,t.jsx)(m.default,{isOpen:z,onClose:()=>E(!1),onSave:e=>{if(!e.name||!e.allocated)return void s.default.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");let t={id:$?$.id:crypto.randomUUID(),name:e.name,code:e.code,segment:e.segment,allocated:parseFloat(e.allocated.toString()),used:0,color:e.color,colorLabel:e.name.charAt(0).toUpperCase(),year:$?$.year:k,businessPlace:e.businessPlace,businessArea:e.businessArea,fund:e.fund,fundCenter:e.fundCenter,costCenter:e.costCenter,functionalArea:e.functionalArea,commitmentItem:e.commitmentItem};$?(d(t),s.default.success("แก้ไขหมวดหมู่สำเร็จ!")):(l(t),s.default.success("เพิ่มหมวดหมู่สำเร็จ!")),E(!1)},initialData:$,selectedYear:k,autoCode:$?void 0:(i=(e=o.map(e=>e.code).filter(e=>e.startsWith("DCC-")).map(e=>parseInt(e.replace("DCC-",""))).filter(e=>!isNaN(e))).length>0?Math.max(...e)+1:1,`DCC-${String(i).padStart(3,"0")}`),colors:u}),(0,t.jsx)(p.default,{viewingCategory:M,onClose:()=>I(null),requests:h,subActivities:f,budgetLogs:O,expenses:P,activeDetailTab:L,setActiveDetailTab:F,onAdjustBudget:async(e,t,a)=>{M&&(await y(M.id,e,t,a),s.default.success("ปรับปรุงงบประมาณสำเร็จ!"),"history"===L&&v(M.id).then(T))},onAddSubActivity:async(e,t)=>{if(M)try{await b({id:crypto.randomUUID(),categoryId:M.id,name:e,allocated:parseFloat(t)}),s.default.success("เพิ่มกิจกรรมย่อยสำเร็จ")}catch(e){console.error("Failed to add sub-activity:",e),s.default.error("ไม่สามารถเพิ่มกิจกรรมย่อยได้")}},onDeleteSubActivity:g,onAddExpense:async e=>{M&&(await w({categoryId:M.id,amount:parseFloat(e.amount),payee:e.payee,date:e.date,description:e.description}),s.default.success("บันทึกรายจ่ายสำเร็จ!"),j(M.id).then(U))},onDeleteExpense:async e=>{M&&(await N(e),s.default.success("ลบรายจ่ายสำเร็จ"),j(M.id).then(U))}})]})}],7999)}]);