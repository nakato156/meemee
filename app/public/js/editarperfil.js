window.addEventListener("DOMContentLoaded", initEdit)

function initEdit() {
    const contChars = document.getElementById("cont")
    const bio = document.getElementById("bio")
    const form = document.getElementById("updateInfo")
    const previewImg = document.getElementById("previewImg")

    function initListeners() {
        form.addEventListener("submit", updateInfo)
        bio.addEventListener("input", (e) => updateContChars(e.target, contChars))

    }

    updateContChars(bio, contChars)
    initListeners()


    function updateContChars(el, contChars) {
        const len = el.value.length
        if (len > 150) el.value = el.value.substring(0, 150)
        contChars.innerHTML = el.value.length
    }

    function updateInfo(e) {
        e.preventDefault()
        const form = e.target

        const data = new FormData(form)
        data.forEach((value, key) => console.log(key, value))

        fetch("/perfil/editar", {
            method: "POST",
            body: data
        })
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                previewImg.src = data.link
            }
        })
    }
}