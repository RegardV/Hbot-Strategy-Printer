import net from 'net';

function findAvailablePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });

    server.on('error', () => {
      // Port is in use, try the next one
      findAvailablePort(startPort + 1)
        .then(resolve)
        .catch(reject);
    });
  });
}

findAvailablePort()
  .then(port => {
    console.log(port);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error finding available port:', err);
    process.exit(1);
  });