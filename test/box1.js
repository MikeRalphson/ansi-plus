'use strict';

const crt = require('../crt.js');
const utility = require('../utility.js');

crt.ClrScr();
crt.Title('CRT Box Demo 1');
utility.fillchar(0,0,24,79,utility.shades[1],crt.Black,crt.DarkGrey);
utility.box(10,5,10,40,utility.styles.ascii,crt.Blue,crt.Yellow);
utility.box(15,8,10,40,utility.styles.single,crt.Green,crt.LightCyan);
utility.box(20,11,10,40,utility.styles.double,crt.Red,crt.White);
utility.box(25,14,10,40,utility.styles.sindub,crt.Brown,crt.Magenta);
utility.box(30,17,10,40,utility.styles.dubsin,crt.Cyan,crt.DarkGrey);
crt.NormVideo();
