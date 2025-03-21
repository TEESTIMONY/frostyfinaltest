async function clearLeaderboard() {
    const confirmation = confirm("Are you sure you want to clear the entire leaderboard? This action cannot be undone.");

    if (!confirmation) return; // Stop if the user cancels the action

    try {
        const response = await fetch("https://my-backend-red.vercel.app/api/delete", {
            method: "DELETE",
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Leaderboard cleared successfully!");
            // Optionally, update the leaderboard display
            const leaderboardList = document.getElementById("leaderboard-list");
            leaderboardList.innerHTML = ""; // Clear leaderboard UI
        } else {
            alert(result.error || "Failed to clear leaderboard.");
        }
    } catch (error) {
        console.error("Error clearing leaderboard:", error);
        alert("An error occurred while clearing the leaderboard.");
    }
}

// Attach this function to a button in your HTML
document.getElementById("clearLeaderboardBtn").addEventListener("click", clearLeaderboard);
