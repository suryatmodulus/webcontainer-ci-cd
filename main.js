import './style.css';
import { WebContainer } from '@webcontainer/api';
import { files } from './files';

/** @type {import('@webcontainer/api').WebContainer}  */
let webcontainerInstance;

window.addEventListener('load', async () => {
  // Call only once
  webcontainerInstance = await WebContainer.boot();

  await webcontainerInstance.mount(files);
  await installDependencies();
  await gitClone();
  await installClonedProjectDependencies();
  await buildClonedProject();
  await listFiles();
  await startDevServer();
  // if (iprocess.exit !== 0) {
  //   throw new Error('Installation failed');
  // }
});

async function installDependencies() {
  // Install dependencies
  const iProcess = await webcontainerInstance.spawn('npm', ['install']);
  iProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  // Wait for install command to exit
  return iProcess.exit;
}

async function gitClone() {
  // Git clone
  const iProcess = await webcontainerInstance.spawn('node', [
    'index.js',
    'https://github.com/suryamodulus/moviebuzz',
    'main',
    '/home/gh-repo',
  ]);
  iProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  // Wait for install command to exit
  return iProcess.exit;
}

async function installClonedProjectDependencies() {
  // Install dependencies
  const iProcess = await webcontainerInstance.spawn('npm', [
    '--prefix',
    '/home/gh-repo/moviebuzz-main',
    'install',
  ]);
  iProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  // Wait for install command to exit
  return iProcess.exit;
}

async function buildClonedProject() {
  // Install dependencies
  const iProcess = await webcontainerInstance.spawn('npm', [
    '--prefix',
    '/home/gh-repo/moviebuzz-main',
    'run',
    'build',
  ]);
  iProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  // Wait for install command to exit
  return iProcess.exit;
}

async function listFiles() {
  //List files
  const iProcess = await webcontainerInstance.spawn('ls', [
    '-la',
    '/home/gh-repo/moviebuzz-main/build',
  ]);
  iProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  // Wait for install command to exit
  return iProcess.exit;
}

async function startDevServer() {
  // Run `npm run start` to start the Express app
  await webcontainerInstance.spawn('npx', [
    'serve',
    '/home/gh-repo/moviebuzz-main/build',
  ]);

  // Wait for `server-ready` event
  webcontainerInstance.on('server-ready', (port, url) => {
    iframeEl.src = url;
  });
}

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>
  </div>
`;

/** @type {HTMLIFrameElement | null} */
const iframeEl = document.querySelector('iframe');
