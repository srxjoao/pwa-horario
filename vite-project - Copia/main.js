window.onload = () =>{
    "use strict";
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("sw.js")
    }
}


if('serviceWorker' in navigator){
    window.addEventListener('load', async () => {
        try{
            let reg;
            reg = await navigator.serviceWorker.register('/sw.js',{type:"module"});

            console.log('Service Worker registrada 😎', reg);
        } catch(err){
            console.log('😢 Service Worker falhou', err)
        }
    });
}