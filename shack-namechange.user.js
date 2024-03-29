// ==UserScript==
// @name Shack-namechange
// @namespace https://github.com/gimpyprophet/shack-namechange/
// @description Adds previous user names next to the current user name
// @include http://shacknews.com/*
// @include http://www.shacknews.com/*
// @exclude http://www.shacknews.com/frame_chatty.x*
// @exclude http://bananas.shacknews.com/*
// @exclude http://*.gmodules.com/*
// @exclude http://*.facebook.com/*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// ==/UserScript==
/*
	------------------------------------------------------------

	Shack [namechange]
	Author: Austin McGee - www.austinmcgee.com
	(C)2007-2011 Austin McGee

	------------------------------------------------------------

	REVISIONS:

	2012-12-27
		- Initial Release
*/

(function()
{
	// grab start time of script
	var benchmarkTimer = null;
	var scriptStartTime = getTime();

	function tw_log(str) { GM_log(str); }
	function getTime() { benchmarkTimer = new Date(); return benchmarkTimer.getTime(); }
	function stripHtml(html) { return String(html).replace(/(<([^>]+)>)/ig, ''); }
	function trim(str) { return String(str).replace(/^\s+|\s+$/g,""); }
	
	// ThomW: I took getElementsByClassName and stripped it down to just what's needed by this script
	function getElementByClassName(oElm, strTagName, strClassName)
	{
		try
		{
			var arrElements = oElm.getElementsByTagName(strTagName);
			for(var i=0; i < arrElements.length; i++)
			{
				if (arrElements[i].className.indexOf(strClassName) == 0)
				{
					return arrElements[i];
				}
			}
		}
		catch (ex)
		{
			return null; 
		}
	}
	
	function createButton(tag, username)
	{
		var button = document.createElement("a");
		button.id = tag + username;
		button.href = "http://www.shacknews.com/user/" + tag + "/posts";
		button.className = "namechange_button";
		button.setAttribute('style', 'color: #080 !important; font-weight: normal; padding: 0 0.15em;');
		button.appendChild(document.createTextNode(tag));
		
		var span = document.createElement("span");
		span.appendChild(button);
		span.style.padding = '0 0.025em';
		
		return span;	
	}

	// shackLol functions
	function installNameButton(threadIdList)
	{
		var dbg = false;

		var startTime = getTime();

		var msg = '';

		threadIdList = String(threadIdList).split(',');

		for (var i = 0, ii = threadIdList.length; i < ii; i++)
		{
			var threadId = threadIdList[i];
			
			// Don't add #lol_ if it already exists 
			if (document.getElementById('namechange_' + threadId) !== null) 
			{
				continue;
			}

			// find threadId
			var t = document.getElementById('item_' + threadId);
			if (!t)
			{
				if (dbg) { tw_log('COULD NOT FIND item_' + threadId); }
				return false;
			}

			// find div.postmeta
			var spanUser = getElementByClassName(t, 'span', 'user');
			if (!spanUser)
			{
				if (dbg) { tw_log('getElementsByClassName could not locate span.user'); }
				return false;
			}
			
			var divNameChange = document.createElement('div');
			divNameChange.setAttribute('style', 'display: inline; float: none; padding-left: 10px; font-size: 14px;');
			divNameChange.setAttribute('id', 'namechange_' + threadId);

			// Add namechange to the post if necessary
			if (spanUser.firstChild)
			{
				var userName = spanUser.firstChild.textContent;
				var oldUserName = "";
				// go through all of the names we know of and set what it should be
				if (userName == "_jon") oldUserName = "poopsex_";
				else if (userName == "@gamedreamer") oldUserName = "Legolas5";
				else if (userName == "(mojo)") oldUserName = "mojoald";
				else if (userName == "Alice O'Connor") oldUserName = "A Sponge";
				else if (userName == "Bamtan") oldUserName = "hardfl1p";
				else if (userName == "brickmatt") oldUserName = "lazarusb";
				else if (userName == "boring gegtik") oldUserName = "gegtik";
				else if (userName == "Chris Remo") oldUserName = "remo";
				else if (userName == "Dave-A") oldUserName = "thaPerfectDrug";
				else if (userName == "degenerate") oldUserName = "dg3nr8";
				else if (userName == "deject") oldUserName = "MrFunky3000";
				else if (userName == "devnullgt") oldUserName = "darklox";
				else if (userName == "dignan") oldUserName = "zagzig32";
				else if (userName == "dougb") oldUserName = "mayo";
				else if (userName == "Druuge") oldUserName = "icon_of_syn";
				else if (userName == "edgewise") oldUserName = "futtbucker";
				else if (userName == "GameDreamer") oldUserName = "@gamedreamer";
				else if (userName == "Hagbard") oldUserName = "romulan";
				else if (userName == "helvetica") oldUserName = "zerologik";
				else if (userName == "kgargonmagrix79") oldUserName = "dougb";
				else if (userName == "kgargs") oldUserName = "kgargonmagrix79";
				else if (userName == "MrBlarg") oldUserName = "smegmar";
				else if (userName == "My Documents") oldUserName = "karen sympathy";
				else if (userName == "Nick Breckon") oldUserName = "Ratsofatsorat";
				else if (userName == "ninjase") oldUserName = "sexninja!!!!";
				else if (userName == "pandastrong") oldUserName = "emocore";
				else if (userName == "R@zzle") oldUserName = "kpxkrnjc";
				else if (userName == "randomposter") oldUserName = "thewriter";
				else if (userName == "Super Sparker") oldUserName = "MuaaSan";
				else if (userName == "theghostofsmdever") oldUserName = "smdever";
				else if (userName == "thewriter") oldUserName = "rand04";

				if (oldUserName != "")
				{
					divNameChange.appendChild(createButton(oldUserName));
				}
			}
			
			// add d to spanUser
			spanUser.appendChild(divNameChange);
		}
	}

	function getIdList() {
		/*
		This retrieves a comma-separated list of all the root posts on a page
		*/
		var items = document.evaluate("//div[contains(@class, 'fullpost')]/..", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var idList = '';
		var i = 0;
		for (item = null, i = 0; item = items.snapshotItem(i); i++) {
			idList += idList.length ? ',' : '';
			idList += item.id.substr(5);
		}
		return idList;
	}
	
	
	function installNameButtons() {
		installNameButton(getIdList());
	}
	

	/* MAIN
	*/
	
	// Install the namechange button to any page with a div.commentsblock
	if (typeof(getElementByClassName(document, 'div', 'commentsblock')) != 'undefined')
	{
		installNameButtons(); 
	}

	// Create event handler to watch for DOMNode changes
	document.addEventListener('DOMNodeInserted', function(e) 
	{
		if (e.target.className.indexOf('fullpost') !== -1)
		{
			installNameButtons();
		}
		
		if (e.target.id.indexOf('root_') !== -1)
		{
			installNameButtons(); 
		}
	}, false);

	// log execution time
	tw_log(location.href + ' / ' + (getTime() - scriptStartTime) + 'ms');
	
})();
