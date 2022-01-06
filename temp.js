#!/usr/bin/node
// made by prince kumar 
//date 2 jan 2022
// import all the requirements 
const axios = require('axios').default;
const process = require("process");
var prompt = require('prompt-sync')();
// make a help function to provide the user instruction 
function help(){
    if(process.argv.length === 2 || process.argv[2] === "-h" || process.argv[2] === "--help"){
        console.log("\033[38;1m Use this tool like this :");
        console.log("temp.js username");
    }
    else if(process.argv.length === 3) {
        console.log("\033[0;1m Checking domain ...");
        checkDomain(process.argv[2]);
    }
    else {
        console.error("[!] Sorry i can't handle too many argument");

    }

}
// make nice little banner 
function banner(){
    process.stdout.write(`
   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
   █▄▄░▄▄█░▄▄█░▄▀▄░█▀▄▄▀████░▄▀▄░█░▄▄▀██▄██░█
   ███░███░▄▄█░█▄█░█░▀▀░█▄▄█░█▄█░█░▀▀░██░▄█░█
   ███░███▄▄▄█▄███▄█░███████▄███▄█▄██▄█▄▄▄█▄▄
   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
    `);
    console.log("\033[33;1m \t\t MADE BY PRINCE ");
}
// now make a empty container for the available server option 
let avlDomain = [];
// now make a session 
const session = axios.create();
session.defaults.withCredentials = true;
session.defaults.headers['User-Agent'] = "Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36";
// meke a function to check the msg 
function checkMsg(user,domain,id){
    session({
        method : "get",
        url : `https://www.1secmail.com/api/v1/?action=readMessage&login=${user}&domain=${domain}&id=${id}`
    })
    .then((res) => {
        process.stdout.write("\033[36;1m Mail recived from : ");
        console.log(res.data.from);
        process.stdout.write("\033[39;1m Msg Date And Time : ");
        console.log(res.data.date);
        process.stdout.write("\033[36;1m Subject : ");
        console.log(res.data.subject);
       process.stdout.write("\033[36;1m Msg : ");
       console.log(res.data.textBody);

    })
    .catch((err) => {
        console.error(err);
    })
}
// make a function to check the id
function checkId(user,dom){
    session({
        method : "get",
        url : `https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=${dom}`

    })
    .then((res) => {
        if(res.data.length === 0) {
            checkId(user,dom);
        }
        else{
           let msgId = res.data[0].id;
           // now call the msg function 
           checkMsg(user,dom,msgId);
        }
        

})

}
// now make a function to check the available domail server and create the mail
function checkDomain(user){
    
    session({
        method : "get",
        url : "https://www.1secmail.com/api/v1/?action=getDomainList"

    })
    .then((res) => {
        for(var i =1; i < res.data.length; i++){
            process.stdout.write(`[${i}] `);
            process.stdout.write(`${res.data[i-1]} \n`);

        }
        console.log("\n");
        let n = prompt('[~] Choose the domain: ');
        let dom = res.data[n-1];
        // now call the msg function 
        const mail = `${user}@${dom}`
        console.log(`This is your temp mail : ${mail}`);
        console.log("After 4 sec msg will be visible here");
        setTimeout(() => {
            console.clear()
            setTimeout(() => {
                banner();
                console.log("Temp mail :",mail);
                checkId(user,dom);
            },1000);
        },2000);
        
       
    })
    .catch((err) => {
        console.log(err);
    })
    
}
help();
