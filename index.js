let socket = require('socket.io-client')('http://osint-hub.cnil.me:5340');
let utilsFunction = require('./utils/main.js');
let serverManage = require('./server/main.js');
let userManage = require('./user/main.js');
let groupManage = require('./group/main.js');
const fs = require('fs');
const term = require('terminal-kit').terminal;
const { formatArgs } = require('debug');
const { group } = require('console');

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
        } else if(baseChoise.choise === "group"){
            groupManagement()
        }
    }

    async function groupManagement(){
        let choise = await JSON.parse(await groupManage.groupBaseMenu())
        if(choise.choise == "exit"){
            console.log("[-] exiting...")
            process.exit();
        } else if(choise.choise == "return"){
            baseMenu()
        }  else if(choise.choise == "create"){
            groupManage.createGroup(socket, userKey, thisIsATmpTokenListener)
        } else if(choise.choise == "leave"){
            groupManage.leaveGroup(socket, userKey, thisIsATmpTokenListener)
        } else if(choise.choise == "info"){
            groupManage.infoGroup(socket, userKey, thisIsATmpTokenListener)
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
        } else if(data.type === "group"){
            console.log(data.message)
        } else if(data.type === "createGroup"){
            console.log("\n[*] "+data.message)
            groupManagement()
        } else if(data.type === "leaveGroup"){
            console.log("\n[*] "+data.message)
            groupManagement()
        } else if(data.type === "groupInfo"){
            console.log("\n[*] "+data.message.name)
            console.log("- master: "+data.message.master)
            console.log("- members: "+data.message.members)
            groupManagement()
        }
        
    });
});