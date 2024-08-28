<template>
  <footer class="footer text-center">
    <span class="text-white text-sm-left d-block d-sm-inline-block">
      © 2024 Gemini Consulting & Services India Pvt Ltd
    </span>
    <span class="text-white end">
      (By BBYF)
    </span>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  /* background-color: #d7d1e2; */
  background: linear-gradient(90deg, #e19dd2, #7e64a8);
}

.end {
  text-align: end;
  font-size: 0.475em;
}
</style>