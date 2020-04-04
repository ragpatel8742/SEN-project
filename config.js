const config = {
    "keys": {
        "alphavantage": "replace_with_alphavantage_key"
    },
    "servPort": 5000,
    "useAlphavantage": true,
    "useFmprep": false,
    "useFirestore": true,
    "firestoreURL": "https://smap-c4a6a.firebaseio.com",
    "earliestYear": 2018,
    "statusCodes": {
        "ok": "OK",
        "failed": "FAILED"
    },
    "errorCodes": {
        "api": "APIERROR",
        "db": "DATABASERROR",
        "internal": "SERVERERROR",
        "auth": "AUTHENTICATIONERROR",
        
    }
};

module.exports = config;