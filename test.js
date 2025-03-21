function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

async function connectRonin() {
    if (isMobile()) {
        // Handle mobile-specific wallet connection
        connectRoninMobile();
        return;
    }

    // Handle desktop (extension-based) wallet connection
    if (!window.ronin || !window.ronin.provider) {
        alert("Please install Ronin Wallet extension on your browser!");
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

function connectRoninMobile() {
    const redirectUrl = window.location.origin + "/game_play.html"; // Your app's callback URL
    const roninDeepLink = `ronin://connect?redirect=${encodeURIComponent(redirectUrl)}`;

    // Redirect the user to the Ronin Wallet app
    window.location.href = roninDeepLink;
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

function getWalletAddressFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("wallet");
}

// Retrieve wallet address on page load
window.addEventListener("load", () => {
    const walletAddress = getWalletAddressFromUrl();
    if (walletAddress) {
        localStorage.setItem("roninWalletConnected", "true");
        localStorage.setItem("roninWalletAddress", walletAddress);
        document.getElementById("walletAddress").textContent = "Wallet: " + walletAddress;
    }
});

document.getElementById("connectBtn").addEventListener("click", connectRonin);
