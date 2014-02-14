var config = {}

//Local editing machine's Grunt Script will listen to the following port
config.localmachinegruntport = 3000;
//Remote machine listens to the following port:
config.remotemachinelisteningport = 3500;


var bp = "../TaihoPharmaUSAInc-DefaultPortfolio-2013-CorporateSitePhaseI/Web/";  //base path
var asp = "/**/*."; //all subpaths
var extensions = [
					'html', 
					'css', 
					'cshtml', 
					'js', 
					'cs',
					'xml',
					'config',
					'bat',
					'txt',
					'csproj',
					'user',
					'shtml'
				];

config.filestowatch = [
						bp+"*.*",
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