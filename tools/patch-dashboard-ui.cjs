/**
 * Dashboard UI/UX: denser layout, insight widgets, better empty states, profit legend.
 */
const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/Dashboard-BKhCVreq.js';
const htmlPath = 'c:/project/Anna_sandra-main/dist/index.html';
let s = fs.readFileSync(path, 'utf8');
let n = 0;

function rep(old, neu, label) {
  if (s.includes(neu)) {
    console.log('Already:', label);
    return;
  }
  if (!s.includes(old)) {
    console.warn('MISSING:', label);
    return;
  }
  s = s.replace(old, neu);
  n++;
  console.log('Patched:', label);
}

// Track customers + out-of-stock in dashboard state
rep(
  'inventory:{value:0,items:0,lowStock:0},cashInHand:0}',
  'inventory:{value:0,items:0,lowStock:0,outOfStock:0},customers:0,cashInHand:0}',
  'state: customers + outOfStock defaults'
);

rep(
  'inventory:{value:pt,items:F.length,lowStock:Ie.length},cashInHand:ht}',
  'inventory:{value:pt,items:F.length,lowStock:Ie.length,outOfStock:F.filter(t=>(Number(t.stock)||0)<=0).length},customers:zt.filter(t=>{const ty=String(t.type||"").toLowerCase();return ty==="customer"||ty==="both"}).length,cashInHand:ht}',
  'state: populate customers + outOfStock'
);

// Desktop: insight widgets + improved weekly chart area
const widgetsBlock =
  's.jsx(m.div,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},className:"grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-1",children:[{title:"Today\'s Sales",value:r.sales.today,route:"/sales",color:"text-emerald-600"},{title:"Today\'s Purchases",value:r.purchases.today,route:"/purchases",color:"text-rose-600"},{title:"Today\'s Expenses",value:r.expenses.today,route:"/expenses",color:"text-amber-600"},{title:"Profit Today",value:ge,route:"/reports",color:ge>=0?"text-emerald-600":"text-red-600"}].map((e,idx)=>s.jsxs("button",{type:"button",onClick:()=>l(e.route),className:"text-left p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow",children:[s.jsx("p",{className:"text-xs font-medium text-slate-500 dark:text-slate-400",children:e.title}),s.jsxs("p",{className:`mt-1 text-lg xl:text-xl font-bold ${e.color}`,children:["₹",Math.abs(e.value).toLocaleString("en-IN",{maximumFractionDigits:0})]})]},idx))}),s.jsx("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4",children:[{title:"Total Products",value:r.inventory.items,sub:`${r.inventory.lowStock} low stock`,route:"/inventory",color:"text-slate-700 dark:text-slate-200"},{title:"Out of Stock",value:r.inventory.outOfStock||0,sub:"Needs restock",route:"/inventory?filter=low-stock",color:"text-red-600"},{title:"Customers",value:r.customers||0,sub:"Active parties",route:"/parties",color:"text-blue-600"},{title:"Receivables",value:r.receivables,sub:`Payables ₹${(r.payables||0).toLocaleString("en-IN",{maximumFractionDigits:0})}`,route:"/parties",color:"text-indigo-600"}].map((e,idx)=>s.jsxs("button",{type:"button",onClick:()=>l(e.route),className:"text-left p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow",children:[s.jsx("p",{className:"text-xs font-medium text-slate-500 dark:text-slate-400",children:e.title}),s.jsxs("p",{className:`mt-1 text-lg xl:text-xl font-bold ${e.color}`,children:[e.title.includes("Receiv")?"₹":"",typeof e.value==="number"&&e.title.includes("Receiv")?e.value.toLocaleString("en-IN",{maximumFractionDigits:0}):e.value]}),s.jsx("p",{className:"mt-0.5 text-[11px] text-slate-400",children:e.sub})]},idx))}),';

const gridAnchor =
  's.jsxs("div",{className:"grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6",children:[s.jsx("div",{className:"xl:col-span-2 space-y-5 lg:space-y-6",children:s.jsxs("div",{className:`p-4 lg:p-6 xl:p-7 rounded-3xl bg-[#e4ebf5] dark:bg-slate-800';

if (!s.includes("Today's Sales")) {
  rep(gridAnchor, widgetsBlock + gridAnchor, 'desktop: insight widget rows');
}

