function getDinamic(url, container){
    fetch(url)
    .then(response => response.text())
    .then(html => {
        renderHTML(html, container);
    })
    .catch(error => {
        console.error('Error al cargar la plantilla HTML:', error);
    });
}

function renderHTML(html, container) {
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;

    const scripts = tempContainer.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.text = script.textContent;
        newScript.src = script.src;
        
        Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
        });
        
        script.parentNode.removeChild(script);

        document.body.appendChild(newScript);
    });

    container.innerHTML = tempContainer.innerHTML;
}