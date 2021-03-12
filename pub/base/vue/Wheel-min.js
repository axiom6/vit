var Wheel;import Data from"../../base/util/Data.js";Wheel=class{constructor(t,i){this.publish=this.publish.bind(this),this.adjustRadius=this.adjustRadius.bind(this),this.xc=this.xc.bind(this),this.yc=this.yc.bind(this),this.isParentOf=this.isParentOf.bind(this),this.fill=this.fill.bind(this),this.doText=this.doText.bind(this),this.onEvent=this.onEvent.bind(this),this.fontSize=this.fontSize.bind(this),this.doChoiceResize=this.doChoiceResize.bind(this),this.textTransform=this.textTransform.bind(this),this.displayAllLeaves=this.displayAllLeaves.bind(this),this.zoomTween=this.zoomTween.bind(this),this.svgMgr=t,this.onChoice=i,this.svg=this.svgMgr.svg,this.g=this.svgMgr.g,this.d3=this.svgMgr.d3,this.name=this.svgMgr.name,this.width=this.svgMgr.size.w,this.height=this.svgMgr.size.h,this.opacity=1,this.showAllLeaves=!1,this.radiusFactorChoice=1.3,this.radiusFactorChild=1,this.url=Data.toUrl("jitter/Flavor.json"),this.ready()}publish(t,i,s){var e;e={name:"Wheel",op:t?"AddChoice":"DelChoice",flavor:i,roast:s},console.log("Choice",e)}ready(){var t,i;this.json={},this.radius=1*Math.min(this.width,this.height)/2,this.xx=this.d3.scaleLinear().range([0,2*Math.PI]),this.yy=this.d3.scalePow().exponent(1.4).domain([0,1]).range([0,this.radius]),this.padding=0,this.duration=300,this.lookup={},t=this.width/2,i=this.height/2,this.g=this.svg.append("g").attr("transform",`translate(${t},${i}) scale(1,1)`),this.g.append("text").text("Flavor").attr("x",-32).attr("y",12).style("fill","black").style("font-size","3vmin"),this.partition=this.d3.partition(),this.arc=this.d3.arc().startAngle(t=>Math.max(0,Math.min(2*Math.PI,this.xx(this.x0(t))))).endAngle(t=>Math.max(0,Math.min(2*Math.PI,this.xx(this.x1(t))))).innerRadius(t=>Math.max(0,this.yy(this.y0(t)))).outerRadius(t=>Math.max(0,this.yy(this.y1(t)))),this.d3.json(this.url).then(t=>(this.json=t,this.root=this.d3.hierarchy(t),this.root.sum(t=>(t.chosen=!1,t.hide=this.isLeaf(t),this.isBranch(t)?0:1)),this.nodes=this.partition(this.root).descendants(),this.adjustRadius(this.root),this.path=this.g.selectAll("path").data(this.nodes).enter().append("path").attr("id",(function(t,i){return"path-"+i})).attr("d",this.arc).attr("fill-rule","evenodd").style("fill",t=>this.fill(t)).style("opacity",this.opacity).style("stroke","black").style("stroke-width","2").style("display",(function(t){return t.data.hide?"none":"block"})).on("click",t=>this.onEvent(t,"click")).on("mouseover",t=>this.onEvent(t,"mouseover")).on("mouseout",t=>this.onEvent(t,"mouseout")),this.doText(this.nodes))),this.d3.select(self.frameElement).style("height",this.height+"px")}adjustRadius(t){var i,s;this.lookup[t.data.name]=t,s=null!=t.data.scale?t.data.scale:null==t.children?.8:1,i=(t.y1-t.y0)*s,null!=t.parent&&(t.y0=t.parent.y1),t.y1=t.y0+i,null!=t.children&&t.children.forEach(t=>this.adjustRadius(t))}x0(t){return null!=t.m0?t.m0:t.x0}x1(t){return null!=t.m1?t.m1:t.x1}y0(t){return null!=t.n0?t.n0:t.y0}y1(t){return null!=t.n1?t.n1:t.y1}xc(t){return(this.x0(t)+this.x1(t))/2}yc(t){return(this.y0(t)+this.y1(t))/2}sameNode(t,i){return(null!=t?t.data.name:void 0)===(null!=i?i.data.name:void 0)}inBranch(t,i){var s,e,n,h;if((null!=t?t.data.name:void 0)===(null!=i?i.data.name:void 0))return!0;if(null!=t.children)for(e=0,n=(h=null!=t?t.children:void 0).length;e<n;e++)if((null!=(s=h[e])?s.data.name:void 0)===(null!=i?i.data.name:void 0))return!0;return!1}isBranch(t){return null!=t.children}isLeaf(t){return null==t.children}isParentOf(t,i){return t===i||!!t.children&&t.children.some(t=>this.isParentOf(t,i))}fill(t){var i,s,e;return null!=t.data.fill&&null!=t.children?t.data.fill:null!=t.data.fill&&null==t.children&&null!=t.parent&&null!=t.parent.data.fill?t.parent.data.fill:null!=t.children?(e=t.children.map(this.fill),i=this.d3.hsl(e[0]),s=this.d3.hsl(e[1]),this.d3.hsl((i.h+s.h)/2,1.2*i.s,i.l/1.2)):"#666666"}doText(t){var i,s;this.text=this.g.selectAll("text").data(t),this.textEnter=this.text.enter().append("text").on("click",t=>this.onEvent(t,"click")).on("mouseover",t=>this.onEvent(t,"mouseover")).on("mouseout",t=>this.onEvent(t,"mouseout")).style("font-size",t=>this.fontSize(t)).style("opacity",1).style("fill","#000000").style("font-weight",900).style("display",(function(t){return t.data.hide?"none":"block"})).attr("text-anchor",t=>this.xx(this.xc(t))>Math.PI?"end":"start").attr("dy",".2em").attr("transform",t=>this.textTransform(t)),i=t=>180*this.xx(this.xc(t))/Math.PI,s=function(t){return i(t)<=180?"0.7em":"-0.7em"},this.textEnter.append("tspan").attr("x",(function(t){return s(t)})).text((function(t){return t.depth?t.data.name.split(" ")[0]:""})),this.textEnter.append("tspan").attr("x",(function(t){return s(t)})).attr("dy","1em").text((function(t){return null!=t.depth&&null!=t.data.name&&t.data.name.split(" ")[1]||""}))}onEvent(t,i){var s,e,n,h;"click"===i&&null==t.parent&&this.displayAllLeaves(),null!=t.data.can&&(e=t.y0,n=t.y0+(t.y1-t.y0)*this.radiusFactorChoice,h=this.doChoiceResize(t,i,t.x0,e,t.x1,n),s=h?n:t.y1,null!=t.children&&t.children.forEach(t=>{var i;return null!=t&&(t.data.hide=h),i=s+(t.y1-t.y0)*this.radiusFactorChild,this.resizeElem(t,h,t.x0,s,t.x1,i)}),this.g.selectAll("path").data(this.nodes).filter(i=>this.inBranch(t,i)).transition().duration(this.duration).style("display",(function(t){return t.data.hide?"none":"block"})).attr("d",this.arc),this.g.selectAll("text").data(this.nodes).filter(i=>this.inBranch(t,i)).transition().duration(this.duration).attr("transform",t=>this.textTransform(t)).style("font-size",i=>this.fontSize(i,t)).style("display",(function(t){return t.data.hide?"none":"block"})))}fontSize(t,i=null){return null!=i&&this.sameNode(t,i)&&null!=t.m0?"1.1rem":null!=t.children?"1.0rem":"0.9rem"}doChoiceResize(t,i,s,e,n,h){var a;return a=!0,"click"===i?(t.chosen=!t.chosen,this.resizeElem(t,t.chosen,s,e,n,h),this.onChoice(t.data.name,this.getRoastValue(t.data.name)),a=t.chosen):"AddChoice"===i||"DelChoice"===i?(t.chosen="AddChoice"===i,this.resizeElem(t,t.chosen,s,e,n,h),a=t.chosen):t.chosen||"mouseover"!==i&&"mouseout"!==i||(a="mouseover"===i,this.resizeElem(t,a,s,e,n,h)),a}resizeElem(t,i,s,e,n,h){i?(t.m0=s,t.m1=n,t.n0=e,t.n1=h,t.data.hide=!1):(t.m0=void 0,t.m1=void 0,t.n0=void 0,t.n1=void 0,t.data.hide=null==t.data.children&&!this.showAllLeaves)}textTransform(t){var i,s;return s=(t.data.name||"").split(" ").length>1,"rotate("+((i=180*this.xx(this.xc(t))/Math.PI-90)+(s?-.5:0))+")translate("+this.yy(this.y0(t))+this.padding+")rotate("+(i>90?-180:0)+")"}displayAllLeaves(){this.showAllLeaves=!this.showAllLeaves,this.g.selectAll("path").style("display",t=>!this.isLeaf(t)||this.showAllLeaves||t.parent.chosen?"block":"none"),this.g.selectAll("text").style("display",t=>!this.isLeaf(t)||this.showAllLeaves||t.parent.chosen?"block":"none")}zoomTween(t){this.svg.transition().duration(this.duration).tween("scale",()=>{var i,s,e;return i=this.d3.interpolate(this.xx.domain(),[this.x0(t),this.x1(t)]),s=this.d3.interpolate(this.yy.domain(),[this.y0(t),1]),e=this.d3.interpolate(this.yy.range(),[null!=t.y0?20:0,this.radius]),t=>(this.xx.domain(i(t)),this.yy.domain(s(t)).range(e(t)))}).selectAll("path").attrTween("d",t=>()=>this.arc(t))}getFlavor(t,i,s){var e,n,h,a,l;if(null!=t.children)for(h=0,a=(l=t.children).length;h<a;h++){if(s(n=l[h]))return n;if(null!=(e=this.getFlavor(n,i,s)))return e}return null}getRoastValue(t){var i,s;return s=function(i){return i.name===t},null!=(i=this.getFlavor(this.json,t,s))?.5*(i.roast[0]+i.roast[1]):-1}getFlavorName(t){var i,s;return s=function(i){return null!=i.roast&&i.roast[0]<=t&&t<=i.roast[1]},i=this.getFlavor(this.json,t,s),console.log("Wheel.getFlavorName()",{roast:t,flavor:i}),i?i.name:""}};export default Wheel;