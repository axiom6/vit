"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformSFCEntry = void 0;
const hash_sum_1 = __importDefault(require("hash-sum"));
const path_1 = __importDefault(require("path"));
const querystring_1 = __importDefault(require("querystring"));
const compiler_sfc_1 = require("@vue/compiler-sfc");
const descriptorCache_1 = require("./utils/descriptorCache");
const error_1 = require("./utils/error");
const script_1 = require("./script");
function transformSFCEntry(code, filename, options, sourceRoot, isProduction, isServer, filterCustomBlock, pluginContext) {
  const { descriptor, errors } = compiler_sfc_1.parse(code, {
    sourceMap: true,
    filename,
    sourceRoot,
  });
  descriptorCache_1.setDescriptor(filename, descriptor);
  if (errors.length) {
    errors.forEach((error) => pluginContext.error(error_1.createRollupError(filename, error)));
    return null;
  }
  const shortFilePath = path_1.default
    .relative(sourceRoot, filename)
    .replace(/^(\.\.[\/\\])+/, '')
    .replace(/\\/g, '/');
  const scopeId = hash_sum_1.default(isProduction ? shortFilePath + '\n' + code : shortFilePath);
  // feature information
  const hasScoped = descriptor.styles.some((s) => s.scoped);
  const isTemplateInlined = descriptor.scriptSetup && !(descriptor.template && descriptor.template.src);
  const hasTemplateImport = descriptor.template && !isTemplateInlined;
  const templateImport = hasTemplateImport
    ? genTemplateCode(descriptor, scopeId, isServer)
    : '';
  const renderReplace = hasTemplateImport
    ? isServer
      ? `script.ssrRender = ssrRender`
      : `script.render = render`
    : '';
  const scriptImport = genScriptCode(descriptor, scopeId, isProduction, isServer, options, pluginContext);
  const stylesCode = genStyleCode(descriptor, scopeId, options.preprocessStyles);
  const customBlocksCode = getCustomBlock(descriptor, filterCustomBlock);
  const output = [
    scriptImport,
    templateImport,
    stylesCode,
    customBlocksCode,
    renderReplace,
  ];
  if (hasScoped) {
    output.push(`script.__scopeId = ${JSON.stringify(`data-v-${scopeId}`)}`);
  }
  if (!isProduction) {
    output.push(`script.__file = ${JSON.stringify(shortFilePath)}`);
  }
  else if (options.exposeFilename) {
    output.push(`script.__file = ${JSON.stringify(path_1.default.basename(shortFilePath))}`);
  }
  output.push('export default script');
  return {
    code: output.join('\n'),
    map: {
      mappings: '',
    },
  };
}
exports.transformSFCEntry = transformSFCEntry;
function genTemplateCode(descriptor, id, isServer) {
  const renderFnName = isServer ? 'ssrRender' : 'render';
  let templateImport = `const ${renderFnName} = () => {}`;
  let templateRequest;
  if (descriptor.template) {
    const src = descriptor.template.src || descriptor.filename;
    const idQuery = `&id=${id}`;
    const srcQuery = descriptor.template.src ? `&src` : ``;
    const attrsQuery = attrsToQuery(descriptor.template.attrs, 'js', true);
    const query = `?vue&type=template${idQuery}${srcQuery}${attrsQuery}`;
    templateRequest = JSON.stringify(src + query);
    templateImport = `import { ${renderFnName} } from ${templateRequest}`;
  }
  return templateImport;
}
function genScriptCode(descriptor, scopeId, isProd, isServer, options, pluginContext) {
  let scriptImport = `const script = {}`;
  const script = script_1.resolveScript(descriptor, scopeId, isProd, isServer, options, pluginContext);
  if (script) {
    const src = script.src || descriptor.filename;
    const attrsQuery = attrsToQuery(script.attrs, 'js');
    const srcQuery = script.src ? `&src` : ``;
    const query = `?vue&type=script${srcQuery}${attrsQuery}`;
    const scriptRequest = JSON.stringify(src + query);
    scriptImport =
      `import script from ${scriptRequest}\n` + `export * from ${scriptRequest}`; // support named exports
  }
  return scriptImport;
}
function genStyleCode(descriptor, scopeId, preprocessStyles) {
  let stylesCode = ``;
  let hasCSSModules = false;
  if (descriptor.styles.length) {
    descriptor.styles.forEach((style, i) => {
      const src = style.src || descriptor.filename;
      // do not include module in default query, since we use it to indicate
      // that the module needs to export the modules json
      const attrsQuery = attrsToQuery(style.attrs, 'css', preprocessStyles);
      const attrsQueryWithoutModule = attrsQuery.replace(/&module(=true|=[^&]+)?/, '');
      // make sure to only pass id when necessary so that we don't inject
      // duplicate tags when multiple components import the same css file
      const idQuery = `&id=${scopeId}`;
      const srcQuery = style.src ? `&src` : ``;
      const query = `?vue&type=style&index=${i}${srcQuery}${idQuery}`;
      const styleRequest = src + query + attrsQuery;
      const styleRequestWithoutModule = src + query + attrsQueryWithoutModule;
      if (style.module) {
        if (!hasCSSModules) {
          stylesCode += `\nconst cssModules = script.__cssModules = {}`;
          hasCSSModules = true;
        }
        stylesCode += genCSSModulesCode(i, styleRequest, styleRequestWithoutModule, style.module);
      }
      else {
        stylesCode += `\nimport ${JSON.stringify(styleRequest)}`;
      }
      // TODO SSR critical CSS collection
    });
  }
  return stylesCode;
}
function getCustomBlock(descriptor, filter) {
  let code = '';
  descriptor.customBlocks.forEach((block, index) => {
    if (filter(block.type)) {
      const src = block.src || descriptor.filename;
      const attrsQuery = attrsToQuery(block.attrs, block.type);
      const srcQuery = block.src ? `&src` : ``;
      const query = `?vue&type=${block.type}&index=${index}${srcQuery}${attrsQuery}`;
      const request = JSON.stringify(src + query);
      code += `import block${index} from ${request}\n`;
      code += `if (typeof block${index} === 'function') block${index}(script)\n`;
    }
  });
  return code;
}
function genCSSModulesCode(index, request, requestWithoutModule, moduleName) {
  const styleVar = `style${index}`;
  let code =
    // first import the CSS for extraction
    `\nimport ${JSON.stringify(requestWithoutModule)}` +
    // then import the json file to expose to component...
    `\nimport ${styleVar} from ${JSON.stringify(request + '.js')}`;
  // inject variable
  const name = typeof moduleName === 'string' ? moduleName : '$style';
  code += `\ncssModules["${name}"] = ${styleVar}`;
  return code;
}
// these are built-in query parameters so should be ignored
// if the user happen to add them as attrs
const ignoreList = ['id', 'index', 'src', 'type', 'lang'];
function attrsToQuery(attrs, langFallback, forceLangFallback = false) {
  let query = ``;
  for (const name in attrs) {
    const value = attrs[name];
    if (!ignoreList.includes(name)) {
      query += `&${querystring_1.default.escape(name)}${value ? `=${querystring_1.default.escape(String(value))}` : ``}`;
    }
  }
  if (langFallback || attrs.lang) {
    query +=
      `lang` in attrs
        ? forceLangFallback
        ? `&lang.${langFallback}`
        : `&lang.${attrs.lang}`
        : `&lang.${langFallback}`;
  }
  return query;
}
