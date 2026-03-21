// --- 1. INITIALIZE CANVAS (New) ---
const canvas = document.getElementById("drawingSpace");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSizeInput = document.getElementById("brushSize");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set initial canvas size
const resizeCanvas = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
};
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// --- YOUR EXISTING THEME LOGIC (Unchanged) ---
const dayChange = document.getElementById("dayChange");
const fullscreen = document.getElementById("fullscreen");
const fullscreenIcon = document.getElementById("fullScreenIcon");

dayChange.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = dayChange.querySelector("i");
    icon.classList.toggle("fa-moon");
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

// --- YOUR EXISTING FULLSCREEN LOGIC (Unchanged) ---
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
        fullscreenIcon.classList.toggle("fa-expand");
        fullscreenIcon.classList.toggle("fa-compress");
    }
    resizeCanvas(); // Ensure canvas fits new screen size
})

// --- 2. DRAWING FUNCTIONALITY (New) ---
const startDrawing = (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
};

const draw = (e) => {
    if (!isDrawing) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    
    // Styling
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSizeInput.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
};

const stopDrawing = () => {
    isDrawing = false;
    ctx.beginPath(); // Reset path so next line doesn't connect
};

// Event Listeners for the Canvas
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

clearbutton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});