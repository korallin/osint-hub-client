let utilsFunction = {

    randomString(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    art(){
        console.log(`
   ____      _      __    __        __ 
  / __ \\___ (_)__  / /_  / /  __ __/ / 
 / /_/ (_-</ / _ \\/ __/ / _ \\/ // / _ \\
 \\____/___/_/_//_/\\__/ /_//_/\\_,_/_.__/                                  
 `)
    }

}


module.exports = utilsFunction;
