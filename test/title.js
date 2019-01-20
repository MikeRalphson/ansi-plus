const crt = require('../crt.js');

let title = '';
for (let i=2;i<process.argv.length;i++) {
  title += process.argv[i] + ' ';
}
if (title === '') title = 'Supply a title on the commandline!';

crt.Title(title);
