const Firestore = require('@google-cloud/firestore');

function main() {
    const firestore = new Firestore({
        projectId: 'je-ne-sais-quoi',
        keyFilename: '../../newcreds.json',
    });

    var sales = firestore.collections('sales');

    console.log("working")
}

main()