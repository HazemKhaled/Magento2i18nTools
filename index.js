/**
 * Migrate csv language files of Magento 1 to Magneto 2 by comparing keys, Also
 * You can xliff from branch to another branch same way of comparing key (source).
 *
 * Final result will be replacment for source xliff file to upload on crowdin.com.
 *
 * @auther Hazem Khaled <hazem.khaled@gmail.com>
 * @version 0.1
 */

/**
 * Language path
 * @type {String}
 */
var path = 'ar_SA/',

    // Dependacies
    fs = require('fs'),
    basicCSV = require("basic-csv"),
    xml2js = require('xml2js'),
    xmlParser = new xml2js.Parser(),

    // Load files
    sourceFile = fs.readFileSync(path + 'source.xliff', 'utf8'),
    targetFile = fs.readFileSync(path + 'target.xliff', 'utf8'),

    // empty objects to fill
    sourceKeys = {},
    targetKeys = {},
    files = [],
    flag = 0;

/*
 * @param {string} str - an XLIFF document as a string
 * @param {function} cb - a mandatory callback for the output
 */
function parseXML(str, cb) {
    xmlParser.parseString(str, (err, data) => {
        cb(data.xliff.file);
    });
}

// parse csv file
basicCSV.readCSV(path + "source.csv", function(error, rows) {

    // ignore if not exist
    if (error) {
        flag++;
        output();
        return;
    }

    // Fill source with our strings
    rows.forEach(row => {
        if (!sourceKeys[row[0]]) {
            sourceKeys[row[0]] = row[1];
        }
    });

    flag++;
    output();
});

// Load source xliff file to get translated keys
parseXML(sourceFile, function(sourceObject) {
    sourceObject.forEach($_ => {
        if (!$_.body[0]['trans-unit']) {
            return;
        }

        var units = $_.body[0]['trans-unit'];
        units.forEach(line => {

            // Add only translated keys
            if (line.target[0].$ && line.target[0].$.state === 'translated') {
                sourceKeys[line.source[0]] = line.target[0]._;
            }
        });
    });

    flag++;
    output();
});

// Load target xliff to get needs-translation keys with ids and file info
parseXML(targetFile, function(targetObject) {

    targetObject.forEach($_ => {

        // ignore empty keys
        if (!$_.body[0]['trans-unit']) {
            return;
        }

        // We need this info to draw file tag
        var file = {
                $: $_.$,
                body: []
            },
            units = $_.body[0]['trans-unit'];

        units.forEach(line => {

            // Add needs-translation keys with no translation
            if (line.target[0].$ && line.target[0].$.state === 'needs-translation') {
                file.body.push({
                    $: line.$,
                    source: line.source[0],
                    target: undefined
                });
            }
        });

        // Ignore files has no needs-translation
        if (file.body.length > 0) {
            files.push(file);
        }
    });

    flag++;
    output();
});

/**
 * prepare tranlsated object by collecting translation from csv and source xliff files
 * @return {void}
 */
function output() {

    // Ignore if any other of the 3 async tasks still in progress
    if (flag < 3) {
        return;
    }

    var counter = 0;

    for (var fileKey in files) {
        for (var key in files[fileKey].body) {
            var sourceKey = files[fileKey].body[key].source;

            // Make sure key already in translated object
            if (sourceKeys[sourceKey] && files[fileKey].body[key].target !== sourceKeys[sourceKey]) {
                files[fileKey].body[key].target = sourceKeys[sourceKey];
                counter++;
            }
        }
    }

    console.log('New words:', counter);
    exportXML();
}

/**
 * Generate output.xml file
 * @return {void}
 */
function exportXML() {

    var convert = require('xml-js'),
        options = {
            compact: false,
            spaces: 0
        },
        json = {
            "declaration": {
                "attributes": {
                    "version": "1.0",
                    "encoding": "utf-8"
                }
            },
            "elements": [{
                "type": "element",
                "name": "xliff",
                "attributes": {
                    "version": 1.2,
                    "xmlns": "urn:oasis:names:tc:xliff:document:1.2"
                },
                "elements": []
            }]
        };

    // Draw file tags
    files.forEach(file => {

        var unites = [];

        // Loop on translated items
        file.body.forEach(unit => {

            // Ignore if no translation found
            if (!unit.target) {
                return;
            }

            // Finall xml structure
            unites.push({
                "type": "element",
                "name": "trans-unit",
                "attributes": {
                    "id": unit.$.id,
                    "identifier": unit.$.identifier
                },
                "elements": [{
                    "type": "element",
                    "name": "source",
                    "elements": [{
                        "type": "text",
                        "text": unit.source
                    }]
                }, {
                    "type": "element",
                    "name": "target",
                    "attributes": {
                        "state": "translated"
                    },
                    "elements": [{
                        "type": "text",
                        "text": unit.target
                    }]
                }]
            });
        });


        // Don't add file has no translated keys
        if (unites.length === 0) {
            return;
        }

        // Final file object
        var $ = file.$,
            e = {
                "type": "element",
                "name": "file",
                "attributes": {
                    "id": $.id,
                    "original": $.original,
                    "source-language": $["source-language"],
                    "target-language": $["target-language"],
                    "datatype": $.datatype
                },
                "elements": [{
                    "type": "element",
                    "name": "body",
                    "elements": unites
                }]
            };
        json.elements[0].elements.push(e);
    });

    var result = convert.json2xml(json, options);

    fs.writeFileSync(path + 'output.xliff', result, {
        encoding: 'utf8'
    });
}
