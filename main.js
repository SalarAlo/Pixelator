const inputFile = document.querySelector(".file-upload");
const pixelateButton = document.querySelector(".pixelate-btn");

const canvas = document.querySelector(".canvas");

const imageElementPixelated = document.querySelector(".pixelated-img");
const imageElementOriginal = document.querySelector(".original-img");
let imgToPixelate = null;

const handleInputFileChange = function(event){
    imgToPixelate = event.target.files[0];
    fillImageWithFile(imgToPixelate, imageElementOriginal);
}


const handlePixelateButtonClick = function() {
    if(!imgToPixelate) return;
    
};

const fillImageWithFile = function(file, imgElement){
    const fileReader = new FileReader();

    fileReader.onload = function(e) {
        imgElement.src = e.target.result;
    }

    fileReader.readAsDataURL(file);
}

inputFile.addEventListener("change", handleInputFileChange);
pixelateButton.addEventListener("click",handlePixelateButtonClick);