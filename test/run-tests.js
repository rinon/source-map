#!/usr/bin/env node
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

function run(tests) {
  var failures = [];
  var total = 0;
  var passed = 0;

  for (var i = 0; i < tests.length; i++) {
    for (var k in tests[i].testCase) {
      if (/^test/.test(k)) {
        total++;
        try {
          tests[i].testCase[k]();
          passed++;
          process.stdout.write('.');
        }
        catch (e) {
          failures.push({
            name: tests[i].name + ': ' + k,
            error: e
          });
          process.stdout.write('E');
        }
      }
    }
  }

  process.stdout.write('\n');
  console.log(passed + ' / ' + total + ' tests passed.');

  failures.forEach(function (f) {
    console.log('================================================================================');
    console.log(f.name);
    console.log('--------------------------------------------------------------------------------');
    console.log(f.error.stack);
  });

  return failures.length;
}

var code;

process.stdout.on('close', function () {
  process.exit(code);
});

var requirejs = require('requirejs');

requirejs.config({
  paths: {
    'source-map': '../lib/source-map'
  },
  nodeRequire: require
});

var fs = require('fs');

function isTestFile(f) {
  return /^test\-.*?\.js/.test(f);
}

function toModule(f) {
  return './' + f.replace(/\.js$/, '');
}

var requires = fs.readdirSync(__dirname).filter(isTestFile).map(toModule);

requirejs(requires, function () {

  code = run([].slice.call(arguments).map(function (mod, i) {
    return {
      name: requires[i],
      testCase: mod
    };
  }));

});
