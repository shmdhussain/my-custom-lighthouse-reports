//node --inspect sna-test.js 7 //test in leg7
//node --debug-brk --inspect sna-test.js 


const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const config = require('./custom-config/config.js');
const urlsToAnalyse = require('./paths/SEO4_URLS.js').paths;
var results;

/*START: Reference Domain Name From CommandLine argument*/
var domainItem = process.argv[2] || 0;
var domainList = require('./domains/domainList').domainList;

var domain = domainList[domainItem].webDomain;
/*END: Reference Domain Name From CommandLine argument*/

/*START: Test Domain Name From CommandLine argument*/
var testDomainItem = process.argv[3] || 0;

var testDomain = domainList[testDomainItem].webDomain;
/*END: Test Domain Name From CommandLine argument*/


async function launchChromeAndRunLighthouse(pages, opts, config = null) {

	chrome = await chromeLauncher.launch({ chromeFlags: opts.chromeFlags });
	opts.port = chrome.port;
	for (var i = 0; i < pages.length; i++) {
		/*START: Get Data for the refernce domain*/
    	results = await lighthouse(domain + pages[i].url, opts, config);
    	delete results.artifacts;
        console.log("%c The Data For the Page: " + pages[i].title, "color:green;font-size:20px");
        console.log(results);
		/*END: Get Data for the refernce domain*/

		/*START: Get Data for the test domain*/
    	results = await lighthouse(testDomain + pages[i].url, opts, config);
    	delete results.artifacts;
        console.log("%c The Data For the Page: " + pages[i].title, "color:blue;font-size:20px");
        console.log(results);
		/*END: Get Data for the test domain*/

    }

    return chrome.kill();
}

const opts = {
    chromeFlags: [],
    disableDeviceEmulation  : true,
    disableCpuThrottling    : true,
    disableNetworkThrottling: true
};

// Usage:


launchChromeAndRunLighthouse(urlsToAnalyse, opts, config).then(done => {
    // debugger;
    console.log("Light House Reporting has been completed");
    console.log(done);
});