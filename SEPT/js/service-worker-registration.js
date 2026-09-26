if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  navigator.serviceWorker.register('./service-worker.js?v=321X',{updateViaCache:'none'})
    .then(registration=>registration.update())
    .catch(()=>{});
}
