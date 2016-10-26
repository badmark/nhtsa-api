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
    var fmake = make.replace(/ /g,"%20");
    var fmodel = model.replace(/ /g,"%20");



    //Connect to the API URL (http://www.nhtsa.gov/webapi/api/SafetyRatings/)
    var request = http.get("http://www.nhtsa.gov/webapi/api/SafetyRatings/modelyear/"+year+"/make/"+fmake+"/model/"+fmodel+"?format=json", function(response) {
        var body = "";

        if (response.statusCode !== 200) {
            request.abort();
            //Status Code Error
            profileEmitter.emit("error", new Error("There was an error getting the safety data for " + year + " " + make + " " + model + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
        }

        //Read the data
        response.on('data', function (chunk) {
            body += chunk;
            profileEmitter.emit("data", chunk);
        });

        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    //Parse the data
                    //var profile = JSON.parse(body);
                    var vehicleId = JSON.parse(body).Results[0].VehicleId;

                    profileEmitter.emit("end", vehicleId);
                } catch (error) {
                    profileEmitter.emit("error", error);
                }
            }
        }).on("error", function(error){
            profileEmitter.emit("error", error);
        });
    });
}

util.inherits( NHTSAGetModel, EventEmitter );


module.exports = NHTSAGetModel;