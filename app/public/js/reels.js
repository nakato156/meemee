let prevReel;
let isLoading;

(function reels() {
    const divReels = document.getElementById('reels');
    const reels = document.querySelectorAll('.reel > div');

    function getActiveReel() {
        let activeReel = null;
        const containerCenter = divReels.offsetHeight / 2;
        reels.forEach(reel => {
            const reelRect = reel.getBoundingClientRect();
            const reelCenter = (reelRect.top + reelRect.bottom) / 2;
            if (reelCenter > containerCenter - 100 && reelCenter < containerCenter + 100) {
                activeReel = reel;
            }
        });
        return activeReel;
    }

    function updateActiveReel() {
        const activeReel = getActiveReel();
        if (!prevReel) prevReel = activeReel
        if (prevReel != activeReel) {
            prevReel.querySelector('video').pause();
        }

        if (prevReel != activeReel && activeReel) {
            prevReel = activeReel
            activeReel.querySelector('video').play();

        }
    }

    divReels.addEventListener('scroll', (e) => {
        if (divReels.scrollTop >= divReels.scrollHeight - (divReels.clientHeight * 1.8)) {
            if (!isLoading) getReels(divReels);
        }
        updateActiveReel();
    })
    updateActiveReel();
    // prevReel.querySelector('video').play();
})()

function getReels(divReels) {
    isLoading = true;
    fetch('/reels/suggest')
        .then(response => response.json())
        .then(data => {
            isLoading = false;
            if (data.status) {
                showReels(data, divReels)
            }
        })
}

function showReels(data, divReels) {
    let temp = '';
    data.forEach(reel => {
        temp += `<div id="${reel._id}" class="snap-center h-screen flex flex-col items-center justify-center bg-black relative">
            <div class="md:hidden absolute pl-2 pt-2 top-0 left-0 flex text-white cursor-pointer" onclick="window.history.back()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <p class="mx-2">Volver</p>                          
            </div>    
            <video class="w-full h-full object-cover" id="${reel._id}" loop>
                <source src="${reel.url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="absolute bottom-8 right-8 flex flex-col space-y-4">
                <div class="z-50 p-3">
                    <input id="toggle-heart" type="checkbox"/>
                    <label for="toggle-heart" >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                    </label>                             
                </div>
                <button class="p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                    </svg>                              
                </button>
            </div>
        </div>`
    });
    const rango = document.createRange();
    const fragmento = rango.createContextualFragment(temp);
    divReels.appendChild(fragmento);
}