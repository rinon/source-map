/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define(function (require, exports, module) {

  var assert = require('assert');
  var base64VLQ = require('source-map/base64-vlq');

  exports['test normal encoding and decoding'] = function () {
    var result;
    for (var i = -255; i < 256; i++) {
      result = base64VLQ.decode(base64VLQ.encode(i));
      assert.ok(result);
      assert.equal(result.value, i);
      assert.equal(result.rest, "");
    }
  };

});
