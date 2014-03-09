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


var include_specific_path = [
						"../"
						];  //includes a specfic path - IGNORES BASEPATH. Does not include the path's subpaths
var include_path_and_its_subpaths = [
						"wp-content"
						];

config.filestowatch = new Array();
var ftw_entry = "";

//add files to watch list
for(var i=0; i<include_specific_path.length; i++) {
	for(var j=0; j<extensions.length; j++) {
		ftw_entry = include_specific_path[i]+nsp+extensions[j];
		config.filestowatch.push(ftw_entry);
	}
}
if(watch_basepath) {
	for(var i=0; i<extensions.length; i++) {
		ftw_entry = config.bpl+'/'+nsp+extensions[i];
		config.filestowatch.push(ftw_entry);
	}
}
for(var i=0; i<include_path_and_its_subpaths.length; i++) {
	for(var j=0; j<extensions.length; j++) {
		ftw_entry = config.bpl+'/'+include_path_and_its_subpaths[i]+'/'+asp+extensions[j];
		config.filestowatch.push(ftw_entry);
	}
}

//needed to export
module.exports = config;