'use strict';

const crt = require('../crt.js');
const utility = require('../utility.js');

(async () => {
  crt.Save();
  utility.fillchar(0,0,79,24,'a');
  let k = await crt.ReadKey();
  crt.Restore();
  console.log(k);
})().then(process.exit);
