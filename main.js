const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http); //bind socket.io to http
const schema = require('./schema')

//Begin Server App
// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');  //index.html needs to have the ability to add/edit/remove data. might be fun to roll my own. Angular?
//   });



io.on('connection', function (socket) { //Start processing when user connects
    console.log('a user connected');
    socket.on('disconnect', function () { //display message when user disconnects
        console.log('user disconnected');
    });
    //   socket.on('chat message', function(msg){
    //     console.log('message: ' + msg);
    //   });
    // socket.on('chat message', function (msg) { //display 
    //     io.emit('chat message', msg);
    // });
    socket.on('getTokenList', async function (msg){
        let tokenList = await schema.Token.findAll()
        socket.emit('receiveTokenList', tokenList);
    })
    socket.on('getSoundList', async function (msg){
        let soundList = await schema.Sound.findAll()
        socket.emit('receiveSoundList', soundList);
    })
    socket.on('createToken', async function (msg) {
        console.log(msg);
        let data = JSON.parse(msg)
        //Create gamestatetoken record in DB and broadcast out a token update
        let newRecord = await schema.GameTokenPosition.create( {
            // attributes
            
            locked: data.locked,
            hidden: data.hidden,
            angle: data.angle,
            height: data.height,
            width: data.width,
            scalex: data.scalex,
            scaley: data.scaley,
            x: data.x,
            y: data.y,
            mapstate: data.mapstate,
            player: data.player,
            token: data.token,
            tokenurl: data.tokenurl
        })
        io.emit('updateToken', JSON.stringify(newRecord))
    })
    socket.on('postUpdateToken', async function (msg) {
        console.log(msg);
        let data = JSON.parse(msg)
        await schema.GameTokenPosition.update( {
            // attributes
            
            locked: data.locked,
            hidden: data.hidden,
            angle: data.angle,
            height: data.height,
            width: data.width,
            scalex: data.scalex,
            scaley: data.scaley,
            x: data.x,
            y: data.y,
        }, {
            where: {
                id: data.id
            }
        })
        
        newData = await schema.GameTokenPosition.findOne({
            where:
            { 
                id: data.id
            }
        })
        io.emit('updateToken', JSON.stringify(newData))
        //update gamestatetoken record in DB and broadcast out a token update
    })
    socket.on('createFog', async function (msg) {
        let newRecord = await schema.FogStatePosition.create({
            angle: 0,
            height: 50,
            width: 50,
            scalex: 1,
            scaley: 1,
            x: 20,
            y: 20,
            mapstate: msg,
        })
        // console.log(JSON.stringify(newRecord));
        io.emit('updateFog', JSON.stringify(newRecord))
        //Create gamestatetoken record in DB and broadcast out a token update
    })
    socket.on('postUpdateFog', async function (msg) {
        console.log(msg);
        let data = JSON.parse(msg)
        await schema.FogStatePosition.update( {
            // attributes
            
            // locked: data.locked,
            // hidden: data.hidden,
            angle: data.angle,
            height: data.height,
            width: data.width,
            scalex: data.scalex,
            scaley: data.scaley,
            x: data.x,
            y: data.y,
        }, {
            where: {
                id: data.id
            }
        })
        newData = await schema.FogStatePosition.findOne({
            where:
            { 
                id: data.id
            }
        })
        io.emit('updateFog', JSON.stringify(newData))
        //update gamestatetoken record in DB and broadcast out a token update
    })
    socket.on('sendRemoveFog', async function (msg){
        await schema.FogStatePosition.destroy({
            where: {
                id: msg.id
            }
        })
        io.emit('removeFog', msg.id);   
    })
    socket.on('createSound', async function (msg) {
        console.log(msg);
        //Create gamestatetoken record in DB and broadcast out a token update
        let newRecord = await schema.SoundStatePosition.create( {
            // attributes
            
            active: msg.active,
            angle: msg.angle,
            height: msg.height,
            width: msg.width,
            scalex: msg.scalex,
            scaley: msg.scaley,
            x: msg.x,
            y: msg.y,
            mapstate: msg.mapstate,
            sound: msg.sound
        })
        io.emit('updateSound', newRecord)
    })
    socket.on('postUpdateSound', async function (msg) {
        console.log(msg);
        let data = msg
        await schema.SoundStatePosition.update( {
            // attributes
            
            // locked: data.locked,
            // hidden: data.hidden,
            angle: data.angle,
            height: data.height,
            width: data.width,
            scalex: data.scalex,
            scaley: data.scaley,
            x: data.x,
            y: data.y,
        }, {
            where: {
                id: data.id
            }
        })
        newData = await schema.SoundStatePosition.findOne({
            where:
            { 
                id: data.id
            }
        })
        socket.emit('updateSound', newData)
        //update gamestatetoken record in DB and broadcast out a token update
    })
    socket.on('sendRemoveSound', async function (msg){
        await schema.SoundStatePosition.destroy({
            where: {
                id: msg.id
            }
        })
        io.emit('removeSound', msg.id);   
    })
    socket.on('updateMap', async function (msg) {
        // let data = JSON.parse(msg);
        console.log('got update map for ' + msg.id)
        await schema.Campaign.update({
            currentmap: msg.id
        }, {
            where: {
                id: msg.campaign
            }
        })
        //check to see if mapstate exists, if not then create it before we issue refreshes.
        let mapExists = await schema.MapState.findOne({
            where: {
                campaign: msg.campaign,
                map: msg.id
            }
        })
        if(mapExists === null){
            await schema.MapState.create({
                map: msg.id,
                campaign: msg.campaign
            })
        }
        console.log('emit changemap')
        io.emit('changeMap'); //cause a screen refresh on any clients
    })
    socket.on('getCampaigns', async function (msg) {
        let campaign = await schema.Campaign.findAll({
        })
        socket.emit('campaigns', JSON.stringify(campaign));
    })
    socket.on('getCurrentScreen', async function (msg) {
        let csData = {};
        csData.campaign = await schema.Campaign.findOne({
            where: {
                id: msg
            }
        })
        csData.map = await schema.Map.findOne({
            where: {
                id: csData.campaign.currentmap
            }
        })
        csData.campaignMap = await schema.CampaignMap.findAll({
            where: {
                campaign: csData.campaign.id
            }
        })
        let campaignMapArray = []
        for(x in csData.campaignMap){
            let foundMap = await schema.Map.findOne({ where: {id: csData.campaignMap[x].map}})
            campaignMapArray.push(foundMap)
        }
        csData.availableMaps = campaignMapArray
        csData.maps = await schema.Map.findAll({
            
        })
        csData.mapState = await schema.MapState.findOne({
            where: {
                map: csData.campaign.currentmap,
                campaign: csData.campaign.id
            }
        })
        csData.tokenState = await schema.GameTokenPosition.findAll({
            where: {
                mapstate: csData.mapState.id
            }
        })
        csData.fogState = await schema.FogStatePosition.findAll({
            where: {
                mapstate: csData.mapState.id
            }
        })
        csData.soundState = await schema.SoundStatePosition.findAll({
            where: {
                mapstate: csData.mapState.id
            }
        })
        // console.log(csData.campaign)
        console.log('emit refresh')
        socket.emit('RefreshScreen', JSON.stringify(csData));
    })
    socket.on('getTable', async function (msg) {
        switch (msg){
        case 'tokens':{
            let table = await schema.Token.findAll({
            })
            socket.emit('receiveTable', table);
            break
        }
        case 'maps':{
            let table = await schema.Map.findAll({
            })
            socket.emit('receiveTable', table);
            break
        }
        case 'sounds':{
            let table = await schema.Sound.findAll({
            })
            socket.emit('receiveTable', table);
            break
        }
        case 'campaigns':{
            let table = await schema.Campaign.findAll({
            })
            socket.emit('receiveTable', table);
            break
        }
        case 'campaignmaps':{
            let table = await schema.CampaignMap.findAll({
            })
            socket.emit('receiveTable', table);
            break
        }
        
        }
    })
    socket.on('updateField', async function (msg){
        let field = msg.field
        switch (msg.table){
            case 'tokens':{
                if(msg.id === ''){
                    let table = await schema.Token.create({
                        [field]:  msg.value
                    },
                    {
                        where:{
                            id: msg.id
                        }
                    })
                    socket.emit('dbInsert', table)
                }
                else{
                let table = await schema.Token.update({
                    [field]:  msg.value
                },
                {
                    where:{
                        id: msg.id
                    }
                })
            }
                // socket.emit('receiveTable', table);
                break
            }
            case 'maps':{
                if(msg.id === ''){
                    let table = await schema.Map.create({
                        [field]:  msg.value
                    },
                    {
                        where:{
                            id: msg.id
                        }
                    })
                    socket.emit('dbInsert', table)
                }
                else{
                let table = await schema.Map.update({
                    [field]:  msg.value
                },
                {
                    where:{
                        id: msg.id
                    }
                })
            }
                break
            }
            case 'sounds':{
                if(msg.id === ''){
                    let table = await schema.Sound.create({
                        [field]:  msg.value
                    },
                    {
                        where:{
                            id: msg.id
                        }
                    })
                    socket.emit('dbInsert', table)
                }
                else{
                let table = await schema.Sound.update({
                    [field]:  msg.value
                },
                {
                    where:{
                        id: msg.id
                    }
                })
            }
                break
            }
            case 'campaigns':{
                if(msg.id === ''){
                    let table = await schema.Campaign.create({
                        [field]:  msg.value
                    },
                    {
                        where:{
                            id: msg.id
                        }
                    })
                    socket.emit('dbInsert', table)
                }
                else{
                let table = await schema.Campaign.update({
                    [field]:  msg.value
                },
                {
                    where:{
                        id: msg.id
                    }
                })
            }
                break
            }
            case 'campaignmaps':{
                if(msg.id === ''){
                    let table = await schema.CampaignMap.create({
                        [field]:  msg.value
                    },
                    {
                        where:{
                            id: msg.id
                        }
                    })
                    socket.emit('dbInsert', table)
                }
                else{
                let table = await schema.CampaignMap.update({
                    [field]:  msg.value
                },
                {
                    where:{
                        id: msg.id
                    }
                })
            }
                break
            }
        }
    })
    socket.on('deleteRow', async function (msg){
        // console.log(msg);
        switch (msg.table){
            case 'tokens':{
                let table = await schema.Token.destroy({
                    where: {
                        id: msg.id
                    }
                })
                break
            }
            case 'maps':{
                let table = await schema.Map.destroy({
                    where: {
                        id: msg.id
                    }
                })
                break
            }
            case 'sounds':{
                let table = await schema.Sound.destroy({
                    where: {
                        id: msg.id
                    }
                })
                break
            }
            case 'campaigns':{
                let table = await schema.Campaign.destroy({
                    where: {
                        id: msg.id
                    }
                })
                break
            }
            case 'campaignmaps':{
                let table = await schema.CampaignMap.destroy({
                    where: {
                        id: msg.id
                    }
                })
                break
            }
        }
    })
    
});


//sets an http server to listen on 3000 for connects, socket.io is bound to this.
http.listen(3000, function () {
    console.log('listening on *:3000');
});