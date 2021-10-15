const term = require('terminal-kit').terminal;

let userManage = {
    async selectLoginOrRegister () {
        return new Promise(function (resolve, reject) {
            term.cyan('Connect or register ?\n');
            let items = ["Login", "Register", "Exit"];
            term.gridMenu(items, function (error, response) {
                resolve(JSON.stringify({choise: response.selectedText.toLowerCase()}))
            });
        })
    },

    //login user
    async loginUser(socket, creditential, key, thisIsATmpTokenListener){
        socket.emit('login', JSON.stringify({
            tmp: thisIsATmpTokenListener,
            token: key,
            username: creditential.username,
            password: creditential.password
        }))
    },

    async registerUser(socket, creditential, thisIsATmpTokenListener){
        socket.emit('register', JSON.stringify({
            tmp: thisIsATmpTokenListener,
            username: creditential.username,
            password: creditential.password
        }))
    },



    //utils function
    async askCreditantial(){
        let username = await this.ask('Username: ');
        let password = await this.ask('Password: ', true);
        return JSON.stringify({username: username, password: password});
    },

    async ask(question, hide) {
        console.log()
        return new Promise(function (resolve, reject) {
            term.cyan(question + '\n');
            if(hide){
                term.inputField( {echoChar : "*" } , function( error , input ) {
                        resolve(input)
                    }
                );
            } else {
                term.inputField( { } , function( error , input ) {
                        resolve(input)
                    }
                );
            }
            
        })
    },

    checkTheKey(key){
        if(key != undefined){
            if(key.length >= 50 && key.length < 64){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}


module.exports = userManage;