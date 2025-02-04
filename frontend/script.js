const backendUrl = "https://your-backend-url.com/api/url";

async function shortenUrl() {
    const longUrl = document.getElementById("longUrl").value;
    if (!longUrl) {
        alert("Please enter a valid URL");
        return;
    }

    const response = await fetch(`${backendUrl}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: longUrl })
    });

    const data = await response.json();
    document.getElementById("shortenedUrl").innerHTML = 
        `Shortened URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
}
