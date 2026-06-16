const { execFileSync } = require('child_process');

const port = Number(process.argv[2] || process.env.PORT || 8888);

if (!Number.isFinite(port)) {
  console.error('[kill-port] invalid port');
  process.exit(1);
}

const killWindows = () => {
  const output = execFileSync(
    'powershell',
    [
      '-NoProfile',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      `Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique`,
    ],
    { encoding: 'utf8' }
  );

  const pids = output
    .split(/\r?\n/)
    .map((line) => Number(line.trim()))
    .filter((pid) => Number.isFinite(pid) && pid > 0 && pid !== process.pid);

  for (const pid of pids) {
    console.log(`[kill-port] stopping process ${pid} on port ${port}`);
    execFileSync('powershell', ['-NoProfile', '-Command', `Stop-Process -Id ${pid} -Force`], {
      stdio: 'inherit',
    });
  }
};

const killUnix = () => {
  const output = execFileSync('sh', ['-c', `lsof -ti tcp:${port} -sTCP:LISTEN || true`], {
    encoding: 'utf8',
  });
  const pids = output
    .split(/\r?\n/)
    .map((line) => Number(line.trim()))
    .filter((pid) => Number.isFinite(pid) && pid > 0 && pid !== process.pid);

  for (const pid of pids) {
    console.log(`[kill-port] stopping process ${pid} on port ${port}`);
    process.kill(pid, 'SIGTERM');
  }
};

try {
  if (process.platform === 'win32') killWindows();
  else killUnix();
} catch (error) {
  console.warn('[kill-port] skipped:', error.message);
}
