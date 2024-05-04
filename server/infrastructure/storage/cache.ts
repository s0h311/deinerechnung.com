export default defineNitroPlugin(() => {
  const cache = useStorage()

  cache.mount('cache')
})
