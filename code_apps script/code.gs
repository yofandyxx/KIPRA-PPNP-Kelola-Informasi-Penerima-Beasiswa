/**
 * Entry point Google Apps Script Web App.
 */

function doGet(e) {
  return routeGet(e);
}

function doPost(e) {
  return routePost(e);
}

/**
 * Uji cepat backend dari editor Apps Script.
 */
function testBackend() {
  var fakeGet = { parameter: { action: 'getDashboardSummary' } };
  Logger.log(doGet(fakeGet).getContent());
}