import{r as $}from"./chunk.vendor_vite-plugin-node-polyfills.js";import{r as D}from"./chunk.vendor_inherits.js";import{r as M}from"./chunk.vendor_hash-base.js";var L,A;function F(){if(A)return L;A=1;var E=$.Buffer,z=D(),R=M(),H=new Array(16),b=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],x=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],p=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],k=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11],w=[0,1518500249,1859775393,2400959708,2840853838],I=[1352829926,1548603684,1836072691,2053994217,0];function m(){R.call(this,64),this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520}z(m,R),m.prototype._update=function(){for(var r=H,s=0;s<16;++s)r[s]=this._block.readInt32LE(s*4);for(var f=this._a|0,e=this._b|0,a=this._c|0,i=this._d|0,h=this._e|0,_=this._a|0,n=this._b|0,o=this._c|0,c=this._d|0,l=this._e|0,t=0;t<80;t+=1){var v,d;t<16?(v=q(f,e,a,i,h,r[b[t]],w[0],p[t]),d=y(_,n,o,c,l,r[x[t]],I[0],k[t])):t<32?(v=O(f,e,a,i,h,r[b[t]],w[1],p[t]),d=g(_,n,o,c,l,r[x[t]],I[1],k[t])):t<48?(v=B(f,e,a,i,h,r[b[t]],w[2],p[t]),d=B(_,n,o,c,l,r[x[t]],I[2],k[t])):t<64?(v=g(f,e,a,i,h,r[b[t]],w[3],p[t]),d=O(_,n,o,c,l,r[x[t]],I[3],k[t])):(v=y(f,e,a,i,h,r[b[t]],w[4],p[t]),d=q(_,n,o,c,l,r[x[t]],I[4],k[t])),f=h,h=i,i=u(a,10),a=e,e=v,_=l,l=c,c=u(o,10),o=n,n=d}var U=this._b+a+c|0;this._b=this._c+i+l|0,this._c=this._d+h+_|0,this._d=this._e+f+n|0,this._e=this._a+e+o|0,this._a=U},m.prototype._digest=function(){this._block[this._blockOffset++]=128,this._blockOffset>56&&(this._block.fill(0,this._blockOffset,64),this._update(),this._blockOffset=0),this._block.fill(0,this._blockOffset,56),this._block.writeUInt32LE(this._length[0],56),this._block.writeUInt32LE(this._length[1],60),this._update();var r=E.alloc?E.alloc(20):new E(20);return r.writeInt32LE(this._a,0),r.writeInt32LE(this._b,4),r.writeInt32LE(this._c,8),r.writeInt32LE(this._d,12),r.writeInt32LE(this._e,16),r};function u(r,s){return r<<s|r>>>32-s}function q(r,s,f,e,a,i,h,_){return u(r+(s^f^e)+i+h|0,_)+a|0}function O(r,s,f,e,a,i,h,_){return u(r+(s&f|~s&e)+i+h|0,_)+a|0}function B(r,s,f,e,a,i,h,_){return u(r+((s|~f)^e)+i+h|0,_)+a|0}function g(r,s,f,e,a,i,h,_){return u(r+(s&e|f&~e)+i+h|0,_)+a|0}function y(r,s,f,e,a,i,h,_){return u(r+(s^(f|~e))+i+h|0,_)+a|0}return L=m,L}export{F as r};
