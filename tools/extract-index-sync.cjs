const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');

// find queueSync or enqueue
for (const term of ['queueSync', 'syncQueue', 'enqueueSync', 'action:"create"', 'pendingSync']) {
  const i = s.indexOf(term);
  if (i >= 0) {
    console.log('\n', term, i);
    console.log(s.substring(i, i + 400));
  }
}
