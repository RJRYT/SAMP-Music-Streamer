# SAMP-Music-Streamer
The SAMP music streamer build for SAMP Roleplay servers.
We can stream playable(on SAMP) songs by using this project.

## Availability

- Can run on Pterodactyl panel
- Can Run on Replit
- Can Run on Heroku

## Requirement

- You need required disk space to store audio files.

## Installation

### Replit

- Fork repl from [@Somaliyo](https://replit.com/@Somaliyo/SAMP-Music-Streamer)
- Add Secrets
  - `PORT` : Server port
  - `AUTH` : Your Auth Code (Admin password)
- Run the server

### Pterodactyl

- Create new server on pterodactyl with the egg `nodejs generic egg`
- When panel is ready to use go to startup tab and add `GIT REPO ADDRESS` as `https://github.com/RJRYT/SAMP-Music-Streamer.git`
- Add `INSTALL BRANCH` as `main`
- Set `JS FILE` as `app.js`
- Goto server settings and reinstall server.
- After it add your panel port and Authcode to .env (Note: Rename `example.env` to `.env`) file
- Start the server
Your server is ready to use.

### Usage

When your server is marked as running. Open server on chrome. upload music as your choice.
