
// 获取浏览器版本
export function getBrowser() {
  var webInfo = navigator.userAgent;
  var chromeVendor = navigator.vendor;
  if (webInfo.indexOf("OPR") !== -1) {
    return "Opera";
  } else if (webInfo.indexOf("Edge") !== -1) {
    return "Edge";
  } else if (webInfo.indexOf("Firefox") !== -1) {
    return "FF";
  } else if (webInfo.indexOf("MSIE 9.0") !== -1) {
    return "IE9";
  } else if (webInfo.indexOf("MSIE 10.0") !== -1) {
    return "IE10";
  } else if (webInfo.indexOf("Trident") !== -1) {
    return "IE11";
  } else if (
    (chromeVendor !== "" &&
      chromeVendor !== undefined &&
      chromeVendor !== null &&
      chromeVendor.indexOf("Google") !== -1) ||
    webInfo.indexOf("Chrome") !== -1
  ) {
    return "Chrome";
  } else if (webInfo.indexOf("Safari") !== -1) {
    return "Safari";
  } else {
    return "other";
  }
}