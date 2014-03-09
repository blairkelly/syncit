var config = {}

//local is the machine the user is editing on
//remote is the machine running the server

//Local editing machine's Grunt Script will listen to the following port
config.localmachinegruntport = 3456;
//Remote machine listens to the following port:
config.remotemachinelisteningport = 3500;

config.bpl = "../blairkelly";  	//base path
config.bpr = config.bpl;		//base path remote, if different from local

var nsp = "*."; 				//no sub-paths
var asp = "**/*."; 				//all subpaths
var sp_flag = nsp;				//sub path or no sub path flag

var watch_basepath = true;		//watch for files in the basepath?

var extensions = [
					'html', 
					'css', 
					'cshtml',
					'php', 
					'js', 
					'cs',
					'xml',
					'config',
					'bat',
					'txt',
					'csproj',
					'user',
					'shtml',
					'jade',
					'sass',
					'scss',
					'jpg',
					'jpeg',
					'mpeg',
					'mp4'
				];

var include_subpaths = [
						"wp-content"
						];
var exclude_subpaths = [
						"exclude_this_subpath"
						];

config.filestowatch = new Array();
var ftw_entry = "";

//add files to watch list
if(watch_basepath) {
	sp_flag = nsp; //set sup path flag to no sub paths.
	for(var i=0; i<extensions.length; i++) {
		ftw_entry = '/'+sp_flag+extensions[i];
		config.filestowatch.push(ftw_entry);
	}
}
sp_flag = asp; //set sup path flag to INCLUDE paths.
for(var i=0; i<include_subpaths.length; i++) {
	for(var j=0; j<extensions.length; j++) {
		ftw_entry = '/'+include_subpaths[i]+'/'+sp_flag+extensions[j];
		config.filestowatch.push(ftw_entry);
	}
}


//needed to export
module.exports = config;