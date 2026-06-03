const fs = require('fs');
const path = 'c:/project/Anna_sandra-main/dist/assets/Dashboard-BKhCVreq.js';
let s = fs.readFileSync(path, 'utf8');

const broken =
  'children:"Purchases"}),s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("div",{className:"w-3 h-3 rounded-full bg-gradient-to-br fro';

const fixed =
  'children:"Purchases"})]}),s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("div",{className:"w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"}),s.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"Profit"})]})]})]}),s.jsx(m.div,{className:p("flex items-end justify-between gap-1.5 lg:gap-2",we?"h-44 lg:h-52":"min-h-[120px] h-auto py-6"),initial:"hidden",animate:"visible",variants:{visible:{transition:{staggerChildren:.05}}},children:R.map((e,n)=>s.jsxs("div",{className:"flex-1 flex flex-col items-center gap-2 group",children:[s.jsxs("div",{className:"w-full flex items-end justify-center gap-1.5 h-full",children:[s.jsx(m.div,{variants:{hidden:{height:"2%",opacity:0},visible:{height:O(e.sales,z,2),opacity:1}},transition:{type:"spring",stiffness:200,damping:20},className:"w-5 lg:w-7 xl:w-8 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-700",title:`Sales: ₹${e.sales.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`}),s.jsx(m.div,{variants:{hidden:{height:"2%",opacity:0},visible:{height:O(e.purchases,z,2),opacity:1}},transition:{type:"spring",stiffness:200,damping:20,delay:.1},className:"w-5 lg:w-7 xl:w-8 bg-gradient-to-t from-amber-300 to-amber-500 rounded-t-lg transition-all duration-300 group-hover:from-amber-400 group-hover:to-amber-600",title:`Purchases: ₹${e.purchases.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`}),s.jsx(m.div,{variants:{hidden:{height:"2%",opacity:0},visible:{height:O(Math.max(0,e.sales-e.purchases),z,2),opacity:1}},transition:{type:"spring",stiffness:200,damping:20,delay:.15},className:"w-5 lg:w-7 xl:w-8 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-t-lg",title:`Profit: ₹${Math.max(0,e.sales-e.purchases).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`})]}),s.jsx("span",{className:"text-xs lg:text-sm font-semibold text-slate-500 dark:text-slate-400",children:e.day})]},n))}),!we&&s.jsxs("div",{className:"mt-2 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-900/40 px-6 py-8",children:[s.jsx("p",{className:"text-sm font-semibold text-slate-700 dark:text-slate-200",children:"No transactions available yet."}),s.jsx("p",{className:"text-xs text-slate-500 dark:text-slate-400 text-center max-w-md",children:"Create your first invoice or purchase to see daily sales, purchases, and profit trends here."}),s.jsxs("div",{className:"flex flex-wrap gap-2 justify-center",children:[s.jsx("button",{type:"button",onClick:()=>{localStorage.setItem("sales_viewMode","create"),l("/sales")},className:"px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold",children:"Create Invoice"}),s.jsx("button",{type:"button",onClick:()=>{localStorage.setItem("purchases_viewMode","create"),l("/purchases")},className:"px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold",children:"Create Purchase"})]})]})]})}),s.jsxs("div",{className:"space-y-5 lg:space-y-6",children:[s.jsxs("div",{className:`p-4 lg:p-6 xl:p-7 rounded-3xl bg-[#e4ebf5] dark:bg-slate-800\r\n              shadow-[12px_12px_24px_#c5ccd6,-12px_-12px_24px_#ffffff]\r\n              dark:shadow-[12px_12px_24px_#1e293b,-12px_-12px_24px_#334155]`,children:[s.jsxs("div",{className:"flex items-center justify-between gap-3 mb-5",children:[s.jsx("h2",{className:"text-lg lg:text-xl font-bold text-slate-700 dark:text-slate-100",children:"Expiry Alerts"}),s.jsx("button",{onClick:()=>l("/inventory?filter=expired"),className:"text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline",children:"Manage"})]}),s.jsx("div",{className:"space-y-3",children:H.length===0?s.jsx("p",{className:"text-sm text-slate-500 dark:text-slate-400",children:"No items expiring soon."}):H.slice(0,5).map(e=>{const n=He(e.expiryDate),o=typeof n==="number"?n===0?"Today":n===1?"Tomorrow":`${n} days`:"Soon";return s.jsxs("div",{className:`flex items-center justify-between p-4 rounded-2xl bg-[#e4ebf5] dark:bg-slate-700\r\n                        shadow-[inset_4px_4px_8px_#c5ccd6,inset_-4px_-4px_8px_#ffffff]\r\n                        dark:shadow-[inset_4px_4px_8px_#1e293b,inset_-4px_-4px_8px_#334155]`,children:[s.jsxs("div",{children:[s.jsx("p",{className:"text-sm font-semibold text-slate-700 dark:text-slate-100",children:e.name}),s.jsx("p",{className:"text-xs text-slate-500 dark:text-slate-400",children:e.category||"Uncategorized"})]}),s.jsxs("span",{className:p("text-xs font-semibold px-2 py-1 rounded-full",typeof n==="number"&&n<0?"text-red-700 bg-red-100":typeof n==="number"&&n<=7?"text-orange-700 bg-orange-100":"text-green-700 bg-green-100"),children:[typeof n==="number"&&n<0?"Expired":typeof n==="number"&&n<=7?"Expiring soon":"Safe"]}),s.jsx("p",{className:"text-[11px] text-slate-500 mt-0.5",children:e.expiryDate?new Date(e.expiryDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—"})]},e.id)})}),M>0&&s.jsxs("button",{onClick:()=>l("/inventory?filter=expired"),className:"mt-4 text-sm text-red-600 font-semibold hover:underline",children:["View ",M," expired item",M===1?"":"s"]})]}),s.jsxs("div",{className:`p-4 lg:p-6 xl:p-7 rounded-3xl bg-[#e4ebf5] dark:bg-slate-800';

