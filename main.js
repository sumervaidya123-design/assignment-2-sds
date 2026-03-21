const dayChange = document.getElementById("dayChange");
const fullscreen = document.getElementById("fullscreen");

dayChange.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = dayChange.querySelector("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
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
        document.exitFullscreen();
    }
}

fullscreen.addEventListener("click", toggleFullscreen);
