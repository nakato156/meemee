window.onload = init

function init() {
    const form = document.getElementById("form")
    form.addEventListener("submit", createAccount)

    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');

    function populateYears() {
        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 10; i >= currentYear - 80; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }
    }

    function populateMonths() {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = month;
            monthSelect.appendChild(option);
        });
    }

    function populateDays(month) {
        daySelect.innerHTML = '';
        let days = 31;

        if ([4, 6, 9, 11].includes(month)) {
            days = 30;
        } else if (month == 2) {
            const year = parseInt(yearSelect.value);
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                days = 29;
            } else {
                days = 28;
            }
        }
        for (let i = 1; i <= days; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            daySelect.appendChild(option);
        }
    }

    yearSelect.addEventListener('change', () => populateDays(monthSelect.value));
    monthSelect.addEventListener('change', () => populateDays(monthSelect.value));

    populateYears();
    populateMonths();
    populateDays(new Date().getMonth() + 1); // Initialize days based on current month

}

async function createAccount(e) {
    e.preventDefault()
    const form = e.target;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    
    payload.rememberMe = document.getElementById("remember-me").checked
    payload.birthdate = new Date(payload.day + "/" + payload.month + "/" + payload.year)
    
    delete payload["year"]
    delete payload["month"]
    delete payload["day"]

    console.log(payload);

    const req = await fetch("/registro", {
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

