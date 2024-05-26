(function() {
    const dropArea = document.getElementById('dropArea');
    const input = document.getElementById('inputPost');
    const areaPlaceholder = document.getElementById('areaPlaceholder');
    const btnSend = document.getElementById('uploadPost');

    let files;
    input.addEventListener('change', (e) => {
        files = e.target.files;
        showFiles(files[0], areaPlaceholder)
    })

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('bg-zinc-900');
    })
    
    dropArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropArea.classList.remove('bg-zinc-900');
    })
    
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        files = e.dataTransfer.files;
        dropArea.classList.remove('bg-zinc-900');
        showFiles(files[0], areaPlaceholder)
    })

    btnSend.addEventListener('click', (e) => {
        e.preventDefault();
        uploadPost(files[0]);
    })
})()

function showFiles(file, areaPlaceholder) {
    const fileType = file.type;
    const validExtensions = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/x-matroska'];
    if(validExtensions.includes(fileType)){
        if(fileType.includes('video')){
            const preview = document.createElement('video');
            preview.controls = true;
            preview.autoplay = true;
            preview.classList.add('w-full', 'h-full', 'object-cover');
            const source = document.createElement('source');
            source.src = URL.createObjectURL(file);
            
            if(areaPlaceholder.parentElement.querySelector('video'))
                areaPlaceholder.parentElement.querySelector('video').remove();
            
            preview.appendChild(source);
            areaPlaceholder.parentElement.appendChild(preview)
            
        }else{
            processImage(file, 380, 380, 0.65, compressedFile => {
                const preview = document.createElement('img');
                preview.classList.add('w-full', 'h-full', 'object-cover');
                preview.src = URL.createObjectURL(compressedFile);
                if(areaPlaceholder.parentElement.querySelector('img'))
                    areaPlaceholder.parentElement.querySelector('img').remove();
                areaPlaceholder.parentElement.appendChild(preview)
            });
        }
        areaPlaceholder.classList.add('hidden');
    } else {
        Swal.fire({icon:'warning', text:'Formato no soportado'});
    }
}

function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            
            let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            callback(canvas);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function compressImage(canvas, quality, callback) {
    canvas.toBlob((blob) => {
        new Compressor(blob, {
            quality: quality,
            success(result) {
                callback(result);
            },
            error(err) {
                console.error(err.message);
            },
        });
    }, 'image/jpeg', quality);
}

// Uso combinado
function processImage(file, maxWidth, maxHeight, quality, callback) {
    resizeImage(file, maxWidth, maxHeight, (canvas) => {
        compressImage(canvas, quality, callback);
    });
}

function uploadPost(file){
    const descripcion = document.getElementById('descripcionPost');
    const data = new FormData()
    data.append('image', file)
    data.append('descripcion', descripcion.value)

    fetch("/publicar/post", {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(data => {
        alert("No se si se subio pero...", {data})
        if(data.status){
            const contador = document.getElementById("countPub")
            contador.innerText = parseInt(contador.innerText) + 1
            showNewPost(file)
        }
    })
}

function showNewPost(file){
    const preview = file.type.includes("video") ? document.createElement('video') : document.createElement('img');
    preview.src = URL.createObjectURL(file);
    preview.classList.add('w-full', 'h-full', 'object-cover');

    const contenedor = document.createElement('div');
    contenedor.appendChild(preview)
    const contenedorPosts = document.getElementById('content-posts')
    contenedorPosts.insertBefore(contenedor, contenedorPosts.firstChild)
}
