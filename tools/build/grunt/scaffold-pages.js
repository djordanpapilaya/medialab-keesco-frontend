module.exports = function (grunt, options)
{
	return {
		options: {
			'sitemap': '<%= sourceDir %>inc/script/app/config/sitemap.js',
			'scaffold': 'non-default', // 'all' | 'non-default'
			'scriptDir': '<%= sourceDir %>inc/script/',
			'styleDir': '<%= sourceDir %>inc/style/page/',
			'outputDir': 'app/page/',
			'outputDirMobile': 'mobile/page/',
			'templateDir': '<%= sourceDir %>inc/template/',
			'templateDirMobile': '<%= sourceDir %>inc/template/mobile/',
			'pagesPath': '<%= sourceDir %>inc/script/app/data/enum/Branches.ts',
			'clean': false
		},
		default: {}
	}
};