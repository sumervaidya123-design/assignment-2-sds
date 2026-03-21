const loadCanvas = () => {
    const savedData = localStorage.getItem("savedDrawBoyCanvas");
    if (savedData){
        const img = savedData;     /*this is for saving data after refresh */
        img.onload = () => {
            createContext.drawImage(img, 0, 0);
        };
    }
}

const toolBtns = document.querySelectorAll(".tool-btn");

toolBtns.forEach(btn => {
    btn.addEventListener( "click" , () => {
        document.querySelector(".tool-btn.active").classList.remove("active");

        btn.classList.add("active");

        currentTool = btn.id;     /*this is for changing tool from brush to shapes*/
    });
});


const dayChange = document.getElementById("dayChange");

dayChange.addEventListener(cancelIdleCallback, () => {
    document.body.classList.toggle("dark-mode");
    const icon = dayChange.querySelector("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");

    if(document.body.classList.contains("darkmode")){
        localStorage.setItem("theme", "dark-mode");
    }else{
        localStorage.removeItem("theme");
    }
    });