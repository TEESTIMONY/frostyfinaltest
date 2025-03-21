async function connectRonin() {
    if (!window.ronin || !window.ronin.provider) {
        alert("Please install Ronin Wallet!");
        return;
    }
    
    try {
        const provider = window.ronin.provider;
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        const walletName = "Ronin Wallet"; // Since we detected Ronin provider
        
        document.getElementById("walletName").textContent = "Wallet Name: " + walletName;
        document.getElementById("walletAddress").textContent = "Wallet: " + accounts[0];
        document.getElementById("usernameContainer").classList.remove("hidden"); // Show username input
        signMessage(accounts[0], provider);

        if (accounts.length > 0) {
            // Store connection status and wallet address in localStorage
            localStorage.setItem("roninWalletConnected", "true");
            localStorage.setItem("roninWalletAddress", accounts[0]);

            // Redirect to game.html after storing wallet info
            window.location.href = "/game_play.html";
        }
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

async function signMessage(account, provider) {
    const message = `Sign to verify your identity. Timestamp: ${Date.now()}`;
    
    try {
        const signedMessage = await provider.request({
            method: "personal_sign",
            params: [message, account],
        });
        document.getElementById("signature").textContent = "Signature: " + signedMessage;
    } catch (error) {
        console.error("Signing failed:", error);
    }
}

document.getElementById("connectBtn").addEventListener("click", connectRonin);

