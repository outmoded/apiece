'use strict';

// Load modules

const Hoek = require('hoek');


// Declare internals

const internals = {};


exports.wrap = function (options) {

    if (typeof options === 'function') {
        if (options.isApiece) {
            return options;
        }

        options = { end: options };
    }
    else if (options) {
        Hoek.assert(typeof options === 'object', 'Invalid options object');
    }
    else {
        options = {};
    }

    Hoek.assert(!options.end || typeof options.end === 'function', 'Invalid end option');
    Hoek.assert(!options.each || typeof options.each === 'function', 'Invalid each option');

    return internals.generate(options);
};


internals.generate = function (options) {

    // No end handler

    if (!options.end) {
        const apiece = function () { };
        apiece.isApiece = true;
        apiece.each = options.each || Hoek.ignore;
        return apiece;
    }

    // End and each handlers

    if (options.each) {
        const apiece = function (err, results) {

            if (results !== undefined &&
                results !== null) {

                if (Array.isArray(results)) {
                    results.forEach((result) => options.each(result));
                }
                else {
                    options.each(results);
                }
            }

            return options.end(err);
        };

        apiece.isApiece = true;
        apiece.each = options.each;
        return apiece;
    }

    // End without each handler

    let items = [];
    const apiece = function (err, results) {

        if (results !== undefined &&
            results !== null) {

            items = items.concat(results);
        }

        return options.end(err, items);
    };

    apiece.isApiece = true;
    apiece.each = function (result) {

        items.push(result);
    };

    return apiece;
};
