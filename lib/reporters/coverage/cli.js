/*
 * Licensed to Cloudkick, Inc ('Cloudkick') under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * Cloudkick licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * _reportCoverage is taken from expresso
 *  <https://github.com/visionmedia/expresso> which is MIT licensed.
 *  Copyright(c) TJ Holowaychuk <tj@vision-media.ca>
 */

var sys = require('util');
var util = require('util');
var path = require('path');
var fs = require('fs');

var rimraf = require('rimraf');
var templates = require('magic-templates');

var constants = require('./../../constants');
var utils = require('./../../util');
var coverage = require('./../../coverage');
var CoverageReporter = require('./base').CoverageReporter;

function CliReporter(tests, options) {
  CoverageReporter.call(this, tests, options);

  this._coverage = {};
}

CliReporter.prototype.handleTestFileComplete = function(filePath, coverageObj) {
  var filename = filePath;
  this._coverage[filename] = coverageObj;
};

CliReporter.prototype.handleTestsComplete = function() {
  var coverageObj = coverage.populateCoverage(this._coverage);
  this._reportCoverage(coverageObj);
};

CliReporter.prototype._reportCoverage = function(cov) {
  sys.puts('');
  sys.puts('Test Coverage');
  var sep = '   +------------------------------------------+----------+------+------+--------+',
      lastSep = '                                              +----------+------+------+--------+';
  sys.puts(sep);
  sys.puts('   | filename                                 | coverage | LOC  | SLOC | missed |');
  sys.puts(sep);
  for (var name in cov.files) {
    var file = cov.files[name];
    sys.print('   | ' + utils.rpad(name, 40));
    sys.print(' | ' + utils.lpad(file.coverage, 8));
    sys.print(' | ' + utils.lpad(file.LOC, 4));
    sys.print(' | ' + utils.lpad(file.SLOC, 4));
    sys.print(' | ' + utils.lpad(file.totalMisses, 6));
    sys.print(' |\n');
  }
  sys.puts(sep);
  sys.print('     ' + utils.rpad('', 40));
  sys.print(' | ' + utils.lpad(cov.coverage, 8));
  sys.print(' | ' + utils.lpad(cov.LOC, 4));
  sys.print(' | ' + utils.lpad(cov.SLOC, 4));
  sys.print(' | ' + utils.lpad(cov.totalMisses, 6));
  sys.print(' |\n');
  sys.puts(lastSep);
};

exports.name = 'cli';
exports.klass = CliReporter;
