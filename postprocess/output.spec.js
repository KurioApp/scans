var assert = require('assert');
var expect = require('chai').expect;
var output = require('./output')

/**
 * Creates an object that looks like an output stream that we can write
 * to (but is actually just a buffer caching the data)
 */
var createOutputBuffer = function () {
    return {
        cache: '',

        write: function (data) {
            this.cache += data;
        },

        end: function () {},
        on: function (event, fn) {},
        once: function(event, fn) {},
        emit: function(even, fn) {}
    }
}

describe('output', function () {
    describe('junit', function () {
        it('should generate empty junit when no results', function () {
            var buffer = createOutputBuffer();
            var handler = output.createJunit(buffer);
            handler.close();
            expect(buffer.cache).to.equal(
                '<?xml version="1.0" encoding="UTF-8" ?>\n' + 
                '<testsuites>\n</testsuites>\n');
        })

        it('should indicate one pass there is one passing result', function () {
            var buffer = createOutputBuffer();
            var handler = output.createJunit(buffer);
            handler.writeResult({status: 0}, {title:'myTitle'}, 'key');
            handler.close();

            expect(buffer.cache).to.include(' tests="1" ');
            expect(buffer.cache).to.include(' failures="0" ');
            expect(buffer.cache).to.include(' errors="0" ');
        })

        it('should indicate one failure there is one failing result', function () {
            var buffer = createOutputBuffer();
            var handler = output.createJunit(buffer);
            handler.writeResult({status: 2, message: 'fail message'}, {title:'myTitle'}, 'key');
            handler.close();

            expect(buffer.cache).to.include(' tests="1" ');
            expect(buffer.cache).to.include(' failures="1" ');
            expect(buffer.cache).to.include(' errors="0" ');
            expect(buffer.cache).to.include('fail message');
        })

        it('should indicate one error there is one failing error', function () {
            var buffer = createOutputBuffer();
            var handler = output.createJunit(buffer);
            handler.writeResult({status: 3, message: 'error message'}, {title:'myTitle'}, 'key');
            handler.close();

            expect(buffer.cache).to.include(' tests="1" ');
            expect(buffer.cache).to.include(' failures="0" ');
            expect(buffer.cache).to.include(' errors="1" ');
            expect(buffer.cache).to.include('error message');
        })
    })

    describe('csv', function () {
        it('should generate only header if no results', function () {
            var buffer = createOutputBuffer();
            var handler = output.createCsv(buffer);
            handler.close();
            expect(buffer.cache).to.equal('');
        })

        it('should indicate one pass there is one passing result', function () {
            var buffer = createOutputBuffer();
            var handler = output.createCsv(buffer);
            handler.writeResult({status: 0}, {title:'myTitle'}, 'key');
            handler.close();
            expect(buffer.cache).to.equal('category,title,resource,region,statusWord,message\n,myTitle,N/A,Global,OK,\n');
        })
    })

    describe('html', function () {
        it('should generate file with no row if no results', function () {
            var buffer = createOutputBuffer();
            var handler = output.createHtml(buffer);
            handler.close();
            expect(buffer.cache).to.equal(`\n<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="utf-8">\n        <meta http-equiv="X-UA-Compatible" content="IE=edge">\n        <title>CloudSploit Scans - Report</title>\n        <link href="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/css/theme.bootstrap_4.min.css" rel="stylesheet">\n        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet">\n        <style>\n            html { font-family: Helvetica; font-size: 12px; }\n            footer { font-size: 11px; }\n        </style>\n    </head>\n    <body>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.widgets.min.js"></script>\n    <script>\n        $(document).ready(function(){\n            var $table = $(\'table\').tablesorter({\n                theme: \'bootstrap\',\n                widgets: ["zebra", "filter", "columns"],\n                widgetOptions : {\n                    zebra : ["even", "odd"],\n                    filter_columnFilters: true,\n                    filter_cssFilter: [\n                        \'form-control\',\n                        \'form-control\',\n                        \'form-control\',\n                        \'form-control\',\n                        \'form-control custom-select\',\n                        \'form-control\'\n                    ]\n                }\n            });\n        });\n    </script>\n\n    <table class="table table-bordered table-striped">\n        <thead class="thead-dark"> <tr>\n            <th>Category</th>\n            <th>Title</th>\n            <th>Resource</th>\n            <th>Region</th>\n            <th class="filter-select filter-exact" data-placeholder="Pick Status">Status</th>\n            <th>Message</th>\n        </tr> </thead>\n        <tbody>\n        \n        </tbody>\n    </table>\n    </body>\n</html>`);
        })

        it('should indicate one pass there is one passing result', function () {
            var buffer = createOutputBuffer();
            var handler = output.createHtml(buffer);
            handler.writeResult({status: 0}, {title:'myTitle'}, 'key');
            handler.close();
            expect(buffer.cache).to.equal(`\n<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="utf-8">\n        <meta http-equiv="X-UA-Compatible" content="IE=edge">\n        <title>CloudSploit Scans - Report</title>\n        <link href="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/css/theme.bootstrap_4.min.css" rel="stylesheet">\n        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet">\n        <style>\n            html { font-family: Helvetica; font-size: 12px; }\n            footer { font-size: 11px; }\n        </style>\n    </head>\n    <body>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.widgets.min.js"></script>\n    <script>\n        $(document).ready(function(){\n            var $table = $(\'table\').tablesorter({\n                theme: \'bootstrap\',\n                widgets: ["zebra", "filter", "columns"],\n                widgetOptions : {\n                    zebra : ["even", "odd"],\n                    filter_columnFilters: true,\n                    filter_cssFilter: [\n                        \'form-control\',\n                        \'form-control\',\n                        \'form-control\',\n                        \'form-control\',\n                        \'form-control custom-select\',\n                        \'form-control\'\n                    ]\n                }\n            });\n        });\n    </script>\n\n    <table class="table table-bordered table-striped">\n        <thead class="thead-dark"> <tr>\n            <th>Category</th>\n            <th>Title</th>\n            <th>Resource</th>\n            <th>Region</th>\n            <th class="filter-select filter-exact" data-placeholder="Pick Status">Status</th>\n            <th>Message</th>\n        </tr> </thead>\n        <tbody>\n        <tr><td>undefined</td><td>myTitle</td><td>N/A</td><td>Global</td><td>OK</td><td>undefined</td></tr>\n        </tbody>\n    </table>\n    </body>\n</html>`);
        })
    })

    describe('json', function () {
        it('should generate empty array if no results', function () {
            var buffer = createOutputBuffer();
            var handler = output.createJson(buffer);
            handler.close();
            expect(buffer.cache).to.equal('[]');
        })

        it('should indicate one pass there is one passing result', function () {
            var buffer = createOutputBuffer();
            var handler = output.createJson(buffer);
            handler.writeResult({status: 0}, {title:'myTitle'}, 'key');
            handler.close();
            expect(buffer.cache).to.equal('[{"plugin":"key","title":"myTitle","resource":"N/A","region":"Global","status":"OK"}]');
        })
    })

    describe('create', function() {
        it('should write to console without errors', function () {
            // Create with no arguments is valid and just says create the
            // default, which is console output.
            var handler = output.create([])

            handler.writeResult({status: 0}, {title:'myTitle'}, 'key');
            handler.close();
            // No expect here because in the current structure, we cannot
            // capture the standard output
        })

        it('should handle compliance sections without errors', function () {
            // Create with no arguments is valid and just says create the
            // default, which is console output.
            var handler = output.create([]);

            // Create the information about the compliance rule - for this
            // test, it doesn't have to be anything fancy
            var complianceRule = {
                describe: function (pluginKey, plugin) {
                    return 'desc';
                }
            };
            var plugin = {
                title: 'title'
            };
            var pluginKey = 'someIdentifier';

            handler.startCompliance(plugin, pluginKey, complianceRule);
            handler.writeResult({status: 0}, {title:'myTitle'}, 'key');
            handler.endCompliance(plugin, pluginKey, complianceRule);
            handler.close();
            // No expect here because in the current structure, we cannot
            // capture the standard output
        })
    })
})