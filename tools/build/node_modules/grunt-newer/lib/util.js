var crypto = require('crypto');
var fs = require('graceful-fs');
var path = require('path');

var async = require('async');


/**
 * Get path to cached file hash for a target.
 * @param {string} cacheDir Path to cache dir.
 * @param {string} taskName Task name.
 * @param {string} targetName Target name.
 * @param {string} filePath Path to file.
 * @return {string} Path to hash.
 */
var getHashPath = exports.getHashPath = function (cacheDir, taskName, targetName, filePath)
{
	//console.log('>> getHashPath: ', cacheDir, taskName, targetName, filePath);
	//var hashedName = crypto.createHash('md5').update(filePath).digest('hex');
	return path.join(cacheDir, taskName, targetName, 'hashes', filePath);
};

/**
 * Generate a hash (md5sum) of a file contents.
 * @param {string} filePath Path to file.
 * @param {function(Error, string)} callback Callback called with any error and
 *     the hash of the file contents.
 */
var generateFileHash = exports.generateFileHash = function (filePath, callback)
{
	//console.log(' >> generateFileHash: ', filePath);
	var md5sum = crypto.createHash('md5');
	var stream = new fs.ReadStream(filePath);
	stream.on('data', function (chunk)
	{
		//console.log(' - data', filePath);
		md5sum.update(chunk);
	});
	stream.on('error', function (err)
	{
		//console.log(filePath, 'error: ', err);
		callback();
	});
	stream.on('end', function ()
	{
		//console.log(' - end', filePath);
		callback(null, md5sum.digest('hex'));
	});
};


/**
 * Filter files based on hashed contents.
 * @param {Array.<string>} paths List of paths to files.
 * @param {string} cacheDir Cache directory.
 * @param {string} taskName Task name.
 * @param {string} targetName Target name.
 * @param {function(Error, Array.<string>)} callback Callback called with any
 *     error and a filtered list of files that only includes files with hashes
 *     that are different than the cached hashes for the same files.
 */
var filterPathsByHash = exports.filterPathsByHash = function (obj, cacheDir, taskName, targetName, writeFileFromCache, callback)
{
	//console.log(' >> filterPathsByHash:', obj.src);
	async.filter(obj.src, function (filePath, done)
	{
		//console.log(filePath);
		generateFileHash(filePath, function (err, hash)
		{
			//console.log(hash, filePath);

			if (!hash)
			{
				console.error('WARNING: cannot create hash for ' + filePath);
				done(false);
				return;
			}

			obj.hash = hash;
			var path = getHashPath(cacheDir, taskName, targetName, hash);
			fs.exists(path, function (exists)
			{
				if (exists)
				{
					writeFileFromCache(path, obj.dest);
				}

				done(!exists);
			});

		});
	}, callback);
};


/**
 * Filter a list of file config objects based on comparing hashes of src files.
 * @param {Array.<Object>} files List of file config objects.
 * @param {string} taskName Task name.
 * @param {string} targetName Target name.
 * @param {function(Error, Array.<Object>)} callback Callback called with a
 *     filtered list of file config objects.  Object returned will only include
 *     src files with hashes that are different than any cached hashes.  Config
 *     objects with no src files will be filtered from the list.
 */
var filterFilesByHash = exports.filterFilesByHash = function (files, cacheDir, taskName, targetName, writeFileFromCache, callback)
{
	async.map(files, function (obj, done)
	{
		filterPathsByHash(obj, cacheDir, taskName, targetName, writeFileFromCache, function (src)
		{
			//console.log('src: ', src);
			done(null, {src: src, dest: obj.dest, hash: obj.hash});
		});

	}, function (err, results)
	{
		if (err)
		{
			return callback(err);
		}
		// get rid of file config objects with no src files
		callback(null, results.filter(function (obj)
		{
			return obj && obj.src && obj.src.length > 0;
		}));
	});
};