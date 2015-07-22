'use strict';
var exec = require('child_process').exec;
var semverValid = require('semver').valid;
var regex = /tag:\s*(.+?)[,\)]/gi;
var cmd = 'git log --date-order --tags --simplify-by-decoration --pretty=format:"%d"';

module.exports = function(callback) {
  regex.lastIndex = 0;
  exec(cmd, function(err, data) {
    if (err) {
      callback(err);
      return;
    }

    var hasSemver = false;

    data.split('\n').some(function(decorations) {
      var match;
      while (match = regex.exec(decorations)) {
        var tag = match[1];
        if (semverValid(tag)) {
          callback(null, tag);
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
