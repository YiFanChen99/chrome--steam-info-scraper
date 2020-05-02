<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
chrome.extension.getBackgroundPage().console.log('Popup loaded');

export default {
  data() {
    return {
      msg: 'Welcome Steam info!'
    }
  }
}
</script>

<style lang="stylus">
</style>
