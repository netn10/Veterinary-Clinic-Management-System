const { exec } = require('child_process');
const os = require('os');

const ports = [3000, 3001];

function killPortWindows(port) {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (error || !stdout) {
        resolve();
        return;
      }
      
      const lines = stdout.trim().split('\n');
      const pids = new Set();
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && !isNaN(pid)) {
          pids.add(pid);
        }
      });
      
      if (pids.size === 0) {
        resolve();
        return;
      }
      
      const killPromises = Array.from(pids).map(pid => {
        return new Promise((res) => {
          exec(`taskkill /F /PID ${pid}`, () => res());
        });
      });
      
      Promise.all(killPromises).then(resolve);
    });
  });
}

function killPortUnix(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (error || !stdout) {
        resolve();
        return;
      }
      
      const pids = stdout.trim().split('\n').filter(pid => pid);
      if (pids.length === 0) {
        resolve();
        return;
      }
      
      const killPromises = pids.map(pid => {
        return new Promise((res) => {
          exec(`kill -9 ${pid}`, () => res());
        });
      });
      
      Promise.all(killPromises).then(resolve);
    });
  });
}

async function killPorts() {
  const isWindows = os.platform() === 'win32';
  const killPort = isWindows ? killPortWindows : killPortUnix;
  
  console.log('Checking for processes on ports', ports.join(', '), '...');
  
  for (const port of ports) {
    await killPort(port);
  }
  
  console.log('Ports cleared. Starting application...\n');
}

killPorts().catch(console.error);

