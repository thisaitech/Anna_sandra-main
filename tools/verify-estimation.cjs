const fs = require('fs');
const pdf = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/pdfService-D_1uA_-Q.js', 'utf8');
console.log('isEst', pdf.includes('const isEst=e.type==="quotation"'));
console.log('ESTIMATION title', pdf.includes('ESTIMATION'));
console.log('head isEst', pdf.includes('head:isEst?'));
console.log('hide tax amount', pdf.includes('isEst||(t.text("Tax Amount:"'));
