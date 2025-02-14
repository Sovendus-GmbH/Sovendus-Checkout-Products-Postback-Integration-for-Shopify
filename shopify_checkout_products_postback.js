const url = new URL(window.location.href);
const sovReqToken = url.searchParams.get("sovReqToken");

function setCookie(cookieName, value) {
  const path = "/";
  const expireDate = new Date();
  expireDate.setTime(expireDate.getTime() + 24 * 60 * 60 * 1000 * 30); // 30 days
  const domain = window.location.hostname;
  const cookieString = `${cookieName}=${value};secure;samesite=strict;expires=${expireDate.toUTCString()};domain=${domain};path=${path}`;
  document.cookie = cookieString;
  return value || "";
}
if (sovReqToken) {
  const sovReqProductId = url.searchParams.get("sovReqProductId");
  if (sovReqProductId) {
    setCookie("sovReqToken", sovReqToken);
    setCookie("sovReqProductId", sovReqProductId);
  } else {
    console.log("Sovendus - failed to find sovReqProductId in URL");
  }
}

analytics.subscribe("checkout_completed", () => {
  function getCookieValue(name) {
    const cookieArr = document.cookie.split("; ");
    for (const cookie of cookieArr) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }
  const sovReqToken = getCookieValue("sovReqToken");
  if (sovReqToken) {
    const sovReqProductId = getCookieValue("sovReqProductId");
    const pixel = document.createElement("img");
    pixel.src = `https://press-order-api.sovendus.com/ext/${sovReqProductId}/image?sovReqToken=${sovReqToken}`;
    document.body.appendChild(pixel);
    const clearCookie = (cookieName) => {
      const domain = window.location.hostname;
      document.cookie = `${cookieName}=;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${domain};path=/;`;
    };
    clearCookie("sovReqToken");
    clearCookie("sovReqProductId");
  }
});
