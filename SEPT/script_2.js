if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  navigator.serviceWorker.register('./service-worker.js?v=313X',{updateViaCache:'none'})
    .then(registration=>registration.update())
    .catch(()=>{});
}
