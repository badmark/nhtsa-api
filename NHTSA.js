var EventEmitter = require("events").EventEmitter;
var http = require("http");
var util = require("util");

/**
 * An EventEmitter to get a NHTSA Vehicle's safety data.
 * @param year
 * @param make
 * @param model
 * @constructor
 */
function NHTSAGetModel(year, make, model) {

    EventEmitter.call(this);

    profileEmitter = this;

    //Replace spaces in make and model
    var fmake = make.replace(/ /g, "%20");
    var fmodel = model.replace(/ /g, "%20");


    var APIURL = "https://www.nhtsa.gov/webapi/api/SafetyRatings/modelyear/" + year + "/make/" + fmake + "/model/" + fmodel + "?format=json";

    /*Connect to the API URL (http://www.nhtsa.gov/webapi/api/SafetyRatings/)
    if (location.protocol === 'https:') {
        // page is secure
        APIURL = "https" + APIURL;
    }else{
        APIURL = "http" + APIURL;
    }*/

    var request = http.get(APIURL, function(response) {
        var body = "";

        if (response.statusCode !== 200) {
            request.abort();
            //Status Code Error
            profileEmitter.emit("error", new Error("There was an error getting the safety data for " + year + " " + make + " " + model + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
        }

        //Read the data
        response.on('data', function(chunk) {
            body += chunk;
            profileEmitter.emit("data", chunk);
        });

        response.on('end', function() {
            if (response.statusCode === 200) {
                try {
                    //Parse the data
                    //var profile = JSON.parse(body);
                    var vehicleId = JSON.parse(body).Results[0].VehicleId;

                    console.log('NHTSA vehicleId', vehicleId);

                    getData(vehicleId, (e, r) => {
                        if (r) {
                            profileEmitter.emit("end", r);
                        }

                    });

                    //Get Safety Data

                    // apiURL = 'http://www.nhtsa.gov/webapi/api/SafetyRatings/VehicleId/'+ vehicleId +'?format=json';
                    //
                    // console.log('API URL:' , apiURL);
                    //
                    //
                    // http.get(apiURL, (response)=> {
                    //     response.on('end', function () {
                    //         if (response.statusCode === 200) {
                    //             console.log('NHTSA API Return:', response);
                    //             profileEmitter.emit("end", response.content);
                    //         }
                    //     });
                    // });



                } catch (error) {
                    profileEmitter.emit("error", error);
                }
            }
        }).on("error", function(error) {
            profileEmitter.emit("error", error);
        });
    });
}







util.inherits(NHTSAGetModel, EventEmitter);


module.exports = NHTSAGetModel;

var getData = function(vehicleId, callback) {
    var body = "";
    apiURL = '://www.nhtsa.gov/webapi/api/SafetyRatings/VehicleId/' + vehicleId + '?format=json';

    if (location.protocol === 'https:') {
        // page is secure
        apiURl = "https" + apiURL;
    }
    else {
        apiURL = "http" + apiURL;
    }
    console.log('API URL:', apiURL);

    var request = http.get(apiURL, (response) => {

        //Read the data
        response.on('data', function(chunk) {
            body += chunk;
            //profileEmitter.emit("data", chunk);
        });
        response.on('end', function() {
            if (response.statusCode === 200) {
                //console.log('NHTSA API Return:', response);
                return callback(null, body);
            }
        });
    });




};
