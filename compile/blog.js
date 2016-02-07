const Promise = require('bluebird');
const path = require('path');
const recurse = Promise.promisify(require('recursive-readdir'));
const mkdirp = Promise.promisify(require('mkdirp'));
const fs = Promise.promisifyAll(require('fs'));
const handlebars = require('handlebars');
const marked = require('marked');

const inputDirectory = './content';
const outputDirectory = './dist';

module.exports = () => {
  const hbs = handlebars.create();

  function loadAndRegisterPartial(prefix, filePath, overridePartialName) {
    const partialName = overridePartialName || path.basename(filePath, '.html');

    return fs.readFileAsync(filePath, 'utf-8')
      .then(template => {
        hbs.registerPartial(`{prefix}.${partialName}`, template);
      });
  }

  function loadLayout() {
    const layout = path.join(inputDirectory, '_layout.html');

    return loadAndRegisterPartial('layouts', layout, 'layout');
  }

  function loadPartials() {
    return recurse(path.join(inputDirectory, 'partials'))
      .then(filePaths =>
        Promise.each(filePaths, filePath =>
          loadAndRegisterPartial('partials', filePath)
        )
      );
  }

  function compileFile(filePath) {
    return fs.readFileAsync(filePath, 'utf-8')
      .then(file => hbs.compile(file));
  }

  function compilePages() {
    recurse(path.join(inputDirectory, 'pages'))
      .then(paths =>
        Promise.each(paths, filePath =>
          compileFile(filePath)
            .then(template => {
              const html = template({});

              const outputPath = path.join(outputDirectory, path.basename(filePath));
              return fs.writeFileAsync(outputPath, html, 'utf-8');
            })
        )
      );
  }

  function compilePosts() {
    const containerPath = path.join(inputDirectory, '_container.html');

    return mkdirp(path.join(outputDirectory, 'posts'))
      .then(() =>
        Promise.join(
          recurse(path.join(inputDirectory, 'posts')),
          compileFile(containerPath)
        )
      )
      .then(results => {
        // Roll on ES6 desctructuring in V8...
        const paths = results[0];
        const template = results[1];

        return Promise.each(paths, filePath =>
          fs.readFileAsync(filePath, 'utf-8')
            .then(file => {
              const post = marked(file);
              const html = template({ post });

              const filenameWithoutExtension = path.basename(filePath, '.md');
              const newFilename = `${filenameWithoutExtension}.html`;
              const outputPath = path.join(outputDirectory, 'posts', newFilename);
              return fs.writeFileAsync(outputPath, html, 'utf-8');
            })
        );
      });
  }

  return loadLayout().then(loadPartials).then(compilePages).then(compilePosts);
};
