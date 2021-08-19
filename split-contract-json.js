const fs = require('fs');
const path = './src/smart/build/contracts/';
const path1 = './src/smart-bzz/build/contracts/';
const files = [{name: 'GetLoginLogic.json'}, {name: 'GetLoginStorage.json'}, {name: 'Token.json', type: 'token'}];
files.forEach(item => {
    let file;
    let fileOut;
    if (item.type === 'token') {
        file = path1 + item.name;
        fileOut = path1 + (item.name.replace('.json', '.out.json'));
    } else {
        file = path + item.name;
        fileOut = path + (item.name.replace('.json', '.out.json'));
    }

    console.log('Check file: ' + file);
    console.log('Out file: ' + fileOut);
    if (!fs.existsSync(file)) {
        console.log('File not exists');
        return;
    }

    const json = JSON.parse(fs.readFileSync(file, 'utf8'));
    fs.writeFileSync(fileOut, JSON.stringify({
        abi: json.abi,
        networks: json.networks,
    }));
});

