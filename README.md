## Simple RPG-VTT
A (hopefully) Simple Role Playing Game Virtual Table Top

## Motivation and goals
Simple RPG-VTT's goal is to be an easy way for a DM to define some assets and get a game up and running visually.

While this is a passion project of mine stemmed from my own need and to learn I figured it could be useful to someone else! 

I will always try to keep things simple and if there is a better way to do things I can always adjust.
This is what I keep in mind for this app:

1) Can I accomplish this feature without adding a new dependency?
2) Is this feature simple enough to use?
3) Does it provide value to the player or DM?

With those in mind I have built this app.


## Tech/Libraries Used
Built with:
- [Node.js](https://nodejs.org/en/)
- [Express.js](http://expressjs.com/)
- [Sequelize](http://docs.sequelizejs.com/)
- [Socket.io](https://socket.io/)
- [Angular](https://angular.io)
- [KonvaJS](https://konvajs.org/)
- [HowlerJS](https://howlerjs.com/)
- [ag Grid](https://www.ag-grid.com/)
- [ng-select](https://ng-select.github.io/ng-select#/)

 

## Features
- Separate Dungeon Master and Player Views
- Dungeon Master View Features:
    - Support for both Image and Video backgrounds
        - App designed around 1080p resolution displays
        - Separate player and DM maps
        - If video is specified it will take precedence
        - Separate player and DM videos are also supported
    - Fog of War layer to show/hide portions of the background, can be manipulated.
        - Access fab buttons on left to add fog
        - Right click to remove fog
    - Sound layer to setup trigger zones for playback of sound, can be manipulated.
        - Access fab buttons on left to add sound
        - Access fab buttons on the left to show/hide sound layer
        - Right click to remove sound
    - Token layer to manipulate tokens added to the layer.
        - Right click on token to hide from player view, allows setup of map ahead of time.
        - Access fab buttons on left to add tokens to the map, including setting the size of the token(s) to add.
    - Updates from all layers automatically transition to database for saving and player views
    - Fab Button interface to manage actions and layers.
    - Drag via mouse and zoom via scroll wheel
- Player View Features:
    - Support for both Image and Video backgrounds
    - Fog of War layer to show/hide portions of the background.
    - Token layer display only.
    - Updates from DM view appear here automatically.
    - Drag via mouse and zoom via scroll wheel
- Database add/remove/update from in app view
    - Database accessed via Sequelize ORM to allow changing of database, currently setup to use SQLite
    - Able to add rows to the main database tables to support adding tokens/sounds/maps/campaigns and campaign map assignment.
    - Inline editing via double click to update data.
    - Note: I still recommend using something like SQLiteStudio to import/export data from the database.

## The Future
Possible features in future versions:
- Grid system for maps that do not have grids, would allow snap to grid functionality
    - Grid system would also allow for possible cone/aoe measurement tools.
- Improvements to sound system, implementation of keyboard shortcut commands, sound split functionality
- Add token label functionality, must be able to hide on player view as most players saw it get in the way.

## Database Schema
All Tables have the following fields: id, createdAt, updatedAt. ID is used to reference from other tables.

Items marked with an asterisk* are for possible future usage and was part of the initial data model design.

- Table: campaigns 
    - Usage: Used to define main campaign records, also defines what map is currently displayed.
    - Fields: name, dm*, currentmap(value is ID from maps)
- Table campaignmaps
    - Usage: Used to define what maps are available for a particular campaign
    - Fields: map(value is ID from maps), campaign(value is ID from campaigns)
- Table campaignplayers*
    - Usage: Will be used to define which players are able to access which campaign
    - Fields: campaign(value is ID from campaigns), player(value is ID from players)
- Table fogstatepositions
    - Usage: This is what records the state of different fog objects
    - Fields: hidden*, angle, height, width, scalex, scaley, x, y, mapstate(value is ID from mapstates)
- Table gametokenpositions
    - Usage: This is what records the state of different token objects
    - Fields: token(value is ID from tokens), tokenurl, player*, locked*, hidden, angle, height, width, scalex, scaley, x, y, mapstate(value is ID from mapstates)
- Table maps
    - Usage: This is what records the different maps you have available for use and which map is shown to DMs or Players
    - Fields: name, dmmap, playermap, dmvideo, playervideo
- Table mapstates
    - Usage: Main referenced record for a maps state per campaign
    - Fields: campaign(value is ID from campaigns), map(value is ID from maps)
- Table players*
    - Usage: Will be used to identify players
    - Fields: email, name
- Table playertokens*
    - Usage: Will be used to identify the players token in a campaign, particularly to add all players to the map quickly.
    - Fields: campaign(value is ID from campaigns), player(value is ID form players), token(value is ID from tokens), url
- Table sounds
    - Usage: Identifies the different sound assets you have available to use and the location of their assets. starta and enda would identify the sounds that have multiple in one file, example multiple sword strikes.
    - Fields: name, vgs*, split*, loop, icon, url, starta*, enda*, startb*, endb*, startc*, endc*, startd*, endd*, default vol
- Table soundstatepositions
    - Usage: This is what records the state of different sound objects
    - Fields: active*, angle, height, width, scalex, scaley, x, y, mapstate(value is ID from mapstates), sound(value is ID from sounds)
Table tokens
    - Usage: Identifies token assets and their locations.
    - Fields: sizex, sizey, name, url

## Screenshots
- Main Menu to select a campaign or table to modify

![](https://github.com/darkesthour111/simplerpgvtt/blob/master/Screenshots/Main%20screen.png?raw=true)
- Selecting a table to modify

![](https://github.com/darkesthour111/simplerpgvtt/blob/master/Screenshots/select%20database.png?raw=true)

- Data editing

![](https://github.com/darkesthour111/simplerpgvtt/blob/master/Screenshots/Editing%20Data.png?raw=true)
- Selecting a Campaign

![](https://github.com/darkesthour111/simplerpgvtt/blob/master/Screenshots/Selecting%20Campaign.png?raw=true)

- Player View(Note that fog hides some of the map, but tokens are visible when not hidden)

![](https://github.com/darkesthour111/simplerpgvtt/blob/master/Screenshots/Player%20View.png?raw=true)
- DM View(Note that fog is the red see through area)

![](https://github.com/darkesthour111/simplerpgvtt/blob/master/Screenshots/DM%20View.png?raw=true)

## Installation
Clone this repo to your desktop and run `npm install` to install all the dependencies.

## Usage
Once you have completed installation, you can run `npm start` to start the application. It will open a browser when Angular is ready. You can however access it at `localhost:4200`.

Sequilize will initialize the database for you, initially from the Sample DB.db file, at this point you will need to define your assets(maps,tokens,sounds).

If you have a lot of data to import I recommend that you import your data via other tools.

You will need to at least define a single Campaign, Map and Token to get started, the sample database will get you going with default records in those databases.

Your assets can be stored in src/assets. When you add the url for your asset it would be for example 'assets/maps/map1.png'

Once you have defined your assets you are going to want to create a Campaign record and Campaign Map record.

The campaign record is the main identification of the campaign you are interacting with, this way you can have multiple campaigns in the database, however the app was designed with you concurrently running only one campaign at a time.

The Campaign Map record is how the app knows which maps to present in the change map dialog.