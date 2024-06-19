const inputFile = document.querySelector(".file-upload");
const pixelateButton = document.querySelector(".pixelate-btn");

const canvas = document.querySelector(".canvas");

const imageElementOriginal = document.querySelector(".original-img");
let imgToPixelate = null;

class Range {
    constructor(min, max){
        this.max = max;
        this.min = min;
    }
}

const handleInputFileChange = function(event){
    imgToPixelate = event.target.files[0];
    if(!imgToPixelate) return;
    const onImageFilled = () => {
        canvas.width = imageElementOriginal.width;
        canvas.height = imageElementOriginal.height;
    }
    fillImageWithFile(imgToPixelate, imageElementOriginal, onImageFilled);
}


const handlePixelateButtonClick = function() {
    if(!imgToPixelate) return;
    
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

            chunks.push(chunk);
        }
    }

    return chunks;
}


const drawPixelatedImage = function(img, pixelSize){
    const imgElement = new Image();
    imgElement.onload(function () {
        const canvasContext = canvas.getContext("2d");
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;

        canvasContext.drawImage(imgElement);
        
        const wholeCanvasColorData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const canvasColorDataFormatted = transformImageData(wholeCanvasColorData);
        const newCanvasColorData = [];

        for(const chunk of canvasColorDataFormatted){
            const averageRgbOfChunk = {
                r: 0,
                g: 0,
                b: 0,
            }
            for(const pixel in chunk) {
                averageRgbOfChunk.r += pixel.r;
                averageRgbOfChunk.g += pixel.g;
                averageRgbOfChunk.b += pixel.b;
            }

            averageRgbOfChunk.r /= pixelSize;
            averageRgbOfChunk.g /= pixelSize;
            averageRgbOfChunk.b /= pixelSize;

            newCanvasColorData.push(averageRgbOfChunk);
        }

        

    });
    imgElement.src = img;
}

const fillImageWithFile = function(file, imgElement, onFinished){
    const fileReader = new FileReader();

    fileReader.onload = function(e) {
        imgElement.src = e.target.result;
        onFinished?.();
    }

    fileReader.readAsDataURL(file);
}

inputFile.addEventListener("change", handleInputFileChange);
pixelateButton.addEventListener("click",handlePixelateButtonClick);