/* @require mapshaper-common */

MapShaper.writeFiles = function(exports, opts, cb) {
  if (exports.length > 0 === false) {
    message("No files to save");
  } else if (opts.dry_run) {
    // no output
  } else if (opts.stdout) {
    // Pass callback for asynchronous output (synchronous output to stdout can
    // trigger EAGAIN error, e.g. when piped to less)
    return cli.writeFile('/dev/stdout', exports[0].content, cb);
  } else {
    var paths = MapShaper.getOutputPaths(utils.pluck(exports, 'filename'), opts);
    exports.forEach(function(obj, i) {
      var path = paths[i];
      var content = obj.content;
      if (content instanceof ArrayBuffer) {
        content = cli.convertArrayBuffer(content); // convert to Buffer
      }
      if (opts.output) {
        opts.output.push({filename: path, content: content});
      } else {
        cli.writeFile(path, obj.content);
        message("Wrote " + path);
      }
    });
  }
  if (cb) cb(null);
};

MapShaper.getOutputPaths = function(files, opts) {
  var odir = opts.directory;
  if (opts.force) {
    message("[o] The force option is obsolete, files are now overwritten by default");
  }
  if (odir) {
    files = files.map(function(file) {
      return require('path').join(odir, file);
    });
  }
  return files;
};