// Weekly overview: profit legend + compact empty state
rep(
  'children:"Purchases"})]})]})]}),s.jsx(m.div,{className:"flex items-end justify-between gap-1.5 lg:gap-2 h-52 lg:h-64"',
  'children:"Purchases"}),s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("div",{className:"w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"}),s.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"Profit"})]})]})]}),s.jsx(m.div,{className:p("flex items-end justify-between gap-1.5 lg:gap-2",we?"h-44 lg:h-52":"min-h-[120px] h-auto py-6")',
  'weekly: profit legend + adaptive chart height'
);

rep(
  '!we&&s.jsx("p",{className:"mt-4 text-center text-sm text-slate-500 dark:text-slate-400",children:"No weekly activity yet"})]})}),s.jsxs("div",{className:"space-y-5 lg:space-y-6",children:[s.jsxs("div",{className:`p-4 lg:p-6 xl:p-7 rounded-3xl bg-[#e4ebf5] dark:bg-slate-800',
  '!we&&s.jsxs("div",{className:"mt-2 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-900/40 px-6 py-8",children:[s.jsx("p",{className:"text-sm font-semibold text-slate-700 dark:text-slate-200",children:"No transactions available yet."}),s.jsx("p",{className:"text-xs text-slate-500 dark:text-slate-400 text-center max-w-md",children:"Create your first invoice or purchase to see daily sales, purchases, and profit trends here."}),s.jsxs("div",{className:"flex flex-wrap gap-2 justify-center",children:[s.jsx("button",{type:"button",onClick:()=>{localStorage.setItem("sales_viewMode","create"),l("/sales")},className:"px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold",children:"Create Invoice"}),s.jsx("button",{type:"button",onClick:()=>{localStorage.setItem("purchases_viewMode","create"),l("/purchases")},className:"px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold",children:"Create Purchase"})]})]})]})}),s.jsxs("div",{className:"space-y-5 lg:space-y-6",children:[s.jsxs("div",{className:`p-4 lg:p-6 xl:p-7 rounded-3xl bg-[#e4ebf5] dark:bg-slate-800',
  'weekly: desktop empty state + CTA'
);

// Mobile empty state
rep(
  '!we&&s.jsx("p",{className:"mt-3 text-center text-xs text-slate-500 dark:text-slate-400",children:"No weekly activity yet"})]}),s.jsxs("div",{className:"mt-6",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsx("p",{className:"text-lg font-semibold text-slate-800 dark:text-slate-100",children:"Expiry Alerts"})',
  '!we&&s.jsxs("div",{className:"mt-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 px-4 py-5 text-center",children:[s.jsx("p",{className:"text-xs font-semibold text-slate-600 dark:text-slate-300",children:"No transactions yet."}),s.jsx("p",{className:"text-[11px] text-slate-500 mt-1",children:"Create your first invoice or purchase."})]})]}),s.jsxs("div",{className:"mt-6",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsx("p",{className:"text-lg font-semibold text-slate-800 dark:text-slate-100",children:"Expiry Alerts"})',
  'weekly: mobile empty state'
);

// Expiry: show date + color badges
rep(
  'children:["In ",o]})]},e.id)})}),M>0&&s.jsxs("button",{onClick:()=>l("/inventory?filter=expired"),className:"mt-4 text-sm text-red-600 font-semibold hover:underline",children:["View ",M," expired item",M===1?"":"s"]})]}),s.jsxs("div",{className:`p-4 lg:p-6 xl:p-7 rounded-3xl bg-[#e4ebf5] dark:bg-slate-800',
  'children:[typeof n==="number"&&n<0?"Expired":typeof n==="number"&&n<=7?"Expiring soon":"Safe"]}),s.jsx("p",{className:"text-[11px] text-slate-500 mt-0.5",children:e.expiryDate?new Date(e.expiryDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—"})]},e.id)})}),M>0&&s.jsxs("button",{onClick:()=>l("/inventory?filter=expired"),className:"mt-4 text-sm text-red-600 font-semibold hover:underline",children:["View ",M," expired item",M===1?"":"s"]})]}),s.jsxs("div",{className:`p-4 lg:p-6 xl:p-7 rounded-3xl bg-[#e4ebf5] dark:bg-slate-800',
  'expiry: badges + expiry date (desktop)'
);

