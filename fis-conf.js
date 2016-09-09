fis.media('prod')
.match('::package', {
	packager: fis.plugin('map')
})
.match('*.js', {
	optimizer: fis.plugin('uglify-js')
})
.match('*.css', {
	optimizer: fis.plugin('clean-css')
})
.match('*.{png}', {
	optimizer: fis.plugin('png-compressor')
})
.match('*.less', {
	parser: fis.plugin('less'),
	rExt: '.css'
})
.match('*.sass', {
	parser: fis.plugin('sass'),
	rExt: '.css'
})
// 前端模板的使用
.match('**.tmpl', {
    parser: fis.plugin('utc'), // invoke `fis-parser-utc`
    isJsLike: true    
});

// FIS3 会读取全部项目目录下的资源，如果有些资源不想被构建，通过以下方式排除。
fis.set('project.ignore', [
  'output/**',
  'node_modules/**',
  '.git/**',
  '.svn/**',
  'test/**',
  'info.txt',
  'fis-conf.js',
  'Gruntfile.js'
]);
