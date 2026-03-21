const loadCanvas = () => {
    const savedData = localStorage.getItem("savedDrawBoyCanvas");
    if (savedData) {
        const img = new Image(); 
        img.src = savedData;     
        img.onload = () => {     
            ctx.drawImage(img, 0, 0);
        };
    }
}


const toolBtns = document.querySelectorAll(".tool-btn");

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        
        document.querySelector(".tool-btn.active").classList.remove("active");
        
        btn.classList.add("active");
        
        currentTool = btn.id; 
    });
});


const dayChange = document.getElementById("dayChange");

dayChange.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = dayChange.querySelector ("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun"); 


    if(document.body.classList.contains("dark-mode")){
        localStorage.setItem("theme", "dark-mode");
    }else{
        localStorage.removeItem("theme");
    }
});

const fullscreen = document.getElementById("fullscreen");
const toggleFullscreen = () => {
    if(!document.fullscreenElement){
        document.body.requestFullscreen().catch((err) => alert(`Error: ${err.message}`));
    }else{
        document.exitFullscreen();
    }
}
fullscreen.addEventListener("click", toggleFullscreen)  ;

const canvas= document.getElementById("drawingSpace");
const colorPicker = document.getElementById("colorPicker");
const ctx = canvas.getContext("2d");
const brushSize =document.getElementById("brushSize");
const brushSizevalue = document.getElementById("brushSizeValue");
const clearCanvas = document.getElementById("clearCanvas");

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = "brush"; 
let snapshot; 

const setContextproperties = () => {
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.lineJoin ="round";


};

const resizeCanvvas = () =>{
    const imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.putImageData(imageData, 0, 0);
    setContextproperties();
};



const draw = (e) => {
    if (!isDrawing) return;
    if (currentTool !== "brush") {
        ctx.putImageData(snapshot, 0, 0);
    }
    setContextproperties();

    if (currentTool === "brush") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

    } else if (currentTool === "rect") {
        const width = e.offsetX - lastX;
        const height = e.offsetY - lastY;
        ctx.strokeRect(lastX, lastY, width, height);

    } else if (currentTool === "circle") {
        ctx.beginPath();
        let radius = Math.sqrt(Math.pow((lastX - e.offsetX), 2) + Math.pow((lastY - e.offsetY), 2));
        ctx.arc(lastX, lastY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }else if (currentTool === "triangle"){
        ctx.beginPath();
        ctx.moveTo(lastX, lastY); 
        ctx.lineTo(e.offsetX, e.offsetY); 
        ctx.lineTo(lastX * 2 - e.offsetX, e.offsetY); 
        ctx.closePath(); 
        ctx.stroke();
    }
}

canvas.addEventListener("mousedown", (e) =>{
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.beginPath(); 
    ctx.moveTo(lastX, lastY);
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
localStorage.setItem("savedDrawBoyCanvas", canvas.toDataURL());
});

canvas.addEventListener("mouseleave", () => (isDrawing = false));
   