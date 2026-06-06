(function() {

    // Notepad functionality
    const notepadIcon = document.getElementById("notepad-icon");
    const notepadWindow = document.getElementById("notepad-window");

    notepadIcon.addEventListener("click", () => {
        notepadWindow.style.width = "600px";
        notepadWindow.style.height = "400px";
        notepadWindow.style.top = "50px";
        notepadWindow.style.left = "100px";
        notepadWindow.classList.remove("maximized");
        isMaximized = false;
        notepadWindow.style.display = "flex";
        addToTaskbar();
    });

    // Taskbar icon functions
    function addToTaskbar() {
        const taskbarItems = document.getElementById("taskbar-items");
        if (document.getElementById("taskbar-notepad")) return; 

        const item = document.createElement("button");
        item.id = "taskbar-notepad";
        item.style.cursor = "pointer";
        item.style.background = "none";
        item.style.border = "none";
        item.style.padding = "0";
        item.style.margin = "0 5px";

        const img = document.createElement("img");
        img.src = "assets/notepad-icon.png";
        img.style.width = "40px";
        img.style.height = "40px";
        
        item.addEventListener("mouseenter", () => {
            item.style.background = "rgba(54, 52, 52, 0.1)";
            item.style.borderRadius = "4px";
            item.style.border = "1px solid rgba(255, 255, 255, 0.2)";
        });

        item.addEventListener("mouseleave", () => {
            item.style.background = "none";
            item.style.borderRadius = "none";
            item.style.border = "none";
        });

        item.addEventListener("click", () => {
            if (notepadWindow.style.display === "none") {
                notepadWindow.style.display = "flex";
                if(isMaximized) taskbar.classList.add("solid");
            } else {
                notepadWindow.style.display = "none";
                if(isMaximized) taskbar.classList.remove("solid");
            }
        });

        item.appendChild(img);
        taskbarItems.appendChild(item);
    }

    document.getElementById("close-btn").addEventListener("click", () => {
            notepadWindow.style.display = "none";
            window.removeFromTaskbar("taskbar-notepad"); // Call the global one
        });
    window.openNotepad = () => {
            notepadWindow.style.display = "flex";
        };

})();