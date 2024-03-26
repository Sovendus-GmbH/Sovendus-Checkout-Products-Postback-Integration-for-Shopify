var sovendusIdsByLandingPagePath = {
  "/products/your-product-landing-page-path": "YOUR_SOVENDUS_PRODUCT_ID",
};

var sovReqToken = getSovReqTokenFromUrl();
if (sovReqToken !== null) {
  saveSovReqTokenToCookie(sovReqToken, getSovReqPathFromUrl(), 2678400); // 31 days
}
function getSovReqTokenFromUrl() {
  var url = new URL(window.location);
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
    var cookieContent = null;
    var cookie =
      document.cookie.split("; ").find(function (entry) {
        return entry.startsWith(cookieName + "=");
      }) || null;
    if (cookie !== null) {
      cookieContent = cookie.split("=")[1];
    }
    return cookieContent;
  }
  var sovReqToken = loadSovInfoFromCookie("sovReqToken");
  if (sovReqToken) {
    var sovReqPath = loadSovInfoFromCookie("sovReqPath");
    var productId = sovendusIdsByLandingPagePath[sovReqPath];
    var pixel = document.createElement("img");
    pixel.src =
      "https://press-order-api.sovendus.com/ext/" +
      productId +
      "/image?sovReqToken=" +
      sovReqToken;
    document.getElementsByTagName("body")[0].appendChild(pixel);
    // remove the cookies
    document.cookie =
      "sovReqToken=;path=/;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "sovReqPath=;path=/;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
});
