const inputFile = document.querySelector(".file-upload");
const pixelateButton = document.querySelector(".pixelate-btn");

const canvas = document.querySelector(".canvas");

const imageElementOriginal = document.querySelector(".original-img");
let imgSrcFile = null;

const PIXELATED_STRENGTH = 5;

imageElementOriginal.onload = () =>  {
    canvas.width = imageElementOriginal.width;
    canvas.height = imageElementOriginal.height;
}

const handlePixelateButtonClick = function() {
    if(!imgSrcFile) return;

    GetSrcOfImageFile(imgSrcFile, (src) => {
        drawPixelatedImage(src, PIXELATED_STRENGTH);
    });
};

function transformImageData(imageData, size) {
    const chunks = [];
    const width = imageData.width;
    const height = imageData.height;

    for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
            const chunk = [];
            
            // Iterate over the current chunk of pixels
            for (let j = y; j < y + size && j < height; j++) {
                for (let i = x; i < x + size && i < width; i++) {
                    const index = (j * width + i) * 4; // Calculate index in imageData array
                    const pixel = {
                        r: imageData.data[index],
                        g: imageData.data[index + 1],
                        b: imageData.data[index + 2],
                        a: imageData.data[index + 3]
                    };
                    chunk.push(pixel);
                }
            }
            
            // Calculate chunk coordinates
            const chunkData = {
                x: x,
                y: y,
                pixels: chunk
            };

            chunks.push(chunkData);
        }
    }

    return chunks;
}



const drawPixelatedImage = function(img, pixelSize){
    const imgElement = new Image();
    imgElement.onload = function () {
        const canvasContext = canvas.getContext("2d");
        canvas.height = imageElementOriginal.height;
        canvas.width = imageElementOriginal.width;
        canvasContext.drawImage(imgElement, 0, 0, imageElementOriginal.width, imageElementOriginal.height);
        
        const wholeCanvasColorData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const canvasColorDataFormatted = transformImageData(wholeCanvasColorData, pixelSize);
        const newCanvasColorData = [];

        for(const chunk of canvasColorDataFormatted){
            const averageRgbOfChunk = {
                x: chunk.x,
                y: chunk.y,
                r: 0,
                g: 0,
                b: 0,
            }
            
            for(const pixel of chunk.pixels) {
                averageRgbOfChunk.r += pixel.r;
                averageRgbOfChunk.g += pixel.g;
                averageRgbOfChunk.b += pixel.b;
            }

            averageRgbOfChunk.r /= pixelSize*pixelSize;
            averageRgbOfChunk.g /= pixelSize*pixelSize;
            averageRgbOfChunk.b /= pixelSize*pixelSize;

            newCanvasColorData.push(averageRgbOfChunk);
        }

        for(const averageChunk of newCanvasColorData) {
            canvasContext.fillStyle = `rgb(${averageChunk.r}, ${averageChunk.g}, ${averageChunk.b})`;
            canvasContext.fillRect(averageChunk.x, averageChunk.y, pixelSize, pixelSize);
        }
    };

    imgElement.src = img;
}

const handleInputFileChange = function(event){
    imgSrcFile = event.target.files[0];
    if (!imgSrcFile) return;

    const onImageFilled = (src) => {
        imageElementOriginal.src = src;
    };

    // Pass the file object and the image element to fillImageWithFile
    GetSrcOfImageFile(imgSrcFile, onImageFilled);
}

const GetSrcOfImageFile = function(file, onFinished){
    const fileReader = new FileReader();

    fileReader.onload = function(e) {
        onFinished?.(e.target.result);
    };

    fileReader.readAsDataURL(file); // Read the file as a data URL
}


inputFile.addEventListener("change", handleInputFileChange);
pixelateButton.addEventListener("click",handlePixelateButtonClick);