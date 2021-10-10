const term = require('terminal-kit').terminal;

let serverManage = {

    async selectServerCnil () {
        return new Promise(function (resolve, reject) {
            term.cyan('Connect to osint-hub.cnil.me:\n');
            let items = ["yes", "no"];
            term.gridMenu(items, function (error, response) {
                resolve(JSON.stringify({choise: response.selectedText.toLowerCase()}))
            });
        })
    },

    async baseMenuSelect(){
        return new Promise(function (resolve, reject) {
            term.cyan('Select base menu:\n');
            let items = ["Search", "Exit"];
            term.gridMenu(items, function (error, response) {
                resolve(JSON.stringify({choise: response.selectedText.toLowerCase()}))
            });
        })
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
    
    async search(socket, userKey, thisIsATmpTokenListener){
        let name = await this.ask('Enter name:');
        let surname = await this.ask('Enter lastname:');

        socket.emit('search', JSON.stringify({
            token: userKey,
            tmp: thisIsATmpTokenListener,
            info: surname+" | "+name,
        }))
    }

}

module.exports = serverManage