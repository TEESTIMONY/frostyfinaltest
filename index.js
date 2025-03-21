document.getElementById("playGameButton").addEventListener("click", () => {
    const isWalletConnected = localStorage.getItem("roninWalletConnected");

    if (isWalletConnected === "true") {
        window.location.href = "/gam.html"; // Go directly to the game if connected
    } else {
        window.location.href = "/test.html"; // Redirect to wallet connection page
    }
});
