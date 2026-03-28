const canvas = document.getElementById("drawingSpace");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSizeInput = document.getElementById("brushSize");
const dayChange = document.getElementById("dayChange");
const fullscreen = document.getElementById("fullscreen");
const fullscreenIcon = document.getElementById("fullScreenIcon");
const clearbutton = document.getElementById("clearCanvas");
const addImageBtn = document.getElementById("addRandomImage");



let isDrawing = false;
let lastX = 0;
let lastY = 0;
let history = [];
let historyIndex = -1;
const maxhistory = 50;
let currentTool = "brush";
let snapshot;






const initHistory = () => {
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    historyIndex = 0;
};


const saveHistory = () => {
    history = history.slice(0, historyIndex + 1);
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (history.length > maxhistory){
        history.shift();
    }else{
        historyIndex++;
    }

    if(historyIndex >= history.length){                      /* save history for undo and redo function*/ 
        historyIndex = history.length -1;
    }
};

const applyHistory = () => {
    if(history[historyIndex]){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(history[historyIndex], 0, 0);
    }
};

const stepHistory = (direction) => {
    const newIndex = historyIndex + direction;
    if(newIndex >= 0 && newIndex < history.length){
        historyIndex = newIndex;
        applyHistory();
    }
};

const undo = () => {
    if (historyIndex > 0) {
        historyIndex--;
        applyHistory();
    }
};

const redo = () => {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        applyHistory();
    }
};

document.addEventListener("keydown", (e) => {
    const ctrlOrCmd = e.ctrlKey || e.metaKey;
    if(ctrlOrCmd && e.key.toLowerCase() === "z"){              /* ctrl z undo*/ 
        e.preventDefault();
        undo();
    }
    if(ctrlOrCmd && e.key.toLowerCase() === "x"){               /* ctrl x redo*/ 
        e.preventDefault();
        redo();
    }
});




clearbutton.addEventListener("click", () => {            /*clear all*/
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveHistory();
});

const resizeCanvas = () => {
    const imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;           /*retain drawing after resizing */
    ctx.putImageData(imageData, 0, 0);
    if (history.length === 0) initHistory();

};
window.addEventListener("resize", resizeCanvas);
resizeCanvas();




dayChange.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = dayChange.querySelector("i");
    icon.classList.toggle("fa-moon");                           /*dark mode*/
    icon.classList.toggle("fa-sun");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark-mode");
    } else {
        localStorage.removeItem("theme");
    }
});

if(localStorage.getItem("theme") === "dark-mode") {
    document.body.classList.add("dark-mode");
    const icon = dayChange.querySelector("i");
    if(icon) icon.classList.replace("fa-moon", "fa-sun");
}


const toggleFullscreen = () => {
    if(!document.fullscreenElement){
        document.body.requestFullscreen().catch((err) => alert(`Error: ${err.message}`));
    }else{
        document.exitFullscreen();
    }
}

fullscreen.addEventListener("click", toggleFullscreen);

document.addEventListener("fullscreenchange", () => {
    if (fullscreenIcon) {
        fullscreenIcon.classList.toggle("fa-expand");                /*fullscreeen button*/
        fullscreenIcon.classList.toggle("fa-compress");
    }
    resizeCanvas(); 
})


const startDrawing = (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);      /*drawing */
    ctx.beginPath();
};                                                      
                                                        
const draw = (e) => {
    if (!isDrawing) return;

    if(currentTool !== "brush" && currentTool !== "spray"){
        ctx.putImageData(snapshot, 0, 0);
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    
    
    
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSizeInput.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";


    if (currentTool === "brush") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    } 
    else if (currentTool === "spray"){

         for (let i = 0; i < 20; i++)   {
        const angle = Math.random() * Math.PI * 2;

        const radius = Math.random() * brushSizeInput.value;

        const x = e.offsetX + radius *Math.cos(angle);
        const y = e.offsetY + radius * Math.sin(angle);
        ctx.fillStyle = colorPicker.value;
        ctx.fillRect(x, y, 1.5,  1.5);
    }
    }
    else if (currentTool === "rect") {
        drawRect(e);
    }                                                             /*shapes */
    else if (currentTool === "circle") {
        drawCircle(e);
    } 
    else if (currentTool === "triangle") {
        drawTriangle(e);
    }
    
};

const drawRect = (e) => {

    ctx.strokeRect(lastX, lastY, e.offsetX - lastX, e.offsetY - lastY);
};

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((lastX - e.offsetX), 2) + Math.pow((lastY - e.offsetY), 2));
    ctx.arc(lastX, lastY, radius, 0, 2 * Math.PI);
    ctx.stroke();
};

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY); 
    ctx.lineTo(e.offsetX, e.offsetY); 
    ctx.lineTo(lastX * 2 - e.offsetX, e.offsetY); 
    ctx.closePath(); 
    ctx.stroke();
};

const stopDrawing = () => {
    isDrawing = false;
    ctx.beginPath(); 
};


const addRandomImage = () =>{
    const img = new Image();

    img.crossOrigin = "anonymous";

    img.src = `https://picsum.photos/400/400?random=${Date.now()}`;

    img.onload = () => {

        const x = (canvas.width / 2) - (img.width / 2);
        const y = (canvas.height / 2) - (img.height / 2);

        ctx.drawImage(img, x, y);              /*randomn image generator*/
        saveHistory(); 
        localStorage.setItem("savedDrawBoyCanvas", canvas.toDataURL());
    };
    img.onerror = () => {
        console.error("Failed to load random image.");
    };
};

addImageBtn.addEventListener("click", addRandomImage);

canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    startDrawing(e);
}, { passive: false });    
canvas.addEventListener("pointermove", (e) => {
    e.preventDefault();
    draw(e);

}, { passive: false });             //tell the website for draiwng what to do based on pointer actions


canvas.addEventListener("pointerup", () => {
    isDrawing = false; 
    saveHistory();
    const canvasData = canvas.toDataURL();
    localStorage.setItem("savedDrawBoyCanvas", canvasData);
});
canvas.addEventListener("pointerleave", stopDrawing);


const toolBtns = document.querySelectorAll(".tool-btn");

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".tool-btn.active").classList.remove("active");
        btn.classList.add("active");
        currentTool = btn.id; 
    });
});

const loadCanvas = () => {
    const savedData = localStorage.getItem("savedDrawBoyCanvas");
    
    if (savedData) {
        const img = new Image();
        img.src = savedData;
        img.onload = () => {                                                     
            ctx.drawImage(img, 0, 0);
        };
    }
};

window.addEventListener("load", () => {
    resizeCanvas();                              // retains drawing after refesh 
    loadCanvas();
});
