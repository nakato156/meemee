let pagePosts = 2;
let isLoading = false;
(function(){
    const mainPosts = document.getElementById("mainPosts")
    const parentMainPosts = mainPosts.parentElement
    parentMainPosts.addEventListener('scroll', () => {
        if (parentMainPosts.scrollTop >= mainPosts.clientHeight - parentMainPosts.offsetHeight - 400) {
            if(!isLoading) loadPosts(mainPosts)
        }
    })
})()

function loadPosts(mainPosts){
    isLoading = true
    fetch(`/posts/suggest?page=${pagePosts}`)
    .then(response => response.json())
    .then(data => {
        isLoading = false
        if(data.length === 0) return
        pagePosts++;
        showPosts(data, mainPosts)
    })
}

function showPosts(posts, mainPosts){
    let temp = ''
    posts.forEach(post => {
        const source = post.mediaUrl.endsWith('.mp4') ? `<video src="${post.mediaUrl}" class="aspect-square object-cover" width="400"></video>` : `<img src="${post.mediaUrl}" width="400" height="400" alt="Image" class="aspect-square object-cover" />`;
        temp += `<div class="grid gap-4 mx-auto">
            <div class="border-0 pb-3" data-v0-t="card">
                <div class="space-y-1.5 p-4 flex flex-row items-center">
                    <a class="flex items-center gap-2 text-sm font-semibold" href="#">
                        <div class="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 border">
                            <img src="${post.profilePicture}" alt="Image" class="object-cover w-full h-full">
                        </div>
                        <p class="text-lg">
                        ${post.author}
                        </p>
                    </a>
                </div>
                <div class="p-0">
                    ${source}
                </div>
                <div class="items-center p-2 grid gap-2">
                    <div class="flex items-center w-full">
                        <button
                            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="w-4 h-4">
                                <path
                                    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z">
                                </path>
                            </svg>
                            <span class="sr-only">Like</span>
                        </button>
                        <button
                            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="w-4 h-4">
                                <path d="m22 2-7 20-4-9-9-4Z"></path>
                                <path d="M22 2 11 13"></path>
                            </svg>
                            <span class="sr-only">Share</span>
                        </button>
                    </div>
                    <div class="px-2 text-sm w-full grid gap-1.5">
                        <p class="text-lg">
                            ${post.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>`
    });
    const rango = document.createRange();
    const fragmento = rango.createContextualFragment(temp);
    mainPosts.appendChild(fragmento);    
}