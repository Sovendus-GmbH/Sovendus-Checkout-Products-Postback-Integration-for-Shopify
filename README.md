# Sovendus External Checkout Products Tracking Integration for Shopify

# Store request id in a cookie when the customer lands on the page

1. In you Shopify backend go to: Settings -> Customer events 
2. Click on "Add custom pixel" on the top right, then enter a name for it e.g. "Sovendus Cookie"
3. Paste the following code in to the textarea: 
```
var sovReqToken = getSovReqTokenFromUrl();
// script version 1.0.0
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
```
4. On the top right click on Save and then click on Connect on the top right

# Track a successful checkout

1. Copy the code below into an editor and add your Sovendus product id for each country into the sovendusIdsByCountry object
```
<script>
  // script version 1.0.0
  var sovendusIdsByCountry = {
    DE: "YOUR_DE_SOVENDUS_ID",
    // add other countries here

    // examples for other countries:
    // UK: "YOUR_UK_SOVENDUS_ID",
    // AT: "YOUR_AT_SOVENDUS_ID",
    // DK: "YOUR_DK_SOVENDUS_ID",
    // SE: "YOUR_SE_SOVENDUS_ID",
  };
  var countryCode = "{{checkout.billing_address.country_code}}";
  var productId = sovendusIdsByCountry[countryCode];
  if (productId) {
    function loadSovReqTokenFromCookie() {
      var sovReqToken = null;
      var cookie =
        document.cookie.split("; ").find(function (entry) {
          return entry.startsWith("sovReqToken=");
        }) || null;
      if (cookie !== null) {
        sovReqToken = cookie.split("=")[1];
      }
      return sovReqToken;
    }
    var sovReqToken = loadSovReqTokenFromCookie();
    if (sovReqToken) {
      var pixel = document.createElement("img");
      pixel.src =
        "https://press-order-api.sovendus.com/ext/" +
        productId +
        "/image?sovReqToken=" +
        sovReqToken;
      document.getElementsByTagName("body")[0].appendChild(pixel);
      // remove the cookie
      document.cookie = "sovReqToken=;path=/;secure;samesite=strict;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
</script>
```
2. In you Shopify backend go to: Settings -> Checkout -> Order status page -> Additional scripts - paste the script and save it