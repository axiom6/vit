import { pushScopeId, popScopeId, openBlock, createBlock, Fragment, createCommentVNode, createVNode } from 'vue';

pushScopeId("data-v-34c2a192");
popScopeId();

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
let Vit = {};

const _hoisted_1 = /*#__PURE__*/createVNode("div", { msg: "Hello Vue 3 + Vite" }, null, -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(Fragment, null, [
    createCommentVNode("img alt=\"Vue Logo\" src=\"../../img/htm/logo.png\" /"),
    _hoisted_1
  ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
}

Vit.render = render;
Vit.__file = "pub/app/vit/Vit.vue";

export default Vit;
