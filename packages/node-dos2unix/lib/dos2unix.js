/*
 * dos2unix
 * https://github.com/JamesMGreene/node-dos2unix
 *
 * Copyright (c) 2013 James M. Greene
 * Licensed under the MIT license.
 */

'use strict';

// Built-in modules
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// External modules
var Q = require('q');
var extend = require('node.extend');
var Readable = require('stream').Readable || require('readable-stream').Readable;

// Internal modules
var encoder = require('./util/encoding');
var globber = require('./util/glob');
var validator = require('./util/validate');

// Utility
var slicer = Array.prototype.slice;

function arraysMatch(arr1, arr2) {
  if (arr1 && arr2 && arr1.length === arr2.length) {
    var matches = arr1.filter(function(e, i) {
      return e === arr2[i];
    });
    return matches.length === arr1.length;
  }
  return arr1 === arr2;
}

function processAllFiles(fileList) {
  /*jshint validthis:true */
  var processor = this;

  // For reporting final results
  var defaultStats = {
    'error': 0,
    'skip': 0,
    'fix': 0
  };

  return Q.all(
    fileList.map(function(filePath) {
      return processor._processFile(filePath);
    })
  ).then(function(statuses) {
    // Roll up the counts of each status
    return (statuses || []).reduce(
      function(previousVal, currentVal) {
        if (!previousVal.hasOwnProperty(currentVal)) {
          throw new Error('Reduced object did not have the expected key "' + currentVal + '": ' + JSON.stringify(previousVal));
        }
        previousVal[currentVal] += 1;
        return previousVal;
      },
      defaultStats
    );
  });
}

function onDone(stats) {
  /*jshint validthis:true */
  this.emit('end', stats);
}

function onFail(err) {
  /*jshint validthis:true */
  this.emit('error', err);
}

// Promise bindings
var validateGlobPatternsP = Q.nfbind(validator.validateGlobPatterns.bind(validator));
var globP = Q.nfbind(globber.glob.bind(globber));

function Dos2UnixConverter(defaultOptions) {
  // Enforce the constructor pattern
  if (!(this instanceof Dos2UnixConverter)) {
    return new Dos2UnixConverter(defaultOptions);
  }

  // Mixin the EventEmitter API
  EventEmitter.call(this);

  // Validate and save the default options (if any)
  var validOptions = validator.validateOptions(defaultOptions);
  this.defaultOptions = extend(true, {}, validOptions);
}
// Mark it as inherited, too
util.inherits(Dos2UnixConverter, EventEmitter);

// GO!
Dos2UnixConverter.prototype.process = function(globPatterns, options) {
  var processAllFilesP = processAllFiles.bind(this);
  var onDoneP = onDone.bind(this);
  var onFailP = onFail.bind(this);
  
  this.emit('start');
  
  var opts = extend(true, {}, this.defaultOptions, options);
  
  // Find the pertinent files from the glob, sorted and without duplicates
  validateGlobPatternsP(globPatterns)
    .then(function(validGlobPatterns) {
      return globP(validGlobPatterns, opts.glob);
    })
    .then(processAllFilesP)
    .then(onDoneP)
    .fail(onFailP)
    .done();
};

