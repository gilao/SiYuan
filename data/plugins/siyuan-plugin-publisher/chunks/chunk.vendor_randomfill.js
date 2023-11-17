import{d as u}from"./chunk.vendor_vite-plugin-node-polyfills.js";import{c as a}from"./chunk.vendor_asn1-js.js";import{r as U}from"./chunk.vendor_safe-buffer.js";import{r as A}from"./chunk.vendor_randombytes.js";var t={},g;function M(){if(g)return t;g=1;function m(){throw new Error(`secure random number generation not supported by this browser
use chrome, FireFox or Internet Explorer 11`)}var l=U(),p=A(),w=l.Buffer,y=l.kMaxLength,i=a.crypto||a.msCrypto,f=Math.pow(2,32)-1;function c(r,n){if(typeof r!="number"||r!==r)throw new TypeError("offset must be a number");if(r>f||r<0)throw new TypeError("offset must be a uint32");if(r>y||r>n)throw new RangeError("offset out of range")}function h(r,n,e){if(typeof r!="number"||r!==r)throw new TypeError("size must be a number");if(r>f||r<0)throw new TypeError("size must be a uint32");if(r+n>e||r>y)throw new RangeError("buffer too small")}i&&i.getRandomValues||!u.process.browser?(t.randomFill=B,t.randomFillSync=v):(t.randomFill=m,t.randomFillSync=m);function B(r,n,e,o){if(!w.isBuffer(r)&&!(r instanceof a.Uint8Array))throw new TypeError('"buf" argument must be a Buffer or Uint8Array');if(typeof n=="function")o=n,n=0,e=r.length;else if(typeof e=="function")o=e,e=r.length-n;else if(typeof o!="function")throw new TypeError('"cb" argument must be a function');return c(n,r.length),h(e,n,r.length),s(r,n,e,o)}function s(r,n,e,o){if(u.process.browser){var E=r.buffer,F=new Uint8Array(E,n,e);if(i.getRandomValues(F),o){u.process.nextTick(function(){o(null,r)});return}return r}if(o){p(e,function(d,x){if(d)return o(d);x.copy(r,n),o(null,r)});return}var T=p(e);return T.copy(r,n),r}function v(r,n,e){if(typeof n>"u"&&(n=0),!w.isBuffer(r)&&!(r instanceof a.Uint8Array))throw new TypeError('"buf" argument must be a Buffer or Uint8Array');return c(n,r.length),e===void 0&&(e=r.length-n),h(e,n,r.length),s(r,n,e)}return t}export{M as r};
