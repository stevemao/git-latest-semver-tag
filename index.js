'use strict';
var exec = require('child_process').exec;
var semverValid = require('semver').valid;
var regex = /tag:\s*(.+?)[,\)]/gi;

module.exports = function(callback) {
  exec('git log --date-order --tags --simplify-by-decoration --pretty=format:"%d"', function(err, data) {
    if (err) {
      callback(err);
      return;
    }

    var hasSemver = false;

    data.split('\n').some(function(raw) {
      var tag;
      while (tag = regex.exec(raw)) {
        var ver = tag[1];
        if (semverValid(ver)) {
          callback(null, ver);
          hasSemver = true;
          return true;
        }
      }
    });

    if (!hasSemver) {
      callback(null, '');
    }
  });
};
