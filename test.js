function saveUsername() {
    const usernameInput = document.getElementById("usernameInput").value.trim();

    if (usernameInput === "") {
        alert("Please enter a valid username.");
        return;
    }

    // Store the username in localStorage
    localStorage.setItem("roninWalletConnected", "true");
    localStorage.setItem("playerUsername", usernameInput);

    // Display the username to the user
    document.getElementById("displayUsername").textContent = "Username: " + usernameInput;

    // Optionally redirect to the game page
    window.location.href = "/game_play.html";
}

// Retrieve and display the username on page load (if it exists)
window.addEventListener("load", () => {
    const savedUsername = localStorage.getItem("playerUsername");
    if (savedUsername) {
        document.getElementById("displayUsername").textContent = "Username: " + savedUsername;
    }
});

// Attach event listener to the save button
document.getElementById("saveUsernameBtn").addEventListener("click", saveUsername);
