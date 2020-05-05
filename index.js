'use strict';

// webhook url - https://3000-ad377648-efec-4917-8aeb-3d5be9808b9e.ws-eu01.gitpod.io/webhook 

const express = require('express');
const bodyParser = require('body-parser')
const https = require('https');
const {dialogflow, BasicCard, Button, Image, SimpleResponse} = require('actions-on-google');
const app = dialogflow({debug:false});

app.intent("Domos", (conv)=>{
    console.log(conv.query);
    let action='';
    let appareil='';
    let local='';
    let idx='';
    let reponse='';
    if (conv.query=="lance l'application domos") reponse='Je suis prêt'; 
    else {
        if (conv.query.includes("allume"))                      action="On";
        if (conv.query.includes("éteins"))                      action="Off";
        if (conv.query.includes("coupe"))                      action="Off";        
        if (conv.query.includes("ouvre"))                       action="On";
        if (conv.query.includes("ferme"))                       action="Off";
        if (conv.query.includes("monte"))                       action="On";
        if (conv.query.includes("descends"))                    action="Off";
        if (conv.query.includes("lampe"))                       appareil="lampe";
        if (conv.query.includes("lumière"))                     appareil="lampe";        
        if (conv.query.includes("volet"))                       appareil="volet";
        if (conv.query.includes("salle à manger"))              local="salle à manger";        
        if (conv.query.includes("cuisine"))                     local="cuisine";        
        if (conv.query.includes("salon"))                       local="salon";        
        if (conv.query.includes("chambre à couché"))            local="chambre à couché";   
        if (conv.query.includes("salle de bain"))               local="salle de bain";        
        if (conv.query.includes("bureau"))                      local="bureau";
        if (conv.query.includes("salle de jeu"))                local="salle de jeu";
        if (conv.query.includes("salle de bain de l'étage"))    local="salle de bain de l'étage";                        
        if (conv.query.includes("chambre de pierre"))           local="chambre de pierre";   
        if (conv.query.includes("chambre de pierre"))           local="chambre de julien";           
        if (conv.query.includes("garage"))                      local="garage";
        if (appareil=='') reponse="cet équippement n'existe pas";
        if (local=='') reponse="ce local n'existe pas";
        if (action=='') reponse="je n'ai pas compris ce qu'il faut faire";   
        console.log(action, appareil, local);
        if (appareil!='' && local!='' && action!='') {
            switch (appareil+local) {
                case "lampebureau": idx = '100'; break;
                
            }
            if (idx=='') reponse="Je n'ai pas trouvé cet équippement dans ce local";
            else {
                reponse = "ok c'est fait";
                https.get('https://thierry:tB04011966!@domoticz.tbsoft.fr/json.htm?type=command&param=switchlight&idx=' + idx + '&switchcmd=' + action + '&level=0&passcode=');                 
            }
        }
    }    
    conv.ask(new SimpleResponse({speech: reponse, text: reponse })); 
});

app.intent('Examples', (conv)=>{
    https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => { console.log(JSON.parse(data).explanation); });
    }).on("error", (err) => {  console.log("Error: " + err.message);  });

    conv.ask(new BasicCard({
        text: 'Gitpod is a online IDE for Github.', 
        subtitle: 'Online IDE', 
        title: 'Gitpod', 
        buttons: new Button({title: 'Buton title', url: 'https://gitpod.io/'}), 
        image: new Image({url: 'https://i.ytimg.com/vj/D41zSHJthZI/sddefault.jpg#404_is_fine', alt: 'Gitpod'})
    }));
});

const expressApp = express().use(bodyParser.json());
expressApp.post('/webhook',app);
expressApp.listen(3000);
