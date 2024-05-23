window.addEventListener("DOMContentLoaded", (e)=>{
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal)=>{
        modal.addEventListener("click", (e)=>{
            const url = e.target.getAttribute("url")
            const contanier = document.createElement("div")
            contanier.classList.add("fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center")
            document.body.appendChild(contanier)
            getDinamic(url, contanier)
        })
    })
})