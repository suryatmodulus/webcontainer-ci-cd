import './style.css';
import { WebContainer } from '@webcontainer/api';
import { files } from './files';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

/** @type {import('xterm').Terminal}  */
let term;

/** @type {import('@webcontainer/api').WebContainer}  */
let webcontainerInstance;

window.addEventListener('load', async () => {
  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);
  await installCoreDependencies();
});

async function installCoreDependencies() {
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

document.getElementById('github-input').addEventListener('change', async () => {
  await runApp();
});

async function runApp() {
  setUpTerminal();
  await gitClone();
  await installProjectDependencies();
  await buildProject();
  await listFiles();
  await startDevServer();
}

function setUpTerminal() {
  term = new Terminal({ convertEol: true });
  term.open(document.getElementById('terminal'));
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
        term.write(data);
      },
    })
  );
  // Wait for install command to exit
  return iProcess.exit;
}

async function installProjectDependencies() {
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
        term.write(data);
      },
    })
  );
  // Wait for install command to exit
  return iProcess.exit;
}

async function buildProject() {
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
        term.write(data);
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
        term.write(data);
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

/** @type {HTMLIFrameElement | null} */
const iframeEl = document.querySelector('iframe');
