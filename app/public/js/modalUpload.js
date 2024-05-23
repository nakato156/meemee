(function() {
    const dropArea = document.getElementById('dropArea');
    const input = document.getElementById('inputPost');
    const preview = document.getElementById('preview');
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
    console.log(fileType)
    const validExtensions = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/x-matroska'];
    if(validExtensions.includes(fileType)){
        if(fileType.includes('video')){
            compressVideo(file, video => {
                const preview = document.createElement('video');
                preview.classList.add('w-full', 'h-full', 'object-cover');
                const source = document.createElement('source');
                source.src = URL.createObjectURL(video);
                preview.appendChild(source);
                areaPlaceholder.parentElement.appendChild(preview)
            })
        }else{
            processImage(file, 380, 380, 0.65, compressedFile => {
                const preview = document.createElement('img');
                console.log(preview)
                preview.classList.add('w-full', 'h-full', 'object-cover');
                preview.src = URL.createObjectURL(compressedFile);
                areaPlaceholder.parentElement.appendChild(preview)
            });
        }
        areaPlaceholder.classList.add('hidden');
    } else {
        Swal.fire({icon:'warning', text:'Formato no soportado'});
    }
}

async function compressVideo(file, callback) {
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });

    // Cargar ffmpeg
    await ffmpeg.load();

    // Leer el archivo y escribirlo en el sistema de archivos virtual de ffmpeg
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

    // Ejecutar el comando de compresión
    await ffmpeg.run('-i', 'input.mp4', '-vf', 'scale=640:360', '-c:v', 'libx264', '-crf', '28', 'output.mp4');

    // Leer el archivo comprimido del sistema de archivos virtual de ffmpeg
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });

    // Devolver el archivo comprimido mediante el callback
    callback(compressedBlob);
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
    const data = new FormData()
    data.append('file', file)
    fetch("/publicar/post", {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
}
