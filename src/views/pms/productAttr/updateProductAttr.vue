<template>
  <product-attr-detail :is-edit='true'></product-attr-detail>
</template>

<script>
  import ProductAttrDetail from './components/ProductAttrDetail.vue'
  export default {
    name: 'updateProductAttr',
    components: { ProductAttrDetail }
  }
</script>