// A big frickin' mess... but aimed at performance by not reading the file more than necessary
Dos2UnixConverter.prototype._processFile = function(filePath) {
  var processor = this;
  processor.emit('processing.start', {
    file: filePath
  });

  var deferred = Q.defer();
  encoder.detectBom(filePath, function(err, bomName) {
    var status = 'good';

    if (err) {
      status = 'error';
      processor.emit('processing.error', {
        file: filePath,
        message: 'Skipping file with errors during encoding detection: ' + err
      });
      return deferred.resolve(status);
    }
    else {
      var needsFixing = false;
      var lastByteSequenceWasCR = false;
      var bytesPerBom = encoder.getBytesPerBom(bomName);
      var bytesPerControlChar = encoder.getBytesPerControlChar(bomName);

      var transformBuffer = [];
      var tempBuffer = null;

      // Fast-forward past the BOM if present
      var onFirstReadable = function() {
        var bomBuffer = this.read(bytesPerBom);
        if (bomBuffer == null || bomBuffer.length !== bytesPerBom) {
          status = 'error';
          processor.emit('processing.error', {
            file: filePath,
            message: 'Skipping file with errors during read: Unable to read past the expected BOM'
          });
          return deferred.resolve(status);
        }
      };
      var onReadable = function() {
        var data = this.read(),
            i = 0,
            len = data.length,
            cursor = i,
            buffer;
        for ( ; i < len; i += bytesPerControlChar) {
          buffer = slicer.call(data, i, i + bytesPerControlChar);

          // If we read less bytes than the minimum number necessary to register
          // as a complete character in this encoding, put them back on the front
          // of the read queue for the next read and then bail out.
          if (buffer.length < bytesPerControlChar) {
            if (!tempBuffer || !arraysMatch(buffer, tempBuffer)) {
              tempBuffer = buffer;
              // Save these rogue bytes to inspect on the next time around
              this.unshift(data.slice(i, i + buffer.length));
              // Break out of the loop
              break;
            }
            else {
              // This will prevent an infinite loop if the number of bytes in the file
              // is erroneous/irregular, e.g. a total of 7 bytes in a UTF-16 file.
              status = 'error';

              // Send a signal to cause early termination (i.e. trigger the 'end' event)
              this.push(null);
              // Break out of the loop
              break;
            }
          }
          tempBuffer = null;

          if (encoder.doesByteSequenceSuggestBinary(buffer, bomName)) {
            status = 'skip';
            processor.emit('processing.skip', {
              file: filePath,
              message: 'Skipping suspected binary file'
            });
            // Send a signal to cause early termination (i.e. trigger the 'end' event)
            this.push(null);
            // Break out of the loop
            break;
          }
          else {
            if (encoder.isByteSequenceCR(buffer, bomName)) {
              lastByteSequenceWasCR = true;
            }
            else {
              if (lastByteSequenceWasCR && encoder.isByteSequenceLF(buffer, bomName)) {
                needsFixing = true;

                // Push everything (except for CRs) into the outgoing buffer
                transformBuffer.splice.apply(transformBuffer, [transformBuffer.length, 0].concat(slicer.call(data, cursor, i - bytesPerControlChar)));
                cursor = i;
              }
              
              // If this is the last byte of the buffer, push the remaining data into the outgoing buffer
              if (i + bytesPerControlChar === len && needsFixing) {
                // Push everything (except for CRs) into the outgoing buffer
                transformBuffer.splice.apply(transformBuffer, [transformBuffer.length, 0].concat(slicer.call(data, cursor)));
              }
              
              // Reset
              lastByteSequenceWasCR = false;
            }
          }
        }
      };
      var onError = function(err) {
        status = 'error';
        processor.emit('processing.error', {
          file: filePath,
          message: 'Skipping file with errors during read: ' + err
        });
        return deferred.resolve(status);
      };
      var onEnd = function() {
        if (status === 'good') {
          if (needsFixing) {
            status = 'bad';
            this.on('close', function() {
              // Overwrite the existing file with the fixed data
              process.nextTick(function() {
                processor.emit('convert.start', {
                  file: filePath
                });

                //
                // TODO: Is there a more optimal way to do this?
                //       e.g. TransformStream, write to temp then move, etc.
                //
                fs.writeFile(filePath, new Buffer(transformBuffer), function(err) {
                  if (err) {
                    status = 'error';
                    processor.emit('convert.error', {
                      file: filePath,
                      message: 'Unexpected error during conversion process: ' + err
                    });
                  }
                  else {
                    status = 'fix';
                    processor.emit('convert.end', {
                      file: filePath
                    });
                  }

                  processor.emit('processing.end', {
                    file: filePath
                  });
                  return deferred.resolve(status);
                });
              });
            });
          }
          else {
            status = 'skip';
            processor.emit('processing.skip', {
              file: filePath,
              message: 'Skipping file with all correct line endings'
            });
          }
        }
        
        if (status === 'skip') {
          processor.emit('processing.end', {
            file: filePath
          });
        }
        if (status !== 'bad') {
          return deferred.resolve(status);
        }
      };
      
      var reader = new Readable();
      reader.wrap(fs.createReadStream(filePath));

      if (bytesPerBom > 0) {
        reader.once('readable', onFirstReadable);
      }
      reader
        .on('readable', onReadable)
        .on('error', onError)
        .on('end', onEnd);
    }
  });
  return deferred.promise;
};

// Exports
module.exports = Dos2UnixConverter;