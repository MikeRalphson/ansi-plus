const crt = require('../crt.js');

crt.ClrScr();
crt.TextBackground(crt.Blue);
crt.TextColor(crt.Yellow);
crt.GotoXY(35,12);
crt.WriteLn('Hello, World!');
crt.NormVideo();
