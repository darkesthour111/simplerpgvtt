const Sequelize = require('sequelize');
const fs = require('fs')
const { COPYFILE_EXCL } = fs.constants;
const path = './db/rpg.db'
const sampleDB = './db/Sample DB.db'
if (!fs.existsSync(path)){
    fs.copyFileSync(sampleDB, path, COPYFILE_EXCL)
}
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/rpg.db'
});
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
//Defines Tables, Sequilize will add id, created, updated automatically
const Campaign = sequelize.define('campaign', {
    // attributes
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dm: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    currentmap: {
        type: Sequelize.STRING
    }
}, {
    // options
    // freezeTableName: true
});
const Map = sequelize.define('map', {
    // attributes
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dmmap: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    playermap: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    dmvideo: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    playervideo: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
}, {
    // options
    // freezeTableName: true
});
const CampaignMap = sequelize.define('campaignmap', {
    // attributes
    map: {
        type: Sequelize.STRING,
        // allowNull: false
    },
    campaign: {
        type: Sequelize.STRING,
        // allowNull: false
    },
}, {
    // options
    // freezeTableName: true
});
const MapState = sequelize.define('mapstate', {
    // attributes
    campaign: {
        type: Sequelize.STRING,
        allowNull: false
    },
    map: {
        type: Sequelize.STRING
        // allowNull defaults to true
    }
}, {
    // options
    // freezeTableName: true
});
const GameTokenPosition = sequelize.define('gametokenposition', {
    // attributes
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tokenurl: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    player: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    locked: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    hidden: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    angle: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    height: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    width: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    scalex: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    scaley: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    x: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    y: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    mapstate: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
}, {
    // options
    // freezeTableName: true
});
const FogStatePosition = sequelize.define('fogstateposition', {
    // attributes
    hidden: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    angle: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    height: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    width: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    scalex: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    scaley: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    x: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    y: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    mapstate: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
}, {
    // options
    // freezeTableName: true
});
const SoundStatePosition = sequelize.define('soundstateposition', {
    // attributes
    active: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    angle: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    height: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    width: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    scalex: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    scaley: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    x: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    y: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    mapstate: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    sound: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
}, {
    // options
    // freezeTableName: true
});
const Token = sequelize.define('token', {
    // attributes
    sizex: {
        type: Sequelize.STRING,
    },
    sizey: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    name: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    url: {
        type: Sequelize.STRING
        // allowNull defaults to true
    }

}, {
    // options
    // freezeTableName: true
});
const Sound = sequelize.define('sound', {
    // attributes
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    vgs: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    split: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    },
    loop: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    },
    icon: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    url: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    starta: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    },
    enda: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    },
    startb: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    },
    endb: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    },
    startc: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    },
    endc: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    },
    startd: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    },
    endd: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    },
    default_vol:{
        type: Sequelize.REAL
        // allowNull defaults to true
    },
}, {
    // options
    // freezeTableName: true
});
const Player = sequelize.define('player', {
    email: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
})
const PlayerToken = sequelize.define('playertoken', {
    campaign: {
        type: Sequelize.STRING
    },
    player: {
        type: Sequelize.STRING
    },
    token: {
        type: Sequelize.STRING
    },
    url: {
        type: Sequelize.STRING
    },
})
const CampaignPlayer = sequelize.define('campaignplayer', {
    campaign: {
        type: Sequelize.STRING
    },
    player: {
        type: Sequelize.STRING
    },
})
sequelize.sync();

module.exports = {
    CampaignPlayer,
    PlayerToken,
    Player,
    Sound,
    SoundStatePosition,
    FogStatePosition,
    GameTokenPosition,
    MapState,
    Map,
    CampaignPlayer,
    CampaignMap,
    Campaign,
    Token,
    sequelize,
  };