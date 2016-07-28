// 3D Wayfinder Admin API for Angular
// This file is auto-generated. DO NOT EDIT MANUALLY.
// 2016-07-15 17:40:47

angular.module('wf.api', ['ngStorage'])
	.constant('wf.api.config', {
		project: '_',
		location: false
	})
	.config(function ($httpProvider) {
		$httpProvider.defaults.withCredentials = true;
	})
	.factory('apiService', ['$http', '$q', '$rootScope', 'wf.api.config', '$cacheFactory', function ($http, $q, $rootScope, config, $cacheFactory) {

	var api = {};
	var httpCache = $cacheFactory.get('$http');	api.getURL = function(apiname, classname, method, args) {
		if (config.project===false) throw "No project opened! Call open(<project name>);";
		args = args||[];
		return [config.location, apiname, config.project, classname, method].concat(args).join('/');
	},

	api.request = function(type, apiname, classname, method, args, postArgs, cache) {
		var url = api.getURL(apiname, classname, method, args);
		postArgs = postArgs||[];
		var req = {
			method: type,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			url: url,
			cache: (!!cache),
			data: {parameters: postArgs},
			transformRequest: function(obj) {
			        return 'parameters='+encodeURIComponent(JSON.stringify(postArgs));
			    },
		};
		return $http(req).catch(function(err){
			$rootScope.$broadcast('wf.api.error', err.data);
		});
	};

	api.open = function(project) { config.project = project; };

	api.account = {
		changePassword: {
			url: function(oldPassword, newPassword, newPassword2){ return api.getURL("admin", "account", "changePassword", Array.prototype.slice.call(arguments, 0))},
			post: function (oldPassword, newPassword, newPassword2, cache) { return api.request('post', "admin", "account", "changePassword", false, [oldPassword, newPassword, newPassword2], cache); },
			get: function (oldPassword, newPassword, newPassword2, cache) { return api.request('get', "admin", "account", "changePassword", false, [oldPassword, newPassword, newPassword2], cache); },
			clearCache: function () { return api.clear("admin", "account", "changePassword"); }
		},
		createUser: {
			url: function(email, password, name, role){ return api.getURL("admin", "account", "createUser", Array.prototype.slice.call(arguments, 0))},
			post: function (email, password, name, role, cache) { return api.request('post', "admin", "account", "createUser", false, [email, password, name, role], cache); },
			get: function (email, password, name, role, cache) { return api.request('get', "admin", "account", "createUser", false, [email, password, name, role], cache); },
			clearCache: function () { return api.clear("admin", "account", "createUser"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "account", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "account", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "account", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "account", "dbLogger"); }
		},
		getAccountUsers: {
			url: function(){ return api.getURL("admin", "account", "getAccountUsers", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "account", "getAccountUsers", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "account", "getAccountUsers", false, [], cache); },
			clearCache: function () { return api.clear("admin", "account", "getAccountUsers"); }
		},
		getUser: {
			url: function(id){ return api.getURL("admin", "account", "getUser", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "account", "getUser", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "account", "getUser", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "account", "getUser"); }
		},
		getUserHelpPreference: {
			url: function(){ return api.getURL("admin", "account", "getUserHelpPreference", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "account", "getUserHelpPreference", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "account", "getUserHelpPreference", false, [], cache); },
			clearCache: function () { return api.clear("admin", "account", "getUserHelpPreference"); }
		},
		getUserProjectRole: {
			url: function(user_id, project_id){ return api.getURL("admin", "account", "getUserProjectRole", Array.prototype.slice.call(arguments, 0))},
			post: function (user_id, project_id, cache) { return api.request('post', "admin", "account", "getUserProjectRole", false, [user_id, project_id], cache); },
			get: function (user_id, project_id, cache) { return api.request('get', "admin", "account", "getUserProjectRole", false, [user_id, project_id], cache); },
			clearCache: function () { return api.clear("admin", "account", "getUserProjectRole"); }
		},
		getUsers: {
			url: function(){ return api.getURL("admin", "account", "getUsers", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "account", "getUsers", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "account", "getUsers", false, [], cache); },
			clearCache: function () { return api.clear("admin", "account", "getUsers"); }
		},
		getValidProjectRoles: {
			url: function(){ return api.getURL("admin", "account", "getValidProjectRoles", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "account", "getValidProjectRoles", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "account", "getValidProjectRoles", false, [], cache); },
			clearCache: function () { return api.clear("admin", "account", "getValidProjectRoles"); }
		},
		removeUser: {
			url: function(id){ return api.getURL("admin", "account", "removeUser", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "account", "removeUser", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "account", "removeUser", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "account", "removeUser"); }
		},
		setUserHelpPreference: {
			url: function(preference){ return api.getURL("admin", "account", "setUserHelpPreference", Array.prototype.slice.call(arguments, 0))},
			post: function (preference, cache) { return api.request('post', "admin", "account", "setUserHelpPreference", false, [preference], cache); },
			get: function (preference, cache) { return api.request('get', "admin", "account", "setUserHelpPreference", false, [preference], cache); },
			clearCache: function () { return api.clear("admin", "account", "setUserHelpPreference"); }
		},
		setUserProjectRole: {
			url: function(user_id, project_id, role){ return api.getURL("admin", "account", "setUserProjectRole", Array.prototype.slice.call(arguments, 0))},
			post: function (user_id, project_id, role, cache) { return api.request('post', "admin", "account", "setUserProjectRole", false, [user_id, project_id, role], cache); },
			get: function (user_id, project_id, role, cache) { return api.request('get', "admin", "account", "setUserProjectRole", false, [user_id, project_id, role], cache); },
			clearCache: function () { return api.clear("admin", "account", "setUserProjectRole"); }
		},
		setUserRealname: {
			url: function(id, name){ return api.getURL("admin", "account", "setUserRealname", Array.prototype.slice.call(arguments, 0))},
			post: function (id, name, cache) { return api.request('post', "admin", "account", "setUserRealname", false, [id, name], cache); },
			get: function (id, name, cache) { return api.request('get', "admin", "account", "setUserRealname", false, [id, name], cache); },
			clearCache: function () { return api.clear("admin", "account", "setUserRealname"); }
		},
		usernameExists: {
			url: function(username){ return api.getURL("admin", "account", "usernameExists", Array.prototype.slice.call(arguments, 0))},
			post: function (username, cache) { return api.request('post', "admin", "account", "usernameExists", false, [username], cache); },
			get: function (username, cache) { return api.request('get', "admin", "account", "usernameExists", false, [username], cache); },
			clearCache: function () { return api.clear("admin", "account", "usernameExists"); }
		},
	};
	api.advertisements = {
		clear: {
			url: function(template_id, container_id){ return api.getURL("admin", "advertisements", "clear", Array.prototype.slice.call(arguments, 0))},
			post: function (template_id, container_id, cache) { return api.request('post', "admin", "advertisements", "clear", false, [template_id, container_id], cache); },
			get: function (template_id, container_id, cache) { return api.request('get', "admin", "advertisements", "clear", false, [template_id, container_id], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "clear"); }
		},
		clearSubcontainers: {
			url: function(frame_id){ return api.getURL("admin", "advertisements", "clearSubcontainers", Array.prototype.slice.call(arguments, 0))},
			post: function (frame_id, cache) { return api.request('post', "admin", "advertisements", "clearSubcontainers", false, [frame_id], cache); },
			get: function (frame_id, cache) { return api.request('get', "admin", "advertisements", "clearSubcontainers", false, [frame_id], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "clearSubcontainers"); }
		},
		createFrame: {
			url: function(template_id, html_container_id){ return api.getURL("admin", "advertisements", "createFrame", Array.prototype.slice.call(arguments, 0))},
			post: function (template_id, html_container_id, cache) { return api.request('post', "admin", "advertisements", "createFrame", false, [template_id, html_container_id], cache); },
			get: function (template_id, html_container_id, cache) { return api.request('get', "admin", "advertisements", "createFrame", false, [template_id, html_container_id], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "createFrame"); }
		},
		createSubcontainer: {
			url: function(frame_id, advertisement_id, left, top, width, height){ return api.getURL("admin", "advertisements", "createSubcontainer", Array.prototype.slice.call(arguments, 0))},
			post: function (frame_id, advertisement_id, left, top, width, height, cache) { return api.request('post', "admin", "advertisements", "createSubcontainer", false, [frame_id, advertisement_id, left, top, width, height], cache); },
			get: function (frame_id, advertisement_id, left, top, width, height, cache) { return api.request('get', "admin", "advertisements", "createSubcontainer", false, [frame_id, advertisement_id, left, top, width, height], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "createSubcontainer"); }
		},
		createSubcontainers: {
			url: function(frame_id, containers){ return api.getURL("admin", "advertisements", "createSubcontainers", Array.prototype.slice.call(arguments, 0))},
			post: function (frame_id, containers, cache) { return api.request('post', "admin", "advertisements", "createSubcontainers", false, [frame_id, containers], cache); },
			get: function (frame_id, containers, cache) { return api.request('get', "admin", "advertisements", "createSubcontainers", false, [frame_id, containers], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "createSubcontainers"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "advertisements", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "advertisements", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "advertisements", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "dbLogger"); }
		},
		delete: {
			url: function(advertisement_id){ return api.getURL("admin", "advertisements", "delete", Array.prototype.slice.call(arguments, 0))},
			post: function (advertisement_id, cache) { return api.request('post', "admin", "advertisements", "delete", false, [advertisement_id], cache); },
			get: function (advertisement_id, cache) { return api.request('get', "admin", "advertisements", "delete", false, [advertisement_id], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "delete"); }
		},
		deleteFrame: {
			url: function(frame_id){ return api.getURL("admin", "advertisements", "deleteFrame", Array.prototype.slice.call(arguments, 0))},
			post: function (frame_id, cache) { return api.request('post', "admin", "advertisements", "deleteFrame", false, [frame_id], cache); },
			get: function (frame_id, cache) { return api.request('get', "admin", "advertisements", "deleteFrame", false, [frame_id], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "deleteFrame"); }
		},
		deleteSubcontainer: {
			url: function(subcontainer_id){ return api.getURL("admin", "advertisements", "deleteSubcontainer", Array.prototype.slice.call(arguments, 0))},
			post: function (subcontainer_id, cache) { return api.request('post', "admin", "advertisements", "deleteSubcontainer", false, [subcontainer_id], cache); },
			get: function (subcontainer_id, cache) { return api.request('get', "admin", "advertisements", "deleteSubcontainer", false, [subcontainer_id], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "deleteSubcontainer"); }
		},
		get: {
			url: function(){ return api.getURL("admin", "advertisements", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "advertisements", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "advertisements", "get", false, [], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "get"); }
		},
		moveFrame: {
			url: function(frame_id, direction){ return api.getURL("admin", "advertisements", "moveFrame", Array.prototype.slice.call(arguments, 0))},
			post: function (frame_id, direction, cache) { return api.request('post', "admin", "advertisements", "moveFrame", false, [frame_id, direction], cache); },
			get: function (frame_id, direction, cache) { return api.request('get', "admin", "advertisements", "moveFrame", false, [frame_id, direction], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "moveFrame"); }
		},
		setFrameContainers: {
			url: function(frame_id, containers){ return api.getURL("admin", "advertisements", "setFrameContainers", Array.prototype.slice.call(arguments, 0))},
			post: function (frame_id, containers, cache) { return api.request('post', "admin", "advertisements", "setFrameContainers", false, [frame_id, containers], cache); },
			get: function (frame_id, containers, cache) { return api.request('get', "admin", "advertisements", "setFrameContainers", false, [frame_id, containers], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "setFrameContainers"); }
		},
		setFromToDates: {
			url: function(frame_id, from_date, to_date){ return api.getURL("admin", "advertisements", "setFromToDates", Array.prototype.slice.call(arguments, 0))},
			post: function (frame_id, from_date, to_date, cache) { return api.request('post', "admin", "advertisements", "setFromToDates", false, [frame_id, from_date, to_date], cache); },
			get: function (frame_id, from_date, to_date, cache) { return api.request('get', "admin", "advertisements", "setFromToDates", false, [frame_id, from_date, to_date], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "setFromToDates"); }
		},
		setHTMLContent: {
			url: function(advertisement_id, content){ return api.getURL("admin", "advertisements", "setHTMLContent", Array.prototype.slice.call(arguments, 0))},
			post: function (advertisement_id, content, cache) { return api.request('post', "admin", "advertisements", "setHTMLContent", false, [advertisement_id, content], cache); },
			get: function (advertisement_id, content, cache) { return api.request('get', "admin", "advertisements", "setHTMLContent", false, [advertisement_id, content], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "setHTMLContent"); }
		},
		setKeywords: {
			url: function(frame_id, keywords){ return api.getURL("admin", "advertisements", "setKeywords", Array.prototype.slice.call(arguments, 0))},
			post: function (frame_id, keywords, cache) { return api.request('post', "admin", "advertisements", "setKeywords", false, [frame_id, keywords], cache); },
			get: function (frame_id, keywords, cache) { return api.request('get', "admin", "advertisements", "setKeywords", false, [frame_id, keywords], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "setKeywords"); }
		},
		setSubcontainerAdvertisement: {
			url: function(subcontainer_id, advertisement_id){ return api.getURL("admin", "advertisements", "setSubcontainerAdvertisement", Array.prototype.slice.call(arguments, 0))},
			post: function (subcontainer_id, advertisement_id, cache) { return api.request('post', "admin", "advertisements", "setSubcontainerAdvertisement", false, [subcontainer_id, advertisement_id], cache); },
			get: function (subcontainer_id, advertisement_id, cache) { return api.request('get', "admin", "advertisements", "setSubcontainerAdvertisement", false, [subcontainer_id, advertisement_id], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "setSubcontainerAdvertisement"); }
		},
		setSubcontainerDimensions: {
			url: function(subcontainer_id, top, left, width, height){ return api.getURL("admin", "advertisements", "setSubcontainerDimensions", Array.prototype.slice.call(arguments, 0))},
			post: function (subcontainer_id, top, left, width, height, cache) { return api.request('post', "admin", "advertisements", "setSubcontainerDimensions", false, [subcontainer_id, top, left, width, height], cache); },
			get: function (subcontainer_id, top, left, width, height, cache) { return api.request('get', "admin", "advertisements", "setSubcontainerDimensions", false, [subcontainer_id, top, left, width, height], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "setSubcontainerDimensions"); }
		},
		setThumbnail: {
			url: function(id, data){ return api.getURL("admin", "advertisements", "setThumbnail", Array.prototype.slice.call(arguments, 0))},
			post: function (id, data, cache) { return api.request('post', "admin", "advertisements", "setThumbnail", false, [id, data], cache); },
			get: function (id, data, cache) { return api.request('get', "admin", "advertisements", "setThumbnail", false, [id, data], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "setThumbnail"); }
		},
		updateFrame: {
			url: function(frame_id, enabled, duration_ms){ return api.getURL("admin", "advertisements", "updateFrame", Array.prototype.slice.call(arguments, 0))},
			post: function (frame_id, enabled, duration_ms, cache) { return api.request('post', "admin", "advertisements", "updateFrame", false, [frame_id, enabled, duration_ms], cache); },
			get: function (frame_id, enabled, duration_ms, cache) { return api.request('get', "admin", "advertisements", "updateFrame", false, [frame_id, enabled, duration_ms], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "updateFrame"); }
		},
		upload: {
			url: function(type){ return api.getURL("admin", "advertisements", "upload", Array.prototype.slice.call(arguments, 0))},
			post: function (type, cache) { return api.request('post', "admin", "advertisements", "upload", false, [type], cache); },
			get: function (type, cache) { return api.request('get', "admin", "advertisements", "upload", false, [type], cache); },
			clearCache: function () { return api.clear("admin", "advertisements", "upload"); }
		},
	};
	api.authentication = {
		alive: {
			url: function(){ return api.getURL("admin", "authentication", "alive", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "authentication", "alive", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "authentication", "alive", false, [], cache); },
			clearCache: function () { return api.clear("admin", "authentication", "alive"); }
		},
		cancelToken: {
			url: function(token){ return api.getURL("admin", "authentication", "cancelToken", Array.prototype.slice.call(arguments, 0))},
			post: function (token, cache) { return api.request('post', "admin", "authentication", "cancelToken", false, [token], cache); },
			get: function (token, cache) { return api.request('get', "admin", "authentication", "cancelToken", false, [token], cache); },
			clearCache: function () { return api.clear("admin", "authentication", "cancelToken"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "authentication", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "authentication", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "authentication", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "authentication", "dbLogger"); }
		},
		getCurrentUser: {
			url: function(){ return api.getURL("admin", "authentication", "getCurrentUser", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "authentication", "getCurrentUser", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "authentication", "getCurrentUser", false, [], cache); },
			clearCache: function () { return api.clear("admin", "authentication", "getCurrentUser"); }
		},
		login: {
			url: function(username, password){ return api.getURL("admin", "authentication", "login", Array.prototype.slice.call(arguments, 0))},
			post: function (username, password, cache) { return api.request('post', "admin", "authentication", "login", false, [username, password], cache); },
			get: function (username, password, cache) { return api.request('get', "admin", "authentication", "login", false, [username, password], cache); },
			clearCache: function () { return api.clear("admin", "authentication", "login"); }
		},
		logout: {
			url: function(){ return api.getURL("admin", "authentication", "logout", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "authentication", "logout", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "authentication", "logout", false, [], cache); },
			clearCache: function () { return api.clear("admin", "authentication", "logout"); }
		},
		recover: {
			url: function(email, challenge, response){ return api.getURL("admin", "authentication", "recover", Array.prototype.slice.call(arguments, 0))},
			post: function (email, challenge, response, cache) { return api.request('post', "admin", "authentication", "recover", false, [email, challenge, response], cache); },
			get: function (email, challenge, response, cache) { return api.request('get', "admin", "authentication", "recover", false, [email, challenge, response], cache); },
			clearCache: function () { return api.clear("admin", "authentication", "recover"); }
		},
		register: {
			url: function(email, password, currency, plan, challenge, response){ return api.getURL("admin", "authentication", "register", Array.prototype.slice.call(arguments, 0))},
			post: function (email, password, currency, plan, challenge, response, cache) { return api.request('post', "admin", "authentication", "register", false, [email, password, currency, plan, challenge, response], cache); },
			get: function (email, password, currency, plan, challenge, response, cache) { return api.request('get', "admin", "authentication", "register", false, [email, password, currency, plan, challenge, response], cache); },
			clearCache: function () { return api.clear("admin", "authentication", "register"); }
		},
		resetPassword: {
			url: function(token, password, challenge, response){ return api.getURL("admin", "authentication", "resetPassword", Array.prototype.slice.call(arguments, 0))},
			post: function (token, password, challenge, response, cache) { return api.request('post', "admin", "authentication", "resetPassword", false, [token, password, challenge, response], cache); },
			get: function (token, password, challenge, response, cache) { return api.request('get', "admin", "authentication", "resetPassword", false, [token, password, challenge, response], cache); },
			clearCache: function () { return api.clear("admin", "authentication", "resetPassword"); }
		},
	};
	api.editbuilding = {
		addLevel: {
			url: function(name){ return api.getURL("admin", "editbuilding", "addLevel", Array.prototype.slice.call(arguments, 0))},
			post: function (name, cache) { return api.request('post', "admin", "editbuilding", "addLevel", false, [name], cache); },
			get: function (name, cache) { return api.request('get', "admin", "editbuilding", "addLevel", false, [name], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "addLevel"); }
		},
		addRetileTask: {
			url: function(level_id, textureName){ return api.getURL("admin", "editbuilding", "addRetileTask", Array.prototype.slice.call(arguments, 0))},
			post: function (level_id, textureName, cache) { return api.request('post', "admin", "editbuilding", "addRetileTask", false, [level_id, textureName], cache); },
			get: function (level_id, textureName, cache) { return api.request('get', "admin", "editbuilding", "addRetileTask", false, [level_id, textureName], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "addRetileTask"); }
		},
		clearMaterials: {
			url: function(){ return api.getURL("admin", "editbuilding", "clearMaterials", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "editbuilding", "clearMaterials", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "editbuilding", "clearMaterials", false, [], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "clearMaterials"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "editbuilding", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "editbuilding", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "editbuilding", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "dbLogger"); }
		},
		getLevels: {
			url: function(){ return api.getURL("admin", "editbuilding", "getLevels", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "editbuilding", "getLevels", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "editbuilding", "getLevels", false, [], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "getLevels"); }
		},
		moveLevelDown: {
			url: function(levelID){ return api.getURL("admin", "editbuilding", "moveLevelDown", Array.prototype.slice.call(arguments, 0))},
			post: function (levelID, cache) { return api.request('post', "admin", "editbuilding", "moveLevelDown", false, [levelID], cache); },
			get: function (levelID, cache) { return api.request('get', "admin", "editbuilding", "moveLevelDown", false, [levelID], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "moveLevelDown"); }
		},
		moveLevelUp: {
			url: function(levelID){ return api.getURL("admin", "editbuilding", "moveLevelUp", Array.prototype.slice.call(arguments, 0))},
			post: function (levelID, cache) { return api.request('post', "admin", "editbuilding", "moveLevelUp", false, [levelID], cache); },
			get: function (levelID, cache) { return api.request('get', "admin", "editbuilding", "moveLevelUp", false, [levelID], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "moveLevelUp"); }
		},
		original: {
			url: function(model_id){ return api.getURL("admin", "editbuilding", "original", Array.prototype.slice.call(arguments, 0))},
			post: function (model_id, cache) { return api.request('post', "admin", "editbuilding", "original", false, [model_id], cache); },
			get: function (model_id, cache) { return api.request('get', "admin", "editbuilding", "original", false, [model_id], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "original"); }
		},
		removeLevel: {
			url: function(id){ return api.getURL("admin", "editbuilding", "removeLevel", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "editbuilding", "removeLevel", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "editbuilding", "removeLevel", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "removeLevel"); }
		},
		setLevelLightmap: {
			url: function(level_id, lightmap_id){ return api.getURL("admin", "editbuilding", "setLevelLightmap", Array.prototype.slice.call(arguments, 0))},
			post: function (level_id, lightmap_id, cache) { return api.request('post', "admin", "editbuilding", "setLevelLightmap", false, [level_id, lightmap_id], cache); },
			get: function (level_id, lightmap_id, cache) { return api.request('get', "admin", "editbuilding", "setLevelLightmap", false, [level_id, lightmap_id], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "setLevelLightmap"); }
		},
		setLevelProjectionScale: {
			url: function(levelID, scale){ return api.getURL("admin", "editbuilding", "setLevelProjectionScale", Array.prototype.slice.call(arguments, 0))},
			post: function (levelID, scale, cache) { return api.request('post', "admin", "editbuilding", "setLevelProjectionScale", false, [levelID, scale], cache); },
			get: function (levelID, scale, cache) { return api.request('get', "admin", "editbuilding", "setLevelProjectionScale", false, [levelID, scale], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "setLevelProjectionScale"); }
		},
		setLevelVisibleInMenus: {
			url: function(level_id, v){ return api.getURL("admin", "editbuilding", "setLevelVisibleInMenus", Array.prototype.slice.call(arguments, 0))},
			post: function (level_id, v, cache) { return api.request('post', "admin", "editbuilding", "setLevelVisibleInMenus", false, [level_id, v], cache); },
			get: function (level_id, v, cache) { return api.request('get', "admin", "editbuilding", "setLevelVisibleInMenus", false, [level_id, v], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "setLevelVisibleInMenus"); }
		},
		setLevelY: {
			url: function(levelID, y){ return api.getURL("admin", "editbuilding", "setLevelY", Array.prototype.slice.call(arguments, 0))},
			post: function (levelID, y, cache) { return api.request('post', "admin", "editbuilding", "setLevelY", false, [levelID, y], cache); },
			get: function (levelID, y, cache) { return api.request('get', "admin", "editbuilding", "setLevelY", false, [levelID, y], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "setLevelY"); }
		},
		setMaterialParameter: {
			url: function(matName, param, value){ return api.getURL("admin", "editbuilding", "setMaterialParameter", Array.prototype.slice.call(arguments, 0))},
			post: function (matName, param, value, cache) { return api.request('post', "admin", "editbuilding", "setMaterialParameter", false, [matName, param, value], cache); },
			get: function (matName, param, value, cache) { return api.request('get', "admin", "editbuilding", "setMaterialParameter", false, [matName, param, value], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "setMaterialParameter"); }
		},
		uploadLevel: {
			url: function(fileRef, name){ return api.getURL("admin", "editbuilding", "uploadLevel", Array.prototype.slice.call(arguments, 0))},
			post: function (fileRef, name, cache) { return api.request('post', "admin", "editbuilding", "uploadLevel", false, [fileRef, name], cache); },
			get: function (fileRef, name, cache) { return api.request('get', "admin", "editbuilding", "uploadLevel", false, [fileRef, name], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "uploadLevel"); }
		},
		uploadLevelData: {
			url: function(levelID, fileRef, replaceMats){ return api.getURL("admin", "editbuilding", "uploadLevelData", Array.prototype.slice.call(arguments, 0))},
			post: function (levelID, fileRef, replaceMats, cache) { return api.request('post', "admin", "editbuilding", "uploadLevelData", false, [levelID, fileRef, replaceMats], cache); },
			get: function (levelID, fileRef, replaceMats, cache) { return api.request('get', "admin", "editbuilding", "uploadLevelData", false, [levelID, fileRef, replaceMats], cache); },
			clearCache: function () { return api.clear("admin", "editbuilding", "uploadLevelData"); }
		},
	};
	api.editimages = {
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "editimages", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "editimages", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "editimages", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "editimages", "dbLogger"); }
		},
		getImageReferences: {
			url: function(image_id){ return api.getURL("admin", "editimages", "getImageReferences", Array.prototype.slice.call(arguments, 0))},
			post: function (image_id, cache) { return api.request('post', "admin", "editimages", "getImageReferences", false, [image_id], cache); },
			get: function (image_id, cache) { return api.request('get', "admin", "editimages", "getImageReferences", false, [image_id], cache); },
			clearCache: function () { return api.clear("admin", "editimages", "getImageReferences"); }
		},
		getImages: {
			url: function(){ return api.getURL("admin", "editimages", "getImages", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "editimages", "getImages", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "editimages", "getImages", false, [], cache); },
			clearCache: function () { return api.clear("admin", "editimages", "getImages"); }
		},
		getImagesReferences: {
			url: function(image_ids){ return api.getURL("admin", "editimages", "getImagesReferences", Array.prototype.slice.call(arguments, 0))},
			post: function (image_ids, cache) { return api.request('post', "admin", "editimages", "getImagesReferences", false, [image_ids], cache); },
			get: function (image_ids, cache) { return api.request('get', "admin", "editimages", "getImagesReferences", false, [image_ids], cache); },
			clearCache: function () { return api.clear("admin", "editimages", "getImagesReferences"); }
		},
		receiveImage: {
			url: function(ref){ return api.getURL("admin", "editimages", "receiveImage", Array.prototype.slice.call(arguments, 0))},
			post: function (ref, cache) { return api.request('post', "admin", "editimages", "receiveImage", false, [ref], cache); },
			get: function (ref, cache) { return api.request('get', "admin", "editimages", "receiveImage", false, [ref], cache); },
			clearCache: function () { return api.clear("admin", "editimages", "receiveImage"); }
		},
		removeImage: {
			url: function(image_id){ return api.getURL("admin", "editimages", "removeImage", Array.prototype.slice.call(arguments, 0))},
			post: function (image_id, cache) { return api.request('post', "admin", "editimages", "removeImage", false, [image_id], cache); },
			get: function (image_id, cache) { return api.request('get', "admin", "editimages", "removeImage", false, [image_id], cache); },
			clearCache: function () { return api.clear("admin", "editimages", "removeImage"); }
		},
	};
	api.editlanguages = {
		addFlag: {
			url: function(lang_id, flag_id){ return api.getURL("admin", "editlanguages", "addFlag", Array.prototype.slice.call(arguments, 0))},
			post: function (lang_id, flag_id, cache) { return api.request('post', "admin", "editlanguages", "addFlag", false, [lang_id, flag_id], cache); },
			get: function (lang_id, flag_id, cache) { return api.request('get', "admin", "editlanguages", "addFlag", false, [lang_id, flag_id], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "addFlag"); }
		},
		addLanguage: {
			url: function(code, flag, text_direction, native){ return api.getURL("admin", "editlanguages", "addLanguage", Array.prototype.slice.call(arguments, 0))},
			post: function (code, flag, text_direction, native, cache) { return api.request('post', "admin", "editlanguages", "addLanguage", false, [code, flag, text_direction, native], cache); },
			get: function (code, flag, text_direction, native, cache) { return api.request('get', "admin", "editlanguages", "addLanguage", false, [code, flag, text_direction, native], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "addLanguage"); }
		},
		addTranslation: {
			url: function(value){ return api.getURL("admin", "editlanguages", "addTranslation", Array.prototype.slice.call(arguments, 0))},
			post: function (value, cache) { return api.request('post', "admin", "editlanguages", "addTranslation", false, [value], cache); },
			get: function (value, cache) { return api.request('get', "admin", "editlanguages", "addTranslation", false, [value], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "addTranslation"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "editlanguages", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "editlanguages", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "editlanguages", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "dbLogger"); }
		},
		getLanguages: {
			url: function(){ return api.getURL("admin", "editlanguages", "getLanguages", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "editlanguages", "getLanguages", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "editlanguages", "getLanguages", false, [], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "getLanguages"); }
		},
		getTranslation: {
			url: function(id){ return api.getURL("admin", "editlanguages", "getTranslation", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "editlanguages", "getTranslation", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "editlanguages", "getTranslation", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "getTranslation"); }
		},
		getTranslations: {
			url: function(){ return api.getURL("admin", "editlanguages", "getTranslations", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "editlanguages", "getTranslations", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "editlanguages", "getTranslations", false, [], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "getTranslations"); }
		},
		massUpdate: {
			url: function(id, value){ return api.getURL("admin", "editlanguages", "massUpdate", Array.prototype.slice.call(arguments, 0))},
			post: function (id, value, cache) { return api.request('post', "admin", "editlanguages", "massUpdate", false, [id, value], cache); },
			get: function (id, value, cache) { return api.request('get', "admin", "editlanguages", "massUpdate", false, [id, value], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "massUpdate"); }
		},
		removeLanguage: {
			url: function(id){ return api.getURL("admin", "editlanguages", "removeLanguage", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "editlanguages", "removeLanguage", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "editlanguages", "removeLanguage", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "removeLanguage"); }
		},
		removeTranslation: {
			url: function(translationId){ return api.getURL("admin", "editlanguages", "removeTranslation", Array.prototype.slice.call(arguments, 0))},
			post: function (translationId, cache) { return api.request('post', "admin", "editlanguages", "removeTranslation", false, [translationId], cache); },
			get: function (translationId, cache) { return api.request('get', "admin", "editlanguages", "removeTranslation", false, [translationId], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "removeTranslation"); }
		},
		updateTranslation: {
			url: function(translationId, language, value){ return api.getURL("admin", "editlanguages", "updateTranslation", Array.prototype.slice.call(arguments, 0))},
			post: function (translationId, language, value, cache) { return api.request('post', "admin", "editlanguages", "updateTranslation", false, [translationId, language, value], cache); },
			get: function (translationId, language, value, cache) { return api.request('get', "admin", "editlanguages", "updateTranslation", false, [translationId, language, value], cache); },
			clearCache: function () { return api.clear("admin", "editlanguages", "updateTranslation"); }
		},
	};
	api.editlights = {
		addLight: {
			url: function(levelID){ return api.getURL("admin", "editlights", "addLight", Array.prototype.slice.call(arguments, 0))},
			post: function (levelID, cache) { return api.request('post', "admin", "editlights", "addLight", false, [levelID], cache); },
			get: function (levelID, cache) { return api.request('get', "admin", "editlights", "addLight", false, [levelID], cache); },
			clearCache: function () { return api.clear("admin", "editlights", "addLight"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "editlights", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "editlights", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "editlights", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "editlights", "dbLogger"); }
		},
		deleteLight: {
			url: function(id){ return api.getURL("admin", "editlights", "deleteLight", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "editlights", "deleteLight", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "editlights", "deleteLight", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "editlights", "deleteLight"); }
		},
		updateLight: {
			url: function(id, position, rotation, type, color, intensity, radius){ return api.getURL("admin", "editlights", "updateLight", Array.prototype.slice.call(arguments, 0))},
			post: function (id, position, rotation, type, color, intensity, radius, cache) { return api.request('post', "admin", "editlights", "updateLight", false, [id, position, rotation, type, color, intensity, radius], cache); },
			get: function (id, position, rotation, type, color, intensity, radius, cache) { return api.request('get', "admin", "editlights", "updateLight", false, [id, position, rotation, type, color, intensity, radius], cache); },
			clearCache: function () { return api.clear("admin", "editlights", "updateLight"); }
		},
	};
	api.editmaterials = {
		createMaterial: {
			url: function(){ return api.getURL("admin", "editmaterials", "createMaterial", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "editmaterials", "createMaterial", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "editmaterials", "createMaterial", false, [], cache); },
			clearCache: function () { return api.clear("admin", "editmaterials", "createMaterial"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "editmaterials", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "editmaterials", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "editmaterials", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "editmaterials", "dbLogger"); }
		},
		removeMaterial: {
			url: function(id){ return api.getURL("admin", "editmaterials", "removeMaterial", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "editmaterials", "removeMaterial", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "editmaterials", "removeMaterial", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "editmaterials", "removeMaterial"); }
		},
		removeMaterials: {
			url: function(materials){ return api.getURL("admin", "editmaterials", "removeMaterials", Array.prototype.slice.call(arguments, 0))},
			post: function (materials, cache) { return api.request('post', "admin", "editmaterials", "removeMaterials", false, [materials], cache); },
			get: function (materials, cache) { return api.request('get', "admin", "editmaterials", "removeMaterials", false, [materials], cache); },
			clearCache: function () { return api.clear("admin", "editmaterials", "removeMaterials"); }
		},
		saveMaterial: {
			url: function(id, name, shader, model_id){ return api.getURL("admin", "editmaterials", "saveMaterial", Array.prototype.slice.call(arguments, 0))},
			post: function (id, name, shader, model_id, cache) { return api.request('post', "admin", "editmaterials", "saveMaterial", false, [id, name, shader, model_id], cache); },
			get: function (id, name, shader, model_id, cache) { return api.request('get', "admin", "editmaterials", "saveMaterial", false, [id, name, shader, model_id], cache); },
			clearCache: function () { return api.clear("admin", "editmaterials", "saveMaterial"); }
		},
		saveTextures: {
			url: function(id, textures){ return api.getURL("admin", "editmaterials", "saveTextures", Array.prototype.slice.call(arguments, 0))},
			post: function (id, textures, cache) { return api.request('post', "admin", "editmaterials", "saveTextures", false, [id, textures], cache); },
			get: function (id, textures, cache) { return api.request('get', "admin", "editmaterials", "saveTextures", false, [id, textures], cache); },
			clearCache: function () { return api.clear("admin", "editmaterials", "saveTextures"); }
		},
		saveUniforms: {
			url: function(id, uniforms){ return api.getURL("admin", "editmaterials", "saveUniforms", Array.prototype.slice.call(arguments, 0))},
			post: function (id, uniforms, cache) { return api.request('post', "admin", "editmaterials", "saveUniforms", false, [id, uniforms], cache); },
			get: function (id, uniforms, cache) { return api.request('get', "admin", "editmaterials", "saveUniforms", false, [id, uniforms], cache); },
			clearCache: function () { return api.clear("admin", "editmaterials", "saveUniforms"); }
		},
	};
	api.editpoigroups = {
		addPOIGroup: {
			url: function(name, image_id, language){ return api.getURL("admin", "editpoigroups", "addPOIGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (name, image_id, language, cache) { return api.request('post', "admin", "editpoigroups", "addPOIGroup", false, [name, image_id, language], cache); },
			get: function (name, image_id, language, cache) { return api.request('get', "admin", "editpoigroups", "addPOIGroup", false, [name, image_id, language], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "addPOIGroup"); }
		},
		addPOIToGroup: {
			url: function(poiId, groupId){ return api.getURL("admin", "editpoigroups", "addPOIToGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (poiId, groupId, cache) { return api.request('post', "admin", "editpoigroups", "addPOIToGroup", false, [poiId, groupId], cache); },
			get: function (poiId, groupId, cache) { return api.request('get', "admin", "editpoigroups", "addPOIToGroup", false, [poiId, groupId], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "addPOIToGroup"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "editpoigroups", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "editpoigroups", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "editpoigroups", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "dbLogger"); }
		},
		getPOIGroup: {
			url: function(id, language){ return api.getURL("admin", "editpoigroups", "getPOIGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (id, language, cache) { return api.request('post', "admin", "editpoigroups", "getPOIGroup", false, [id, language], cache); },
			get: function (id, language, cache) { return api.request('get', "admin", "editpoigroups", "getPOIGroup", false, [id, language], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "getPOIGroup"); }
		},
		getPOIGroups: {
			url: function(language){ return api.getURL("admin", "editpoigroups", "getPOIGroups", Array.prototype.slice.call(arguments, 0))},
			post: function (language, cache) { return api.request('post', "admin", "editpoigroups", "getPOIGroups", false, [language], cache); },
			get: function (language, cache) { return api.request('get', "admin", "editpoigroups", "getPOIGroups", false, [language], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "getPOIGroups"); }
		},
		getPOIsGroup: {
			url: function(id, language){ return api.getURL("admin", "editpoigroups", "getPOIsGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (id, language, cache) { return api.request('post', "admin", "editpoigroups", "getPOIsGroup", false, [id, language], cache); },
			get: function (id, language, cache) { return api.request('get', "admin", "editpoigroups", "getPOIsGroup", false, [id, language], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "getPOIsGroup"); }
		},
		removePOIGroup: {
			url: function(id){ return api.getURL("admin", "editpoigroups", "removePOIGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "editpoigroups", "removePOIGroup", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "editpoigroups", "removePOIGroup", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "removePOIGroup"); }
		},
		removePOIGroupImage: {
			url: function(id){ return api.getURL("admin", "editpoigroups", "removePOIGroupImage", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "editpoigroups", "removePOIGroupImage", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "editpoigroups", "removePOIGroupImage", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "removePOIGroupImage"); }
		},
		removePOIsGroup: {
			url: function(poiId, groupId){ return api.getURL("admin", "editpoigroups", "removePOIsGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (poiId, groupId, cache) { return api.request('post', "admin", "editpoigroups", "removePOIsGroup", false, [poiId, groupId], cache); },
			get: function (poiId, groupId, cache) { return api.request('get', "admin", "editpoigroups", "removePOIsGroup", false, [poiId, groupId], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "removePOIsGroup"); }
		},
		setPOIGroupColor: {
			url: function(group_id, color){ return api.getURL("admin", "editpoigroups", "setPOIGroupColor", Array.prototype.slice.call(arguments, 0))},
			post: function (group_id, color, cache) { return api.request('post', "admin", "editpoigroups", "setPOIGroupColor", false, [group_id, color], cache); },
			get: function (group_id, color, cache) { return api.request('get', "admin", "editpoigroups", "setPOIGroupColor", false, [group_id, color], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "setPOIGroupColor"); }
		},
		updatePOIGroup: {
			url: function(id, name, language){ return api.getURL("admin", "editpoigroups", "updatePOIGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (id, name, language, cache) { return api.request('post', "admin", "editpoigroups", "updatePOIGroup", false, [id, name, language], cache); },
			get: function (id, name, language, cache) { return api.request('get', "admin", "editpoigroups", "updatePOIGroup", false, [id, name, language], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "updatePOIGroup"); }
		},
		updatePOIGroupImage: {
			url: function(id, image_id){ return api.getURL("admin", "editpoigroups", "updatePOIGroupImage", Array.prototype.slice.call(arguments, 0))},
			post: function (id, image_id, cache) { return api.request('post', "admin", "editpoigroups", "updatePOIGroupImage", false, [id, image_id], cache); },
			get: function (id, image_id, cache) { return api.request('get', "admin", "editpoigroups", "updatePOIGroupImage", false, [id, image_id], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "updatePOIGroupImage"); }
		},
		updatePOIGroupMainShowing: {
			url: function(id, main){ return api.getURL("admin", "editpoigroups", "updatePOIGroupMainShowing", Array.prototype.slice.call(arguments, 0))},
			post: function (id, main, cache) { return api.request('post', "admin", "editpoigroups", "updatePOIGroupMainShowing", false, [id, main], cache); },
			get: function (id, main, cache) { return api.request('get', "admin", "editpoigroups", "updatePOIGroupMainShowing", false, [id, main], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "updatePOIGroupMainShowing"); }
		},
		updatePOIGroupTopShowing: {
			url: function(id, top){ return api.getURL("admin", "editpoigroups", "updatePOIGroupTopShowing", Array.prototype.slice.call(arguments, 0))},
			post: function (id, top, cache) { return api.request('post', "admin", "editpoigroups", "updatePOIGroupTopShowing", false, [id, top], cache); },
			get: function (id, top, cache) { return api.request('get', "admin", "editpoigroups", "updatePOIGroupTopShowing", false, [id, top], cache); },
			clearCache: function () { return api.clear("admin", "editpoigroups", "updatePOIGroupTopShowing"); }
		},
	};
	api.editpoiinfo = {
		addInfo: {
			url: function(poi_id, type, name, translation, value){ return api.getURL("admin", "editpoiinfo", "addInfo", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, type, name, translation, value, cache) { return api.request('post', "admin", "editpoiinfo", "addInfo", false, [poi_id, type, name, translation, value], cache); },
			get: function (poi_id, type, name, translation, value, cache) { return api.request('get', "admin", "editpoiinfo", "addInfo", false, [poi_id, type, name, translation, value], cache); },
			clearCache: function () { return api.clear("admin", "editpoiinfo", "addInfo"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "editpoiinfo", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "editpoiinfo", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "editpoiinfo", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "editpoiinfo", "dbLogger"); }
		},
		deleteInfo: {
			url: function(id){ return api.getURL("admin", "editpoiinfo", "deleteInfo", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "editpoiinfo", "deleteInfo", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "editpoiinfo", "deleteInfo", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "editpoiinfo", "deleteInfo"); }
		},
		getPOIInfo: {
			url: function(id, language){ return api.getURL("admin", "editpoiinfo", "getPOIInfo", Array.prototype.slice.call(arguments, 0))},
			post: function (id, language, cache) { return api.request('post', "admin", "editpoiinfo", "getPOIInfo", false, [id, language], cache); },
			get: function (id, language, cache) { return api.request('get', "admin", "editpoiinfo", "getPOIInfo", false, [id, language], cache); },
			clearCache: function () { return api.clear("admin", "editpoiinfo", "getPOIInfo"); }
		},
		getPOIInfos: {
			url: function(language){ return api.getURL("admin", "editpoiinfo", "getPOIInfos", Array.prototype.slice.call(arguments, 0))},
			post: function (language, cache) { return api.request('post', "admin", "editpoiinfo", "getPOIInfos", false, [language], cache); },
			get: function (language, cache) { return api.request('get', "admin", "editpoiinfo", "getPOIInfos", false, [language], cache); },
			clearCache: function () { return api.clear("admin", "editpoiinfo", "getPOIInfos"); }
		},
		getSinglePOIInfos: {
			url: function(id, language){ return api.getURL("admin", "editpoiinfo", "getSinglePOIInfos", Array.prototype.slice.call(arguments, 0))},
			post: function (id, language, cache) { return api.request('post', "admin", "editpoiinfo", "getSinglePOIInfos", false, [id, language], cache); },
			get: function (id, language, cache) { return api.request('get', "admin", "editpoiinfo", "getSinglePOIInfos", false, [id, language], cache); },
			clearCache: function () { return api.clear("admin", "editpoiinfo", "getSinglePOIInfos"); }
		},
		updateInfo: {
			url: function(id, poi_id, type, name, translation, value, language){ return api.getURL("admin", "editpoiinfo", "updateInfo", Array.prototype.slice.call(arguments, 0))},
			post: function (id, poi_id, type, name, translation, value, language, cache) { return api.request('post', "admin", "editpoiinfo", "updateInfo", false, [id, poi_id, type, name, translation, value, language], cache); },
			get: function (id, poi_id, type, name, translation, value, language, cache) { return api.request('get', "admin", "editpoiinfo", "updateInfo", false, [id, poi_id, type, name, translation, value, language], cache); },
			clearCache: function () { return api.clear("admin", "editpoiinfo", "updateInfo"); }
		},
	};
	api.editpois = {
		addLocation: {
			url: function(name, description, image_id, background_id, room_id){ return api.getURL("admin", "editpois", "addLocation", Array.prototype.slice.call(arguments, 0))},
			post: function (name, description, image_id, background_id, room_id, cache) { return api.request('post', "admin", "editpois", "addLocation", false, [name, description, image_id, background_id, room_id], cache); },
			get: function (name, description, image_id, background_id, room_id, cache) { return api.request('get', "admin", "editpois", "addLocation", false, [name, description, image_id, background_id, room_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "addLocation"); }
		},
		addPOI: {
			url: function(name, description, nodeID, language){ return api.getURL("admin", "editpois", "addPOI", Array.prototype.slice.call(arguments, 0))},
			post: function (name, description, nodeID, language, cache) { return api.request('post', "admin", "editpois", "addPOI", false, [name, description, nodeID, language], cache); },
			get: function (name, description, nodeID, language, cache) { return api.request('get', "admin", "editpois", "addPOI", false, [name, description, nodeID, language], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "addPOI"); }
		},
		addPOIGroup: {
			url: function(poi_id, groupName, language){ return api.getURL("admin", "editpois", "addPOIGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, groupName, language, cache) { return api.request('post', "admin", "editpois", "addPOIGroup", false, [poi_id, groupName, language], cache); },
			get: function (poi_id, groupName, language, cache) { return api.request('get', "admin", "editpois", "addPOIGroup", false, [poi_id, groupName, language], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "addPOIGroup"); }
		},
		addPOITag: {
			url: function(poi_id, tag, language){ return api.getURL("admin", "editpois", "addPOITag", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, tag, language, cache) { return api.request('post', "admin", "editpois", "addPOITag", false, [poi_id, tag, language], cache); },
			get: function (poi_id, tag, language, cache) { return api.request('get', "admin", "editpois", "addPOITag", false, [poi_id, tag, language], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "addPOITag"); }
		},
		addUserPOI: {
			url: function(user_id, poi_id){ return api.getURL("admin", "editpois", "addUserPOI", Array.prototype.slice.call(arguments, 0))},
			post: function (user_id, poi_id, cache) { return api.request('post', "admin", "editpois", "addUserPOI", false, [user_id, poi_id], cache); },
			get: function (user_id, poi_id, cache) { return api.request('get', "admin", "editpois", "addUserPOI", false, [user_id, poi_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "addUserPOI"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "editpois", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "editpois", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "editpois", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "dbLogger"); }
		},
		exportPOIs: {
			url: function(){ return api.getURL("admin", "editpois", "exportPOIs", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "editpois", "exportPOIs", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "editpois", "exportPOIs", false, [], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "exportPOIs"); }
		},
		getPOI: {
			url: function(id, language){ return api.getURL("admin", "editpois", "getPOI", Array.prototype.slice.call(arguments, 0))},
			post: function (id, language, cache) { return api.request('post', "admin", "editpois", "getPOI", false, [id, language], cache); },
			get: function (id, language, cache) { return api.request('get', "admin", "editpois", "getPOI", false, [id, language], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "getPOI"); }
		},
		getPOITags: {
			url: function(poi_id, language){ return api.getURL("admin", "editpois", "getPOITags", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, language, cache) { return api.request('post', "admin", "editpois", "getPOITags", false, [poi_id, language], cache); },
			get: function (poi_id, language, cache) { return api.request('get', "admin", "editpois", "getPOITags", false, [poi_id, language], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "getPOITags"); }
		},
		getPOIs: {
			url: function(language){ return api.getURL("admin", "editpois", "getPOIs", Array.prototype.slice.call(arguments, 0))},
			post: function (language, cache) { return api.request('post', "admin", "editpois", "getPOIs", false, [language], cache); },
			get: function (language, cache) { return api.request('get', "admin", "editpois", "getPOIs", false, [language], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "getPOIs"); }
		},
		getUserPOIs: {
			url: function(id, language){ return api.getURL("admin", "editpois", "getUserPOIs", Array.prototype.slice.call(arguments, 0))},
			post: function (id, language, cache) { return api.request('post', "admin", "editpois", "getUserPOIs", false, [id, language], cache); },
			get: function (id, language, cache) { return api.request('get', "admin", "editpois", "getUserPOIs", false, [id, language], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "getUserPOIs"); }
		},
		hasPOIGroup: {
			url: function(poi_id, groupName, language){ return api.getURL("admin", "editpois", "hasPOIGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, groupName, language, cache) { return api.request('post', "admin", "editpois", "hasPOIGroup", false, [poi_id, groupName, language], cache); },
			get: function (poi_id, groupName, language, cache) { return api.request('get', "admin", "editpois", "hasPOIGroup", false, [poi_id, groupName, language], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "hasPOIGroup"); }
		},
		hasPOITag: {
			url: function(poi_id, tag, language){ return api.getURL("admin", "editpois", "hasPOITag", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, tag, language, cache) { return api.request('post', "admin", "editpois", "hasPOITag", false, [poi_id, tag, language], cache); },
			get: function (poi_id, tag, language, cache) { return api.request('get', "admin", "editpois", "hasPOITag", false, [poi_id, tag, language], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "hasPOITag"); }
		},
		importTags: {
			url: function(ref){ return api.getURL("admin", "editpois", "importTags", Array.prototype.slice.call(arguments, 0))},
			post: function (ref, cache) { return api.request('post', "admin", "editpois", "importTags", false, [ref], cache); },
			get: function (ref, cache) { return api.request('get', "admin", "editpois", "importTags", false, [ref], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "importTags"); }
		},
		removePOI: {
			url: function(id){ return api.getURL("admin", "editpois", "removePOI", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "editpois", "removePOI", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "editpois", "removePOI", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "removePOI"); }
		},
		removePOIBackground: {
			url: function(poi_id){ return api.getURL("admin", "editpois", "removePOIBackground", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, cache) { return api.request('post', "admin", "editpois", "removePOIBackground", false, [poi_id], cache); },
			get: function (poi_id, cache) { return api.request('get', "admin", "editpois", "removePOIBackground", false, [poi_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "removePOIBackground"); }
		},
		removePOIImage: {
			url: function(poi_id){ return api.getURL("admin", "editpois", "removePOIImage", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, cache) { return api.request('post', "admin", "editpois", "removePOIImage", false, [poi_id], cache); },
			get: function (poi_id, cache) { return api.request('get', "admin", "editpois", "removePOIImage", false, [poi_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "removePOIImage"); }
		},
		removePOIMesh: {
			url: function(poi_id){ return api.getURL("admin", "editpois", "removePOIMesh", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, cache) { return api.request('post', "admin", "editpois", "removePOIMesh", false, [poi_id], cache); },
			get: function (poi_id, cache) { return api.request('get', "admin", "editpois", "removePOIMesh", false, [poi_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "removePOIMesh"); }
		},
		removePOITag: {
			url: function(poi_id, tag_id){ return api.getURL("admin", "editpois", "removePOITag", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, tag_id, cache) { return api.request('post', "admin", "editpois", "removePOITag", false, [poi_id, tag_id], cache); },
			get: function (poi_id, tag_id, cache) { return api.request('get', "admin", "editpois", "removePOITag", false, [poi_id, tag_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "removePOITag"); }
		},
		removeUserPOI: {
			url: function(user_id, poi_id){ return api.getURL("admin", "editpois", "removeUserPOI", Array.prototype.slice.call(arguments, 0))},
			post: function (user_id, poi_id, cache) { return api.request('post', "admin", "editpois", "removeUserPOI", false, [user_id, poi_id], cache); },
			get: function (user_id, poi_id, cache) { return api.request('get', "admin", "editpois", "removeUserPOI", false, [user_id, poi_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "removeUserPOI"); }
		},
		setAlwaysVisible: {
			url: function(poi_id, visible){ return api.getURL("admin", "editpois", "setAlwaysVisible", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, visible, cache) { return api.request('post', "admin", "editpois", "setAlwaysVisible", false, [poi_id, visible], cache); },
			get: function (poi_id, visible, cache) { return api.request('get', "admin", "editpois", "setAlwaysVisible", false, [poi_id, visible], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "setAlwaysVisible"); }
		},
		setPOIMesh: {
			url: function(poi_id, model_id, mesh_name){ return api.getURL("admin", "editpois", "setPOIMesh", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, model_id, mesh_name, cache) { return api.request('post', "admin", "editpois", "setPOIMesh", false, [poi_id, model_id, mesh_name], cache); },
			get: function (poi_id, model_id, mesh_name, cache) { return api.request('get', "admin", "editpois", "setPOIMesh", false, [poi_id, model_id, mesh_name], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "setPOIMesh"); }
		},
		setPOINode: {
			url: function(poi_id, node_id){ return api.getURL("admin", "editpois", "setPOINode", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, node_id, cache) { return api.request('post', "admin", "editpois", "setPOINode", false, [poi_id, node_id], cache); },
			get: function (poi_id, node_id, cache) { return api.request('get', "admin", "editpois", "setPOINode", false, [poi_id, node_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "setPOINode"); }
		},
		setPOIType: {
			url: function(id, type){ return api.getURL("admin", "editpois", "setPOIType", Array.prototype.slice.call(arguments, 0))},
			post: function (id, type, cache) { return api.request('post', "admin", "editpois", "setPOIType", false, [id, type], cache); },
			get: function (id, type, cache) { return api.request('get', "admin", "editpois", "setPOIType", false, [id, type], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "setPOIType"); }
		},
		setShowInMenu: {
			url: function(poi_id, show){ return api.getURL("admin", "editpois", "setShowInMenu", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, show, cache) { return api.request('post', "admin", "editpois", "setShowInMenu", false, [poi_id, show], cache); },
			get: function (poi_id, show, cache) { return api.request('get', "admin", "editpois", "setShowInMenu", false, [poi_id, show], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "setShowInMenu"); }
		},
		updatePOI: {
			url: function(id, name, description, language){ return api.getURL("admin", "editpois", "updatePOI", Array.prototype.slice.call(arguments, 0))},
			post: function (id, name, description, language, cache) { return api.request('post', "admin", "editpois", "updatePOI", false, [id, name, description, language], cache); },
			get: function (id, name, description, language, cache) { return api.request('get', "admin", "editpois", "updatePOI", false, [id, name, description, language], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "updatePOI"); }
		},
		updatePOIBackground: {
			url: function(poi_id, bg_id){ return api.getURL("admin", "editpois", "updatePOIBackground", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, bg_id, cache) { return api.request('post', "admin", "editpois", "updatePOIBackground", false, [poi_id, bg_id], cache); },
			get: function (poi_id, bg_id, cache) { return api.request('get', "admin", "editpois", "updatePOIBackground", false, [poi_id, bg_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "updatePOIBackground"); }
		},
		updatePOIImage: {
			url: function(poi_id, image_id){ return api.getURL("admin", "editpois", "updatePOIImage", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, image_id, cache) { return api.request('post', "admin", "editpois", "updatePOIImage", false, [poi_id, image_id], cache); },
			get: function (poi_id, image_id, cache) { return api.request('get', "admin", "editpois", "updatePOIImage", false, [poi_id, image_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "updatePOIImage"); }
		},
		updatePOINode: {
			url: function(poi_id, node_id){ return api.getURL("admin", "editpois", "updatePOINode", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, node_id, cache) { return api.request('post', "admin", "editpois", "updatePOINode", false, [poi_id, node_id], cache); },
			get: function (poi_id, node_id, cache) { return api.request('get', "admin", "editpois", "updatePOINode", false, [poi_id, node_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "updatePOINode"); }
		},
		updatePOIRoom: {
			url: function(poi_id, room_id){ return api.getURL("admin", "editpois", "updatePOIRoom", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, room_id, cache) { return api.request('post', "admin", "editpois", "updatePOIRoom", false, [poi_id, room_id], cache); },
			get: function (poi_id, room_id, cache) { return api.request('get', "admin", "editpois", "updatePOIRoom", false, [poi_id, room_id], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "updatePOIRoom"); }
		},
		uploadPOIs: {
			url: function(ref){ return api.getURL("admin", "editpois", "uploadPOIs", Array.prototype.slice.call(arguments, 0))},
			post: function (ref, cache) { return api.request('post', "admin", "editpois", "uploadPOIs", false, [ref], cache); },
			get: function (ref, cache) { return api.request('get', "admin", "editpois", "uploadPOIs", false, [ref], cache); },
			clearCache: function () { return api.clear("admin", "editpois", "uploadPOIs"); }
		},
	};
	api.events = {
		converted: {
			url: function(conversion_id){ return api.getURL("admin", "events", "converted", Array.prototype.slice.call(arguments, 0))},
			post: function (conversion_id, cache) { return api.request('post', "admin", "events", "converted", false, [conversion_id], cache); },
			get: function (conversion_id, cache) { return api.request('get', "admin", "events", "converted", false, [conversion_id], cache); },
			clearCache: function () { return api.clear("admin", "events", "converted"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "events", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "events", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "events", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "events", "dbLogger"); }
		},
	};
	api.guitranslation = {
		addTranslation: {
			url: function(name, translation){ return api.getURL("admin", "guitranslation", "addTranslation", Array.prototype.slice.call(arguments, 0))},
			post: function (name, translation, cache) { return api.request('post', "admin", "guitranslation", "addTranslation", false, [name, translation], cache); },
			get: function (name, translation, cache) { return api.request('get', "admin", "guitranslation", "addTranslation", false, [name, translation], cache); },
			clearCache: function () { return api.clear("admin", "guitranslation", "addTranslation"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "guitranslation", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "guitranslation", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "guitranslation", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "guitranslation", "dbLogger"); }
		},
		getTranslations: {
			url: function(){ return api.getURL("admin", "guitranslation", "getTranslations", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "guitranslation", "getTranslations", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "guitranslation", "getTranslations", false, [], cache); },
			clearCache: function () { return api.clear("admin", "guitranslation", "getTranslations"); }
		},
		removeTranslation: {
			url: function(id){ return api.getURL("admin", "guitranslation", "removeTranslation", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "guitranslation", "removeTranslation", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "guitranslation", "removeTranslation", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "guitranslation", "removeTranslation"); }
		},
		updateTranslation: {
			url: function(id, name){ return api.getURL("admin", "guitranslation", "updateTranslation", Array.prototype.slice.call(arguments, 0))},
			post: function (id, name, cache) { return api.request('post', "admin", "guitranslation", "updateTranslation", false, [id, name], cache); },
			get: function (id, name, cache) { return api.request('get', "admin", "guitranslation", "updateTranslation", false, [id, name], cache); },
			clearCache: function () { return api.clear("admin", "guitranslation", "updateTranslation"); }
		},
	};
	api.menu = {
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "menu", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "menu", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "menu", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "menu", "dbLogger"); }
		},
		getAdminLanguages: {
			url: function(){ return api.getURL("admin", "menu", "getAdminLanguages", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "menu", "getAdminLanguages", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "menu", "getAdminLanguages", false, [], cache); },
			clearCache: function () { return api.clear("admin", "menu", "getAdminLanguages"); }
		},
		getMenu: {
			url: function(){ return api.getURL("admin", "menu", "getMenu", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "menu", "getMenu", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "menu", "getMenu", false, [], cache); },
			clearCache: function () { return api.clear("admin", "menu", "getMenu"); }
		},
		getUserLanguage: {
			url: function(){ return api.getURL("admin", "menu", "getUserLanguage", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "menu", "getUserLanguage", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "menu", "getUserLanguage", false, [], cache); },
			clearCache: function () { return api.clear("admin", "menu", "getUserLanguage"); }
		},
		saveUserLanguage: {
			url: function(language){ return api.getURL("admin", "menu", "saveUserLanguage", Array.prototype.slice.call(arguments, 0))},
			post: function (language, cache) { return api.request('post', "admin", "menu", "saveUserLanguage", false, [language], cache); },
			get: function (language, cache) { return api.request('get', "admin", "menu", "saveUserLanguage", false, [language], cache); },
			clearCache: function () { return api.clear("admin", "menu", "saveUserLanguage"); }
		},
	};
	api.models = {
		createInstance: {
			url: function(model_id){ return api.getURL("admin", "models", "createInstance", Array.prototype.slice.call(arguments, 0))},
			post: function (model_id, cache) { return api.request('post', "admin", "models", "createInstance", false, [model_id], cache); },
			get: function (model_id, cache) { return api.request('get', "admin", "models", "createInstance", false, [model_id], cache); },
			clearCache: function () { return api.clear("admin", "models", "createInstance"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "models", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "models", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "models", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "models", "dbLogger"); }
		},
		delete: {
			url: function(id){ return api.getURL("admin", "models", "delete", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "models", "delete", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "models", "delete", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "models", "delete"); }
		},
		deleteInstance: {
			url: function(id){ return api.getURL("admin", "models", "deleteInstance", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "models", "deleteInstance", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "models", "deleteInstance", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "models", "deleteInstance"); }
		},
		deleteProperties: {
			url: function(instance_id){ return api.getURL("admin", "models", "deleteProperties", Array.prototype.slice.call(arguments, 0))},
			post: function (instance_id, cache) { return api.request('post', "admin", "models", "deleteProperties", false, [instance_id], cache); },
			get: function (instance_id, cache) { return api.request('get', "admin", "models", "deleteProperties", false, [instance_id], cache); },
			clearCache: function () { return api.clear("admin", "models", "deleteProperties"); }
		},
		deleteProperty: {
			url: function(instance_id, key){ return api.getURL("admin", "models", "deleteProperty", Array.prototype.slice.call(arguments, 0))},
			post: function (instance_id, key, cache) { return api.request('post', "admin", "models", "deleteProperty", false, [instance_id, key], cache); },
			get: function (instance_id, key, cache) { return api.request('get', "admin", "models", "deleteProperty", false, [instance_id, key], cache); },
			clearCache: function () { return api.clear("admin", "models", "deleteProperty"); }
		},
		instance: {
			url: function(id){ return api.getURL("admin", "models", "instance", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "models", "instance", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "models", "instance", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "models", "instance"); }
		},
		original: {
			url: function(id){ return api.getURL("admin", "models", "original", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "models", "original", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "models", "original", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "models", "original"); }
		},
		replace: {
			url: function(id){ return api.getURL("admin", "models", "replace", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "models", "replace", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "models", "replace", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "models", "replace"); }
		},
		setPosition: {
			url: function(instance_id, x, y, z){ return api.getURL("admin", "models", "setPosition", Array.prototype.slice.call(arguments, 0))},
			post: function (instance_id, x, y, z, cache) { return api.request('post', "admin", "models", "setPosition", false, [instance_id, x, y, z], cache); },
			get: function (instance_id, x, y, z, cache) { return api.request('get', "admin", "models", "setPosition", false, [instance_id, x, y, z], cache); },
			clearCache: function () { return api.clear("admin", "models", "setPosition"); }
		},
		setProperty: {
			url: function(instance_id, key, value){ return api.getURL("admin", "models", "setProperty", Array.prototype.slice.call(arguments, 0))},
			post: function (instance_id, key, value, cache) { return api.request('post', "admin", "models", "setProperty", false, [instance_id, key, value], cache); },
			get: function (instance_id, key, value, cache) { return api.request('get', "admin", "models", "setProperty", false, [instance_id, key, value], cache); },
			clearCache: function () { return api.clear("admin", "models", "setProperty"); }
		},
		setRotation: {
			url: function(instance_id, x, y, z, w){ return api.getURL("admin", "models", "setRotation", Array.prototype.slice.call(arguments, 0))},
			post: function (instance_id, x, y, z, w, cache) { return api.request('post', "admin", "models", "setRotation", false, [instance_id, x, y, z, w], cache); },
			get: function (instance_id, x, y, z, w, cache) { return api.request('get', "admin", "models", "setRotation", false, [instance_id, x, y, z, w], cache); },
			clearCache: function () { return api.clear("admin", "models", "setRotation"); }
		},
		setScale: {
			url: function(instance_id, x, y, z){ return api.getURL("admin", "models", "setScale", Array.prototype.slice.call(arguments, 0))},
			post: function (instance_id, x, y, z, cache) { return api.request('post', "admin", "models", "setScale", false, [instance_id, x, y, z], cache); },
			get: function (instance_id, x, y, z, cache) { return api.request('get', "admin", "models", "setScale", false, [instance_id, x, y, z], cache); },
			clearCache: function () { return api.clear("admin", "models", "setScale"); }
		},
		upload: {
			url: function(){ return api.getURL("admin", "models", "upload", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "models", "upload", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "models", "upload", false, [], cache); },
			clearCache: function () { return api.clear("admin", "models", "upload"); }
		},
	};
	api.navigation = {
		addNavigationNode: {
			url: function(levelID){ return api.getURL("admin", "navigation", "addNavigationNode", Array.prototype.slice.call(arguments, 0))},
			post: function (levelID, cache) { return api.request('post', "admin", "navigation", "addNavigationNode", false, [levelID], cache); },
			get: function (levelID, cache) { return api.request('get', "admin", "navigation", "addNavigationNode", false, [levelID], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "addNavigationNode"); }
		},
		customReprojectNodes: {
			url: function(){ return api.getURL("admin", "navigation", "customReprojectNodes", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "navigation", "customReprojectNodes", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "navigation", "customReprojectNodes", false, [], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "customReprojectNodes"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "navigation", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "navigation", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "navigation", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "dbLogger"); }
		},
		getNodeGroup: {
			url: function(){ return api.getURL("admin", "navigation", "getNodeGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "navigation", "getNodeGroup", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "navigation", "getNodeGroup", false, [], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "getNodeGroup"); }
		},
		removeNavigationNode: {
			url: function(id){ return api.getURL("admin", "navigation", "removeNavigationNode", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "navigation", "removeNavigationNode", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "navigation", "removeNavigationNode", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "removeNavigationNode"); }
		},
		setEdges: {
			url: function(edges){ return api.getURL("admin", "navigation", "setEdges", Array.prototype.slice.call(arguments, 0))},
			post: function (edges, cache) { return api.request('post', "admin", "navigation", "setEdges", false, [edges], cache); },
			get: function (edges, cache) { return api.request('get', "admin", "navigation", "setEdges", false, [edges], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "setEdges"); }
		},
		setNodeAttributes: {
			url: function(id, json){ return api.getURL("admin", "navigation", "setNodeAttributes", Array.prototype.slice.call(arguments, 0))},
			post: function (id, json, cache) { return api.request('post', "admin", "navigation", "setNodeAttributes", false, [id, json], cache); },
			get: function (id, json, cache) { return api.request('get', "admin", "navigation", "setNodeAttributes", false, [id, json], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "setNodeAttributes"); }
		},
		setNodeGroup: {
			url: function(node_id, type){ return api.getURL("admin", "navigation", "setNodeGroup", Array.prototype.slice.call(arguments, 0))},
			post: function (node_id, type, cache) { return api.request('post', "admin", "navigation", "setNodeGroup", false, [node_id, type], cache); },
			get: function (node_id, type, cache) { return api.request('get', "admin", "navigation", "setNodeGroup", false, [node_id, type], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "setNodeGroup"); }
		},
		setNodeType: {
			url: function(nodeID, weight, entangled, entry, exit){ return api.getURL("admin", "navigation", "setNodeType", Array.prototype.slice.call(arguments, 0))},
			post: function (nodeID, weight, entangled, entry, exit, cache) { return api.request('post', "admin", "navigation", "setNodeType", false, [nodeID, weight, entangled, entry, exit], cache); },
			get: function (nodeID, weight, entangled, entry, exit, cache) { return api.request('get', "admin", "navigation", "setNodeType", false, [nodeID, weight, entangled, entry, exit], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "setNodeType"); }
		},
		setNodeWeight: {
			url: function(nodeID, weight){ return api.getURL("admin", "navigation", "setNodeWeight", Array.prototype.slice.call(arguments, 0))},
			post: function (nodeID, weight, cache) { return api.request('post', "admin", "navigation", "setNodeWeight", false, [nodeID, weight], cache); },
			get: function (nodeID, weight, cache) { return api.request('get', "admin", "navigation", "setNodeWeight", false, [nodeID, weight], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "setNodeWeight"); }
		},
		setNodeZoom: {
			url: function(id, zoom){ return api.getURL("admin", "navigation", "setNodeZoom", Array.prototype.slice.call(arguments, 0))},
			post: function (id, zoom, cache) { return api.request('post', "admin", "navigation", "setNodeZoom", false, [id, zoom], cache); },
			get: function (id, zoom, cache) { return api.request('get', "admin", "navigation", "setNodeZoom", false, [id, zoom], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "setNodeZoom"); }
		},
		unsetNodeType: {
			url: function(nodeID){ return api.getURL("admin", "navigation", "unsetNodeType", Array.prototype.slice.call(arguments, 0))},
			post: function (nodeID, cache) { return api.request('post', "admin", "navigation", "unsetNodeType", false, [nodeID], cache); },
			get: function (nodeID, cache) { return api.request('get', "admin", "navigation", "unsetNodeType", false, [nodeID], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "unsetNodeType"); }
		},
		updateNavigationNode: {
			url: function(id, x, y, z, rotationX, rotationY, rotationZ){ return api.getURL("admin", "navigation", "updateNavigationNode", Array.prototype.slice.call(arguments, 0))},
			post: function (id, x, y, z, rotationX, rotationY, rotationZ, cache) { return api.request('post', "admin", "navigation", "updateNavigationNode", false, [id, x, y, z, rotationX, rotationY, rotationZ], cache); },
			get: function (id, x, y, z, rotationX, rotationY, rotationZ, cache) { return api.request('get', "admin", "navigation", "updateNavigationNode", false, [id, x, y, z, rotationX, rotationY, rotationZ], cache); },
			clearCache: function () { return api.clear("admin", "navigation", "updateNavigationNode"); }
		},
	};
	api.poisettings = {
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "poisettings", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "poisettings", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "poisettings", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "dbLogger"); }
		},
		get: {
			url: function(){ return api.getURL("admin", "poisettings", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "poisettings", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "poisettings", "get", false, [], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "get"); }
		},
		getAllSettings: {
			url: function(id){ return api.getURL("admin", "poisettings", "getAllSettings", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "poisettings", "getAllSettings", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "poisettings", "getAllSettings", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "getAllSettings"); }
		},
		getByPrefix: {
			url: function(prefix){ return api.getURL("admin", "poisettings", "getByPrefix", Array.prototype.slice.call(arguments, 0))},
			post: function (prefix, cache) { return api.request('post', "admin", "poisettings", "getByPrefix", false, [prefix], cache); },
			get: function (prefix, cache) { return api.request('get', "admin", "poisettings", "getByPrefix", false, [prefix], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "getByPrefix"); }
		},
		getPOISettings: {
			url: function(id){ return api.getURL("admin", "poisettings", "getPOISettings", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "poisettings", "getPOISettings", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "poisettings", "getPOISettings", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "getPOISettings"); }
		},
		getPrefixes: {
			url: function(){ return api.getURL("admin", "poisettings", "getPrefixes", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "poisettings", "getPrefixes", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "poisettings", "getPrefixes", false, [], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "getPrefixes"); }
		},
		getSetting: {
			url: function(key){ return api.getURL("admin", "poisettings", "getSetting", Array.prototype.slice.call(arguments, 0))},
			post: function (key, cache) { return api.request('post', "admin", "poisettings", "getSetting", false, [key], cache); },
			get: function (key, cache) { return api.request('get', "admin", "poisettings", "getSetting", false, [key], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "getSetting"); }
		},
		getSettings: {
			url: function(){ return api.getURL("admin", "poisettings", "getSettings", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "poisettings", "getSettings", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "poisettings", "getSettings", false, [], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "getSettings"); }
		},
		removeSetting: {
			url: function(key, id){ return api.getURL("admin", "poisettings", "removeSetting", Array.prototype.slice.call(arguments, 0))},
			post: function (key, id, cache) { return api.request('post', "admin", "poisettings", "removeSetting", false, [key, id], cache); },
			get: function (key, id, cache) { return api.request('get', "admin", "poisettings", "removeSetting", false, [key, id], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "removeSetting"); }
		},
		setBoolean: {
			url: function(key, id, value){ return api.getURL("admin", "poisettings", "setBoolean", Array.prototype.slice.call(arguments, 0))},
			post: function (key, id, value, cache) { return api.request('post', "admin", "poisettings", "setBoolean", false, [key, id, value], cache); },
			get: function (key, id, value, cache) { return api.request('get', "admin", "poisettings", "setBoolean", false, [key, id, value], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "setBoolean"); }
		},
		setColor: {
			url: function(key, id, value){ return api.getURL("admin", "poisettings", "setColor", Array.prototype.slice.call(arguments, 0))},
			post: function (key, id, value, cache) { return api.request('post', "admin", "poisettings", "setColor", false, [key, id, value], cache); },
			get: function (key, id, value, cache) { return api.request('get', "admin", "poisettings", "setColor", false, [key, id, value], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "setColor"); }
		},
		setFloat: {
			url: function(key, id, value){ return api.getURL("admin", "poisettings", "setFloat", Array.prototype.slice.call(arguments, 0))},
			post: function (key, id, value, cache) { return api.request('post', "admin", "poisettings", "setFloat", false, [key, id, value], cache); },
			get: function (key, id, value, cache) { return api.request('get', "admin", "poisettings", "setFloat", false, [key, id, value], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "setFloat"); }
		},
		setImage: {
			url: function(key, id, value){ return api.getURL("admin", "poisettings", "setImage", Array.prototype.slice.call(arguments, 0))},
			post: function (key, id, value, cache) { return api.request('post', "admin", "poisettings", "setImage", false, [key, id, value], cache); },
			get: function (key, id, value, cache) { return api.request('get', "admin", "poisettings", "setImage", false, [key, id, value], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "setImage"); }
		},
		setInt: {
			url: function(key, id, value){ return api.getURL("admin", "poisettings", "setInt", Array.prototype.slice.call(arguments, 0))},
			post: function (key, id, value, cache) { return api.request('post', "admin", "poisettings", "setInt", false, [key, id, value], cache); },
			get: function (key, id, value, cache) { return api.request('get', "admin", "poisettings", "setInt", false, [key, id, value], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "setInt"); }
		},
		setModel: {
			url: function(key, id, value){ return api.getURL("admin", "poisettings", "setModel", Array.prototype.slice.call(arguments, 0))},
			post: function (key, id, value, cache) { return api.request('post', "admin", "poisettings", "setModel", false, [key, id, value], cache); },
			get: function (key, id, value, cache) { return api.request('get', "admin", "poisettings", "setModel", false, [key, id, value], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "setModel"); }
		},
		setString: {
			url: function(key, id, value){ return api.getURL("admin", "poisettings", "setString", Array.prototype.slice.call(arguments, 0))},
			post: function (key, id, value, cache) { return api.request('post', "admin", "poisettings", "setString", false, [key, id, value], cache); },
			get: function (key, id, value, cache) { return api.request('get', "admin", "poisettings", "setString", false, [key, id, value], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "setString"); }
		},
		setText: {
			url: function(id, text){ return api.getURL("admin", "poisettings", "setText", Array.prototype.slice.call(arguments, 0))},
			post: function (id, text, cache) { return api.request('post', "admin", "poisettings", "setText", false, [id, text], cache); },
			get: function (id, text, cache) { return api.request('get', "admin", "poisettings", "setText", false, [id, text], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "setText"); }
		},
		setTranslation: {
			url: function(key, value){ return api.getURL("admin", "poisettings", "setTranslation", Array.prototype.slice.call(arguments, 0))},
			post: function (key, value, cache) { return api.request('post', "admin", "poisettings", "setTranslation", false, [key, value], cache); },
			get: function (key, value, cache) { return api.request('get', "admin", "poisettings", "setTranslation", false, [key, value], cache); },
			clearCache: function () { return api.clear("admin", "poisettings", "setTranslation"); }
		},
	};
	api.project = {
		canCreateProject: {
			url: function(){ return api.getURL("admin", "project", "canCreateProject", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "project", "canCreateProject", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "project", "canCreateProject", false, [], cache); },
			clearCache: function () { return api.clear("admin", "project", "canCreateProject"); }
		},
		createProject: {
			url: function(title, demoProject){ return api.getURL("admin", "project", "createProject", Array.prototype.slice.call(arguments, 0))},
			post: function (title, demoProject, cache) { return api.request('post', "admin", "project", "createProject", false, [title, demoProject], cache); },
			get: function (title, demoProject, cache) { return api.request('get', "admin", "project", "createProject", false, [title, demoProject], cache); },
			clearCache: function () { return api.clear("admin", "project", "createProject"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "project", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "project", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "project", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "project", "dbLogger"); }
		},
		deleteProject: {
			url: function(name){ return api.getURL("admin", "project", "deleteProject", Array.prototype.slice.call(arguments, 0))},
			post: function (name, cache) { return api.request('post', "admin", "project", "deleteProject", false, [name], cache); },
			get: function (name, cache) { return api.request('get', "admin", "project", "deleteProject", false, [name], cache); },
			clearCache: function () { return api.clear("admin", "project", "deleteProject"); }
		},
		generatePassword: {
			url: function(){ return api.getURL("admin", "project", "generatePassword", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "project", "generatePassword", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "project", "generatePassword", false, [], cache); },
			clearCache: function () { return api.clear("admin", "project", "generatePassword"); }
		},
		getCurrentProject: {
			url: function(){ return api.getURL("admin", "project", "getCurrentProject", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "project", "getCurrentProject", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "project", "getCurrentProject", false, [], cache); },
			clearCache: function () { return api.clear("admin", "project", "getCurrentProject"); }
		},
		getLastChanged: {
			url: function(){ return api.getURL("admin", "project", "getLastChanged", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "project", "getLastChanged", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "project", "getLastChanged", false, [], cache); },
			clearCache: function () { return api.clear("admin", "project", "getLastChanged"); }
		},
		getNumberOfProjects: {
			url: function(){ return api.getURL("admin", "project", "getNumberOfProjects", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "project", "getNumberOfProjects", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "project", "getNumberOfProjects", false, [], cache); },
			clearCache: function () { return api.clear("admin", "project", "getNumberOfProjects"); }
		},
		getProjectInfo: {
			url: function(){ return api.getURL("admin", "project", "getProjectInfo", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "project", "getProjectInfo", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "project", "getProjectInfo", false, [], cache); },
			clearCache: function () { return api.clear("admin", "project", "getProjectInfo"); }
		},
		getProjectsSharedWithUser: {
			url: function(id){ return api.getURL("admin", "project", "getProjectsSharedWithUser", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "project", "getProjectsSharedWithUser", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "project", "getProjectsSharedWithUser", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "project", "getProjectsSharedWithUser"); }
		},
		getUserProjects: {
			url: function(id){ return api.getURL("admin", "project", "getUserProjects", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "project", "getUserProjects", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "project", "getUserProjects", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "project", "getUserProjects"); }
		},
		getUserProjectsObject: {
			url: function(id){ return api.getURL("admin", "project", "getUserProjectsObject", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "project", "getUserProjectsObject", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "project", "getUserProjectsObject", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "project", "getUserProjectsObject"); }
		},
		isProject: {
			url: function(projectName){ return api.getURL("admin", "project", "isProject", Array.prototype.slice.call(arguments, 0))},
			post: function (projectName, cache) { return api.request('post', "admin", "project", "isProject", false, [projectName], cache); },
			get: function (projectName, cache) { return api.request('get', "admin", "project", "isProject", false, [projectName], cache); },
			clearCache: function () { return api.clear("admin", "project", "isProject"); }
		},
		removeProject: {
			url: function(name){ return api.getURL("admin", "project", "removeProject", Array.prototype.slice.call(arguments, 0))},
			post: function (name, cache) { return api.request('post', "admin", "project", "removeProject", false, [name], cache); },
			get: function (name, cache) { return api.request('get', "admin", "project", "removeProject", false, [name], cache); },
			clearCache: function () { return api.clear("admin", "project", "removeProject"); }
		},
		setProjectDescription: {
			url: function(description){ return api.getURL("admin", "project", "setProjectDescription", Array.prototype.slice.call(arguments, 0))},
			post: function (description, cache) { return api.request('post', "admin", "project", "setProjectDescription", false, [description], cache); },
			get: function (description, cache) { return api.request('get', "admin", "project", "setProjectDescription", false, [description], cache); },
			clearCache: function () { return api.clear("admin", "project", "setProjectDescription"); }
		},
		setProjectLocation: {
			url: function(latitude, longitude, direction, scale){ return api.getURL("admin", "project", "setProjectLocation", Array.prototype.slice.call(arguments, 0))},
			post: function (latitude, longitude, direction, scale, cache) { return api.request('post', "admin", "project", "setProjectLocation", false, [latitude, longitude, direction, scale], cache); },
			get: function (latitude, longitude, direction, scale, cache) { return api.request('get', "admin", "project", "setProjectLocation", false, [latitude, longitude, direction, scale], cache); },
			clearCache: function () { return api.clear("admin", "project", "setProjectLocation"); }
		},
		setProjectTitle: {
			url: function(title){ return api.getURL("admin", "project", "setProjectTitle", Array.prototype.slice.call(arguments, 0))},
			post: function (title, cache) { return api.request('post', "admin", "project", "setProjectTitle", false, [title], cache); },
			get: function (title, cache) { return api.request('get', "admin", "project", "setProjectTitle", false, [title], cache); },
			clearCache: function () { return api.clear("admin", "project", "setProjectTitle"); }
		},
	};
	api.raytracing = {
		addJob: {
			url: function(){ return api.getURL("admin", "raytracing", "addJob", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "raytracing", "addJob", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "raytracing", "addJob", false, [], cache); },
			clearCache: function () { return api.clear("admin", "raytracing", "addJob"); }
		},
		addProjectionJob: {
			url: function(){ return api.getURL("admin", "raytracing", "addProjectionJob", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "raytracing", "addProjectionJob", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "raytracing", "addProjectionJob", false, [], cache); },
			clearCache: function () { return api.clear("admin", "raytracing", "addProjectionJob"); }
		},
		cancel: {
			url: function(task_id){ return api.getURL("admin", "raytracing", "cancel", Array.prototype.slice.call(arguments, 0))},
			post: function (task_id, cache) { return api.request('post', "admin", "raytracing", "cancel", false, [task_id], cache); },
			get: function (task_id, cache) { return api.request('get', "admin", "raytracing", "cancel", false, [task_id], cache); },
			clearCache: function () { return api.clear("admin", "raytracing", "cancel"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "raytracing", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "raytracing", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "raytracing", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "raytracing", "dbLogger"); }
		},
		preview: {
			url: function(level_id){ return api.getURL("admin", "raytracing", "preview", Array.prototype.slice.call(arguments, 0))},
			post: function (level_id, cache) { return api.request('post', "admin", "raytracing", "preview", false, [level_id], cache); },
			get: function (level_id, cache) { return api.request('get', "admin", "raytracing", "preview", false, [level_id], cache); },
			clearCache: function () { return api.clear("admin", "raytracing", "preview"); }
		},
		previews: {
			url: function(){ return api.getURL("admin", "raytracing", "previews", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "raytracing", "previews", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "raytracing", "previews", false, [], cache); },
			clearCache: function () { return api.clear("admin", "raytracing", "previews"); }
		},
		progress: {
			url: function(task_id){ return api.getURL("admin", "raytracing", "progress", Array.prototype.slice.call(arguments, 0))},
			post: function (task_id, cache) { return api.request('post', "admin", "raytracing", "progress", false, [task_id], cache); },
			get: function (task_id, cache) { return api.request('get', "admin", "raytracing", "progress", false, [task_id], cache); },
			clearCache: function () { return api.clear("admin", "raytracing", "progress"); }
		},
		tasks: {
			url: function(){ return api.getURL("admin", "raytracing", "tasks", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "raytracing", "tasks", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "raytracing", "tasks", false, [], cache); },
			clearCache: function () { return api.clear("admin", "raytracing", "tasks"); }
		},
	};
	api.settings = {
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "settings", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "settings", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "settings", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "settings", "dbLogger"); }
		},
		getByPrefix: {
			url: function(prefix){ return api.getURL("admin", "settings", "getByPrefix", Array.prototype.slice.call(arguments, 0))},
			post: function (prefix, cache) { return api.request('post', "admin", "settings", "getByPrefix", false, [prefix], cache); },
			get: function (prefix, cache) { return api.request('get', "admin", "settings", "getByPrefix", false, [prefix], cache); },
			clearCache: function () { return api.clear("admin", "settings", "getByPrefix"); }
		},
		getPrefixes: {
			url: function(){ return api.getURL("admin", "settings", "getPrefixes", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "settings", "getPrefixes", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "settings", "getPrefixes", false, [], cache); },
			clearCache: function () { return api.clear("admin", "settings", "getPrefixes"); }
		},
		getSetting: {
			url: function(key){ return api.getURL("admin", "settings", "getSetting", Array.prototype.slice.call(arguments, 0))},
			post: function (key, cache) { return api.request('post', "admin", "settings", "getSetting", false, [key], cache); },
			get: function (key, cache) { return api.request('get', "admin", "settings", "getSetting", false, [key], cache); },
			clearCache: function () { return api.clear("admin", "settings", "getSetting"); }
		},
		getSettings: {
			url: function(){ return api.getURL("admin", "settings", "getSettings", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "settings", "getSettings", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "settings", "getSettings", false, [], cache); },
			clearCache: function () { return api.clear("admin", "settings", "getSettings"); }
		},
		setBoolean: {
			url: function(key, value){ return api.getURL("admin", "settings", "setBoolean", Array.prototype.slice.call(arguments, 0))},
			post: function (key, value, cache) { return api.request('post', "admin", "settings", "setBoolean", false, [key, value], cache); },
			get: function (key, value, cache) { return api.request('get', "admin", "settings", "setBoolean", false, [key, value], cache); },
			clearCache: function () { return api.clear("admin", "settings", "setBoolean"); }
		},
		setColor: {
			url: function(key, value){ return api.getURL("admin", "settings", "setColor", Array.prototype.slice.call(arguments, 0))},
			post: function (key, value, cache) { return api.request('post', "admin", "settings", "setColor", false, [key, value], cache); },
			get: function (key, value, cache) { return api.request('get', "admin", "settings", "setColor", false, [key, value], cache); },
			clearCache: function () { return api.clear("admin", "settings", "setColor"); }
		},
		setFloat: {
			url: function(key, value){ return api.getURL("admin", "settings", "setFloat", Array.prototype.slice.call(arguments, 0))},
			post: function (key, value, cache) { return api.request('post', "admin", "settings", "setFloat", false, [key, value], cache); },
			get: function (key, value, cache) { return api.request('get', "admin", "settings", "setFloat", false, [key, value], cache); },
			clearCache: function () { return api.clear("admin", "settings", "setFloat"); }
		},
		setImage: {
			url: function(key, value){ return api.getURL("admin", "settings", "setImage", Array.prototype.slice.call(arguments, 0))},
			post: function (key, value, cache) { return api.request('post', "admin", "settings", "setImage", false, [key, value], cache); },
			get: function (key, value, cache) { return api.request('get', "admin", "settings", "setImage", false, [key, value], cache); },
			clearCache: function () { return api.clear("admin", "settings", "setImage"); }
		},
		setInt: {
			url: function(key, value){ return api.getURL("admin", "settings", "setInt", Array.prototype.slice.call(arguments, 0))},
			post: function (key, value, cache) { return api.request('post', "admin", "settings", "setInt", false, [key, value], cache); },
			get: function (key, value, cache) { return api.request('get', "admin", "settings", "setInt", false, [key, value], cache); },
			clearCache: function () { return api.clear("admin", "settings", "setInt"); }
		},
		setModel: {
			url: function(key, value){ return api.getURL("admin", "settings", "setModel", Array.prototype.slice.call(arguments, 0))},
			post: function (key, value, cache) { return api.request('post', "admin", "settings", "setModel", false, [key, value], cache); },
			get: function (key, value, cache) { return api.request('get', "admin", "settings", "setModel", false, [key, value], cache); },
			clearCache: function () { return api.clear("admin", "settings", "setModel"); }
		},
		setString: {
			url: function(key, value){ return api.getURL("admin", "settings", "setString", Array.prototype.slice.call(arguments, 0))},
			post: function (key, value, cache) { return api.request('post', "admin", "settings", "setString", false, [key, value], cache); },
			get: function (key, value, cache) { return api.request('get', "admin", "settings", "setString", false, [key, value], cache); },
			clearCache: function () { return api.clear("admin", "settings", "setString"); }
		},
		setText: {
			url: function(id, text){ return api.getURL("admin", "settings", "setText", Array.prototype.slice.call(arguments, 0))},
			post: function (id, text, cache) { return api.request('post', "admin", "settings", "setText", false, [id, text], cache); },
			get: function (id, text, cache) { return api.request('get', "admin", "settings", "setText", false, [id, text], cache); },
			clearCache: function () { return api.clear("admin", "settings", "setText"); }
		},
		setTranslation: {
			url: function(key, value){ return api.getURL("admin", "settings", "setTranslation", Array.prototype.slice.call(arguments, 0))},
			post: function (key, value, cache) { return api.request('post', "admin", "settings", "setTranslation", false, [key, value], cache); },
			get: function (key, value, cache) { return api.request('get', "admin", "settings", "setTranslation", false, [key, value], cache); },
			clearCache: function () { return api.clear("admin", "settings", "setTranslation"); }
		},
	};
	api.snapshots = {
		comment: {
			url: function(snapshot_id, comment){ return api.getURL("admin", "snapshots", "comment", Array.prototype.slice.call(arguments, 0))},
			post: function (snapshot_id, comment, cache) { return api.request('post', "admin", "snapshots", "comment", false, [snapshot_id, comment], cache); },
			get: function (snapshot_id, comment, cache) { return api.request('get', "admin", "snapshots", "comment", false, [snapshot_id, comment], cache); },
			clearCache: function () { return api.clear("admin", "snapshots", "comment"); }
		},
		count: {
			url: function(){ return api.getURL("admin", "snapshots", "count", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "snapshots", "count", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "snapshots", "count", false, [], cache); },
			clearCache: function () { return api.clear("admin", "snapshots", "count"); }
		},
		create: {
			url: function(){ return api.getURL("admin", "snapshots", "create", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "snapshots", "create", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "snapshots", "create", false, [], cache); },
			clearCache: function () { return api.clear("admin", "snapshots", "create"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "snapshots", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "snapshots", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "snapshots", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "snapshots", "dbLogger"); }
		},
		delete: {
			url: function(snapshot_id){ return api.getURL("admin", "snapshots", "delete", Array.prototype.slice.call(arguments, 0))},
			post: function (snapshot_id, cache) { return api.request('post', "admin", "snapshots", "delete", false, [snapshot_id], cache); },
			get: function (snapshot_id, cache) { return api.request('get', "admin", "snapshots", "delete", false, [snapshot_id], cache); },
			clearCache: function () { return api.clear("admin", "snapshots", "delete"); }
		},
		get: {
			url: function(){ return api.getURL("admin", "snapshots", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "snapshots", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "snapshots", "get", false, [], cache); },
			clearCache: function () { return api.clear("admin", "snapshots", "get"); }
		},
		snapshot: {
			url: function(snapshot_id){ return api.getURL("admin", "snapshots", "snapshot", Array.prototype.slice.call(arguments, 0))},
			post: function (snapshot_id, cache) { return api.request('post', "admin", "snapshots", "snapshot", false, [snapshot_id], cache); },
			get: function (snapshot_id, cache) { return api.request('get', "admin", "snapshots", "snapshot", false, [snapshot_id], cache); },
			clearCache: function () { return api.clear("admin", "snapshots", "snapshot"); }
		},
	};
	api.statistics = {
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "statistics", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "statistics", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "statistics", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "statistics", "dbLogger"); }
		},
		distinct: {
			url: function(viewName){ return api.getURL("admin", "statistics", "distinct", Array.prototype.slice.call(arguments, 0))},
			post: function (viewName, cache) { return api.request('post', "admin", "statistics", "distinct", false, [viewName], cache); },
			get: function (viewName, cache) { return api.request('get', "admin", "statistics", "distinct", false, [viewName], cache); },
			clearCache: function () { return api.clear("admin", "statistics", "distinct"); }
		},
		export: {
			url: function(viewName){ return api.getURL("admin", "statistics", "export", Array.prototype.slice.call(arguments, 0))},
			post: function (viewName, cache) { return api.request('post', "admin", "statistics", "export", false, [viewName], cache); },
			get: function (viewName, cache) { return api.request('get', "admin", "statistics", "export", false, [viewName], cache); },
			clearCache: function () { return api.clear("admin", "statistics", "export"); }
		},
		get: {
			url: function(viewName, startDate, endDate){ return api.getURL("admin", "statistics", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (viewName, startDate, endDate, cache) { return api.request('post', "admin", "statistics", "get", false, [viewName, startDate, endDate], cache); },
			get: function (viewName, startDate, endDate, cache) { return api.request('get', "admin", "statistics", "get", false, [viewName, startDate, endDate], cache); },
			clearCache: function () { return api.clear("admin", "statistics", "get"); }
		},
		get_sum: {
			url: function(viewName, startDate, endDate){ return api.getURL("admin", "statistics", "get_sum", Array.prototype.slice.call(arguments, 0))},
			post: function (viewName, startDate, endDate, cache) { return api.request('post', "admin", "statistics", "get_sum", false, [viewName, startDate, endDate], cache); },
			get: function (viewName, startDate, endDate, cache) { return api.request('get', "admin", "statistics", "get_sum", false, [viewName, startDate, endDate], cache); },
			clearCache: function () { return api.clear("admin", "statistics", "get_sum"); }
		},
	};
	api.subscription = {
		addAddon: {
			url: function(addon_id){ return api.getURL("admin", "subscription", "addAddon", Array.prototype.slice.call(arguments, 0))},
			post: function (addon_id, cache) { return api.request('post', "admin", "subscription", "addAddon", false, [addon_id], cache); },
			get: function (addon_id, cache) { return api.request('get', "admin", "subscription", "addAddon", false, [addon_id], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "addAddon"); }
		},
		addons: {
			url: function(){ return api.getURL("admin", "subscription", "addons", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "subscription", "addons", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "subscription", "addons", false, [], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "addons"); }
		},
		cancelSubscription: {
			url: function(){ return api.getURL("admin", "subscription", "cancelSubscription", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "subscription", "cancelSubscription", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "subscription", "cancelSubscription", false, [], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "cancelSubscription"); }
		},
		chooseSubscriptionPlan: {
			url: function(plan){ return api.getURL("admin", "subscription", "chooseSubscriptionPlan", Array.prototype.slice.call(arguments, 0))},
			post: function (plan, cache) { return api.request('post', "admin", "subscription", "chooseSubscriptionPlan", false, [plan], cache); },
			get: function (plan, cache) { return api.request('get', "admin", "subscription", "chooseSubscriptionPlan", false, [plan], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "chooseSubscriptionPlan"); }
		},
		createBillingInfo: {
			url: function(firstname, lastname, creditcard, month, year, cvv, company, address, apartment, city, state, zip, country, vat){ return api.getURL("admin", "subscription", "createBillingInfo", Array.prototype.slice.call(arguments, 0))},
			post: function (firstname, lastname, creditcard, month, year, cvv, company, address, apartment, city, state, zip, country, vat, cache) { return api.request('post', "admin", "subscription", "createBillingInfo", false, [firstname, lastname, creditcard, month, year, cvv, company, address, apartment, city, state, zip, country, vat], cache); },
			get: function (firstname, lastname, creditcard, month, year, cvv, company, address, apartment, city, state, zip, country, vat, cache) { return api.request('get', "admin", "subscription", "createBillingInfo", false, [firstname, lastname, creditcard, month, year, cvv, company, address, apartment, city, state, zip, country, vat], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "createBillingInfo"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "subscription", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "subscription", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "subscription", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "dbLogger"); }
		},
		getBillingInfo: {
			url: function(){ return api.getURL("admin", "subscription", "getBillingInfo", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "subscription", "getBillingInfo", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "subscription", "getBillingInfo", false, [], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "getBillingInfo"); }
		},
		getMonthTransactions: {
			url: function(year, month){ return api.getURL("admin", "subscription", "getMonthTransactions", Array.prototype.slice.call(arguments, 0))},
			post: function (year, month, cache) { return api.request('post', "admin", "subscription", "getMonthTransactions", false, [year, month], cache); },
			get: function (year, month, cache) { return api.request('get', "admin", "subscription", "getMonthTransactions", false, [year, month], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "getMonthTransactions"); }
		},
		getTransactions: {
			url: function(){ return api.getURL("admin", "subscription", "getTransactions", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "subscription", "getTransactions", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "subscription", "getTransactions", false, [], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "getTransactions"); }
		},
		getTrial: {
			url: function(){ return api.getURL("admin", "subscription", "getTrial", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "subscription", "getTrial", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "subscription", "getTrial", false, [], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "getTrial"); }
		},
		plans: {
			url: function(){ return api.getURL("admin", "subscription", "plans", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "subscription", "plans", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "subscription", "plans", false, [], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "plans"); }
		},
		removeAddon: {
			url: function(addon_id){ return api.getURL("admin", "subscription", "removeAddon", Array.prototype.slice.call(arguments, 0))},
			post: function (addon_id, cache) { return api.request('post', "admin", "subscription", "removeAddon", false, [addon_id], cache); },
			get: function (addon_id, cache) { return api.request('get', "admin", "subscription", "removeAddon", false, [addon_id], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "removeAddon"); }
		},
		removeAddons: {
			url: function(){ return api.getURL("admin", "subscription", "removeAddons", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "subscription", "removeAddons", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "subscription", "removeAddons", false, [], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "removeAddons"); }
		},
		updateBillingInfo: {
			url: function(token, firstname, lastname, credicard, month, year, cvv, company, address, apartment, city, state, zip, country, vat){ return api.getURL("admin", "subscription", "updateBillingInfo", Array.prototype.slice.call(arguments, 0))},
			post: function (token, firstname, lastname, credicard, month, year, cvv, company, address, apartment, city, state, zip, country, vat, cache) { return api.request('post', "admin", "subscription", "updateBillingInfo", false, [token, firstname, lastname, credicard, month, year, cvv, company, address, apartment, city, state, zip, country, vat], cache); },
			get: function (token, firstname, lastname, credicard, month, year, cvv, company, address, apartment, city, state, zip, country, vat, cache) { return api.request('get', "admin", "subscription", "updateBillingInfo", false, [token, firstname, lastname, credicard, month, year, cvv, company, address, apartment, city, state, zip, country, vat], cache); },
			clearCache: function () { return api.clear("admin", "subscription", "updateBillingInfo"); }
		},
	};
	api.support = {
		addSupportRequest: {
			url: function(content){ return api.getURL("admin", "support", "addSupportRequest", Array.prototype.slice.call(arguments, 0))},
			post: function (content, cache) { return api.request('post', "admin", "support", "addSupportRequest", false, [content], cache); },
			get: function (content, cache) { return api.request('get', "admin", "support", "addSupportRequest", false, [content], cache); },
			clearCache: function () { return api.clear("admin", "support", "addSupportRequest"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "support", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "support", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "support", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "support", "dbLogger"); }
		},
		getSupportListThisUser: {
			url: function(){ return api.getURL("admin", "support", "getSupportListThisUser", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "support", "getSupportListThisUser", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "support", "getSupportListThisUser", false, [], cache); },
			clearCache: function () { return api.clear("admin", "support", "getSupportListThisUser"); }
		},
		getTicketThisUser: {
			url: function(id){ return api.getURL("admin", "support", "getTicketThisUser", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "support", "getTicketThisUser", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "support", "getTicketThisUser", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "support", "getTicketThisUser"); }
		},
	};
	api.supportmanagement = {
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "supportmanagement", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "supportmanagement", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "supportmanagement", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "supportmanagement", "dbLogger"); }
		},
		getMessageThread: {
			url: function(id){ return api.getURL("admin", "supportmanagement", "getMessageThread", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "supportmanagement", "getMessageThread", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "supportmanagement", "getMessageThread", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "supportmanagement", "getMessageThread"); }
		},
		getRootTicketsbyStatus: {
			url: function(status){ return api.getURL("admin", "supportmanagement", "getRootTicketsbyStatus", Array.prototype.slice.call(arguments, 0))},
			post: function (status, cache) { return api.request('post', "admin", "supportmanagement", "getRootTicketsbyStatus", false, [status], cache); },
			get: function (status, cache) { return api.request('get', "admin", "supportmanagement", "getRootTicketsbyStatus", false, [status], cache); },
			clearCache: function () { return api.clear("admin", "supportmanagement", "getRootTicketsbyStatus"); }
		},
		getSupportList: {
			url: function(){ return api.getURL("admin", "supportmanagement", "getSupportList", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "supportmanagement", "getSupportList", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "supportmanagement", "getSupportList", false, [], cache); },
			clearCache: function () { return api.clear("admin", "supportmanagement", "getSupportList"); }
		},
	};
	api.tags = {
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "tags", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "tags", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "tags", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "tags", "dbLogger"); }
		},
		insertTag: {
			url: function(tag, language){ return api.getURL("admin", "tags", "insertTag", Array.prototype.slice.call(arguments, 0))},
			post: function (tag, language, cache) { return api.request('post', "admin", "tags", "insertTag", false, [tag, language], cache); },
			get: function (tag, language, cache) { return api.request('get', "admin", "tags", "insertTag", false, [tag, language], cache); },
			clearCache: function () { return api.clear("admin", "tags", "insertTag"); }
		},
		insertTags: {
			url: function(tags, language){ return api.getURL("admin", "tags", "insertTags", Array.prototype.slice.call(arguments, 0))},
			post: function (tags, language, cache) { return api.request('post', "admin", "tags", "insertTags", false, [tags, language], cache); },
			get: function (tags, language, cache) { return api.request('get', "admin", "tags", "insertTags", false, [tags, language], cache); },
			clearCache: function () { return api.clear("admin", "tags", "insertTags"); }
		},
		tagExists: {
			url: function(tag, language){ return api.getURL("admin", "tags", "tagExists", Array.prototype.slice.call(arguments, 0))},
			post: function (tag, language, cache) { return api.request('post', "admin", "tags", "tagExists", false, [tag, language], cache); },
			get: function (tag, language, cache) { return api.request('get', "admin", "tags", "tagExists", false, [tag, language], cache); },
			clearCache: function () { return api.clear("admin", "tags", "tagExists"); }
		},
	};
	api.templates = {
		compile: {
			url: function(template_id){ return api.getURL("admin", "templates", "compile", Array.prototype.slice.call(arguments, 0))},
			post: function (template_id, cache) { return api.request('post', "admin", "templates", "compile", false, [template_id], cache); },
			get: function (template_id, cache) { return api.request('get', "admin", "templates", "compile", false, [template_id], cache); },
			clearCache: function () { return api.clear("admin", "templates", "compile"); }
		},
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "templates", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "templates", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "templates", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "templates", "dbLogger"); }
		},
		get: {
			url: function(){ return api.getURL("admin", "templates", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "templates", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "templates", "get", false, [], cache); },
			clearCache: function () { return api.clear("admin", "templates", "get"); }
		},
		getAccountTemplates: {
			url: function(){ return api.getURL("admin", "templates", "getAccountTemplates", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "templates", "getAccountTemplates", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "templates", "getAccountTemplates", false, [], cache); },
			clearCache: function () { return api.clear("admin", "templates", "getAccountTemplates"); }
		},
		screenshot: {
			url: function(id){ return api.getURL("admin", "templates", "screenshot", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "templates", "screenshot", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "templates", "screenshot", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "templates", "screenshot"); }
		},
		setVariable: {
			url: function(template_id, variable, value){ return api.getURL("admin", "templates", "setVariable", Array.prototype.slice.call(arguments, 0))},
			post: function (template_id, variable, value, cache) { return api.request('post', "admin", "templates", "setVariable", false, [template_id, variable, value], cache); },
			get: function (template_id, variable, value, cache) { return api.request('get', "admin", "templates", "setVariable", false, [template_id, variable, value], cache); },
			clearCache: function () { return api.clear("admin", "templates", "setVariable"); }
		},
		setVariables: {
			url: function(template_id, data){ return api.getURL("admin", "templates", "setVariables", Array.prototype.slice.call(arguments, 0))},
			post: function (template_id, data, cache) { return api.request('post', "admin", "templates", "setVariables", false, [template_id, data], cache); },
			get: function (template_id, data, cache) { return api.request('get', "admin", "templates", "setVariables", false, [template_id, data], cache); },
			clearCache: function () { return api.clear("admin", "templates", "setVariables"); }
		},
		thumbnail: {
			url: function(id){ return api.getURL("admin", "templates", "thumbnail", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "templates", "thumbnail", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "templates", "thumbnail", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "templates", "thumbnail"); }
		},
		unsetVariable: {
			url: function(template_id, variable){ return api.getURL("admin", "templates", "unsetVariable", Array.prototype.slice.call(arguments, 0))},
			post: function (template_id, variable, cache) { return api.request('post', "admin", "templates", "unsetVariable", false, [template_id, variable], cache); },
			get: function (template_id, variable, cache) { return api.request('get', "admin", "templates", "unsetVariable", false, [template_id, variable], cache); },
			clearCache: function () { return api.clear("admin", "templates", "unsetVariable"); }
		},
	};
	api.textures = {
		dbLogger: {
			url: function(message, db){ return api.getURL("admin", "textures", "dbLogger", Array.prototype.slice.call(arguments, 0))},
			post: function (message, db, cache) { return api.request('post', "admin", "textures", "dbLogger", false, [message, db], cache); },
			get: function (message, db, cache) { return api.request('get', "admin", "textures", "dbLogger", false, [message, db], cache); },
			clearCache: function () { return api.clear("admin", "textures", "dbLogger"); }
		},
		removeTexture: {
			url: function(name){ return api.getURL("admin", "textures", "removeTexture", Array.prototype.slice.call(arguments, 0))},
			post: function (name, cache) { return api.request('post', "admin", "textures", "removeTexture", false, [name], cache); },
			get: function (name, cache) { return api.request('get', "admin", "textures", "removeTexture", false, [name], cache); },
			clearCache: function () { return api.clear("admin", "textures", "removeTexture"); }
		},
		updateName: {
			url: function(id, name){ return api.getURL("admin", "textures", "updateName", Array.prototype.slice.call(arguments, 0))},
			post: function (id, name, cache) { return api.request('post', "admin", "textures", "updateName", false, [id, name], cache); },
			get: function (id, name, cache) { return api.request('get', "admin", "textures", "updateName", false, [id, name], cache); },
			clearCache: function () { return api.clear("admin", "textures", "updateName"); }
		},
		updateTexture: {
			url: function(id){ return api.getURL("admin", "textures", "updateTexture", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "admin", "textures", "updateTexture", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "admin", "textures", "updateTexture", false, [id], cache); },
			clearCache: function () { return api.clear("admin", "textures", "updateTexture"); }
		},
		uploadFile: {
			url: function(){ return api.getURL("admin", "textures", "uploadFile", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "textures", "uploadFile", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "textures", "uploadFile", false, [], cache); },
			clearCache: function () { return api.clear("admin", "textures", "uploadFile"); }
		},
		uploadTexture: {
			url: function(){ return api.getURL("admin", "textures", "uploadTexture", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "admin", "textures", "uploadTexture", false, [], cache); },
			get: function (cache) { return api.request('get', "admin", "textures", "uploadTexture", false, [], cache); },
			clearCache: function () { return api.clear("admin", "textures", "uploadTexture"); }
		},
		uploadTextures: {
			url: function(ref){ return api.getURL("admin", "textures", "uploadTextures", Array.prototype.slice.call(arguments, 0))},
			post: function (ref, cache) { return api.request('post', "admin", "textures", "uploadTextures", false, [ref], cache); },
			get: function (ref, cache) { return api.request('get', "admin", "textures", "uploadTextures", false, [ref], cache); },
			clearCache: function () { return api.clear("admin", "textures", "uploadTextures"); }
		},
	};
	api.d2 = {
		edges: {
			url: function(){ return api.getURL("public", "2d", "edges", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "2d", "edges", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "2d", "edges", false, [], cache); },
			clearCache: function () { return api.clear("public", "2d", "edges"); }
		},
		image: {
			url: function(level_id){ return api.getURL("public", "2d", "image", Array.prototype.slice.call(arguments, 0))},
			post: function (level_id, cache) { return api.request('post', "public", "2d", "image", false, [level_id], cache); },
			get: function (level_id, cache) { return api.request('get', "public", "2d", "image", false, [level_id], cache); },
			clearCache: function () { return api.clear("public", "2d", "image"); }
		},
		lod: {
			url: function(level_id, lod, x, y){ return api.getURL("public", "2d", "lod", Array.prototype.slice.call(arguments, 0))},
			post: function (level_id, lod, x, y, cache) { return api.request('post', "public", "2d", "lod", false, [level_id, lod, x, y], cache); },
			get: function (level_id, lod, x, y, cache) { return api.request('get', "public", "2d", "lod", false, [level_id, lod, x, y], cache); },
			clearCache: function () { return api.clear("public", "2d", "lod"); }
		},
		lodcount: {
			url: function(){ return api.getURL("public", "2d", "lodcount", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "2d", "lodcount", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "2d", "lodcount", false, [], cache); },
			clearCache: function () { return api.clear("public", "2d", "lodcount"); }
		},
		nodes: {
			url: function(){ return api.getURL("public", "2d", "nodes", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "2d", "nodes", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "2d", "nodes", false, [], cache); },
			clearCache: function () { return api.clear("public", "2d", "nodes"); }
		},
		overlays: {
			url: function(){ return api.getURL("public", "2d", "overlays", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "2d", "overlays", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "2d", "overlays", false, [], cache); },
			clearCache: function () { return api.clear("public", "2d", "overlays"); }
		},
	};
	api.d3 = {
		scene: {
			url: function(){ return api.getURL("public", "3d", "scene", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "3d", "scene", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "3d", "scene", false, [], cache); },
			clearCache: function () { return api.clear("public", "3d", "scene"); }
		},
	};
	api.access = {
		template: {
			url: function(templateName){ return api.getURL("public", "access", "template", Array.prototype.slice.call(arguments, 0))},
			post: function (templateName, cache) { return api.request('post', "public", "access", "template", false, [templateName], cache); },
			get: function (templateName, cache) { return api.request('get', "public", "access", "template", false, [templateName], cache); },
			clearCache: function () { return api.clear("public", "access", "template"); }
		},
	};
	api.advertisements = {
		all: {
			url: function(){ return api.getURL("public", "advertisements", "all", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "advertisements", "all", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "advertisements", "all", false, [], cache); },
			clearCache: function () { return api.clear("public", "advertisements", "all"); }
		},
		data: {
			url: function(id){ return api.getURL("public", "advertisements", "data", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "public", "advertisements", "data", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "public", "advertisements", "data", false, [id], cache); },
			clearCache: function () { return api.clear("public", "advertisements", "data"); }
		},
		frames: {
			url: function(template_id, container_id, check_time){ return api.getURL("public", "advertisements", "frames", Array.prototype.slice.call(arguments, 0))},
			post: function (template_id, container_id, check_time, cache) { return api.request('post', "public", "advertisements", "frames", false, [template_id, container_id, check_time], cache); },
			get: function (template_id, container_id, check_time, cache) { return api.request('get', "public", "advertisements", "frames", false, [template_id, container_id, check_time], cache); },
			clearCache: function () { return api.clear("public", "advertisements", "frames"); }
		},
	};
	api.building = {
		levels: {
			url: function(){ return api.getURL("public", "building", "levels", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "building", "levels", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "building", "levels", false, [], cache); },
			clearCache: function () { return api.clear("public", "building", "levels"); }
		},
		location: {
			url: function(){ return api.getURL("public", "building", "location", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "building", "location", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "building", "location", false, [], cache); },
			clearCache: function () { return api.clear("public", "building", "location"); }
		},
	};
	api.guitranslations = {
		get: {
			url: function(){ return api.getURL("public", "guitranslations", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "guitranslations", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "guitranslations", "get", false, [], cache); },
			clearCache: function () { return api.clear("public", "guitranslations", "get"); }
		},
	};
	api.images = {
		checkImage: {
			url: function(id){ return api.getURL("public", "images", "checkImage", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "public", "images", "checkImage", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "public", "images", "checkImage", false, [id], cache); },
			clearCache: function () { return api.clear("public", "images", "checkImage"); }
		},
		get: {
			url: function(id){ return api.getURL("public", "images", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "public", "images", "get", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "public", "images", "get", false, [id], cache); },
			clearCache: function () { return api.clear("public", "images", "get"); }
		},
		thumbnail: {
			url: function(id){ return api.getURL("public", "images", "thumbnail", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "public", "images", "thumbnail", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "public", "images", "thumbnail", false, [id], cache); },
			clearCache: function () { return api.clear("public", "images", "thumbnail"); }
		},
	};
	api.languages = {
		get: {
			url: function(){ return api.getURL("public", "languages", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "languages", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "languages", "get", false, [], cache); },
			clearCache: function () { return api.clear("public", "languages", "get"); }
		},
		translation: {
			url: function(id){ return api.getURL("public", "languages", "translation", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "public", "languages", "translation", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "public", "languages", "translation", false, [id], cache); },
			clearCache: function () { return api.clear("public", "languages", "translation"); }
		},
	};
	api.lights = {
		get: {
			url: function(){ return api.getURL("public", "lights", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "lights", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "lights", "get", false, [], cache); },
			clearCache: function () { return api.clear("public", "lights", "get"); }
		},
	};
	api.locationgroups = {
		get: {
			url: function(){ return api.getURL("public", "locationgroups", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "locationgroups", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "locationgroups", "get", false, [], cache); },
			clearCache: function () { return api.clear("public", "locationgroups", "get"); }
		},
	};
	api.locations = {
		byfloor: {
			url: function(){ return api.getURL("public", "locations", "byfloor", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "locations", "byfloor", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "locations", "byfloor", false, [], cache); },
			clearCache: function () { return api.clear("public", "locations", "byfloor"); }
		},
		bygroup: {
			url: function(){ return api.getURL("public", "locations", "bygroup", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "locations", "bygroup", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "locations", "bygroup", false, [], cache); },
			clearCache: function () { return api.clear("public", "locations", "bygroup"); }
		},
		bynode: {
			url: function(node_id){ return api.getURL("public", "locations", "bynode", Array.prototype.slice.call(arguments, 0))},
			post: function (node_id, cache) { return api.request('post', "public", "locations", "bynode", false, [node_id], cache); },
			get: function (node_id, cache) { return api.request('get', "public", "locations", "bynode", false, [node_id], cache); },
			clearCache: function () { return api.clear("public", "locations", "bynode"); }
		},
		get: {
			url: function(){ return api.getURL("public", "locations", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "locations", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "locations", "get", false, [], cache); },
			clearCache: function () { return api.clear("public", "locations", "get"); }
		},
		location: {
			url: function(poi_id){ return api.getURL("public", "locations", "location", Array.prototype.slice.call(arguments, 0))},
			post: function (poi_id, cache) { return api.request('post', "public", "locations", "location", false, [poi_id], cache); },
			get: function (poi_id, cache) { return api.request('get', "public", "locations", "location", false, [poi_id], cache); },
			clearCache: function () { return api.clear("public", "locations", "location"); }
		},
		tags: {
			url: function(){ return api.getURL("public", "locations", "tags", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "locations", "tags", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "locations", "tags", false, [], cache); },
			clearCache: function () { return api.clear("public", "locations", "tags"); }
		},
	};
	api.materials = {
		get: {
			url: function(){ return api.getURL("public", "materials", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "materials", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "materials", "get", false, [], cache); },
			clearCache: function () { return api.clear("public", "materials", "get"); }
		},
		textureMaterialNames: {
			url: function(names){ return api.getURL("public", "materials", "textureMaterialNames", Array.prototype.slice.call(arguments, 0))},
			post: function (names, cache) { return api.request('post', "public", "materials", "textureMaterialNames", false, [names], cache); },
			get: function (names, cache) { return api.request('get', "public", "materials", "textureMaterialNames", false, [names], cache); },
			clearCache: function () { return api.clear("public", "materials", "textureMaterialNames"); }
		},
		textures: {
			url: function(materialName){ return api.getURL("public", "materials", "textures", Array.prototype.slice.call(arguments, 0))},
			post: function (materialName, cache) { return api.request('post', "public", "materials", "textures", false, [materialName], cache); },
			get: function (materialName, cache) { return api.request('get', "public", "materials", "textures", false, [materialName], cache); },
			clearCache: function () { return api.clear("public", "materials", "textures"); }
		},
		uniforms: {
			url: function(materialName){ return api.getURL("public", "materials", "uniforms", Array.prototype.slice.call(arguments, 0))},
			post: function (materialName, cache) { return api.request('post', "public", "materials", "uniforms", false, [materialName], cache); },
			get: function (materialName, cache) { return api.request('get', "public", "materials", "uniforms", false, [materialName], cache); },
			clearCache: function () { return api.clear("public", "materials", "uniforms"); }
		},
	};
	api.models = {
		all: {
			url: function(){ return api.getURL("public", "models", "all", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "models", "all", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "models", "all", false, [], cache); },
			clearCache: function () { return api.clear("public", "models", "all"); }
		},
		allmeshes: {
			url: function(){ return api.getURL("public", "models", "allmeshes", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "models", "allmeshes", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "models", "allmeshes", false, [], cache); },
			clearCache: function () { return api.clear("public", "models", "allmeshes"); }
		},
		get: {
			url: function(){ return api.getURL("public", "models", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "models", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "models", "get", false, [], cache); },
			clearCache: function () { return api.clear("public", "models", "get"); }
		},
		instances: {
			url: function(){ return api.getURL("public", "models", "instances", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "models", "instances", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "models", "instances", false, [], cache); },
			clearCache: function () { return api.clear("public", "models", "instances"); }
		},
		json: {
			url: function(model_id){ return api.getURL("public", "models", "json", Array.prototype.slice.call(arguments, 0))},
			post: function (model_id, cache) { return api.request('post', "public", "models", "json", false, [model_id], cache); },
			get: function (model_id, cache) { return api.request('get', "public", "models", "json", false, [model_id], cache); },
			clearCache: function () { return api.clear("public", "models", "json"); }
		},
		meshes: {
			url: function(model_id){ return api.getURL("public", "models", "meshes", Array.prototype.slice.call(arguments, 0))},
			post: function (model_id, cache) { return api.request('post', "public", "models", "meshes", false, [model_id], cache); },
			get: function (model_id, cache) { return api.request('get', "public", "models", "meshes", false, [model_id], cache); },
			clearCache: function () { return api.clear("public", "models", "meshes"); }
		},
		meshesbyfloor: {
			url: function(){ return api.getURL("public", "models", "meshesbyfloor", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "models", "meshesbyfloor", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "models", "meshesbyfloor", false, [], cache); },
			clearCache: function () { return api.clear("public", "models", "meshesbyfloor"); }
		},
		model: {
			url: function(model_id){ return api.getURL("public", "models", "model", Array.prototype.slice.call(arguments, 0))},
			post: function (model_id, cache) { return api.request('post', "public", "models", "model", false, [model_id], cache); },
			get: function (model_id, cache) { return api.request('get', "public", "models", "model", false, [model_id], cache); },
			clearCache: function () { return api.clear("public", "models", "model"); }
		},
	};
	api.navigation = {
		allAttributes: {
			url: function(){ return api.getURL("public", "navigation", "allAttributes", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "navigation", "allAttributes", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "navigation", "allAttributes", false, [], cache); },
			clearCache: function () { return api.clear("public", "navigation", "allAttributes"); }
		},
		attributes: {
			url: function(id){ return api.getURL("public", "navigation", "attributes", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "public", "navigation", "attributes", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "public", "navigation", "attributes", false, [id], cache); },
			clearCache: function () { return api.clear("public", "navigation", "attributes"); }
		},
		edges: {
			url: function(){ return api.getURL("public", "navigation", "edges", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "navigation", "edges", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "navigation", "edges", false, [], cache); },
			clearCache: function () { return api.clear("public", "navigation", "edges"); }
		},
		node: {
			url: function(id){ return api.getURL("public", "navigation", "node", Array.prototype.slice.call(arguments, 0))},
			post: function (id, cache) { return api.request('post', "public", "navigation", "node", false, [id], cache); },
			get: function (id, cache) { return api.request('get', "public", "navigation", "node", false, [id], cache); },
			clearCache: function () { return api.clear("public", "navigation", "node"); }
		},
		nodes: {
			url: function(){ return api.getURL("public", "navigation", "nodes", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "navigation", "nodes", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "navigation", "nodes", false, [], cache); },
			clearCache: function () { return api.clear("public", "navigation", "nodes"); }
		},
		nodesbytype: {
			url: function(type){ return api.getURL("public", "navigation", "nodesbytype", Array.prototype.slice.call(arguments, 0))},
			post: function (type, cache) { return api.request('post', "public", "navigation", "nodesbytype", false, [type], cache); },
			get: function (type, cache) { return api.request('get', "public", "navigation", "nodesbytype", false, [type], cache); },
			clearCache: function () { return api.clear("public", "navigation", "nodesbytype"); }
		},
	};
	api.poisettings = {
		get: {
			url: function(){ return api.getURL("public", "poisettings", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "poisettings", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "poisettings", "get", false, [], cache); },
			clearCache: function () { return api.clear("public", "poisettings", "get"); }
		},
		getAllPOISettings: {
			url: function(){ return api.getURL("public", "poisettings", "getAllPOISettings", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "poisettings", "getAllPOISettings", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "poisettings", "getAllPOISettings", false, [], cache); },
			clearCache: function () { return api.clear("public", "poisettings", "getAllPOISettings"); }
		},
		getText: {
			url: function(key){ return api.getURL("public", "poisettings", "getText", Array.prototype.slice.call(arguments, 0))},
			post: function (key, cache) { return api.request('post', "public", "poisettings", "getText", false, [key], cache); },
			get: function (key, cache) { return api.request('get', "public", "poisettings", "getText", false, [key], cache); },
			clearCache: function () { return api.clear("public", "poisettings", "getText"); }
		},
		getTexts: {
			url: function(){ return api.getURL("public", "poisettings", "getTexts", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "poisettings", "getTexts", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "poisettings", "getTexts", false, [], cache); },
			clearCache: function () { return api.clear("public", "poisettings", "getTexts"); }
		},
		map: {
			url: function(){ return api.getURL("public", "poisettings", "map", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "poisettings", "map", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "poisettings", "map", false, [], cache); },
			clearCache: function () { return api.clear("public", "poisettings", "map"); }
		},
		setting: {
			url: function(key){ return api.getURL("public", "poisettings", "setting", Array.prototype.slice.call(arguments, 0))},
			post: function (key, cache) { return api.request('post', "public", "poisettings", "setting", false, [key], cache); },
			get: function (key, cache) { return api.request('get', "public", "poisettings", "setting", false, [key], cache); },
			clearCache: function () { return api.clear("public", "poisettings", "setting"); }
		},
	};
	api.settings = {
		get: {
			url: function(){ return api.getURL("public", "settings", "get", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "settings", "get", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "settings", "get", false, [], cache); },
			clearCache: function () { return api.clear("public", "settings", "get"); }
		},
		getText: {
			url: function(key){ return api.getURL("public", "settings", "getText", Array.prototype.slice.call(arguments, 0))},
			post: function (key, cache) { return api.request('post', "public", "settings", "getText", false, [key], cache); },
			get: function (key, cache) { return api.request('get', "public", "settings", "getText", false, [key], cache); },
			clearCache: function () { return api.clear("public", "settings", "getText"); }
		},
		getTexts: {
			url: function(){ return api.getURL("public", "settings", "getTexts", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "settings", "getTexts", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "settings", "getTexts", false, [], cache); },
			clearCache: function () { return api.clear("public", "settings", "getTexts"); }
		},
		map: {
			url: function(){ return api.getURL("public", "settings", "map", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "settings", "map", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "settings", "map", false, [], cache); },
			clearCache: function () { return api.clear("public", "settings", "map"); }
		},
		setting: {
			url: function(key){ return api.getURL("public", "settings", "setting", Array.prototype.slice.call(arguments, 0))},
			post: function (key, cache) { return api.request('post', "public", "settings", "setting", false, [key], cache); },
			get: function (key, cache) { return api.request('get', "public", "settings", "setting", false, [key], cache); },
			clearCache: function () { return api.clear("public", "settings", "setting"); }
		},
	};
	api.statistics = {
		click: {
			url: function(data, session_id, type){ return api.getURL("public", "statistics", "click", Array.prototype.slice.call(arguments, 0))},
			post: function (data, session_id, type, cache) { return api.request('post', "public", "statistics", "click", false, [data, session_id, type], cache); },
			get: function (data, session_id, type, cache) { return api.request('get', "public", "statistics", "click", false, [data, session_id, type], cache); },
			clearCache: function () { return api.clear("public", "statistics", "click"); }
		},
		device: {
			url: function(width, height, kiosk){ return api.getURL("public", "statistics", "device", Array.prototype.slice.call(arguments, 0))},
			post: function (width, height, kiosk, cache) { return api.request('post', "public", "statistics", "device", false, [width, height, kiosk], cache); },
			get: function (width, height, kiosk, cache) { return api.request('get', "public", "statistics", "device", false, [width, height, kiosk], cache); },
			clearCache: function () { return api.clear("public", "statistics", "device"); }
		},
		endSession: {
			url: function(session_id, language_id){ return api.getURL("public", "statistics", "endSession", Array.prototype.slice.call(arguments, 0))},
			post: function (session_id, language_id, cache) { return api.request('post', "public", "statistics", "endSession", false, [session_id, language_id], cache); },
			get: function (session_id, language_id, cache) { return api.request('get', "public", "statistics", "endSession", false, [session_id, language_id], cache); },
			clearCache: function () { return api.clear("public", "statistics", "endSession"); }
		},
		search: {
			url: function(data, session_id, type){ return api.getURL("public", "statistics", "search", Array.prototype.slice.call(arguments, 0))},
			post: function (data, session_id, type, cache) { return api.request('post', "public", "statistics", "search", false, [data, session_id, type], cache); },
			get: function (data, session_id, type, cache) { return api.request('get', "public", "statistics", "search", false, [data, session_id, type], cache); },
			clearCache: function () { return api.clear("public", "statistics", "search"); }
		},
		startSession: {
			url: function(language_id, kiosk, application, layout, device_id){ return api.getURL("public", "statistics", "startSession", Array.prototype.slice.call(arguments, 0))},
			post: function (language_id, kiosk, application, layout, device_id, cache) { return api.request('post', "public", "statistics", "startSession", false, [language_id, kiosk, application, layout, device_id], cache); },
			get: function (language_id, kiosk, application, layout, device_id, cache) { return api.request('get', "public", "statistics", "startSession", false, [language_id, kiosk, application, layout, device_id], cache); },
			clearCache: function () { return api.clear("public", "statistics", "startSession"); }
		},
	};
	api.templates = {
		css: {
			url: function(template_id){ return api.getURL("public", "templates", "css", Array.prototype.slice.call(arguments, 0))},
			post: function (template_id, cache) { return api.request('post', "public", "templates", "css", false, [template_id], cache); },
			get: function (template_id, cache) { return api.request('get', "public", "templates", "css", false, [template_id], cache); },
			clearCache: function () { return api.clear("public", "templates", "css"); }
		},
	};
	api.textures = {
		count: {
			url: function(){ return api.getURL("public", "textures", "count", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "textures", "count", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "textures", "count", false, [], cache); },
			clearCache: function () { return api.clear("public", "textures", "count"); }
		},
		map: {
			url: function(){ return api.getURL("public", "textures", "map", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "textures", "map", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "textures", "map", false, [], cache); },
			clearCache: function () { return api.clear("public", "textures", "map"); }
		},
		mipmap: {
			url: function(level, name){ return api.getURL("public", "textures", "mipmap", Array.prototype.slice.call(arguments, 0))},
			post: function (level, name, cache) { return api.request('post', "public", "textures", "mipmap", false, [level, name], cache); },
			get: function (level, name, cache) { return api.request('get', "public", "textures", "mipmap", false, [level, name], cache); },
			clearCache: function () { return api.clear("public", "textures", "mipmap"); }
		},
		names: {
			url: function(){ return api.getURL("public", "textures", "names", Array.prototype.slice.call(arguments, 0))},
			post: function (cache) { return api.request('post', "public", "textures", "names", false, [], cache); },
			get: function (cache) { return api.request('get', "public", "textures", "names", false, [], cache); },
			clearCache: function () { return api.clear("public", "textures", "names"); }
		},
		texture: {
			url: function(name){ return api.getURL("public", "textures", "texture", Array.prototype.slice.call(arguments, 0))},
			post: function (name, cache) { return api.request('post', "public", "textures", "texture", false, [name], cache); },
			get: function (name, cache) { return api.request('get', "public", "textures", "texture", false, [name], cache); },
			clearCache: function () { return api.clear("public", "textures", "texture"); }
		},
		texturebyid: {
			url: function(texture_id){ return api.getURL("public", "textures", "texturebyid", Array.prototype.slice.call(arguments, 0))},
			post: function (texture_id, cache) { return api.request('post', "public", "textures", "texturebyid", false, [texture_id], cache); },
			get: function (texture_id, cache) { return api.request('get', "public", "textures", "texturebyid", false, [texture_id], cache); },
			clearCache: function () { return api.clear("public", "textures", "texturebyid"); }
		},
		thumbnail: {
			url: function(name){ return api.getURL("public", "textures", "thumbnail", Array.prototype.slice.call(arguments, 0))},
			post: function (name, cache) { return api.request('post', "public", "textures", "thumbnail", false, [name], cache); },
			get: function (name, cache) { return api.request('get', "public", "textures", "thumbnail", false, [name], cache); },
			clearCache: function () { return api.clear("public", "textures", "thumbnail"); }
		},
		thumbnailbyid: {
			url: function(texture_id){ return api.getURL("public", "textures", "thumbnailbyid", Array.prototype.slice.call(arguments, 0))},
			post: function (texture_id, cache) { return api.request('post', "public", "textures", "thumbnailbyid", false, [texture_id], cache); },
			get: function (texture_id, cache) { return api.request('get', "public", "textures", "thumbnailbyid", false, [texture_id], cache); },
			clearCache: function () { return api.clear("public", "textures", "thumbnailbyid"); }
		},
	};
return api;
}]);