
# WLF Back-Channel Offline Deployment Guide

This application is designed to run on a local network (LAN) without internet access. Follow these steps to set up your Command Center laptop as the server.

## 1. Physical Infrastructure
* **Hardware:** One Laptop (Windows/Mac/Linux) + One Wi-Fi Router.
* **Network:** Connect the laptop to the router via Ethernet cable for stability.
* **Internet:** Disconnect the router from the WAN (Internet) port.

## 2. Server Configuration (Laptop)
1. **Find your Local IP:**
   - Windows: Run `ipconfig` in CMD. Look for `IPv4 Address` (e.g., `192.168.0.10`).
   - Mac: `System Settings > Network > Wi-Fi > Details`.
2. **Install Node.js:** Download the LTS installer while online, then transfer it to the offline laptop if needed.
3. **Backend Files:**
   Create a folder `wlf-server` and initialize a basic Express + Socket.IO server:
   ```javascript
   // server.js
   const express = require('express');
   const http = require('http');
   const { Server } = require('socket.io');
   const path = require('path');

   const app = express();
   const server = http.createServer(app);
   const io = new Server(server, { cors: { origin: "*" } });

   // Serve the React build (after running 'npm run build')
   app.use(express.static(path.join(__dirname, 'dist')));

   io.on('connection', (socket) => {
     console.log('User Connected');
     socket.on('message', (msg) => io.emit('message', msg));
     socket.on('emergency', (state) => io.emit('emergency', state));
   });

   server.listen(80, '0.0.0.0', () => {
     console.log('Server running on http://192.168.0.10');
   });
   ```

## 3. Client Access
1. Connect all mobile devices/tablets to the **same Wi-Fi**.
2. Open the mobile browser (Chrome/Safari).
3. Type the server IP: `http://192.168.0.10`.
4. The system will load instantly from the local server.

## 4. Database (SQLite)
To persist messages and tasks offline, use the `sqlite3` npm package in your Node.js server to store messages in a local `wlf_event.db` file.

## 5. Deployment Checklist
- [ ] Laptop Firewall: Allow port 80/3000.
- [ ] Router DHCP: Set static IP for the server laptop.
- [ ] Backup: Keep a copy of the server code on a USB drive.
