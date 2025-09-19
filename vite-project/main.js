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