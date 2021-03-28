
const {parse,compileTemplate,compileScript,compileStyle} = require( '@vue/compiler-sfc' );
const fs      = require("fs");
const path    = require("path");
const reader  = name => fs.readFileSync(path.resolve(__dirname, name), "utf-8");
const VUE_DIR = path.resolve(__dirname, "vue");
const PUB_DIR = path.resolve(__dirname, "pub/vue");

// compile a vue file from `vue dir` to `result dir`
function compileSFC( filename ) {
  const result  = compileVuetoJS( filename );
  const resolve = path.resolve(PUB_DIR, filename.replace(/\.vue$/, ".js"));
  fs.writeFileSync( resolve, result.descriptor.source );
}

function compileVuetoJS( filename ) {
  const resolve   = path.resolve( VUE_DIR, filename );
  const code      = reader(resolve);
  const parseOpts = { sourceMap:true, filename:filename, sourceRoot:"" }
  const parsed    = parse( code, parseOpts );
  console.log( "compileSFC parsed", parsed );
  // if( parsed.errors!=[] ) {
  //   console.log( "compileSFC parse errors", parsed.errors ); }
  const templateOpts = { source:parsed.descriptor.template.content,  filename:filename, id:'xxxx' };
  const scriptedOpts = {  id:'xxxx' };
  const styledOpts   = { source:parsed.descriptor.styles[0].content, filename:filename, id:'xxxx' };
  const templated = compileTemplate( templateOpts );
  const scripted  = compileScript(   parsed.descriptor, scriptedOpts );
  //nst styled    = compileStyle(    styledOpts );
  console.log( "compileSFC result", { templated:templated, scripted:scripted } );
  return  parsed; // sfcDesc.source;
}

module.exports = compileSFC;

/*
export interface SFCDescriptor {
  filename: string
  source: string
  template: SFCTemplateBlock | null
  script: SFCScriptBlock | null
  scriptSetup: SFCScriptBlock | null
  styles: SFCStyleBlock[]
  customBlocks: SFCBlock[]
  cssVars: string[]
  // whether the SFC uses :slotted() modifier.
  // this is used as a compiler optimization hint.
  slotted: boolean
}
 */