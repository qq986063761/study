<template>
  <div>
    <comment-input @submit="onSubmit"></comment-input>
  </div>
</template>

<script>
  export default {
    methods: {
      onSubmit({content, usrs}) {
        console.log({content, usrs})
      }
    }
  }
</script>