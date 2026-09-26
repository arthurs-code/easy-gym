if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  navigator.serviceWorker.register('./service-worker.js?v=322X',{updateViaCache:'none'})
    .then(registration=>registration.update())
    .catch(()=>{});
}
