const term = require('terminal-kit').terminal;

let groupManage = {

    async groupBaseMenu(){
        return new Promise(function (resolve, reject) {
            term.cyan('Manage Group:\n');
            let items = ["Create", "Leave", "Info", "Return", "Exit"];
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
    

    async createGroup(socket, userKey, thisIsATmpTokenListener){
        let name = await this.ask('Group name:');

        socket.emit('group', JSON.stringify({
            token: userKey,
            tmp: thisIsATmpTokenListener,
            info: "create",
            groupname: name
        }))
    }

}

module.exports = groupManage;