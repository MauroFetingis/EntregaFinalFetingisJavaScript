const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});


const hiddenElements = document.querySelectorAll('.hidd');
hiddenElements.forEach((el) => observer.observe(el));


document.addEventListener("DOMContentLoaded", function () {
    var goToNextPageButton = document.getElementById("go-to-next-page");


    goToNextPageButton.addEventListener("click", function () {
        showLoadingScreen();
        setTimeout(function () {

            window.location.href = "/ecommerce/index.html";
        }, 2000);
    });
});

function showLoadingScreen() {
    document.body.classList.add("loading");
    var loadingScreen = document.createElement("div");
    loadingScreen.id = "loading-screen";
    loadingScreen.innerHTML = '<div id="loading-message">Aguarde mientras la página carga...</div>';


    for (var i = 0; i < 250; i++) {
        createPixel(loadingScreen);
    }

    document.body.appendChild(loadingScreen);
}

function createPixel(parentElement) {
    var pixel = document.createElement("div");
    pixel.classList.add("pixel");


    var size = Math.floor(Math.random() * 10) + 1;
    pixel.style.width = size + "px";
    pixel.style.height = size + "px";


    var color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    pixel.style.backgroundColor = color;


    pixel.style.left = Math.random() * window.innerWidth + "px";
    pixel.style.top = Math.random() * window.innerHeight + "px";
    parentElement.appendChild(pixel);


    pixel.style.animationDuration = Math.random() * 2 + 1 + "s";
}
window.addEventListener("load", function () {
    document.body.classList.remove("loading");
});