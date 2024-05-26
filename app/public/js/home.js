window.addEventListener("DOMContentLoaded", initHome)

function initHome(){
    const mainContainer = document.getElementById("main")
    getDinamic('/posts', mainContainer)
}