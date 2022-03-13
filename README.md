# Blok tech chat feature
This project is part of a matching application that is soon to be completed. The part of matching application I'm making is a chat feature. To create this feature, I'm using the Socket.io module for Express.

---
## Requirements (optimal)
- Npm 8.3.1 or higher
- Node 17.4.0 or higher

### Node
- #### Node installation on Windows

Go to the [official Node.js website](https://nodejs.org/) and download the installer.
Make sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version

    $ npm --version

## Install

    $ git clone https://github.com/Laurens256/bloktech
    $ cd bloktech
    $ npm install


## Setting up .env
```
DB_USERNAME=[youeDatabaseUsername]
DB_PASSWORD=[yourPassword]
```


## Running the project
To run the project you can either use `node server.js` or `nodemon server.js` where the latter is preferred for development purposes.

## Sources
- [Readme template](https://gist.github.com/Igormandello/57d57ee9a9f32a5414009cbe191db432)