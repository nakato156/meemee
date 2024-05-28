window.addEventListener("DOMContentLoaded", (e)=>{
    if(!window.modals){
        window.modals = {
            cache: {}
        }
    }
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal)=>{
        modal.addEventListener("click", (e)=>{
            const element = e.target.closest("[url]")
            const url = element.getAttribute("url")
            getModal(url)
        })
    })
})

function randomID(longitud) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < longitud; i++) {
        id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return id;
}

function getModal(url){
    if(window.modals && window.modals.cache[url]){
        const id = window.modals.cache[url]
        const modal = document.getElementById(id)
        modal.classList.remove("hidden")
    }
    else {
        fetchModal(url)
    }
}

function fetchModal(url){
    const container = document.createElement("div")
    container.classList.add("fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center")
    container.id = '_dinamic'+ randomID(10)
    container.addEventListener("click", (e)=>{
        e.stopPropagation()
        if(e.target.id == container.id){
            container.classList.add("hidden")
        }
    })
    document.body.appendChild(container)
    getDinamic(url, container)
    window.modals.cache[url] = container.id
}