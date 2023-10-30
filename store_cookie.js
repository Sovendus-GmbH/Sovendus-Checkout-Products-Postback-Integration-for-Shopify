var sovReqToken = getSovReqTokenFromUrl();
if (sovReqToken !== null) {
  saveSovReqTokenToCookie(sovReqToken, 2678400); // 31 days
}
function getSovReqTokenFromUrl() {
  var url = new URL(window.location);
  return url.searchParams.get("sovReqToken");
}
function saveSovReqTokenToCookie(sovReqToken, seconds) {
  document.cookie =
    "sovReqToken=" + sovReqToken + ";path=/;secure;samesite=strict;max-age=" + seconds;
}