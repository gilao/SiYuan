import{r as y}from"./chunk.vendor_get-intrinsic.js";import{r as h}from"./chunk.vendor_function-bind.js";var o={exports:{}},v;function $(){return v||(v=1,function(e){var n=h(),r=y(),p=r("%Function.prototype.apply%"),i=r("%Function.prototype.call%"),l=r("%Reflect.apply%",!0)||n.call(i,p),a=r("%Object.getOwnPropertyDescriptor%",!0),t=r("%Object.defineProperty%",!0),B=r("%Math.max%");if(t)try{t({},"a",{value:1})}catch{t=null}e.exports=function(g){var u=l(n,i,arguments);if(a&&t){var x=a(u,"length");x.configurable&&t(u,"length",{value:1+B(0,g.length-(arguments.length-1))})}return u};var f=function(){return l(n,p,arguments)};t?t(e.exports,"apply",{value:f}):e.exports.apply=f}(o)),o.exports}var c,d;function O(){if(d)return c;d=1;var e=y(),n=$(),r=n(e("String.prototype.indexOf"));return c=function(i,l){var a=e(i,!!l);return typeof a=="function"&&r(i,".prototype.")>-1?n(a):a},c}export{$ as a,O as r};
