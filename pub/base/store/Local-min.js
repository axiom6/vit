var Local,hasProp={}.hasOwnProperty;Local=class{constructor(t){this.store=t,this.tableIds={}}key(t,e){return this.store.dbName+t+e}obj(t,e){var s;return null!=(s=localStorage.getItem(this.key(t,e)))?JSON.parse(s):null}addId(t,e){return null==this.tableIds[t]&&(this.tableIds[t]=[]),this.tableIds[t].push(e)}delId(t,e){return null==this.tableIds[t]&&(this.tableIds[t]=[]),this.tableIds[t].push(e)}batch(t,e,s,l=null){var r,a;r=r=>{if(e.result=r,this.store.batchComplete(s))return null!=l?l(s):this.store.results(t,"batch",s)},a=function(){return!0},this.select(e.table,a,r)}get(t,e,s=null,l="get"){var r;null!=(r=this.obj(t,e))?null!=s?s(r):this.store.results(t,l,r,e):this.store.onerror(t,l,{error:"Local get error"},e)}add(t,e,s){this.addId(t,e),localStorage.setItem(this.key(t,e),JSON.stringify(s))}put(t,e,s){localStorage.setItem(this.key(t,e),JSON.stringify(s))}del(t,e){this.delId(t,e),localStorage.removeItem(this.key(t,e))}insert(t,e){var s,l;for(s in e)hasProp.call(e,s)&&(l=e[s],this.add(t,s,l))}select(t,e,s=null,l="select"){var r,a,o,h,i,n;for(n={},r=0,h=(o=this.tableIds[t]).length;r<h;r++)a=o[r],null!=(i=this.obj(t,a))&&e(i)&&(n[key]=i);null!=s?s(n):this.store.results(t,l,n)}update(t,e){var s,l;for(s in e)hasProp.call(e,s)&&(l=e[s],this.put(t,s,l))}remove(t,e){var s,l,r,a,o,h;for(h={},s=0,a=(r=this.tableIds[t]).length;s<a;s++)l=r[s],null!=(o=this.obj(t,l))&&e(o)&&(this.del(t,l),h[l]=o);this.store.results(t,"remove",h)}open(t){}drop(t){this.remove(t,(function(t){return!0}))}};export default Local;