const dayChange = document.getElementById("dayChange");
const fullscreen = document.getElementById("fullscreen");
const fullscreenIcon = document.getElementById("fullScreenIcon");
const canvas = document.getElementById("drawingSpace");
const colorPicker = document.getElementById("colorPicker");
const brushSizeInput = document.getElementById("brushsize");
const brushSizeValue = document.getElementById("brushSizeValue");
const clearbutton = document.getElementById("clearCanvas");

let isDrawing = false;
lastX = 0;
lastY = 0;

const setContextProperties = () =>{
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSizeInput.value;
    ctx.lineCap = round;
    ctx.lineJoin = round;

};

const resizeCanvas = () =>{
    const imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.putImageData(imageData, 0, 0);
    setContextProperties();

}

resizeCanvas();

const draw = (e) =>{
    if (!isDrawing) return;
    setContextProperties();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastx, lastY] = [e.offsetX, e.offsetY];

};

canvas.addEventListener("mousedown", (e) =>{
    isDrawing = true;
    [lastx, lastY] = [e.offsetX, e.offsetY];

});

canvas.addEventListener(mousemove, draw);
canvas.addEventListener(mouseup, () => (isDrawing = false));
canvas.addEventListener(mouseleave, () => (isDrawing = false));




dayChange.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = dayChange.querySelector("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");         /*the night mode button */
if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark-mode");
}else{
    localStorage.removeItem("theme");
}

});

if(localStorage.getItem("theme") === "dark-mode") {
    document.body.classList.add("dark-mode");
    dayChange.querySelector("i").classList.replace("fa-moon", "fa-sun");
}


const toggleFullscreen = () => {
    if(!document.fullscreenElement){
        document.body.requestFullscreen().catch((err) => alert(`Error: ${err.message}`));
    }else{
        document.exitFullscreen();            /*thi is the fullscreen button */
    }
}

fullscreen.addEventListener("click", toggleFullscreen);


document.addEventListener("fullscreenchange", () => {
    fullscreenIcon.classList.toggle("fa-expand");
    fullscreenIcon.classList.toggle("fa-compress");
})

