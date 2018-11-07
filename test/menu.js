'use strict';

const crt = require('../crt.js');
const utility = require('../utility.js');
const cua = require('../cua.js');

let data = [ [ { title: 'File' }, { title: 'Edit' }, { title: 'Help' } ] ];

crt.ClrScr();
cua.menu(data,utility.themes.cua);
crt.NormVideo();
