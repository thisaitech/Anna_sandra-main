import fs from 'node:fs'

const exportPath = 'c:/project/Anna_sandra-main/dist/assets/exportUtils-DcH-82Sc.js'
const salesPath = 'c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js'

let exportJs = fs.readFileSync(exportPath, 'utf8')

const oldExcelLoop =
  'e.forEach(n=>{const c=n.items||[],S=n.isInterstate||n.customerState&&n.customerState!==(t?.state||"Tamil Nadu");c.forEach((r,u)=>{const T=r.gstRate||r.tax||0,F=r.taxableAmount||r.quantity*r.rate,I=F*T/100,b=S?0:T/2,w=S?0:T/2,g=S?T:0,f=F*b/100,P=F*w/100,R=F*g/100;s.push([u===0?n.invoiceNumber:"",u===0?new Date(n.invoiceDate).toLocaleDateString("en-IN"):"",u===0?n.partyName||n.customerName||"Walk-in Customer":"",u===0&&(n.partyGSTIN||n.customerGSTIN)||"",u===0?n.placeOfSupply||n.customerState||t?.state||"Tamil Nadu":"",r.hsnCode||r.hsn||"",r.itemName||r.name||"",r.quantity||r.qty||1,r.unit||"Nos",r.rate||r.price||0,F.toFixed(2),T.toFixed(2),b.toFixed(2),f.toFixed(2),w.toFixed(2),P.toFixed(2),g.toFixed(2),R.toFixed(2),I.toFixed(2),u===0?(n.grandTotal||n.total||0).toFixed(2):"",u===0?n.paymentMode||"Credit":"",n.reference||""])}),s.push([])});'

const newExcelLoop =
  'e.forEach(n=>{let c=n.items||n.invoiceItems||n.itemsList||[];Array.isArray(c)||(c=[]);c.length===0&&(n.grandTotal||n.total)&&(c=[{name:n.notes||"Sale",description:n.notes||"Sale",qty:1,quantity:1,rate:n.grandTotal||n.total||0,price:n.grandTotal||n.total||0,taxableAmount:n.subtotal||n.taxableAmount||n.grandTotal||n.total||0,tax:n.totalTaxAmount||n.tax||0,unit:"Nos"}]);const S=n.isInterstate||(n.customerState||n.partyState)&&String(n.customerState||n.partyState)!==String(t?.state||"Tamil Nadu");const invGst=Number(n.totalTaxAmount??n.tax??0),invCgst=Number(n.cgstAmount??0),invSgst=Number(n.sgstAmount??0),invIgst=Number(n.igstAmount??0);c.forEach((r,u)=>{const qtyN=Number(r.quantity??r.qty??1),qty=qtyN>0?qtyN:1;const rate=Number(r.rate??r.price??r.unitPrice??0);const T=Number(r.gstRate??r.taxRate??r.tax??0);let F=Number(r.taxableAmount??r.taxableValue);if(!(F>0)){const amt=Number(r.amount??r.total??0),taxL=Number(r.taxAmount??r.gstAmount??0)||Number(r.cgstAmount??0)+Number(r.sgstAmount??0)+Number(r.igstAmount??0);F=amt>0&&taxL>0?amt-taxL:qty*rate}let cgstR=Number(r.cgstPercent??(S?0:T/2)),sgstR=Number(r.sgstPercent??(S?0:T/2)),igstR=Number(r.igstPercent??(S?T:0)),cgstA=Number(r.cgstAmount??0),sgstA=Number(r.sgstAmount??0),igstA=Number(r.igstAmount??0),taxAmt=Number(r.taxAmount??r.gstAmount??0);if(u===0&&cgstA+sgstA+igstA+taxAmt===0&&invCgst+invSgst+invIgst+invGst>0){cgstA=invCgst;sgstA=invSgst;igstA=invIgst;taxAmt=invGst||invCgst+invSgst+invIgst;cgstR=S?0:taxAmt>0&&F>0?cgstA/F*100/2:0;sgstR=S?0:taxAmt>0&&F>0?sgstA/F*100/2:0;igstR=S&&taxAmt>0&&F>0?igstA/F*100:0}else if(cgstA+sgstA+igstA+taxAmt===0&&T>0&&F>0){taxAmt=F*T/100;cgstA=S?0:taxAmt/2;sgstA=S?0:taxAmt/2;igstA=S?taxAmt:0}else taxAmt||(taxAmt=cgstA+sgstA+igstA);const itemName=r.itemName||r.name||r.description||r.productName||"";const unit=r.unit||r.baseUnit||"Nos";s.push([u===0?n.invoiceNumber:"",u===0?new Date(n.invoiceDate||n.date).toLocaleDateString("en-IN"):"",u===0?n.partyName||n.customerName||"Walk-in Customer":"",u===0?(n.partyGSTIN||n.customerGSTIN||n.partyGstin||n.customerGstin||""):"",u===0?n.placeOfSupply||n.customerState||n.partyState||t?.state||"Tamil Nadu":"",r.hsnCode||r.hsn||r.hsnSac||"",itemName,qty,unit,rate,F.toFixed(2),T.toFixed(2),cgstR.toFixed(2),cgstA.toFixed(2),sgstR.toFixed(2),sgstA.toFixed(2),igstR.toFixed(2),igstA.toFixed(2),taxAmt.toFixed(2),u===0?Number(n.grandTotal||n.total||0).toFixed(2):"",u===0?(n.paymentMode||n.payment?.mode||"cash"):"",n.reference||n.notes||""])}),s.push([])});'

