var url = new URL(window.location);
var sovReqToken = url.searchParams.get("sovReqToken");
function saveSovReqTokenToCookie(key, value, seconds) {
  document.cookie =
    key + "=" + value + ";secure;samesite=strict;max-age=" + seconds;
}
if (sovReqToken) {
  var sovProductId = url.searchParams.get("sovProductId");
  if (sovProductId) {
    saveSovReqTokenToCookie("sovReqToken", sovReqToken, 1 * 60 * 5);
    saveSovReqTokenToCookie("sovProductId", sovProductId, 1 * 60 * 5);
  } else {
    console.log("Sovendus - failed to find sovProductId in URL");
  }
}

analytics.subscribe("checkout_completed", () => {
  function getCookieValue(cookieName) {
    var cookieContent = null;
    var cookie =
      document.cookie.split("; ").find(function (entry) {
        return entry.startsWith(cookieName + "=");
      }) || null;
    if (cookie !== null) {
      cookieContent = cookie.split("=")[1];
    }
    return decodeURIComponent(cookieContent);
  }
  var sovReqToken = getCookieValue("sovReqToken");
  if (sovReqToken) {
    var sovProductId = getCookieValue("sovProductId");
    var pixel = document.createElement("img");
    pixel.src =
      "https://press-order-api.sovendus.com/ext/" +
      sovProductId +
      "/image?sovReqToken=" +
      sovReqToken;
    document.body.appendChild(pixel);
    // remove the cookies
    document.cookie =
      "sovReqToken=;path=/;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "sovProductId=;path=/;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
});
