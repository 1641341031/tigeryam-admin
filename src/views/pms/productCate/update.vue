<template> 
  <product-cate-detail :is-edit='true'></product-cate-detail>
</template>
<script>
  import ProductCateDetail from './components/ProductCateDetail.vue'
  export default {
    name: 'updateProductCate',
    components: { ProductCateDetail }
  }
</script>