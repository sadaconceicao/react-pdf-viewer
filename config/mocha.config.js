var jsdom = require('jsdom');
var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

const { JSDOM } = jsdom;
let { document } = (new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>')).window;
global.document = document;
global.navigator = document.defaultView.navigator;
global.window = document;

// Mock localStorage...
global.window.localStorage = {
    setItem: function(key, value) {
        /* NOP */
    },
    getItem: function(key) {
        return null;
    }
}

process.env.NODE_ENV = 'test';

require('babel-register')();

require.extensions['.css'] = function () {return null;};
require.extensions['.scss'] = function () {return null;};
require.extensions['.gif'] = function(){ return null; };
require.extensions['.png'] = function () {return null;};
require.extensions['.jpg'] = function () {return null;};
