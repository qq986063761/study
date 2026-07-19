<template>
  <div>
    <button @click="$router.push({name: 'home'})"><h1>Home</h1></button>
    <button @click="$router.push({name: 'about'})"><h1>About</h1></button>

    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>