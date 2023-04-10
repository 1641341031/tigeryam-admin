<template>
  <product-attr-detail :is-edit='false'></product-attr-detail>
</template>

<script>
  import ProductAttrDetail from './components/ProductAttrDetail.vue'
  export default {
    name: 'addProductAttr',
    components: { ProductAttrDetail }
  }
</script>