//needed for init.
var config = {}

config.partnerlocation = "10.0.1.8";
config.partnerport = 3500;
config.localport = 3000;

var bp = "../TaihoPharmaUSAInc-DefaultPortfolio-2013-CorporateSitePhaseI/Web/";
var afe = "/*.*";

config.filestowatch = [
						bp+"*.config",
						bp+"about"+afe,
						bp+"App_Data"+afe,
						bp+"careers"+afe,
						bp+"contact"+afe,
						bp+"elements"+afe,
						bp+"local"+afe,
						bp+"news"+afe,
						bp+"privacy"+afe,
						bp+"science"+afe,
						bp+"search"+afe,
						bp+"templates"+afe,
						bp+"terms"+afe
						];


//needed to export
module.exports = config;