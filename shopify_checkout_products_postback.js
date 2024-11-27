const sovendusIdsByLandingPagePath = {
  "/products/your-product-landing-page-path": "YOUR_SOVENDUS_PRODUCT_ID",
};

const sovReqToken = getSovReqTokenFromUrl();
if (sovReqToken !== null) {
  saveSovReqTokenToCookie(sovReqToken, getSovReqPathFromUrl(), 2678400); // 31 days
}
function getSovReqTokenFromUrl() {
  const url = new URL(window.location);
  return url.searchParams.get("sovReqToken");
}
function getSovReqPathFromUrl() {
  return window.location.pathname.split("/sandbox/modern")[1];
}
function saveSovReqTokenToCookie(sovReqToken, sovReqPath, seconds) {
  document.cookie =
    "sovReqToken=" +
    sovReqToken +
    ";path=/;secure;samesite=strict;max-age=" +
    seconds;
  document.cookie =
    "sovReqPath=" +
    sovReqPath +
    ";path=/;secure;samesite=strict;max-age=" +
    seconds;
}

analytics.subscribe("checkout_completed", () => {
  function loadSovInfoFromCookie(cookieName) {
    let cookieContent = null;
    const cookie =
      document.cookie.split("; ").find(function (entry) {
        return entry.startsWith(cookieName + "=");
      }) || null;
    if (cookie !== null) {
      cookieContent = cookie.split("=")[1];
    }
    return decodeURIComponent(cookieContent);
  }
  const sovReqToken = loadSovInfoFromCookie("sovReqToken");
  if (sovReqToken) {
    const sovReqPath = loadSovInfoFromCookie("sovReqPath");
    const productId = sovendusIdsByLandingPagePath[sovReqPath];
    const pixel = document.createElement("img");
    pixel.src =
      "https://press-order-api.sovendus.com/ext/" +
      productId +
      "/image?sovReqToken=" +
      sovReqToken;
    document.body.appendChild(pixel);
    // remove the cookies
    document.cookie =
      "sovReqToken=;path=/;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "sovReqPath=;path=/;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
});