// Find index of broken and find where duplicate content starts - use simpler fix: only fix legend close + find duplicate chart

const idx = s.indexOf(broken);
if (idx < 0) {
  console.log('Broken legend not found — may already be fixed');
  process.exit(0);
}

// Find end of duplicated mangled section - look for second "Expiry Alerts" after broken
const after = s.indexOf('children:"Expiry Alerts"}),s.jsx("button",{onClick:()=>l("/inventory?filter=expired")', idx);
if (after < 0) {
  console.error('Could not find recovery anchor');
  process.exit(1);
}

// Remove from broken start to just before the proper expiry section - but we need to keep one chart block
// Simpler: replace from broken through first duplicate weekly chart mangled part

const endMarker = '!we&&s.jsxs("div",{className:"mt-2 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed';
const endIdx = s.indexOf(endMarker, idx);
if (endIdx < 0) {
  console.error('end marker not found');
  process.exit(1);
}

// Find where chart section should start - go back from endMarker to m.div chart
const chartStart = s.lastIndexOf('s.jsx(m.div,{className:p("flex items-end', idx);
console.log('Replace span', idx, 'to', endIdx, 'len', endIdx - idx);

const before = s.slice(0, idx);
const afterPart = s.slice(endIdx);
const middle =
  'children:"Purchases"})]}),s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("div",{className:"w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"}),s.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"Profit"})]})]})]}),s.jsx(m.div,{className:p("flex items-end justify-between gap-1.5 lg:gap-2",we?"h-44 lg:h-52":"min-h-[120px] h-auto py-6"),initial:"hidden",animate:"visible",variants:{visible:{transition:{staggerChildren:.05}}},children:R.map((e,n)=>s.jsxs("div",{className:"flex-1 flex flex-col items-center gap-2 group",children:[s.jsxs("div",{className:"w-full flex items-end justify-center gap-1.5 h-full",children:[s.jsx(m.div,{variants:{hidden:{height:"2%",opacity:0},visible:{height:O(e.sales,z,2),opacity:1}},transition:{type:"spring",stiffness:200,damping:20},className:"w-5 lg:w-7 xl:w-8 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-700",title:`Sales: ₹${e.sales.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`}),s.jsx(m.div,{variants:{hidden:{height:"2%",opacity:0},visible:{height:O(e.purchases,z,2),opacity:1}},transition:{type:"spring",stiffness:200,damping:20,delay:.1},className:"w-5 lg:w-7 xl:w-8 bg-gradient-to-t from-amber-300 to-amber-500 rounded-t-lg transition-all duration-300 group-hover:from-amber-400 group-hover:to-amber-600",title:`Purchases: ₹${e.purchases.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`}),s.jsx(m.div,{variants:{hidden:{height:"2%",opacity:0},visible:{height:O(Math.max(0,e.sales-e.purchases),z,2),opacity:1}},transition:{type:"spring",stiffness:200,damping:20,delay:.15},className:"w-5 lg:w-7 xl:w-8 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-t-lg",title:`Profit: ₹${Math.max(0,e.sales-e.purchases).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`})]}),s.jsx("span",{className:"text-xs lg:text-sm font-semibold text-slate-500 dark:text-slate-400",children:e.day})]},n))}),';

s = before + middle + afterPart;
fs.writeFileSync(path, s);
require('child_process').execSync(`node --check "${path}"`, { stdio: 'inherit' });
console.log('Fixed dashboard legend + profit bars');
