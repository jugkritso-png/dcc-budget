(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,31278,e=>{"use strict";let t=(0,e.i(75254).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["Loader2",()=>t],31278)},3812,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(75157);let r=s.default.forwardRef(({className:e,error:s,icon:r,...i},l)=>(0,t.jsxs)("div",{className:"relative w-full",children:[r&&(0,t.jsx)("div",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",children:(0,t.jsx)(r,{size:18})}),(0,t.jsx)("input",{className:(0,a.cn)("flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",!r&&"pl-4",s&&"border-red-500 focus:ring-red-500 bg-red-50",e),style:{paddingLeft:r?"3rem":void 0},ref:l,...i})]}));r.displayName="Input",e.s(["Input",0,r])},32098,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(74080),r=e.i(37727),i=e.i(46932),l=e.i(88653),o=e.i(75157),n=e.i(59544);e.s(["Modal",0,({isOpen:e,onClose:d,title:c,children:x,footer:m,width:p="max-w-2xl"})=>{let[u,h]=s.default.useState(!1);return(s.default.useEffect(()=>{h(!0)},[]),!u||"u"<typeof document)?null:(0,a.createPortal)((0,t.jsx)(l.AnimatePresence,{children:e&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.motion.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:d,className:"fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity"}),(0,t.jsx)("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none",children:(0,t.jsxs)(i.motion.div,{initial:{opacity:0,scale:.9,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:10},transition:{type:"spring",stiffness:350,damping:25,duration:.3},className:(0,o.cn)("bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-h-[90vh] flex flex-col pointer-events-auto border border-white/60 ring-4 ring-primary-50/50",p),children:[(0,t.jsxs)("div",{className:"flex items-center justify-between p-6 border-b border-gray-100 shrink-0",children:[(0,t.jsx)("h3",{className:"text-xl font-semibold text-gray-900",children:c}),(0,t.jsx)(n.Button,{variant:"ghost",size:"sm",onClick:d,className:"rounded-full h-8 w-8 p-0 hover:bg-gray-100",children:(0,t.jsx)(r.X,{className:"h-5 w-5"})})]}),(0,t.jsx)("div",{className:"p-6 overflow-y-auto flex-1",children:x}),m&&(0,t.jsx)("div",{className:"p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl flex justify-end gap-3 shrink-0",children:m})]})})]})}),document.body)}])},37727,e=>{"use strict";let t=(0,e.i(75254).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",()=>t],37727)},56909,e=>{"use strict";let t=(0,e.i(75254).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["Save",()=>t],56909)},7233,e=>{"use strict";let t=(0,e.i(75254).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["Plus",()=>t],7233)},5766,e=>{"use strict";let t,s;var a,r=e.i(71645);let i={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,d=(e,t)=>{let s="",a="",r="";for(let i in e){let l=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+l+";":a+="f"==i[1]?d(l,i):i+"{"+d(l,"k"==i[1]?"":t)+"}":"object"==typeof l?a+=d(l,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=l&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=d.p?d.p(i,l):i+":"+l+";")}return s+(t&&r?t+"{"+r+"}":r)+a},c={},x=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+x(e[s]);return t}return e};function m(e){let t,s,a=this||{},r=e.call?e(a.p):e;return((e,t,s,a,r)=>{var i;let m=x(e),p=c[m]||(c[m]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(m));if(!c[p]){let t=m!==e?e:(e=>{let t,s,a=[{}];for(;t=l.exec(e.replace(o,""));)t[4]?a.shift():t[3]?(s=t[3].replace(n," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(n," ").trim();return a[0]})(e);c[p]=d(r?{["@keyframes "+p]:t}:t,s?"":"."+p)}let u=s&&c.g?c.g:null;return s&&(c.g=c[p]),i=c[p],u?t.data=t.data.replace(u,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),p})(r.unshift?r.raw?(t=[].slice.call(arguments,1),s=a.p,r.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(a.target),a.g,a.o,a.k)}m.bind({g:1});let p,u,h,g=m.bind({k:1});function f(e,t){let s=this||{};return function(){let a=arguments;function r(i,l){let o=Object.assign({},i),n=o.className||r.className;s.p=Object.assign({theme:u&&u()},o),s.o=/ *go\d+/.test(n),o.className=m.apply(s,a)+(n?" "+n:""),t&&(o.ref=l);let d=e;return e[0]&&(d=o.as||e,delete o.as),h&&d[0]&&h(o),p(d,o)}return t?t(r):r}}var b=(e,t)=>"function"==typeof e?e(t):e,y=(t=0,()=>(++t).toString()),j="default",v=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return v(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},N=[],w={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},k={},C=(e,t=j)=>{k[t]=v(k[t]||w,e),N.forEach(([e,s])=>{e===t&&s(k[t])})},A=e=>Object.keys(k).forEach(t=>C(e,t)),z=(e=j)=>t=>{C(t,e)},S=e=>(t,s)=>{let a,r=((e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||y()}))(t,e,s);return z(r.toasterId||(a=r.id,Object.keys(k).find(e=>k[e].toasts.some(e=>e.id===a))))({type:2,toast:r}),r.id},$=(e,t)=>S("blank")(e,t);$.error=S("error"),$.success=S("success"),$.loading=S("loading"),$.custom=S("custom"),$.dismiss=(e,t)=>{let s={type:3,toastId:e};t?z(t)(s):A(s)},$.dismissAll=e=>$.dismiss(void 0,e),$.remove=(e,t)=>{let s={type:4,toastId:e};t?z(t)(s):A(s)},$.removeAll=e=>$.remove(void 0,e),$.promise=(e,t,s)=>{let a=$.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?b(t.success,e):void 0;return r?$.success(r,{id:a,...s,...null==s?void 0:s.success}):$.dismiss(a),e}).catch(e=>{let r=t.error?b(t.error,e):void 0;r?$.error(r,{id:a,...s,...null==s?void 0:s.error}):$.dismiss(a)}),e};var L=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,E=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,F=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,B=f("div")`
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
    animation: ${E} 0.15s ease-out forwards;
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
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,M=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,I=f("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${M} 1s linear infinite;
`,_=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,O=g`
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
}`,P=f("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${_} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,T=f("div")`
  position: absolute;
`,q=f("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,R=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,D=f("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${R} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,H=({toast:e})=>{let{icon:t,type:s,iconTheme:a}=e;return void 0!==t?"string"==typeof t?r.createElement(D,null,t):t:"blank"===s?null:r.createElement(q,null,r.createElement(I,{...a}),"loading"!==s&&r.createElement(T,null,"error"===s?r.createElement(B,{...a}):r.createElement(P,{...a})))},V=f("div")`
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
`,W=f("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;r.memo(({toast:e,position:t,style:a,children:i})=>{let l=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,i]=(()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=r.createElement(H,{toast:e}),n=r.createElement(W,{...e.ariaProps},b(e.message,e));return r.createElement(V,{className:e.className,style:{...l,...a,...e.style}},"function"==typeof i?i({icon:o,message:n}):r.createElement(r.Fragment,null,o,n))}),a=r.createElement,d.p=void 0,p=a,u=void 0,h=void 0,m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",()=>$],5766)},35530,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(92321),r=e.i(46932),i=e.i(88653),l=e.i(78583),o=e.i(69638),n=e.i(63209),d=e.i(56909),c=e.i(37727);let x=(0,e.i(75254).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);var m=e.i(7233),p=e.i(32098),u=e.i(59544),h=e.i(3812),g=e.i(5766);e.s(["default",0,()=>{let{requests:e,user:f,submitExpenseReport:b,completeRequest:y,revertComplete:j,rejectExpenseReport:v,uploadAttachment:N}=(0,a.useBudget)(),[w,k]=(0,s.useState)(""),[C,A]=(0,s.useState)(null),[z,S]=(0,s.useState)(!1),[$,L]=(0,s.useState)(!1),[E,F]=(0,s.useState)(!1),[B,M]=(0,s.useState)([]),[I,_]=(0,s.useState)([]),[O,P]=(0,s.useState)("active"),T=(0,s.useMemo)(()=>e.filter(e=>{if("active"===O&&"approved"!==e.status||"history"===O&&"completed"!==e.status||"verify"===O&&"waiting_verification"!==e.status)return!1;if(w){let t=w.toLowerCase();return e.project.toLowerCase().includes(t)||e.requester.toLowerCase().includes(t)}return!0}),[e,O,w,f]),q=async()=>{if(C)try{await y(C.id),g.default.success("ตรวจสอบและปิดโครงการเรียบร้อยแล้ว"),L(!1),A(null)}catch(e){console.error(e),g.default.error("เกิดข้อผิดพลาดในการตรวจสอบ")}},R=async()=>{if(!C)return;let e=prompt("ระบุเหตุผลที่ส่งกลับ (Optional):");if(null!==e)try{await v(C.id,e),g.default.success("ส่งกลับให้แก้ไขเรียบร้อยแล้ว"),L(!1),A(null),P("active")}catch(e){console.error(e),g.default.error("เกิดข้อผิดพลาดในการส่งกลับ")}},D=e=>{A(e),_(e.expenseItems?.map(e=>({...e,actualAmount:e.actualAmount??0}))||[]),M([]),F(!1),S(!0)},H=()=>{let e=C?.amount||0,t=I.reduce((e,t)=>e+(t.actualAmount||0),0);return{totalBudget:e,totalActual:t,returnAmount:e-t}},V=async()=>{if(C){F(!0);try{let{totalActual:e,returnAmount:t}=H(),s=[...C.attachments||[]];for(let e of B){let t=await N(e);s.push(t)}await b(C.id,{expenseItems:I,actualTotal:e,returnAmount:t,attachments:s}),g.default.success("ส่งรายงานผลการตรวจสอบเรียบร้อยแล้ว (Waiting for Verification)"),S(!1),A(null),M([])}catch(e){console.error(e),g.default.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล")}finally{F(!1)}}},{totalBudget:W,totalActual:X,returnAmount:G}=H();return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 md:px-0",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",children:"รายงานผลการใช้จ่าย (Expense Report)"}),(0,t.jsx)("p",{className:"text-gray-500 text-sm mt-1",children:"บันทึกค่าใช้จ่ายจริงและปิดโครงการเพื่อคืนเงินงบประมาณ"})]}),(0,t.jsxs)("div",{className:"flex gap-2 bg-gray-100 p-1 rounded-xl",children:[(0,t.jsx)("button",{onClick:()=>P("active"),className:`px-4 py-2 rounded-lg text-sm font-medium transition-all ${"active"===O?"bg-white text-blue-600 shadow-sm":"text-gray-500 hover:text-gray-700"}`,children:"รอรายงานผล"}),(0,t.jsxs)("button",{onClick:()=>P("verify"),className:`px-4 py-2 rounded-lg text-sm font-medium transition-all ${"verify"===O?"bg-white text-orange-600 shadow-sm":"text-gray-500 hover:text-gray-700"}`,children:["รอตรวจสอบ (",e.filter(e=>"waiting_verification"===e.status).length,")"]}),(0,t.jsx)("button",{onClick:()=>P("history"),className:`px-4 py-2 rounded-lg text-sm font-medium transition-all ${"history"===O?"bg-white text-blue-600 shadow-sm":"text-gray-500 hover:text-gray-700"}`,children:"ประวัติการปิดโครงการ"})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[(0,t.jsx)(i.AnimatePresence,{mode:"popLayout",children:T.map((e,s)=>(0,t.jsxs)(r.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,scale:.95},transition:{delay:.05*s},className:"bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all relative overflow-hidden group",children:[(0,t.jsx)("div",{className:"absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity",children:(0,t.jsx)(l.FileText,{className:"w-24 h-24 text-gray-100 -rotate-12 transform translate-x-8 -translate-y-8"})}),(0,t.jsxs)("div",{className:"relative z-10",children:[(0,t.jsxs)("div",{className:"flex justify-between items-start mb-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{className:"inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 mb-2 border border-blue-100",children:e.category}),(0,t.jsx)("h3",{className:"text-lg font-bold text-gray-800 line-clamp-1",children:e.project}),(0,t.jsxs)("p",{className:"text-sm text-gray-500",children:["ผู้ขอ: ",e.requester]})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsxs)("p",{className:"text-2xl font-bold text-gray-900",children:["฿",e.amount.toLocaleString()]}),(0,t.jsx)("p",{className:"text-xs text-gray-500",children:"งบประมาณที่ได้รับ"})]})]}),(0,t.jsxs)("div",{className:"border-t border-gray-100 pt-4 mt-4 flex justify-between items-center",children:[(0,t.jsx)("div",{className:"text-sm text-gray-500",children:"history"===O&&e.actualAmount?(0,t.jsxs)("span",{className:"text-green-600 font-medium flex items-center gap-1",children:[(0,t.jsx)(o.CheckCircle,{size:14})," ใช้จริง: ฿",e.actualAmount.toLocaleString()]}):"verify"===O?(0,t.jsxs)("span",{className:"text-orange-500 font-medium flex items-center gap-1",children:[(0,t.jsx)(n.AlertCircle,{size:14})," รอการตรวจสอบ"]}):(0,t.jsxs)("span",{className:"text-orange-500 font-medium flex items-center gap-1",children:[(0,t.jsx)(n.AlertCircle,{size:14})," รอการรายงานผล"]})}),e.rejectionReason&&(0,t.jsxs)("div",{className:"mt-2 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100 italic",children:['เหตุผลที่ส่งกลับ: "',e.rejectionReason,'"']}),"active"===O&&(0,t.jsx)(u.Button,{onClick:()=>D(e),className:"bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30",children:"รายงานผล"}),"verify"===O&&(0,t.jsx)(u.Button,{onClick:()=>{A(e),L(!0)},className:"bg-orange-500 text-white shadow-lg hover:bg-orange-600",children:"ตรวจสอบและปิดโครงการ"}),"history"===O&&(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(u.Button,{onClick:async()=>{confirm("ยืนยันส่งกลับไปตรวจสอบ? (ยอดเงินจะถูกคืนค่ากลับ)")&&(await j(e.id),g.default.success("ส่งกลับไปสถานะรอตรวจสอบแล้ว"),P("verify"))},className:"bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 px-3 py-1.5 text-xs h-auto",children:"ส่งกลับไปตรวจสอบ"}),(0,t.jsx)(u.Button,{variant:"ghost",onClick:()=>D(e),disabled:!0,className:"text-gray-400 cursor-not-allowed",children:"ปิดโครงการแล้ว"})]})]})]})]},e.id))}),0===T.length&&(0,t.jsxs)("div",{className:"col-span-full flex flex-col items-center justify-center py-12 text-gray-400",children:[(0,t.jsx)(l.FileText,{size:48,className:"mb-4 opacity-50"}),(0,t.jsx)("p",{children:"ไม่พบรายการที่ต้องรายงานผล"})]})]}),(0,t.jsx)(p.Modal,{isOpen:z,onClose:()=>S(!1),title:"รายงานผลการใช้จ่ายจริง (Actual Expense Reporting)",footer:(0,t.jsxs)("div",{className:"flex justify-between w-full items-center",children:[(0,t.jsxs)("div",{className:"text-left",children:[(0,t.jsx)("p",{className:"text-sm text-gray-500",children:G>=0?"คืนเงินงบประมาณ":"เกินงบประมาณ (Over Budget)"}),(0,t.jsxs)("p",{className:`text-xl font-bold ${G>=0?"text-green-600":"text-red-600"}`,children:[G>=0?"":"-","฿",Math.abs(G).toLocaleString()]})]}),(0,t.jsxs)("div",{className:"flex gap-3",children:[(0,t.jsx)(u.Button,{variant:"outline",onClick:()=>S(!1),children:"ยกเลิก"}),(0,t.jsx)(u.Button,{onClick:V,disabled:E,className:`flex items-center gap-2 ${E?"bg-gray-400 cursor-not-allowed":"bg-primary-600 hover:bg-primary-700"} text-white`,children:E?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"}),"กำลังบันทึก..."]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.Save,{size:18})," ยืนยันปิดโครงการ"]})})]})]}),children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-blue-600 font-medium",children:"โครงการ"}),(0,t.jsx)("p",{className:"text-lg font-bold text-blue-900",children:C?.project})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"text-sm text-blue-600 font-medium",children:"งบประมาณอนุมัติ"}),(0,t.jsxs)("p",{className:"text-xl font-bold text-blue-900",children:["฿",C?.amount.toLocaleString()]})]})]}),(0,t.jsx)("div",{className:"max-h-[50vh] overflow-y-auto overflow-x-auto pr-2 space-y-4",children:(0,t.jsxs)("table",{className:"w-full text-sm text-left",children:[(0,t.jsx)("thead",{className:"text-gray-500 bg-gray-50 sticky top-0",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"p-3 rounded-tl-lg",children:"รายการ"}),(0,t.jsx)("th",{className:"p-3",children:"จำนวน"}),(0,t.jsx)("th",{className:"p-3",children:"งบประมาณ (บาท)"}),(0,t.jsx)("th",{className:"p-3 rounded-tr-lg w-48",children:"ใช้จ่ายจริง (บาท)"})]})}),(0,t.jsxs)("tbody",{className:"divide-y divide-gray-100",children:[I.map(e=>(0,t.jsxs)("tr",{className:"hover:bg-gray-50/50",children:[(0,t.jsx)("td",{className:"p-3 font-medium text-gray-700",children:0===e.total||e.id.startsWith("temp-")?(0,t.jsx)(h.Input,{value:e.description,onChange:t=>{let s=t.target.value;_(t=>t.map(t=>t.id===e.id?{...t,description:s}:t))},placeholder:"ระบุรายการ...",className:"h-9 text-sm"}):e.description}),(0,t.jsx)("td",{className:"p-3 text-gray-500",children:0===e.total||e.id.startsWith("temp-")?(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)(h.Input,{type:"number",value:e.quantity,onChange:t=>{let s=parseFloat(t.target.value)||0;_(t=>t.map(t=>t.id===e.id?{...t,quantity:s}:t))},className:"h-9 w-16 text-sm text-center"}),(0,t.jsx)("span",{className:"text-xs",children:e.unit||"หน่วย"})]}):`${e.quantity} ${e.unit}`}),(0,t.jsxs)("td",{className:"p-3 text-gray-900 font-semibold",children:["฿",e.total.toLocaleString()]}),(0,t.jsx)("td",{className:"p-3",children:(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(h.Input,{type:"number",value:e.actualAmount||"",onChange:t=>{var s;let a;return s=e.id,a=parseFloat(t.target.value)||0,void _(e=>e.map(e=>e.id===s?{...e,actualAmount:a}:e))},className:"text-right font-bold text-blue-600 bg-white border-gray-200 focus:border-blue-500 min-w-[100px]",placeholder:"0.00"}),(0===e.total||e.id.startsWith("temp-"))&&(0,t.jsx)("button",{onClick:()=>_(t=>t.filter(t=>t.id!==e.id)),className:"text-red-400 hover:text-red-600 p-1",children:(0,t.jsx)(c.X,{size:16})})]})})]},e.id)),(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:4,className:"p-2 text-center border-t border-dashed border-gray-200",children:(0,t.jsx)(u.Button,{type:"button",variant:"ghost",size:"sm",onClick:()=>_(e=>[...e,{id:`temp-${Date.now()}`,category:C?.category||"",description:"",quantity:1,unit:"หน่วย",unitPrice:0,total:0,actualAmount:0}]),className:"text-blue-500 hover:text-blue-700 hover:bg-blue-50 w-full",children:"+ เพิ่มรายการพิเศษ (Extra Item)"})})})]})]})}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4 border-t border-gray-100 pt-4",children:[(0,t.jsxs)("div",{className:"p-4 rounded-xl bg-gray-50 border border-gray-100 text-center",children:[(0,t.jsx)("p",{className:"text-sm text-gray-500 mb-1",children:"รวมใช้จ่ายจริง"}),(0,t.jsxs)("p",{className:"text-2xl font-bold text-gray-900",children:["฿",X.toLocaleString()]})]}),(0,t.jsxs)("div",{className:"p-4 rounded-xl bg-green-50 border border-green-100 text-center",children:[(0,t.jsx)("p",{className:"text-sm text-green-600 mb-1",children:"เงินคงเหลือส่งคืน"}),(0,t.jsxs)("p",{className:"text-2xl font-bold text-green-700",children:["฿",G.toLocaleString()]})]})]}),(0,t.jsxs)("div",{className:"border-t border-gray-100 pt-6 mt-6",children:[(0,t.jsxs)("h4",{className:"text-sm font-bold text-gray-700 mb-4 flex items-center gap-2",children:[(0,t.jsx)(l.FileText,{size:16,className:"text-primary-500"}),"ใบเสร็จหรือเอกสารแนบเพิ่มเติม ( receipts/attachments )"]}),(0,t.jsxs)("div",{className:"bg-gray-50 rounded-xl border border-gray-200 border-dashed p-4",children:[(0,t.jsx)("input",{type:"file",multiple:!0,id:"expense-file-upload",className:"hidden",onChange:e=>{e.target.files&&M(Array.from(e.target.files))}}),(0,t.jsxs)("label",{htmlFor:"expense-file-upload",className:"cursor-pointer flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-primary-600 transition-colors py-4",children:[(0,t.jsx)(m.Plus,{size:24,className:"mb-1"}),(0,t.jsx)("span",{className:"text-xs font-semibold",children:"คลิกเพื่อเพิ่มไฟล์ใบเสร็จ"}),(0,t.jsx)("span",{className:"text-[10px]",children:"PDF, PNG, JPG (สูงสุด 10MB)"})]}),B.length>0&&(0,t.jsx)("div",{className:"mt-4 space-y-2",children:B.map((e,s)=>(0,t.jsxs)("div",{className:"flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-gray-100 shadow-sm",children:[(0,t.jsx)("span",{className:"truncate max-w-[80%] font-medium text-gray-600",children:e.name}),(0,t.jsx)("button",{onClick:()=>M(e=>e.filter((e,t)=>t!==s)),className:"text-red-400 hover:text-red-600",children:(0,t.jsx)(c.X,{size:14})})]},s))}),C?.attachments&&C.attachments.length>0&&(0,t.jsxs)("div",{className:"mt-4 pt-4 border-t border-gray-100",children:[(0,t.jsx)("p",{className:"text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2",children:"ไฟล์เดิมที่แนบทมา:"}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:C.attachments.map((e,s)=>(0,t.jsxs)("a",{href:e,target:"_blank",rel:"noopener noreferrer",className:"text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 flex items-center gap-1 hover:bg-blue-100",children:[(0,t.jsx)(l.FileText,{size:10}),"ไฟล์ที่ ",s+1]},s))})]})]})]})]})}),(0,t.jsx)(p.Modal,{isOpen:$,onClose:()=>L(!1),title:"ตรวจสอบความถูกต้อง (Verify Expense Report)",footer:(0,t.jsxs)("div",{className:"flex justify-between w-full",children:[(0,t.jsx)("div",{className:"flex gap-2",children:(0,t.jsxs)(u.Button,{variant:"outline",onClick:R,className:"border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300",children:[(0,t.jsx)(x,{size:18,className:"mr-2"})," ส่งกลับแก้ไข"]})}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(u.Button,{variant:"outline",onClick:()=>L(!1),children:"ยกเลิก"}),(0,t.jsxs)(u.Button,{onClick:q,className:"bg-orange-500 hover:bg-orange-600 text-white",children:[(0,t.jsx)(o.CheckCircle,{size:18,className:"mr-2"})," ยืนยันตรวจสอบและปิดโครงการ"]})]})]}),children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"bg-orange-50 p-4 rounded-xl border border-orange-100 flex justify-between items-center",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-orange-600 font-medium",children:"โครงการที่ตรวจสอบ"}),(0,t.jsx)("p",{className:"text-lg font-bold text-orange-900",children:C?.project})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"text-sm text-orange-600 font-medium",children:"ผู้ขอเบิก"}),(0,t.jsx)("p",{className:"text-lg font-bold text-orange-900",children:C?.requester})]})]}),(0,t.jsx)("div",{className:"max-h-[50vh] overflow-y-auto overflow-x-auto pr-2",children:(0,t.jsxs)("table",{className:"w-full text-sm text-left",children:[(0,t.jsx)("thead",{className:"text-gray-500 bg-gray-50 sticky top-0",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"p-3 rounded-tl-lg",children:"รายการ"}),(0,t.jsx)("th",{className:"p-3",children:"จำนวน"}),(0,t.jsx)("th",{className:"p-3 text-right",children:"งบประมาณ (บาท)"}),(0,t.jsx)("th",{className:"p-3 rounded-tr-lg text-right",children:"ใช้จ่ายจริง (บาท)"})]})}),(0,t.jsx)("tbody",{className:"divide-y divide-gray-100",children:C?.expenseItems?.map((e,s)=>(0,t.jsxs)("tr",{className:"hover:bg-gray-50/50",children:[(0,t.jsx)("td",{className:"p-3 font-medium text-gray-700",children:e.description}),(0,t.jsxs)("td",{className:"p-3 text-gray-500",children:[e.quantity," ",e.unit]}),(0,t.jsxs)("td",{className:"p-3 text-right text-gray-900",children:["฿",e.total.toLocaleString()]}),(0,t.jsxs)("td",{className:"p-3 text-right font-bold text-blue-600",children:["฿",(e.actualAmount||0).toLocaleString()]})]},e.id||s))}),(0,t.jsxs)("tfoot",{className:"bg-gray-50 font-bold border-t border-gray-200",children:[(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{colSpan:2,className:"p-3 text-right",children:"รวมทั้งหมด"}),(0,t.jsxs)("td",{className:"p-3 text-right",children:["฿",C?.amount.toLocaleString()]}),(0,t.jsxs)("td",{className:"p-3 text-right text-blue-700",children:["฿",(C?.actualAmount||0).toLocaleString()]})]}),(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{colSpan:3,className:"p-3 text-right text-green-600",children:"เงินคงเหลือคืนงบประมาณ"}),(0,t.jsxs)("td",{className:"p-3 text-right text-green-700",children:["฿",((C?.amount||0)-(C?.actualAmount||0)).toLocaleString()]})]})]})]})}),(0,t.jsxs)("div",{className:"bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center text-sm",children:[(0,t.jsx)("span",{className:"text-gray-500 font-medium tracking-tight uppercase text-[11px]",children:"เอกสารแนบทั้งหมด ( All Attachments )"}),(0,t.jsxs)("span",{className:"bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold",children:[C?.attachments?.length||0," ไฟล์"]})]}),C?.attachments&&C.attachments.length>0?(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-2",children:C.attachments.map((e,s)=>(0,t.jsxs)("a",{href:e,target:"_blank",rel:"noopener noreferrer",className:"flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group",children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors",children:(0,t.jsx)(l.FileText,{size:20})}),(0,t.jsxs)("div",{className:"flex flex-col min-w-0",children:[(0,t.jsxs)("span",{className:"text-xs font-bold text-gray-700 truncate",children:["เอกสารแนบที่ ",s+1]}),(0,t.jsx)("span",{className:"text-[10px] text-gray-400 truncate",children:"คลิกเพื่อดูไฟล์"})]})]},s))}):(0,t.jsxs)("div",{className:"text-center py-6 border-2 border-dashed border-gray-200 rounded-lg",children:[(0,t.jsx)(l.FileText,{size:24,className:"mx-auto text-gray-300 mb-1"}),(0,t.jsx)("p",{className:"text-xs text-gray-400",children:"ไม่มีเอกสารแนบ"})]})]})]})})]})}],35530)}]);