(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,31278,e=>{"use strict";let t=(0,e.i(75254).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["Loader2",()=>t],31278)},21557,e=>{"use strict";let t=(0,e.i(75254).default)("calculator",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]]);e.s(["Calculator",()=>t],21557)},56909,e=>{"use strict";let t=(0,e.i(75254).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["Save",()=>t],56909)},7233,e=>{"use strict";let t=(0,e.i(75254).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["Plus",()=>t],7233)},5766,e=>{"use strict";let t,a;var r,s=e.i(71645);let l={data:""},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,d=(e,t)=>{let a="",r="",s="";for(let l in e){let i=e[l];"@"==l[0]?"i"==l[1]?a=l+" "+i+";":r+="f"==l[1]?d(i,l):l+"{"+d(i,"k"==l[1]?"":t)+"}":"object"==typeof i?r+=d(i,t?t.replace(/([^,])+/g,e=>l.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):l):null!=i&&(l=/^--/.test(l)?l:l.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=d.p?d.p(l,i):l+":"+i+";")}return a+(t&&s?t+"{"+s+"}":s)+r},c={},m=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+m(e[a]);return t}return e};function x(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var l;let x=m(e),p=c[x]||(c[x]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(x));if(!c[p]){let t=x!==e?e:(e=>{let t,a,r=[{}];for(;t=i.exec(e.replace(o,""));)t[4]?r.shift():t[3]?(a=t[3].replace(n," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(n," ").trim();return r[0]})(e);c[p]=d(s?{["@keyframes "+p]:t}:t,a?"":"."+p)}let u=a&&c.g?c.g:null;return a&&(c.g=c[p]),l=c[p],u?t.data=t.data.replace(u,l):-1===t.data.indexOf(l)&&(t.data=r?l+t.data:t.data+l),p})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let l=t[s];if(l&&l.call){let e=l(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;l=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+r+(null==l?"":l)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||l})(r.target),r.g,r.o,r.k)}x.bind({g:1});let p,u,g,h=x.bind({k:1});function y(e,t){let a=this||{};return function(){let r=arguments;function s(l,i){let o=Object.assign({},l),n=o.className||s.className;a.p=Object.assign({theme:u&&u()},o),a.o=/ *go\d+/.test(n),o.className=x.apply(a,r)+(n?" "+n:""),t&&(o.ref=i);let d=e;return e[0]&&(d=o.as||e,delete o.as),g&&d[0]&&g(o),p(d,o)}return t?t(s):s}}var f=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),v="default",j=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let l=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+l}))}}},w=[],N={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},k={},I=(e,t=v)=>{k[t]=j(k[t]||N,e),w.forEach(([e,a])=>{e===t&&a(k[t])})},C=e=>Object.keys(k).forEach(t=>I(e,t)),S=(e=v)=>t=>{I(t,e)},z=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||b()}))(t,e,a);return S(s.toasterId||(r=s.id,Object.keys(k).find(e=>k[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},E=(e,t)=>z("blank")(e,t);E.error=z("error"),E.success=z("success"),E.loading=z("loading"),E.custom=z("custom"),E.dismiss=(e,t)=>{let a={type:3,toastId:e};t?S(t)(a):C(a)},E.dismissAll=e=>E.dismiss(void 0,e),E.remove=(e,t)=>{let a={type:4,toastId:e};t?S(t)(a):C(a)},E.removeAll=e=>E.remove(void 0,e),E.promise=(e,t,a)=>{let r=E.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?f(t.success,e):void 0;return s?E.success(s,{id:r,...a,...null==a?void 0:a.success}):E.dismiss(r),e}).catch(e=>{let s=t.error?f(t.error,e):void 0;s?E.error(s,{id:r,...a,...null==a?void 0:a.error}):E.dismiss(r)}),e};var $=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,D=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,M=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,F=y("div")`
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
`,P=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,A=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${P} 1s linear infinite;
`,q=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,L=h`
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
}`,T=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${q} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${L} 0.2s ease-out forwards;
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
`,O=y("div")`
  position: absolute;
`,_=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,B=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,R=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${B} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,U=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?s.createElement(R,null,t):t:"blank"===a?null:s.createElement(_,null,s.createElement(A,{...r}),"loading"!==a&&s.createElement(O,null,"error"===a?s.createElement(F,{...r}):s.createElement(T,{...r})))},H=y("div")`
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
`,G=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;s.memo(({toast:e,position:t,style:r,children:l})=>{let i=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[s,l]=(()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${h(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(l)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=s.createElement(U,{toast:e}),n=s.createElement(G,{...e.ariaProps},f(e.message,e));return s.createElement(H,{className:e.className,style:{...i,...r,...e.style}},"function"==typeof l?l({icon:o,message:n}):s.createElement(s.Fragment,null,o,n))}),r=s.createElement,d.p=void 0,p=r,u=void 0,g=void 0,x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",()=>E],5766)},3812,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(75157);let s=a.default.forwardRef(({className:e,error:a,icon:s,...l},i)=>(0,t.jsxs)("div",{className:"relative w-full",children:[s&&(0,t.jsx)("div",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",children:(0,t.jsx)(s,{size:18})}),(0,t.jsx)("input",{className:(0,r.cn)("flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",!s&&"pl-4",a&&"border-red-500 focus:ring-red-500 bg-red-50",e),style:{paddingLeft:s?"3rem":void 0},ref:i,...l})]}));s.displayName="Input",e.s(["Input",0,s])},67073,e=>{"use strict";var t=e.i(43476),a=e.i(71645);let r=(0,e.i(75254).default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);var s=e.i(43531),l=e.i(75157);e.s(["Select",0,({options:e,value:i,onChange:o,placeholder:n="Select option",error:d,className:c,disabled:m=!1})=>{let[x,p]=(0,a.useState)(!1),u=(0,a.useRef)(null),g=e.find(e=>e.value===i);return(0,a.useEffect)(()=>{let e=e=>{u.current&&!u.current.contains(e.target)&&p(!1)};return x&&document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[x]),(0,t.jsxs)("div",{className:(0,l.cn)("relative w-full",c),ref:u,children:[(0,t.jsxs)("button",{type:"button",disabled:m,onClick:()=>!m&&p(!x),className:(0,l.cn)("flex h-12 w-full items-center justify-between rounded-xl border bg-white px-3 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500",d?"border-red-500 focus:ring-red-500":"border-gray-200 focus:border-transparent",x&&"ring-2 ring-primary-500 border-transparent",m&&"bg-gray-100 cursor-not-allowed opacity-70"),children:[(0,t.jsx)("div",{className:"flex items-center gap-2 truncate",children:g?(0,t.jsxs)(t.Fragment,{children:[g.color&&(0,t.jsx)("div",{className:(0,l.cn)("h-3 w-3 rounded-full flex-shrink-0",g.color)}),g.icon&&(0,t.jsx)(g.icon,{size:16,className:"text-gray-500"}),(0,t.jsx)("span",{className:"text-gray-900 font-medium",children:g.label})]}):(0,t.jsx)("span",{className:"text-gray-400 font-normal",children:n})}),(0,t.jsx)(r,{size:16,className:(0,l.cn)("text-gray-400 transition-transform",x&&"rotate-180")})]}),x&&!m&&(0,t.jsxs)("div",{className:"absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100 p-1",children:[e.map(e=>(0,t.jsxs)("button",{type:"button",onClick:()=>{o(e.value),p(!1)},className:(0,l.cn)("flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gray-50",i===e.value&&"bg-primary-50 text-primary-700 font-medium"),children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[e.color&&(0,t.jsx)("div",{className:(0,l.cn)("h-3 w-3 rounded-full flex-shrink-0",e.color)}),e.icon&&(0,t.jsx)(e.icon,{size:16,className:i===e.value?"text-primary-600":"text-gray-400"}),(0,t.jsx)("span",{children:e.label})]}),i===e.value&&(0,t.jsx)(s.Check,{size:16,className:"text-primary-600"})]},e.value)),0===e.length&&(0,t.jsx)("div",{className:"px-3 py-2 text-center text-sm text-gray-400",children:"No options available"})]})]})}],67073)},68279,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(92321),s=e.i(78583),l=e.i(56909),i=e.i(95468),o=e.i(21557),n=e.i(7233),d=e.i(27612),c=e.i(5766),m=e.i(59544),x=e.i(3812),p=e.i(67073),u=e.i(18566);e.s(["default",0,()=>{let e=(0,u.useRouter)(),{addRequest:g,categories:h,subActivities:y,user:f,uploadAttachment:b}=(0,r.useBudget)(),[v,j]=(0,a.useState)(!1),[w,N]=(0,a.useState)([]),[k,I]=(0,a.useState)({project:"",documentNumber:"",category:"",activity:"",subActivityId:"",amount:0,date:new Date().toISOString().split("T")[0],reason:"",urgency:"normal",startDate:"",endDate:"",expenseItems:[]}),[C,S]=(0,a.useState)({});(0,a.useEffect)(()=>{let e={};k.expenseItems.forEach(t=>{t.category&&(e[t.category]=(e[t.category]||0)+t.total)}),S(e)},[k.expenseItems]);let[z,E]=(0,a.useState)([]),[$,D]=(0,a.useState)(null),M=(e,t,a)=>{I(r=>{let s=r.expenseItems.map(r=>{if(r.id===e){let e={...r,[t]:a};return("quantity"===t||"unitPrice"===t)&&(e.total=(e.quantity||0)*(e.unitPrice||0)),e}return r});return{...r,expenseItems:s}})},F=()=>(k.expenseItems||[]).reduce((e,t)=>e+t.total,0);(0,a.useEffect)(()=>{if(k.expenseItems&&k.expenseItems.length>0){let e=F();e!==k.amount&&I(t=>({...t,amount:e}))}},[k.expenseItems]),(0,a.useEffect)(()=>{if(k.category){let e=h.find(e=>e.name===k.category);D(e||null),e?E(y.filter(t=>t.categoryId===e.id)):E([])}else D(null),E([])},[k.category,h,y]);let P=async t=>{if(t.preventDefault(),!k.project||!k.category||!k.amount)return void c.default.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");j(!0);try{let t=[];for(let e of w){let a=await b(e);t.push(a)}await g({id:`REQ-${Date.now()}`,...k,amount:Number(k.amount),status:"pending",requester:f?.name||"Unknown User",requesterId:f?.id,department:f?.department||"สำนักวิชา",attachments:t}),c.default.success("สร้างคำขอใหม่สำเร็จ - รอการอนุมัติ"),e.push("/budget")}catch(e){console.error("Upload/Submit Error: ",e),c.default.error("เกิดข้อผิดพลาดในการสร้างคำขอ หรือ อัปโหลดไฟล์")}finally{j(!1)}};return(0,t.jsxs)("div",{className:"space-y-4 md:space-y-6",children:[(0,t.jsx)("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-4 px-4 md:px-0",children:(0,t.jsxs)("div",{className:"min-w-0 w-full",children:[(0,t.jsxs)("h2",{className:"text-2xl md:text-[28px] font-extrabold text-gray-900 flex items-center gap-3 tracking-tight",children:[(0,t.jsx)("div",{className:"p-2.5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl",children:(0,t.jsx)(s.FileText,{className:"text-primary-600 flex-shrink-0",size:24})}),(0,t.jsx)("span",{children:"ขอใช้งบประมาณ"})]}),(0,t.jsx)("p",{className:"text-gray-500 text-sm mt-2 md:pl-[52px]",children:"กรอกรายละเอียดเพื่อขออนุมัติงบประมาณสำหรับโครงการหรือกิจกรรม"})]})}),(0,t.jsx)("form",{onSubmit:P,className:"animate-in fade-in slide-in-from-bottom-4 duration-500 w-full md:max-w-5xl mx-auto",children:(0,t.jsxs)("div",{className:"bg-white px-6 py-8 md:p-10 rounded-[24px] shadow-sm border border-gray-100 space-y-8 md:space-y-10",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("h3",{className:"text-xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 tracking-tight",children:[(0,t.jsx)("span",{className:"w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-sm",children:"1"}),"ข้อมูลโครงการ"]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,t.jsxs)("div",{className:"md:col-span-2",children:[(0,t.jsxs)("label",{className:"block text-sm font-bold text-gray-700 mb-2",children:["ชื่อโครงการ/กิจกรรม ",(0,t.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,t.jsx)(x.Input,{type:"text",placeholder:"ระบุชื่อโครงการหรือกิจกรรม",required:!0,value:k.project,onChange:e=>I({...k,project:e.target.value})})]}),(0,t.jsxs)("div",{className:"md:col-span-2",children:[(0,t.jsx)("label",{className:"block text-sm font-bold text-gray-700 mb-2",children:"หมายเลขหนังสือ"}),(0,t.jsx)(x.Input,{type:"text",placeholder:"เช่น มวล 0101/2568, กจ 001/2568",value:k.documentNumber||"",onChange:e=>I({...k,documentNumber:e.target.value})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"block text-sm font-bold text-gray-700 mb-2",children:"วันที่เริ่มต้น"}),(0,t.jsx)(x.Input,{type:"date",value:k.startDate,onChange:e=>I({...k,startDate:e.target.value})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"block text-sm font-bold text-gray-700 mb-2",children:"วันที่สิ้นสุด"}),(0,t.jsx)(x.Input,{type:"date",value:k.endDate,onChange:e=>I({...k,endDate:e.target.value})})]}),(0,t.jsxs)("div",{className:"md:col-span-2",children:[(0,t.jsx)("label",{className:"block text-sm font-bold text-gray-700 mb-2",children:"เหตุผลความจำเป็น / วัตถุประสงค์"}),(0,t.jsx)("textarea",{rows:3,className:"w-full border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none border bg-gray-50 focus:bg-white transition-all resize-y min-h-[100px]",placeholder:"อธิบายรายละเอียดและความจำเป็นของโครงการ...",value:k.reason,onChange:e=>I({...k,reason:e.target.value})})]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("h3",{className:"text-xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 tracking-tight mt-12 border-t border-gray-100 pt-10",children:[(0,t.jsx)("span",{className:"w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-sm",children:"2"}),"รายละเอียดงบประมาณ"]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("label",{className:"block text-sm font-bold text-gray-700 mb-2",children:["หมวดงบประมาณ ",(0,t.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,t.jsx)(p.Select,{options:h.map(e=>({value:e.name,label:e.name,color:e.color})),value:k.category||"",onChange:e=>{I({...k,category:e||"",activity:""})},placeholder:"เลือกหมวดงบประมาณ",required:!0}),$&&(0,t.jsxs)("div",{className:"mt-2 p-3 bg-primary-50 rounded-xl border border-primary-100 text-xs text-primary-700 flex items-center gap-2",children:[(0,t.jsx)(i.CheckCircle2,{size:14}),(0,t.jsxs)("span",{children:["งบคงเหลือ: ฿",($.allocated-$.used).toLocaleString()]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-bold text-gray-700 mb-2",children:"กิจกรรมย่อย"}),z.length>0?(0,t.jsx)(p.Select,{className:"h-12 rounded-xl bg-white border-gray-200",value:k.activity||"",onChange:e=>{let t=z.find(t=>t.name===e);I({...k,activity:e||"",subActivityId:t?t.id:void 0})},options:[{value:"",label:"เลือกกิจกรรมย่อย"},...z.map(e=>({value:e.name,label:e.name})),{value:"อื่นๆ",label:"อื่นๆ"}]}):(0,t.jsx)(x.Input,{type:"text",placeholder:"ระบุกิจกรรมย่อย",value:k.activity,onChange:e=>I({...k,activity:e.target.value})})]}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("label",{className:"block text-sm font-bold text-gray-700 mb-2",children:["วงเงินที่ขออนุมัติ (บาท) ",(0,t.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,t.jsxs)("div",{className:"relative w-full",children:[(0,t.jsx)("div",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold",children:"฿"}),(0,t.jsx)(x.Input,{type:"number",placeholder:"0.00",required:!0,className:"pl-8 font-bold text-gray-900",value:k.amount||"",onChange:e=>I({...k,amount:parseFloat(e.target.value)||0})})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-bold text-gray-700 mb-2",children:"ความเร่งด่วน"}),(0,t.jsx)("div",{className:"flex bg-gray-100 rounded-xl p-1",children:["normal","urgent","critical"].map(e=>(0,t.jsx)("button",{type:"button",onClick:()=>I({...k,urgency:e}),className:`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${k.urgency===e?"critical"===e?"bg-red-500 text-white shadow-md":"urgent"===e?"bg-orange-500 text-white shadow-md":"bg-white text-primary-600 shadow-sm":"text-gray-500 hover:bg-gray-200"}`,children:"normal"===e?"ปกติ":"urgent"===e?"ด่วน":"ด่วนที่สุด"},e))})]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-12 border-t border-gray-100 pt-10",children:[(0,t.jsxs)("h3",{className:"text-xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight",children:[(0,t.jsx)("span",{className:"w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-sm",children:"3"}),"รายละเอียดประมาณการค่าใช้จ่าย"]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"p-2 bg-primary-50 rounded-lg text-primary-600",children:(0,t.jsx)(o.Calculator,{size:20})}),(0,t.jsxs)("span",{className:"text-sm font-bold text-gray-600",children:["รวมทั้งสิ้น: ",(0,t.jsxs)("span",{className:"text-primary-600 text-lg",children:["฿",F().toLocaleString()]})]})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-[20px] border border-gray-200 shadow-sm overflow-hidden",children:[(0,t.jsx)("div",{className:"overflow-x-auto",children:(0,t.jsxs)("table",{className:"w-full text-sm text-left",children:[(0,t.jsx)("thead",{className:"bg-gray-50/50 border-b border-gray-200 text-gray-600 font-semibold",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"px-4 py-3 w-10",children:"#"}),(0,t.jsx)("th",{className:"px-4 py-3 w-32",children:"หมวดรายจ่าย"}),(0,t.jsx)("th",{className:"px-4 py-3",children:"รายการ"}),(0,t.jsx)("th",{className:"px-4 py-3 w-24 text-center",children:"จำนวน"}),(0,t.jsx)("th",{className:"px-4 py-3 w-24 text-center",children:"หน่วย"}),(0,t.jsx)("th",{className:"px-4 py-3 w-32 text-right",children:"ราคา/หน่วย"}),(0,t.jsx)("th",{className:"px-4 py-3 w-32 text-right",children:"รวม (บาท)"}),(0,t.jsx)("th",{className:"px-4 py-3 w-16 text-center"})]})}),(0,t.jsxs)("tbody",{className:"divide-y divide-gray-100",children:[k.expenseItems.map((e,a)=>(0,t.jsxs)("tr",{className:"bg-white hover:bg-gray-50 transition-colors",children:[(0,t.jsx)("td",{className:"px-4 py-3 text-center text-gray-400 font-mono text-xs",children:a+1}),(0,t.jsx)("td",{className:"px-4 py-3",children:(0,t.jsxs)("select",{className:"w-full border-gray-200 rounded-lg py-1.5 text-xs text-gray-700 focus:ring-1 focus:ring-primary-500 border bg-white",value:e.category,onChange:t=>M(e.id,"category",t.target.value),children:[(0,t.jsx)("option",{value:"",children:"เลือกหมวดงบประมาณ"}),h.map(a=>(0,t.jsxs)("option",{value:a.name,children:[a.name," (คงเหลือ: ฿",(a.allocated-(a.used||0)-(C[a.name]||0)+(a.name===e.category?e.total:0)).toLocaleString(),")"]},a.id))]})}),(0,t.jsx)("td",{className:"px-4 py-3",children:(0,t.jsx)("input",{type:"text",className:"w-full border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-700 focus:ring-1 focus:ring-primary-500 border bg-white placeholder-gray-300",placeholder:"รายละเอียดรายการ",value:e.description,onChange:t=>M(e.id,"description",t.target.value)})}),(0,t.jsx)("td",{className:"px-4 py-3",children:(0,t.jsx)("input",{type:"number",min:"0",className:"w-full border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-700 focus:ring-1 focus:ring-primary-500 border bg-white text-center",value:e.quantity,onChange:t=>M(e.id,"quantity",parseFloat(t.target.value)||0)})}),(0,t.jsx)("td",{className:"px-4 py-3",children:(0,t.jsx)("input",{type:"text",className:"w-full border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-700 focus:ring-1 focus:ring-primary-500 border bg-white text-center",placeholder:"หน่วย",value:e.unit,onChange:t=>M(e.id,"unit",t.target.value)})}),(0,t.jsx)("td",{className:"px-4 py-3",children:(0,t.jsx)("input",{type:"number",min:"0",step:"0.01",className:"w-full border-gray-200 rounded-lg py-1.5 px-2 text-xs text-gray-700 focus:ring-1 focus:ring-primary-500 border bg-white text-right",value:e.unitPrice,onChange:t=>M(e.id,"unitPrice",parseFloat(t.target.value)||0)})}),(0,t.jsx)("td",{className:"px-4 py-3 text-right font-bold text-gray-700",children:e.total.toLocaleString()}),(0,t.jsx)("td",{className:"px-4 py-3 text-center",children:(0,t.jsx)("button",{type:"button",onClick:()=>{var t;return t=e.id,void I(e=>({...e,expenseItems:e.expenseItems.filter(e=>e.id!==t)}))},className:"text-gray-300 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50",children:(0,t.jsx)(d.Trash2,{size:16})})})]},e.id)),0===k.expenseItems.length&&(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:8,className:"py-8 text-center text-gray-400 text-sm",children:'ยังไม่มีรายการค่าใช้จ่าย คลิก "เพิ่มรายการ" เพื่อเริ่มต้น'})})]})]})}),(0,t.jsx)("div",{className:"bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-center",children:(0,t.jsxs)("button",{type:"button",onClick:()=>{let e={id:`EXP-${Date.now()}`,category:k.category||h[0]?.name||"",description:"",quantity:1,unitPrice:0,unit:"รายการ",total:0};I(t=>({...t,expenseItems:[...t.expenseItems||[],e]}))},className:"flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm",children:[(0,t.jsx)(n.Plus,{size:16}),"เพิ่มรายการ"]})})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-12 border-t border-gray-100 pt-10",children:(0,t.jsxs)("h3",{className:"text-xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight",children:[(0,t.jsx)("span",{className:"w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-sm",children:"4"}),"เอกสารแนบ (ถ้ามี)"]})}),(0,t.jsxs)("div",{className:"bg-white rounded-[20px] border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center border-dashed",children:[(0,t.jsx)("input",{type:"file",multiple:!0,id:"file-upload",className:"hidden",onChange:e=>{e.target.files&&N(Array.from(e.target.files))}}),(0,t.jsxs)("label",{htmlFor:"file-upload",className:"cursor-pointer flex flex-col items-center space-y-2 text-gray-500 hover:text-primary-600 transition-colors",children:[(0,t.jsx)(s.FileText,{size:48,className:"mb-2 opacity-50"}),(0,t.jsx)("span",{className:"text-sm font-semibold",children:"คลิกเพื่อเลือกไฟล์แนบ"}),(0,t.jsx)("span",{className:"text-xs text-gray-400",children:"รองรับ PDF, JPG, PNG ขนาดไม่เกิน 10MB"})]}),w.length>0&&(0,t.jsx)("ul",{className:"mt-4 w-full max-w-md space-y-2",children:w.map((e,a)=>(0,t.jsxs)("li",{className:"flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-100",children:[(0,t.jsx)("span",{className:"truncate max-w-[80%]",children:e.name}),(0,t.jsx)("button",{type:"button",onClick:()=>N(e=>e.filter((e,t)=>t!==a)),className:"text-red-400 hover:text-red-600 ml-2",children:(0,t.jsx)(d.Trash2,{size:16})})]},a))})]})]}),(0,t.jsxs)("div",{className:"pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-end gap-3 mt-12",children:[(0,t.jsx)(m.Button,{type:"button",variant:"ghost",onClick:()=>{confirm("คุณต้องการยกเลิกการทำรายการใช่หรือไม่? ข้อมูลที่กรอกจะหายไป")&&I({project:"",documentNumber:"",category:"",activity:"",amount:0,date:new Date().toISOString().split("T")[0],reason:"",urgency:"normal",startDate:"",endDate:"",expenseItems:[]})},className:"w-full md:w-auto px-6 py-3.5 h-auto text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl font-medium order-2 md:order-1 transition-colors",children:"ยกเลิก"}),(0,t.jsx)(m.Button,{type:"submit",variant:"gradient",disabled:v,className:`w-full md:w-auto px-10 py-3.5 h-auto text-[15px] font-bold flex items-center justify-center gap-2 order-1 md:order-2 rounded-xl shadow-md transition-all ${v?"opacity-70 cursor-not-allowed":"hover:shadow-lg"}`,children:v?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"}),"กำลังอัปโหลด..."]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.Save,{size:18}),"บันทึกคำขอ"]})})]})]})})]})}])}]);