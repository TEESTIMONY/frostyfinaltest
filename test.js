function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

async function connectRonin() {
    // Check if Ronin Wallet extension is available (desktop)
    if (window.ronin && window.ronin.provider) {
        alert("This is a browser.");

        try {
            const provider = window.ronin.provider;

            // Request wallet connection (desktop)
            const accounts = await provider.request({ method: "eth_requestAccounts" });

            if (accounts.length > 0) {
                const walletAddress = accounts[0];
                const walletName = "Ronin Wallet (Extension)";

                // Display wallet info
                document.getElementById("walletName").textContent = "Wallet Name: " + walletName;
                document.getElementById("walletAddress").textContent = "Wallet Address: " + walletAddress;

                // Store wallet info in localStorage
                localStorage.setItem("roninWalletConnected", "true");
                localStorage.setItem("roninWalletAddress", walletAddress);

                // Optionally, verify the wallet by signing a message
                await signMessage(walletAddress, provider);

                // Redirect to game page after connecting
                window.location.href = "/game_play.html";
            }
        } catch (error) {
            console.error("Desktop connection failed:", error);
            alert("Failed to connect to Ronin Wallet. Please try again.");
        }
    } else {
        alert("This is a phone.");
        // If extension is not available (mobile browser), redirect to Ronin Wallet app
        connectRoninMobile();
    }
}

function connectRoninMobile() {
    const redirectUrl = window.location.origin + "/game_play.html"; // Your app's callback URL
    const roninDeepLink = `ronin://connect?redirect=${encodeURIComponent(redirectUrl)}`;
    const appStoreUrl = "https://wallet.roninchain.com/"; // Update with the official Ronin Wallet app link

    // Attempt to open the Ronin Wallet app
    window.location.href = roninDeepLink;

    // Provide a fallback to the app store if the app is not installed
    setTimeout(() => {
        if (!document.hidden) { // If the user hasn't left the page
            alert("It seems you don't have the Ronin Wallet app installed. Redirecting to the app store...");
            window.location.href = appStoreUrl;
        }
    }, 2000); // Adjust timeout as needed
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
