import{r as f,a0 as i,J as u,K as R,e as v}from"./index-af018db2.js";function d(t){const o=f(),s=f();if(i){const n=new ResizeObserver(e=>{t==null||t(e,n),e.length&&(s.value=e[0].contentRect)});u(()=>{n.disconnect()}),R(o,(e,r)=>{r&&(n.unobserve(r),s.value=void 0),e&&n.observe(e)},{flush:"post"})}return{resizeRef:o,contentRect:v(s)}}export{d as u};
