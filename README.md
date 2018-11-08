# ansi-plus

Turbo Pascal CRT unit-like functions and primitive TUI utilities for Node.JS

## Installation

* Requires `Node.js` `v7.6.0` or higher (for `async`/`await`)
* Clone this repository
* `npm i`

## Contents

* `crt.js` - a rough analogue of the Turbo Pascal CRT unit, has some limitations and some extensions
* `utility.js` - a rough analogue of my own UTILITY.PAS unit from the 1990s which provides simple TUI primitives such as box-drawing

## Work in progress

* `cua.js` - building on the above, provides a menu system loosely based on the IBM SAA/CUA guidelines

## TODO

* A damage / write-through buffer to allow restoring sections of the screen
