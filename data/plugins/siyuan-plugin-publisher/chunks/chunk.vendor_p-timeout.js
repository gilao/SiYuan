class E extends Error{constructor(r){super(r),this.name="TimeoutError"}}class b extends Error{constructor(r){super(),this.name="AbortError",this.message=r}}const d=e=>globalThis.DOMException===void 0?new b(e):new DOMException(e),f=e=>{const r=e.reason===void 0?d("This operation was aborted."):e.reason;return r instanceof Error?r:d(r)};function T(e,r){const{milliseconds:o,fallback:l,message:i,customTimers:u={setTimeout,clearTimeout}}=r;let a;const c=new Promise((s,n)=>{if(typeof o!="number"||Math.sign(o)!==1)throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${o}\``);if(r.signal){const{signal:t}=r;t.aborted&&n(f(t)),t.addEventListener("abort",()=>{n(f(t))})}if(o===Number.POSITIVE_INFINITY){e.then(s,n);return}const m=new E;a=u.setTimeout.call(void 0,()=>{if(l){try{s(l())}catch(t){n(t)}return}typeof e.cancel=="function"&&e.cancel(),i===!1?s():i instanceof Error?n(i):(m.message=i??`Promise timed out after ${o} milliseconds`,n(m))},o),(async()=>{try{s(await e)}catch(t){n(t)}})()}).finally(()=>{c.clear()});return c.clear=()=>{u.clearTimeout.call(void 0,a),a=void 0},c}export{T as p};
