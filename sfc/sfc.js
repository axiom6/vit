
const compile = require( "./compileSFC.js" );

function sfc() {
  console.log( 'begin sfc' );
  compile( 'Area.vue' ); };

sfc();

module.exports = sfc;
