import{r as a,j as e,a as ve}from"./react-vendor-r3yYxNhK.js";import{m as Z,f as J,af as we,an as Se,e as Ce,aQ as K,B as P,Z as De,ai as X,ak as $e,aO as ke,u as Fe,g as ee,p as Ie,av as Pe,ao as ze,H as Ae,a9 as Te,aa as Le}from"./icons-vendor-DcCiQEjK.js";import{u as Oe,f as d}from"./index-jCsVk30s.js";import{getParties as Ee,createParty as Re}from"./partyService-Wzcg7Wjf.js";import{m as j,A as te}from"./ui-vendor--4o8o4K1.js";import"./firebase-vendor-BYKC5ZuK.js";import"./utils-vendor-BiOBxSaf.js";import"./taxCalculations-YxV53_I5.js";import"./localJsonStore-CVmiFbPM.js";const Ke=({items:x,onComplete:se,onCancel:O,companySettings:E})=>{const{t:f}=Oe(),[r,z]=a.useState(1),[A,R]=a.useState([]),[$,B]=a.useState(""),[o,M]=a.useState(null),[l,W]=a.useState(!0),[v,ae]=a.useState("Walk-in Customer"),[k,ne]=a.useState(""),[ie,w]=a.useState(!1),[S,q]=a.useState(""),[U,Y]=a.useState(""),[Be,oe]=a.useState(!0),[m,re]=a.useState("cash"),[F,T]=a.useState(""),[L,G]=a.useState(""),[le,Me]=a.useState(""),[y,H]=a.useState("percentage"),[b,ce]=a.useState(""),[C,de]=a.useState(!0),[We,qe]=a.useState("");a.useEffect(()=>{(async()=>{try{const n=await Ee("customer");R(n)}catch(n){console.error("Error loading parties:",n)}finally{oe(!1)}})()},[]);const s=a.useMemo(()=>{const t=x.reduce((h,I)=>h+I.price*I.quantity,0),n=x.reduce((h,I)=>h+I.taxAmount,0),g=t+n;let u=0;b&&parseFloat(b)>0&&(y==="percentage"?u=g*parseFloat(b)/100:u=parseFloat(b));const p=g-u;let N=0,c=p;C&&(c=Math.round(p),N=c-p);const i=parseFloat(F)||0,D=i>c?i-c:0;return{subtotal:t,taxAmount:n,totalBeforeDiscount:g,discountAmount:u,afterDiscount:p,roundOff:N,grandTotal:c,received:i,change:D}},[x,y,b,C,F]),me=()=>{const t=E||{},n=l?v:o?.displayName||o?.companyName||"Walk-in Customer",g=l?k:o?.phone||"",u=`POS-${Date.now().toString().slice(-6)}`,p=new Date,N=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${u}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
            background: #fff;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 5px;
          }
          .company-details {
            font-size: 13px;
            color: #666;
            line-height: 1.6;
          }
          .gstin {
            font-weight: bold;
            color: #333;
            margin-top: 5px;
          }
          .invoice-title {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #6366f1;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
          }
          .info-block h4 {
            font-size: 12px;
            color: #6366f1;
            text-transform: uppercase;
            margin-bottom: 8px;
            font-weight: 600;
          }
          .info-block p {
            font-size: 14px;
            margin: 3px 0;
          }
          .info-block .value {
            font-weight: 600;
            color: #111;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background: #6366f1;
            color: white;
            padding: 12px 10px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
          }
          th:last-child, td:last-child { text-align: right; }
          td {
            padding: 12px 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          tr:nth-child(even) { background: #f9fafb; }
          .totals {
            margin-top: 20px;
            margin-left: auto;
            width: 300px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .totals-row.grand-total {
            font-size: 18px;
            font-weight: bold;
            color: #6366f1;
            border-bottom: none;
            border-top: 2px solid #6366f1;
            padding-top: 12px;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          .footer .thanks {
            font-size: 16px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 10px;
          }
          .footer .powered {
            font-size: 11px;
            color: #999;
            margin-top: 15px;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-name">${t.companyName||"Your Business"}</div>
            <div class="company-details">
              ${t.address?t.address+"<br>":""}
              ${t.city||""}${t.state?", "+t.state:""} ${t.pincode||""}
              ${t.phone?"<br>Phone: "+t.phone:""}
              ${t.email?" | Email: "+t.email:""}
            </div>
            ${t.gstin?'<div class="gstin">GSTIN: '+t.gstin+"</div>":""}
          </div>

          <div class="invoice-title">Tax Invoice</div>

          <div class="info-section">
            <div class="info-block">
              <h4>Bill To</h4>
              <p class="value">${n}</p>
              ${g?"<p>Phone: "+g+"</p>":""}
            </div>
            <div class="info-block" style="text-align: right;">
              <h4>Invoice Details</h4>
              <p>Invoice No: <span class="value">${u}</span></p>
              <p>Date: <span class="value">${p.toLocaleDateString("en-IN")}</span></p>
              <p>Time: <span class="value">${p.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span></p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Item</th>
                <th style="width: 80px;">Qty</th>
                <th style="width: 100px;">Rate</th>
                <th style="width: 80px;">Tax</th>
                <th style="width: 110px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${x.map((i,D)=>`
                <tr>
                  <td>${D+1}</td>
                  <td>${i.name}${i.hsnCode?'<br><small style="color:#666;">HSN: '+i.hsnCode+"</small>":""}</td>
                  <td>${i.quantity} ${i.unit||""}</td>
                  <td>₹${i.price.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                  <td>${i.tax}%</td>
                  <td>₹${(i.price*i.quantity).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>₹${s.subtotal.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
            </div>
            <div class="totals-row">
              <span>Tax:</span>
              <span>₹${s.taxAmount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
            </div>
            ${s.discountAmount>0?`
              <div class="totals-row" style="color: #16a34a;">
                <span>Discount:</span>
                <span>-₹${s.discountAmount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
              </div>
            `:""}
            ${s.roundOff!==0?`
              <div class="totals-row">
                <span>Round Off:</span>
                <span>${s.roundOff>=0?"+":""}₹${s.roundOff.toFixed(2)}</span>
              </div>
            `:""}
            <div class="totals-row grand-total">
              <span>Grand Total:</span>
              <span>₹${s.grandTotal.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
            </div>
          </div>

          <div class="footer">
            <div class="thanks">Thank You for Your Business!</div>
            <p>Payment Method: ${m.toUpperCase()}</p>
            ${m==="cash"&&s.change>0?"<p>Change Given: ₹"+s.change.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})+"</p>":""}
            <div class="powered">Powered by Sandra ERP</div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        <\/script>
      </body>
      </html>
    `,c=window.open("","_blank","width=900,height=700");c&&(c.document.write(N),c.document.close())},ue=()=>{const t=l?v:o?.displayName||o?.companyName||"Customer",n=l?k:o?.phone||"",g=`POS-${Date.now().toString().slice(-6)}`,u=E||{},p=x.map(h=>`• ${h.name} x${h.quantity} = ₹${(h.price*h.quantity).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`).join(`
`),N=`*${u.companyName||"Invoice"}*

Invoice: ${g}
Date: ${new Date().toLocaleDateString("en-IN")}
Customer: ${t}

*Items:*
${p}

Subtotal: ₹${s.subtotal.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}
Tax: ₹${s.taxAmount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}
`+(s.discountAmount>0?`Discount: -₹${s.discountAmount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}
`:"")+`*Total: ₹${s.grandTotal.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}*

Thank you for your business! 🙏`,c=encodeURIComponent(N),i=n?.replace(/\D/g,"")||"",D=i?`https://wa.me/91${i}?text=${c}`:`https://wa.me/?text=${c}`;window.open(D,"_blank")},Q=a.useMemo(()=>{if(!$.trim())return A.slice(0,10);const t=$.toLowerCase();return A.filter(n=>n.companyName?.toLowerCase().includes(t)||n.displayName?.toLowerCase().includes(t)||n.phone?.includes(t)).slice(0,10)},[A,$]),V=t=>{M(t),W(!1),B(t.displayName||t.companyName)},pe=async()=>{if(S.trim())try{const t=await Re({type:"customer",companyName:S.trim(),displayName:S.trim(),phone:U.trim(),email:"",contacts:[],billingAddress:{line1:"",line2:"",city:"",state:"",pincode:"",country:"India"},sameAsShipping:!0});t&&(R(n=>[t,...n]),V(t),w(!1),q(""),Y(""))}catch(t){console.error("Error creating customer:",t)}},xe=()=>{const t={customer:{id:o?.id,name:l?v:o?.displayName||o?.companyName||"",phone:l?k:o?.phone,isWalkIn:l},payment:{method:m,amount:s.grandTotal,receivedAmount:s.received||s.grandTotal,changeAmount:s.change,transactionId:L||void 0,bankAccount:le||void 0},discount:{type:y,value:parseFloat(b)||0,discountAmount:s.discountAmount},roundOff:s.roundOff,grandTotal:s.grandTotal,items:x};se(t)},ge=[100,200,500,1e3,2e3],he=[{id:"cash",label:"Cash",icon:$e,color:"bg-green-500"},{id:"upi",label:"UPI",icon:ke,color:"bg-purple-500"},{id:"card",label:"Card",icon:X,color:"bg-blue-500"},{id:"bank",label:"Bank",icon:Fe,color:"bg-orange-500"},{id:"credit",label:"Credit",icon:ee,color:"bg-red-500"}],fe=()=>e.jsx("div",{className:"flex items-center justify-center gap-2 mb-6",children:[1,2,3,4].map(t=>e.jsxs(ve.Fragment,{children:[e.jsx("div",{className:d("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",r===t?"bg-purple-600 text-white scale-110":r>t?"bg-green-500 text-white":"bg-gray-200 text-gray-500"),children:r>t?e.jsx(K,{size:16,weight:"bold"}):t}),t<4&&e.jsx("div",{className:d("w-8 h-1 rounded-full transition-all",r>t?"bg-green-500":"bg-gray-200")})]},t))}),be=()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("h2",{className:"text-lg font-bold text-gray-800 flex items-center gap-2",children:[e.jsx(P,{size:24,className:"text-purple-600"}),"Select Customer"]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx("button",{onClick:()=>{W(!0),M(null)},className:d("p-4 rounded-xl border-2 text-left transition-all",l?"border-purple-500 bg-purple-50":"border-gray-200 hover:border-purple-300"),children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:d("w-10 h-10 rounded-full flex items-center justify-center",l?"bg-purple-500 text-white":"bg-gray-100 text-gray-500"),children:e.jsx(P,{size:20,weight:"bold"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-gray-800",children:"Walk-in"}),e.jsx("p",{className:"text-xs text-gray-500",children:"Cash Customer"})]})]})}),e.jsx("button",{onClick:()=>w(!0),className:"p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-300 hover:bg-purple-50 transition-all",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500",children:e.jsx(De,{size:20,weight:"bold"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-gray-800",children:"+ New"}),e.jsx("p",{className:"text-xs text-gray-500",children:"Add Customer"})]})]})})]}),l&&e.jsxs("div",{className:"bg-gray-50 rounded-xl p-4 space-y-3",children:[e.jsx("input",{type:"text",value:v,onChange:t=>ae(t.target.value),placeholder:"Customer Name (optional)",className:"w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"}),e.jsx("input",{type:"tel",value:k,onChange:t=>ne(t.target.value),placeholder:"Phone Number (optional)",className:"w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"})]}),!l&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative",children:[e.jsx(P,{size:18,className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"}),e.jsx("input",{type:"text",value:$,onChange:t=>B(t.target.value),placeholder:"Search customer by name or phone...",className:"w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"})]}),e.jsxs("div",{className:"max-h-48 overflow-y-auto rounded-xl border border-gray-200 divide-y",children:[Q.map(t=>e.jsxs("button",{onClick:()=>V(t),className:d("w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors",o?.id===t.id&&"bg-purple-50"),children:[e.jsx("div",{className:"w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center",children:e.jsx(P,{size:18,className:"text-gray-500"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"font-medium text-gray-800 truncate",children:t.displayName||t.companyName}),e.jsx("p",{className:"text-xs text-gray-500",children:t.phone||"No phone"})]}),o?.id===t.id&&e.jsx(K,{size:20,className:"text-purple-600",weight:"bold"})]},t.id)),Q.length===0&&e.jsx("div",{className:"px-4 py-6 text-center text-gray-500",children:"No customers found"})]})]}),e.jsx(te,{children:ie&&e.jsx(j.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50",onClick:()=>w(!1),children:e.jsxs(j.div,{initial:{scale:.95},animate:{scale:1},exit:{scale:.95},onClick:t=>t.stopPropagation(),className:"bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden",children:[e.jsxs("div",{className:"bg-purple-600 px-4 py-3 flex items-center justify-between",children:[e.jsx("h3",{className:"font-bold text-white",children:"Add New Customer"}),e.jsx("button",{onClick:()=>w(!1),children:e.jsx(J,{size:20,className:"text-white"})})]}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("input",{type:"text",value:S,onChange:t=>q(t.target.value),placeholder:"Customer Name *",className:"w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30",autoFocus:!0}),e.jsx("input",{type:"tel",value:U,onChange:t=>Y(t.target.value),placeholder:"Phone Number",className:"w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"}),e.jsxs("div",{className:"flex gap-2 pt-2",children:[e.jsx("button",{onClick:()=>w(!1),className:"flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium",children:"Cancel"}),e.jsx("button",{onClick:pe,disabled:!S.trim(),className:"flex-1 px-4 py-2.5 rounded-lg bg-purple-600 text-white font-medium disabled:opacity-50",children:"Save"})]})]})]})})})]}),ye=()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("h2",{className:"text-lg font-bold text-gray-800 flex items-center gap-2",children:[e.jsx(X,{size:24,className:"text-purple-600"}),"Payment Method"]}),e.jsx("div",{className:"grid grid-cols-3 gap-3",children:he.map(t=>e.jsxs("button",{onClick:()=>re(t.id),className:d("p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",m===t.id?"border-purple-500 bg-purple-50":"border-gray-200 hover:border-purple-300"),children:[e.jsx("div",{className:d("w-12 h-12 rounded-full flex items-center justify-center text-white",t.color),children:e.jsx(t.icon,{size:24,weight:"bold"})}),e.jsx("span",{className:"font-medium text-gray-800 text-sm",children:t.label})]},t.id))}),e.jsxs("div",{className:"bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white",children:[e.jsx("p",{className:"text-sm opacity-80",children:"Amount to Pay"}),e.jsxs("p",{className:"text-3xl font-bold",children:["₹",s.grandTotal.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),m==="cash"&&e.jsxs("div",{className:"space-y-3",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Amount Received"}),e.jsx("input",{type:"number",value:F,onChange:t=>T(t.target.value),placeholder:"Enter received amount",className:"w-full px-4 py-3 text-lg rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[ge.map(t=>e.jsxs("button",{onClick:()=>T(String(s.grandTotal+t)),className:"px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors",children:["+₹",t.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]},t)),e.jsx("button",{onClick:()=>T(String(s.grandTotal)),className:"px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-sm font-medium text-purple-700 transition-colors",children:"Exact"})]}),s.change>0&&e.jsxs("div",{className:"bg-green-50 border border-green-200 rounded-xl p-4",children:[e.jsx("p",{className:"text-sm text-green-700",children:"Change to Return"}),e.jsxs("p",{className:"text-2xl font-bold text-green-600",children:["₹",s.change.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]})]}),m==="upi"&&e.jsxs("div",{className:"space-y-3",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"UPI Transaction ID (optional)"}),e.jsx("input",{type:"text",value:L,onChange:t=>G(t.target.value),placeholder:"Enter UPI transaction ID",className:"w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"})]}),m==="card"&&e.jsxs("div",{className:"space-y-3",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Card Transaction ID (optional)"}),e.jsx("input",{type:"text",value:L,onChange:t=>G(t.target.value),placeholder:"Enter card transaction ID",className:"w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"})]}),m==="credit"&&e.jsx("div",{className:"bg-amber-50 border border-amber-200 rounded-xl p-4",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(ee,{size:24,className:"text-amber-600 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-amber-800",children:"Credit Sale"}),e.jsx("p",{className:"text-sm text-amber-600",children:"This sale will be added to customer's pending balance"})]})]})})]}),Ne=()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("h2",{className:"text-lg font-bold text-gray-800 flex items-center gap-2",children:[e.jsx(Ie,{size:24,className:"text-purple-600"}),"Bill Summary"]}),e.jsx("div",{className:"bg-gray-50 rounded-xl p-3 max-h-40 overflow-y-auto",children:x.map((t,n)=>e.jsxs("div",{className:"flex items-center justify-between py-2 border-b border-gray-200 last:border-0",children:[e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"font-medium text-gray-800 text-sm truncate",children:t.name}),e.jsxs("p",{className:"text-xs text-gray-500",children:[t.quantity," × ₹",t.price.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsxs("p",{className:"font-semibold text-gray-800",children:["₹",(t.price*t.quantity).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]},n))}),e.jsxs("div",{className:"bg-purple-50 rounded-xl p-4 space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("span",{className:"font-medium text-purple-800 flex items-center gap-2",children:[e.jsx(Pe,{size:18}),"Add Discount"]}),e.jsxs("div",{className:"flex rounded-lg overflow-hidden border border-purple-200",children:[e.jsx("button",{onClick:()=>H("percentage"),className:d("px-3 py-1 text-sm font-medium transition-colors",y==="percentage"?"bg-purple-600 text-white":"bg-white text-purple-600"),children:e.jsx(ze,{size:14})}),e.jsx("button",{onClick:()=>H("amount"),className:d("px-3 py-1 text-sm font-medium transition-colors",y==="amount"?"bg-purple-600 text-white":"bg-white text-purple-600"),children:"₹"})]})]}),e.jsx("input",{type:"number",value:b,onChange:t=>ce(t.target.value),placeholder:y==="percentage"?"Enter % discount":"Enter discount amount",className:"w-full px-4 py-2.5 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"})]}),e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl divide-y",children:[e.jsxs("div",{className:"px-4 py-3 flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:f.common.subtotal}),e.jsxs("span",{className:"font-medium",children:["₹",s.subtotal.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsxs("div",{className:"px-4 py-3 flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:f.common.tax}),e.jsxs("span",{className:"font-medium",children:["₹",s.taxAmount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),s.discountAmount>0&&e.jsxs("div",{className:"px-4 py-3 flex justify-between text-green-600",children:[e.jsx("span",{children:f.common.discount}),e.jsxs("span",{className:"font-medium",children:["-₹",s.discountAmount.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsxs("div",{className:"px-4 py-3 flex justify-between items-center",children:[e.jsxs("span",{className:"text-gray-600 flex items-center gap-2",children:[f.sales.roundOff,e.jsx("button",{onClick:()=>de(!C),className:d("w-10 h-5 rounded-full transition-colors relative",C?"bg-purple-500":"bg-gray-300"),children:e.jsx("div",{className:d("w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all",C?"right-0.5":"left-0.5")})})]}),e.jsxs("span",{className:"font-medium",children:[s.roundOff>=0?"+":"","₹",s.roundOff.toFixed(2)]})]}),e.jsxs("div",{className:"px-4 py-4 flex justify-between bg-purple-50",children:[e.jsx("span",{className:"text-lg font-bold text-purple-800",children:f.sales.grandTotal}),e.jsxs("span",{className:"text-xl font-bold text-purple-600",children:["₹",s.grandTotal.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]})]}),e.jsxs("div",{className:"bg-gray-50 rounded-xl p-4 text-sm",children:[e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx("span",{className:"text-gray-500",children:f.sales.customer}),e.jsx("span",{className:"font-medium text-gray-800",children:l?v:o?.displayName||o?.companyName})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-500",children:f.sales.payment}),e.jsx("span",{className:"font-medium text-gray-800 capitalize",children:m})]})]})]}),je=()=>e.jsxs("div",{className:"text-center py-6 space-y-6",children:[e.jsx(j.div,{initial:{scale:0},animate:{scale:1},transition:{type:"spring",duration:.5},className:"w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center",children:e.jsx(Ae,{size:64,className:"text-green-500",weight:"fill"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:"Payment Successful!"}),e.jsx("p",{className:"text-gray-500 mt-1",children:"Invoice has been created"})]}),e.jsxs("div",{className:"bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white",children:[e.jsx("p",{className:"text-sm opacity-80",children:"Amount Paid"}),e.jsxs("p",{className:"text-4xl font-bold",children:["₹",s.grandTotal.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]}),m==="cash"&&s.change>0&&e.jsxs("p",{className:"text-sm mt-2 opacity-80",children:["Change: ₹",s.change.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]})]}),e.jsxs("div",{className:"flex gap-3 justify-center",children:[e.jsxs("button",{onClick:me,className:"px-6 py-3 rounded-xl border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-colors",children:[e.jsx(Te,{size:20}),"Print"]}),e.jsxs("button",{onClick:ue,className:"px-6 py-3 rounded-xl border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-colors",children:[e.jsx(Le,{size:20,className:"text-green-500"}),"Share"]})]})]}),_=()=>{switch(r){case 1:return l||o!==null;case 2:return m==="cash"?(parseFloat(F)||0)>=s.grandTotal:!0;case 3:return!0;default:return!0}};return e.jsx(j.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsxs(j.div,{initial:{scale:.95,y:20},animate:{scale:1,y:0},exit:{scale:.95,y:20},className:"bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl",children:[e.jsxs("div",{className:"bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-4 flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(Z,{size:24,className:"text-white",weight:"fill"}),e.jsxs("div",{children:[e.jsx("h1",{className:"font-bold text-white",children:"Checkout"}),e.jsxs("p",{className:"text-xs text-white/70",children:[x.length," items"]})]})]}),e.jsx("button",{onClick:O,className:"w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors",children:e.jsx(J,{size:18,className:"text-white",weight:"bold"})})]}),e.jsx("div",{className:"px-4 pt-4",children:e.jsx(fe,{})}),e.jsx("div",{className:"flex-1 overflow-y-auto px-4 pb-4",children:e.jsx(te,{mode:"wait",children:e.jsxs(j.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},exit:{opacity:0,x:-20},transition:{duration:.2},children:[r===1&&be(),r===2&&ye(),r===3&&Ne(),r===4&&je()]},r)})}),e.jsx("div",{className:"px-4 py-4 border-t border-gray-200 bg-gray-50",children:r<4?e.jsxs("div",{className:"flex gap-3",children:[r>1&&e.jsxs("button",{onClick:()=>z(t=>t-1),className:"flex-1 px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors",children:[e.jsx(we,{size:18}),"Back"]}),e.jsx("button",{onClick:()=>{r===3?(xe(),z(4)):z(t=>t+1)},disabled:!_(),className:d("flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",_()?"bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg":"bg-gray-200 text-gray-400 cursor-not-allowed"),children:r===3?e.jsxs(e.Fragment,{children:[e.jsx(Se,{size:18,weight:"bold"}),"Receive Payment"]}):e.jsxs(e.Fragment,{children:["Next",e.jsx(Ce,{size:18})]})})]}):e.jsxs("button",{onClick:O,className:"w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all",children:[e.jsx(Z,{size:18}),"New Sale"]})})]})})};export{Ke as default};
//# sourceMappingURL=POSCheckoutWizard-fO28OrB2.js.map