// Mobile expiry patch applied in fix-dashboard-mobile.cjs if needed

// Recent activity empty state (desktop)
rep(
  'children:fe.slice(0,5).map(e=>s.jsxs(m.div,{variants:{hidden:{opacity:0,x:-20},visible:{opacity:1,x:0}},className:`flex items-center gap-3 lg:gap-4 p-4 rounded-2xl bg-[#e4ebf5] dark:bg-slate-700',
  'children:fe.length===0?s.jsxs("div",{className:"rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 px-4 py-8 text-center",children:[s.jsx("p",{className:"text-sm font-medium text-slate-600 dark:text-slate-300",children:"No recent activity yet."}),s.jsx("p",{className:"text-xs text-slate-500 mt-1",children:"Sales, purchases, payments, and expenses will appear here with timestamps."})]}):fe.slice(0,5).map(e=>s.jsxs(m.div,{variants:{hidden:{opacity:0,x:-20},visible:{opacity:1,x:0}},className:`flex items-center gap-3 lg:gap-4 p-4 rounded-2xl bg-[#e4ebf5] dark:bg-slate-700',
  'recent activity: empty state desktop'
);

// Padding for main app + dashboard density
const cssPath = 'c:/project/Anna_sandra-main/dist/dashboard-layout.css';
if (!fs.existsSync(cssPath)) {
  fs.writeFileSync(
    cssPath,
    `/* Dashboard + app layout — sync pill, no overlap */
body.sandra-app-shell { padding-bottom: 0 !important; }
body.sandra-sync-active { padding-bottom: 0 !important; }
#sandra-offline-status-bar {
  position: fixed !important;
  top: 12px !important;
  right: 12px !important;
  left: auto !important;
  bottom: auto !important;
  width: auto !important;
  max-width: min(420px, calc(100vw - 24px));
  border-radius: 12px !important;
  border: 1px solid rgba(0,0,0,.08) !important;
  padding: 6px 12px !important;
  font-size: 12px !important;
  gap: 8px !important;
  flex-wrap: wrap;
  justify-content: flex-end !important;
  box-shadow: 0 4px 16px rgba(0,0,0,.12) !important;
  pointer-events: none;
}
#sandra-offline-status-bar.online:not(.force-show) { display: none !important; }
@media (max-width: 1023px) {
  #sandra-offline-status-bar { top: auto !important; bottom: 12px !important; right: 12px !important; left: 12px !important; max-width: none; }
}
.min-h-screen.bg-\\[\\#e4ebf5\\], .min-h-screen.bg-slate-900 {
  padding-bottom: 1rem !important;
}
`
  );
  console.log('Wrote dashboard-layout.css');
  n++;
}

if (n > 0) {
  fs.writeFileSync(path, s);
  require('child_process').execSync(`node --check "${path}"`, { stdio: 'inherit' });
}

let html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes('dashboard-layout.css')) {
  html = html.replace(
    '<link rel="stylesheet" href="/index.css"',
    '<link rel="stylesheet" href="/dashboard-layout.css?v=1" />\n    <link rel="stylesheet" href="/index.css"'
  );
  if (!html.includes('dashboard-layout.css')) {
    html = html.replace('</head>', '    <link rel="stylesheet" href="/dashboard-layout.css?v=1" />\n  </head>');
  }
  fs.writeFileSync(htmlPath, html);
  console.log('Linked dashboard-layout.css in index.html');
}

const dashMatch = html.match(/Dashboard-BKhCVreq\.js/);
if (dashMatch && !html.includes('Dashboard-BKhCVreq.js?v=')) {
  html = html.replace(/Dashboard-BKhCVreq\.js/g, 'Dashboard-BKhCVreq.js?v=1');
}
const verMatch = html.match(/index-jCsVk30s\.js\?v=(\d+)/);
if (verMatch) {
  html = fs.readFileSync(htmlPath, 'utf8');
  const next = String(Number(verMatch[1]) + 1);
  html = html.replace(/index-jCsVk30s\.js\?v=\d+/, `index-jCsVk30s.js?v=${next}`);
  fs.writeFileSync(htmlPath, html);
  console.log('Bumped index to v=' + next);
}

console.log('Done', n, 'dashboard patch(es)');