if (!exportJs.includes(oldExcelLoop)) {
  console.error('Excel export loop pattern not found')
  process.exit(1)
}
exportJs = exportJs.replace(oldExcelLoop, newExcelLoop)

const oldCsvStart = 'e.forEach(c=>{const S=c.items||[],r=c.isInterstate||!1;S.forEach((u,T)=>{const F=u.gstRate||u.tax||0,I=u.taxableAmount||u.quantity*u.rate'
if (exportJs.includes(oldCsvStart)) {
  exportJs = exportJs.replace(
    'e.forEach(c=>{const S=c.items||[],r=c.isInterstate||!1;S.forEach((u,T)=>{const F=u.gstRate||u.tax||0,I=u.taxableAmount||u.quantity*u.rate',
    'e.forEach(c=>{let S=c.items||c.invoiceItems||c.itemsList||[];Array.isArray(S)||(S=[]);S.length===0&&(c.grandTotal||c.total)&&(S=[{name:c.notes||"Sale",qty:1,quantity:1,rate:c.grandTotal||c.total||0,price:c.grandTotal||c.total||0,taxableAmount:c.subtotal||c.taxableAmount||c.grandTotal||c.total||0}]);const r=c.isInterstate||!1;S.forEach((u,T)=>{const qtyN=Number(u.quantity??u.qty??1),qty=qtyN>0?qtyN:1,rate=Number(u.rate??u.price??0),F=u.gstRate||u.taxRate||u.tax||0,I=Number(u.taxableAmount??u.taxableValue)||(qty*rate)'
  )
  exportJs = exportJs.replace(
    'T===0?c.partyName||c.',
    'T===0?c.partyName||c.customerName||c.'
  )
  exportJs = exportJs.replace(
    'u.itemName||u.name||""',
    'u.itemName||u.name||u.description||u.productName||""'
  )
  exportJs = exportJs.replace(
    'u.quantity||u.qty||1',
    'qty'
  )
  exportJs = exportJs.replace(
    'T===0?new Date(c.invoiceDate).toLocaleDateString("en-IN"):""',
    'T===0?new Date(c.invoiceDate||c.date).toLocaleDateString("en-IN"):""'
  )
}

fs.writeFileSync(exportPath, exportJs)
console.log('Patched exportUtils-DcH-82Sc.js')

let salesJs = fs.readFileSync(salesPath, 'utf8')
const oldItems = 'items:invoice?.items||[]'
const newItems = 'items:invoice?.items||invoice?.invoiceItems||invoice?.itemsList||[]'
if (salesJs.includes(oldItems)) {
  salesJs = salesJs.replace(oldItems, newItems)
  fs.writeFileSync(salesPath, salesJs)
  console.log('Patched Sales formatted invoice items')
} else {
  console.warn('Sales items pattern not found (may already be patched)')
}

// Export: use full invoice records from getInvoices instead of list-only state
const oldExport =
  't==="excel"?(a.exportToTallyExcel(Ve),p.success("Excel exported!",{id:s})):t==="csv"?(a.exportToTallyCSV(Ve),p.success("CSV exported!",{id:s})):t==="tally"?(a.downloadTallyXML(Ve),p.success("Tally XML exported!",{id:s}))'
const newExport =
  'const exportData=await ed("sale",0);const exportList=Array.isArray(exportData)?exportData.filter(i=>{const ty=i?.type;return(!ty||ty==="sale")&&!String(i?.invoiceNumber||"").toUpperCase().startsWith("QTN/")}):Ve;t==="excel"?(a.exportToTallyExcel(exportList),p.success("Excel exported!",{id:s})):t==="csv"?(a.exportToTallyCSV(exportList),p.success("CSV exported!",{id:s})):t==="tally"?(a.downloadTallyXML(exportList),p.success("Tally XML exported!",{id:s}))'

if (salesJs.includes(oldExport)) {
  salesJs = salesJs.replace(oldExport, newExport)
  fs.writeFileSync(salesPath, salesJs)
  console.log('Patched Sales export to use full getInvoices data')
} else {
  console.warn('Sales export handler pattern not found')
}

console.log('Done. Hard-refresh browser and re-export.')
