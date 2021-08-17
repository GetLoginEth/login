const fs = require('fs');
const path = './src/smart/build/contracts/';
const files = ['GetLoginLogic.json', 'GetLoginStorage.json'];
files.forEach(item => {
    const file = path + item;
    const fileOut = path + (item.replace('.json', '.out.json'));
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

