window.onload = init

function init() {
    const form = document.getElementById("form")
    form.addEventListener("submit", login)
}

async function login(e) {
    e.preventDefault()
    const form = e.target;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    payload.rememberMe = document.getElementById("remember-me").checked
    console.log(payload);

    const req = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    const res = await req.json();
    console.log(res);

    if (res.msg)
        return Swal.fire({ icon: "warning", text: res.msg })

    localStorage.setItem("token", res.token)
    window.location.href = "/perfil"
}

