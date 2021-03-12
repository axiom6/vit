
import Util from '../../base/util/Util.js'
import Data from '../../base/util/Data.js'
import Vis  from    '../base/Vis.js'

class Tree

  constructor:( @svgMgr ) ->
    @d3  = @svgMgr.d3
    @svg = @svgMgr.svg
    @g   = @svgMgr.g
    @arrange='Radial'
    @ready()

  ready:() ->
    @graph  = @svgMgr.svg
    @w      = @svgMgr.size.w
    @h      = @svgMgr.size.h
    @r      = Math.min(@w/2,@h/2)*0.9
    @tree   = @treeArrange( @arrange )
    @tree.size([@r,@r]) # size([@w,@h])
    @tree.separation( (a,b) => ( if a.parent is b.parent then 5 else 10 ) / a.depth )
    @g.attr("transform", "translate(" + @w*0.5 + "," + @h*0.5 + ")")
    Data.asyncJSON( 'draw/Prin.json', (data) => @doRadial(data,@g) )

  treeArrange:( arrange ) ->
    switch arrange
      when 'Tree'    then @d3.tree()
      when 'Radial'  then @d3.tree()
      when 'cluster' then @d3.cluster()
      else                @d3.tree()

  doRadial:( data, g ) =>
    root = @d3.hierarchy( data )
    @tree( root )
    link = @doLinks( root, g )
    node = @doNodes( root, g )
    #node.append("svg:circle").attr("r",4.5)
    #iconNode( node ) # Clutters up overview
    @textNode( node )
    Util.noop( link )
    return

  doLinks:( root, g ) =>
    g.selectAll(".link")
      .data(root.descendants().slice(1))
      .enter().append("svg:path")
      .attr("class","link")
      .attr("stroke", 'blue' )
      .attr("fill",   "none"   )
      .attr("d", (d) => @moveTo(d) )

  doNodes:( root, g ) =>
    g.selectAll("g.node")
      .data(root.descendants())
      .enter().append("svg:g")
      .attr("class",     (d) => @nodeClass(d) )
      .attr("transform", (d) => "translate(" + @project(d.x,d.y) + ")" )

  moveTo:(d) =>
    p = d.parent
    """M#{@project(d.x,d.y)}C#{@project(d.x,(d.y+p.y)/2)} #{@project(p.x,(d.y+p.y)/2)} #{@project(p.x,p.y)}"""

  project:( x, y ) =>
    angle  = (x - 90) / 180 * Math.PI
    radius =  y
    [radius * Math.cos(angle), radius * Math.sin(angle)]

  nodeClass:( d ) =>
    if d.children? then "node--internal" else "node--leaf"

  iconNode:( node ) =>
    node.append("svg:text")
      .attr("dy", 4 )
      .attr("stroke", 'wheat')
      .attr("font-size","1.4em")
      .attr("font-family","FontAwesome")
      .attr("text-anchor","middle")
      .text( (d) => @iconUnicode(d) )
    return

  textNode:( node ) =>
    node.append("svg:text")
      .attr("dy", ".31em" )
      .attr("y", 2 )
      .attr("x",           (d) => if @isEnd180(d) then 6     else -6 )
      .attr("text-anchor", (d) => if @isEnd180(d) then "end" else "start" )
      .attr("transform",   (d) => "rotate(" + (if d.x < 180 then d.x-90 else d.x+90) + ")" )
      .attr("stroke", 'wheat')
#attr("font-size","1.0em")
      .attr("font-family","Roboto")
      .text( (d) -> d.data.name )
    return

  isEnd180:( d ) => d.x > 180

  isEnd:(    d ) => not ( d.children? and d.children.length > 0 )

  iconUnicode:( d ) =>
    icon = if d.data.icon? then d.data.icon else 'fas fa-circle'
    Vis.unicode( icon )

export default Tree
