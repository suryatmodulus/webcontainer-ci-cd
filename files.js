/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
  'index.js': {
    file: {
      contents: `
      const https = require('https'); // or 'https' for https:// URLs
      const { argv } = require('process');
      const unzipper = require('unzipper')
      
      // Zip - https://codeload.github.com/suryamodulus/moviebuzz/zip/refs/heads/main
      // Tar - https://codeload.github.com/suryamodulus/moviebuzz/tar.gz/refs/heads/main
      
      function downloadGithubRepo(githubUrl, branch, dir = 'gh-repo'){
          const url = 'https://codeload.github.com/suryamodulus/moviebuzz/zip/refs/heads/main'
          https.get(url, function (response) {
              response.pipe(unzipper.Extract({ path: dir }));
          });
      }
      downloadGithubRepo(argv[2], argv[3], argv[4])`,
    },
  },
  'package.json': {
    file: {
      contents: `
          {
            "name": "example-app",
            "dependencies": {
              "unzipper": "latest"
            },
            "scripts": {
              "start": "nodemon index.js"
            }
          }`,
    },
  },
};
