(function () {
    const bootScreen = document.getElementById("boot-screen");
    const bootStatus = document.getElementById("boot-status");
    const bootProgressBar = document.getElementById("boot-progress-bar");

    if (!bootScreen) return;

    const savedWallpaper = localStorage.getItem("customWallpaper");
    const extraAssets = savedWallpaper
        ? ["assets/loading-screen.jpeg"]
        : ["assets/wallpaper.jpeg", "assets/loading-screen.jpeg"];

    const domImageSrcs = Array.from(document.images).map(img => img.src);
    const assetsUrls = Array.from(new Set([...domImageSrcs, ...extraAssets]));

    const totalAssets = assetsUrls.length;
    let loadedCount = 0;

    function updateProgress(label) {
        const percent = totalAssets === 0 ? 100 : Math.round((loadedCount / totalAssets) * 100);
        bootProgressBar.style.width = percent + "%";
        bootStatus.textContent = label;
    }

    function loadAsset(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onLoad = () => {
                loadedCount++;
                updateProgress(`Loading ${url.split("/").pop()}...`);
                resolve();
            };
            img.onerror = () => {
                loadedCount++;
                updateProgress(`Failed to load ${url.split("/").pop()}`);
                resolve();
            };
            img.src = url;
        });
    }

    function finishBoot() {
        updateProgress("Ready!");
        setTimeout(() => {
            bootScreen.classList.add("fade-out");
            setTimeout(() => {
                bootScreen.remove();
            }, 600);
        }, 300);
    }

    updateProgress("Starting GenericOS...");

    const minDisplayTime = new Promise (resolve => setTimeout(resolve, 1200));

    if (totalAssets === 0 ){
        minDisplayTime.then(finishBoot);
    } else {
        Promise.all([Promise.all(assetsUrls.map(loadAsset)), minDisplayTime]).then(finishBoot);
    }
})();