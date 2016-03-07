var fs = require('graceful-fs');
var path = require('path');

var async = require('async');
var rimraf = require('rimraf');

var util = require('../lib/util');

var counter = 0;
var configCache = {};

function cacheConfig(config)
{
	++counter;
	configCache[counter] = config;
	return counter;
}

function pluckConfig(id)
{
	if (!configCache.hasOwnProperty(id))
	{
		throw new Error('Failed to find id in cache');
	}
	var config = configCache[id];
	delete configCache[id];
	return config;
}

function nullOverride(details, include)
{
	include(false);
}

function createTask(grunt)
{
	return function (taskName, targetName)
	{
		var tasks = [];
		var prefix = this.name;
		if (!targetName)
		{
			if (!grunt.config(taskName))
			{
				grunt.fatal('The "' + prefix + '" prefix is not supported for aliases');
				return;
			}
			Object.keys(grunt.config(taskName)).forEach(function (targetName)
			{
				if (!/^_|^options$/.test(targetName))
				{
					tasks.push(prefix + ':' + taskName + ':' + targetName);
				}
			});
			return grunt.task.run(tasks);
		}
		var args = Array.prototype.slice.call(arguments, 2).join(':');
		var options = this.options({
			cache: path.join(__dirname, '..', '.cache'),
			override: nullOverride
		});

		// support deprecated timestamps option
		if (options.timestamps)
		{
			grunt.log.warn('DEPRECATED OPTION.  Use the "cache" option instead');
			options.cache = options.timestamps;
		}

		var done = this.async();

		var originalConfig = grunt.config.get([taskName, targetName]);
		var config = grunt.util._.clone(originalConfig);

		/**
		 * Special handling for tasks that expect the `files` config to be a string
		 * or array of string source paths.
		 */
		var srcFiles = true;
		if (typeof config.files === 'string')
		{
			config.src = [config.files];
			delete config.files;
			srcFiles = false;
		}
		else if (Array.isArray(config.files) &&
			typeof config.files[0] === 'string')
		{
			config.src = config.files;
			delete config.files;
			srcFiles = false;
		}

		function override(filePath, time, include)
		{
			var details = {
				task: taskName,
				target: targetName,
				path: filePath,
				time: time
			};
			options.override(details, include);
		}

		var files = grunt.task.normalizeMultiTaskFiles(config, targetName);

		function writeFileFromCache(path, dest)
		{
			grunt.verbose.write('write file from cache > ' + dest + ' ...');
			var buffer = grunt.file.read(path, {encoding: null});
			grunt.file.write(dest, buffer);
			grunt.verbose.ok();
		}

		util.filterFilesByHash(files, options.cache, taskName, targetName, writeFileFromCache, function (err, newerFiles)
		{
			if (err)
			{
				return done(err);
			}
			else if (newerFiles.length === 0)
			{
				grunt.log.writeln('No newer files to process.');
				return done();
			}
			else
			{
				grunt.log.writeln(newerFiles.length + ' newer files');
			}

			/**
			 * If we started out with only src files in the files config,
			 * transform the newerFiles array into an array of source files.
			 */
			if (!srcFiles)
			{
				newerFiles = newerFiles.map(function (obj)
				{
					return obj.src;
				});
			}

			// configure target with only newer files
			config.files = newerFiles;
			delete config.src;
			delete config.dest;
			grunt.config.set([taskName, targetName], config);
			grunt.config.set(['newer-postrun', taskName, targetName], config);

			// because we modified the task config, cache the original
			var id = cacheConfig(originalConfig);

			// run the task, and attend to postrun tasks
			var qualified = taskName + ':' + targetName;
			var tasks = [
				qualified + (args ? ':' + args : ''),
				'newer-postrun:' + qualified + ':' + id + ':' + options.cache
			];
			grunt.task.run(tasks);

			done();
		});
	};
}


/** @param {Object} grunt Grunt. */
module.exports = function (grunt)
{

	grunt.registerTask(
		'newer', 'Run a task with only those source files that have been ' +
		'modified since the last successful run.', createTask(grunt));

	var deprecated = 'DEPRECATED TASK.  Use the "newer" task instead';
	grunt.registerTask(
		'any-newer', deprecated, function ()
		{
			grunt.log.warn(deprecated);
			var args = Array.prototype.join.call(arguments, ':');
			grunt.task.run(['newer:' + args]);
		});

	var internal = 'Internal task.';
	grunt.registerTask('newer-postrun', internal, function (taskName, targetName, id, dir)
	{
		var files = grunt.config.get(['newer-postrun', taskName, targetName]).files;
		// if dir includes a ':', grunt will split it among multiple args
		dir = Array.prototype.slice.call(arguments, 3).join(':');
		//grunt.file.write(util.getStampPath(dir, taskName, targetName),
		//	String(Date.now()));

		var done = this.async();

		async.each(files, function (file, callback)
			{
				var filePath = util.getHashPath(dir, taskName, targetName, file.hash);
				var buffer = grunt.file.read(file.dest, {encoding: null});

				grunt.verbose.write('saving cache ' + path.basename(filePath) + ' > ' + file.dest + ' ...');
				grunt.file.write(filePath, buffer);
				grunt.verbose.ok();

				callback();
			},
			function (err)
			{
				//console.log('done!');
				done();
			});


		// reconfigure task with original config
		grunt.config.set([taskName, targetName], pluckConfig(id));

	});

	var clean = 'Remove cached timestamps.';
	grunt.registerTask('newer-clean', clean, function (taskName, targetName)
	{
		var done = this.async();

		/**
		 * This intentionally only works with the default cache dir.  If a
		 * custom cache dir is provided, it is up to the user to keep it clean.
		 */
		var cacheDir = path.join(__dirname, '..', '.cache');
		if (taskName && targetName)
		{
			cacheDir = util.getStampPath(cacheDir, taskName, targetName);
		}
		else if (taskName)
		{
			cacheDir = path.join(cacheDir, taskName);
		}
		if (grunt.file.exists(cacheDir))
		{
			grunt.log.writeln('Cleaning ' + cacheDir);
			rimraf(cacheDir, done);
		}
		else
		{
			done();
		}
	});

};
