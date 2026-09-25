if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  navigator.serviceWorker.register('./service-worker.js?v=319X',{updateViaCache:'none'})
    .then(registration=>registration.update())
    .catch(()=>{});
}
