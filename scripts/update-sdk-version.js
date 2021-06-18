const fs = require('fs');
const path = require('path');
// const process = require('process');
// const exec = require('child_process').spawnSync;
const { logger, spawnOrFail, process } = require('./utilities');

// const spawnOrFail = (command, args, options) => {
//   options = {
//     ...options,
//     shell: true,
//   };
//   const cmd = exec(command, args, options);
//   if (cmd.error) {
//     logger.log(`Command ${command} failed with ${cmd.error.code}`);

//     process.exit(255);
//   }
//   const output = cmd.stdout.toString();
//   logger.log(output);
//   if (cmd.status !== 0) {
//     logger.log(
//       `Command ${command} failed with exit code ${cmd.status} signal ${cmd.signal}`
//     );
//     logger.log(cmd.stderr.toString());
//     process.exit(cmd.status);
//   }
//   return output;
// };

// const logger = {
//   error: (output, info = '') =>
//     console.error('\x1b[31m%s\x1b[0m', output, info), // Red
//   log: (output) => console.log('\x1b[36m%s\x1b[0m', output), // Teal
//   warn: (output) => console.warn('\x1b[33m%s\x1b[0m', output), // Yellow
// };

// Go to root dir
process.chdir(path.join(__dirname, '..'));
spawnOrFail('npm', ['install']);

// Udpate the meeting demo to the most up to date version of the SDK
const updatedSdkVersion = spawnOrFail('npm', [
  `show amazon-chime-sdk-js version`,
]).trim();
logger.log(
  `Installing SDK Version: ${updatedSdkVersion} into the meeting demo.`
);
process.chdir(path.join(__dirname, '../amazon-chime-sdk/apps/meeting'));
spawnOrFail('npm', [`install amazon-chime-sdk-js@${updatedSdkVersion}`]);

// Get the version of the tar file
process.chdir(path.join(__dirname, '..'));
let package_json = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const originalVersion = package_json['version'];
console.log(`The current version of React library is ${originalVersion}`);

// Pack the latest version of React library and install it in meeting demo
process.chdir(path.join(__dirname, '..'));
spawnOrFail('npm', ['install']);
spawnOrFail('npm', ['run build']);
spawnOrFail('npm', ['pack']);
process.chdir(path.join(__dirname, '../amazon-chime-sdk/apps/meeting'));
spawnOrFail('npm', [
  `install ../../../amazon-chime-sdk-component-library-react-${originalVersion}.tgz`,
]);
