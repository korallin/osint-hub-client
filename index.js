let socket = require('socket.io-client')('http://127.0.0.1:8080');
let utilsFunction = require('./utils/main.js');
let serverManage = require('./server/main.js');
let userManage = require('./user/main.js');
const fs = require('fs');
const term = require('terminal-kit').terminal;

let thisIsATmpTokenListener = utilsFunction.randomString(25);
let userKey
socket.on('connect', async function() {
    
    //all the function of the client
    let choiseServer = JSON.parse(await serverManage.selectServerCnil())
    if(choiseServer.choise != "yes"){
        console.log("[-] no other server...")
        process.exit();
    } else {
        login()
    }

    //select if login or register
    async function login(){
        let userChoiseBase = JSON.parse(await userManage.selectLoginOrRegister())
        if(userChoiseBase.choise == "exit"){
            console.log("[-] exiting...")
            process.exit();
        } else if(userChoiseBase.choise === "login"){
            userKey = fs.readFileSync('./private/key.txt', 'utf8')
            let check = userManage.checkTheKey(userKey);
            if(!check){
                console.log("[-] key is not valid...")
                process.exit();
            } else {
                await userManage.loginUser(socket, JSON.parse(await userManage.askCreditantial()), userKey, thisIsATmpTokenListener);
            }
        } else if(userChoiseBase.choise === "register"){
            userManage.registerUser(socket, JSON.parse(await userManage.askCreditantial()), thisIsATmpTokenListener);
        }
    }

    async function baseMenu(){
        let baseChoise = JSON.parse(await serverManage.baseMenuSelect())
        if(baseChoise.choise == "exit"){
            console.log("[-] exiting...")
            process.exit();
        } else if(baseChoise.choise == "search"){
            serverManage.search(socket, userKey, thisIsATmpTokenListener)
        }
    }
    

    socket.on(thisIsATmpTokenListener, async function(data) {
        if(data.type === "info-login"){
            if(data.success){
                console.clear()
                console.log(data.message)
                baseMenu()
            } else {
                console.clear()
                console.log(data.message)
                login()
            }
        } else if(data.type === "register"){
            console.clear()
            console.log(data.message)
            if(data.success){
                fs.writeFileSync('./private/key.txt', data.message.split(" | ")[1])
            }
            login()
        } else if(data.type ==="search"){
            if(!data.success){
                console.clear()
                console.log(data.message)
                baseMenu()
            } else {
                console.clear()
                //check if the user want to show message
                let tmpchoise = await serverManage.ask('Do you want to print the result ? (y/N)')
                if(tmpchoise == "y" || tmpchoise == "yes"){
                    console.log(data.message)
                }
                let date = Date.now()
                fs.writeFileSync('./reports/'+date+".json", JSON.stringify(data.message), 'utf8')
                console.log("[-] report saved in ./reports/"+date+".json")
                baseMenu()
            }
        }
        
    });
});